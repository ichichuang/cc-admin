import type { RouteRecordRaw } from 'vue-router'

/**
 * 检查数组是否有交集
 * 用于权限检查
 */
export function isOneOfArray(a: string[], b: string[]): boolean {
  return Array.isArray(a) && Array.isArray(b) ? a.some(item => b.includes(item)) : false
}

/**
 * 过滤meta中showLink为false的菜单
 */
export function filterShowLinkMenus(routes: RouteConfig[]): RouteConfig[] {
  return routes.filter(route => {
    if (route.meta?.showLink === false) {
      return false
    }

    if (route.children && route.children.length > 0) {
      route.children = filterShowLinkMenus(route.children)
    }

    return true
  })
}

/**
 * 过滤children长度为0的目录
 * 当目录下没有菜单时，会过滤此目录
 */
export function filterEmptyChildren(routes: RouteConfig[]): RouteConfig[] {
  return routes.filter(route => {
    // 如果有子路由，递归过滤
    if (route.children && route.children.length > 0) {
      route.children = filterShowLinkMenus(route.children)
      // 如果过滤后没有子路由了，则过滤掉父路由（除非父路由本身也是一个页面）
      if (route.children.length === 0 && !route.component) {
        return false
      }
    }
    return true
  })
}

/**
 * 从localStorage里取出当前登录用户的角色roles，过滤无权限的菜单
 */
export function filterNoPermissionTree(
  routes: RouteConfig[],
  userRoles: string[] = []
): RouteConfig[] {
  return routes.filter(route => {
    // 检查权限
    if (route.meta?.roles && route.meta.roles.length > 0) {
      if (!isOneOfArray(route.meta.roles, userRoles)) {
        return false
      }
    }

    // 递归处理子路由
    if (route.children && route.children.length > 0) {
      route.children = filterNoPermissionTree(route.children, userRoles)
    }

    return true
  })
}

/**
 * 处理动态路由（后端返回的路由）
 * 将后端路由数据转换为框架可用的路由格式
 */
export function processAsyncRoutes(backendRoutes: BackendRouteConfig[]): RouteConfig[] {
  if (!backendRoutes || backendRoutes.length === 0) {
    return []
  }

  return backendRoutes.map(route => {
    const processedRoute: RouteConfig = {
      path: route.path,
      name: route.name,
      redirect: route.redirect,
      meta: {
        ...route.meta,
        backstage: true, // 标识为后端路由
      },
    }

    // 处理组件
    if (route.component) {
      processedRoute.component = loadView(route.component as string)
    }

    // 处理重定向：如果有子路由且没有设置重定向，默认重定向到第一个子路由
    if (route.children && route.children.length > 0 && !route.redirect) {
      processedRoute.redirect = route.children[0].path
    }

    // 处理路由名称：如果有子路由且没有设置名称，使用第一个子路由的名称加Parent后缀
    if (route.children && route.children.length > 0 && !route.name) {
      processedRoute.name = (route.children[0].name || 'Unknown') + 'Parent'
    }

    // 递归处理子路由
    if (route.children && route.children.length > 0) {
      processedRoute.children = processAsyncRoutes(route.children)
    }

    return processedRoute
  })
}

/**
 * 一维数组处理成多级嵌套数组
 * 三级及以上的路由全部拍成二级，keep-alive 只支持到二级缓存
 */
export function formatTwoStageRoutes(routesList: RouteConfig[]): RouteConfig[] {
  if (routesList.length === 0) {
    return routesList
  }

  const newRoutesList: RouteConfig[] = []

  routesList.forEach(route => {
    if (route.path === '/') {
      newRoutesList.push({
        component: route.component,
        name: route.name,
        path: route.path,
        redirect: route.redirect,
        meta: route.meta,
        children: [],
      })
    } else {
      newRoutesList[0]?.children?.push({ ...route })
    }
  })

  return newRoutesList
}

/**
 * 将多级嵌套路由处理成一维数组
 */
export function formatFlatteningRoutes(routesList: RouteConfig[]): RouteConfig[] {
  if (routesList.length === 0) {
    return routesList
  }

  const flatRoutes: RouteConfig[] = []

  function flatten(routes: RouteConfig[], parentPath = '') {
    routes.forEach(route => {
      const currentPath = parentPath
        ? `${parentPath}/${route.path}`.replace(/\/+/g, '/')
        : route.path

      flatRoutes.push({
        ...route,
        path: currentPath,
        children: undefined, // 移除children，变成扁平结构
      })

      if (route.children && route.children.length > 0) {
        flatten(route.children, currentPath)
      }
    })
  }

  flatten(routesList)
  return flatRoutes
}

/**
 * 通过指定 key 获取父级路径集合
 * 默认 key 为 path
 */
export function getParentPaths(
  value: string,
  routes: RouteConfig[],
  key: keyof RouteConfig = 'path'
): string[] {
  function dfs(routes: RouteConfig[], value: string, parents: string[]): string[] {
    for (let i = 0; i < routes.length; i++) {
      const item = routes[i]
      // 返回父级path
      if (item[key] === value) {
        return parents
      }
      // children不存在或为空则不递归
      if (!item.children || !item.children.length) {
        continue
      }
      // 往下查找时将当前path入栈
      parents.push(item.path)

      if (dfs(item.children, value, parents).length) {
        return parents
      }
      // 深度遍历查找未找到时当前path出栈
      parents.pop()
    }
    // 未找到时返回空数组
    return []
  }

  return dfs(routes, value, [])
}

/**
 * 获取当前页面按钮级别的权限
 */
export function getAuths(route?: RouteConfig): string[] {
  return route?.meta?.auths || []
}

/**
 * 是否有按钮级别的权限
 * 根据路由meta中的auths字段进行判断
 */
export function hasAuth(value: string | string[], userPermissions: string[]): boolean {
  if (!value) {
    return false
  }

  const authList = Array.isArray(value) ? value : [value]

  // 如果用户有 *:*:* 权限，表示超级管理员
  if (userPermissions.includes('*:*:*')) {
    return true
  }

  // 检查是否包含所需权限
  return authList.every(auth => userPermissions.includes(auth))
}

/**
 * 路由排序函数
 * 按照 meta.rank 升序排序，未设置 rank 的路由排在最后
 */
export function sortRoutes(routes: RouteConfig[]): RouteConfig[] {
  return routes.sort((a, b) => {
    const rankA = a.meta?.rank ?? 999
    const rankB = b.meta?.rank ?? 999
    return rankA - rankB
  })
}

/**
 * 扁平化路由
 * 将嵌套路由展开为一维数组，便于查找和处理
 */
export function flattenRoutes(routes: RouteConfig[]): RouteConfig[] {
  const result: RouteConfig[] = []

  function traverse(routeList: RouteConfig[], parent?: RouteConfig) {
    routeList.forEach(route => {
      // 创建路由副本，避免修改原对象
      const flatRoute: RouteConfig = {
        ...route,
        meta: route.meta
          ? {
              ...route.meta,
              // 如果是子路由，可以添加父路由信息（但不改变必需的 title）
              ...(parent &&
                route.meta.title && {
                  parentPath: parent.path,
                  parentTitle: parent.meta?.title,
                }),
            }
          : undefined,
      }

      result.push(flatRoute)

      // 递归处理子路由
      if (route.children && route.children.length > 0) {
        traverse(route.children, route)
      }
    })
  }

  traverse(routes)
  return result
}

/**
 * 生成菜单树
 * 从路由配置生成用于渲染菜单的树结构
 */
export function generateMenuTree(routes: RouteConfig[]): MenuItem[] {
  function transformRoute(route: RouteConfig): MenuItem | null {
    const { path, name, meta, children } = route

    // 如果明确设置不显示，则跳过
    if (meta?.showLink === false) {
      return null
    }

    // 如果没有 title，跳过该路由
    if (!meta?.title) {
      return null
    }

    const menuItem: MenuItem = {
      path,
      name: name as string,
      title: meta.title,
      icon: meta.icon,
      showLink: meta.showLink ?? true,
      rank: meta.rank ?? 999,
      roles: meta.roles,
      auths: meta.auths,
      children: [],
      meta,
    }

    // 处理子菜单
    if (children && children.length > 0) {
      const childMenus = children.map(transformRoute).filter(Boolean) as MenuItem[]

      if (childMenus.length > 0) {
        menuItem.children = sortMenuItems(childMenus)
      }
    }

    return menuItem
  }

  const menuItems = routes.map(transformRoute).filter(Boolean) as MenuItem[]

  return sortMenuItems(menuItems)
}

/**
 * 菜单项排序
 */
function sortMenuItems(menuItems: MenuItem[]): MenuItem[] {
  return menuItems.sort((a, b) => a.rank - b.rank)
}

/**
 * 生成面包屑映射
 * 为每个路由路径生成对应的面包屑路径
 */
export function generateBreadcrumbMap(routes: RouteConfig[]): Map<string, string[]> {
  const breadcrumbMap = new Map<string, string[]>()

  function traverse(routeList: RouteConfig[], breadcrumb: string[] = []) {
    routeList.forEach(route => {
      const { path, meta, children } = route

      // 如果设置了隐藏面包屑，则不加入面包屑
      if (!meta?.hideBreadcrumb && meta?.title) {
        const currentBreadcrumb = [...breadcrumb, meta.title]
        breadcrumbMap.set(path, currentBreadcrumb)

        // 递归处理子路由
        if (children && children.length > 0) {
          traverse(children, currentBreadcrumb)
        }
      }
    })
  }

  traverse(routes)
  return breadcrumbMap
}

/**
 * 检查路由权限
 * 根据用户角色检查是否有访问路由的权限
 */
export function checkRoutePermission(route: RouteConfig, userRoles: string[]): boolean {
  const { roles } = route.meta || {}

  // 如果路由没有设置权限要求，则允许访问
  if (!roles || roles.length === 0) {
    return true
  }

  // 检查用户角色是否匹配路由要求的角色
  return roles.some(role => userRoles.includes(role))
}

/**
 * 过滤有权限的路由
 * 根据用户角色过滤用户有权限访问的路由
 */
export function filterAuthorizedRoutes(routes: RouteConfig[], userRoles: string[]): RouteConfig[] {
  return routes.filter(route => {
    // 检查当前路由权限
    if (!checkRoutePermission(route, userRoles)) {
      return false
    }

    // 递归过滤子路由
    if (route.children && route.children.length > 0) {
      route.children = filterAuthorizedRoutes(route.children, userRoles)
    }

    return true
  })
}

/**
 * 根据路径查找路由
 */
export function findRouteByPath(routes: RouteConfig[], targetPath: string): RouteConfig | null {
  for (const route of routes) {
    if (route.path === targetPath) {
      return route
    }

    if (route.children && route.children.length > 0) {
      const found = findRouteByPath(route.children, targetPath)
      if (found) {
        return found
      }
    }
  }

  return null
}

/**
 * 转换路由配置为 Vue Router 格式
 */
export function transformToVueRoutes(routes: RouteConfig[]): RouteRecordRaw[] {
  return routes.map(route => {
    // 构建基础路由对象
    const vueRoute: any = {
      path: route.path,
      component: route.component,
      meta: route.meta as Record<string, any>,
    }

    // 只有当确实存在时才添加这些可选属性
    if (route.name) {
      vueRoute.name = route.name
    }

    if (route.redirect) {
      vueRoute.redirect = route.redirect
    }

    if (route.children && route.children.length > 0) {
      vueRoute.children = transformToVueRoutes(route.children)
    }

    return vueRoute as RouteRecordRaw
  })
}

/**
 * 创建路由工具集
 * 提供完整的路由处理工具
 */
export function createRouteUtils(routes: RouteConfig[]): RouteUtils {
  const sortedRoutes = sortRoutes([...routes])

  return {
    flatRoutes: flattenRoutes(sortedRoutes),
    menuTree: generateMenuTree(sortedRoutes),
    breadcrumbMap: generateBreadcrumbMap(sortedRoutes),
  }
}

/**
 * 获取所有路由路径
 * 用于权限校验或路由守卫
 */
export function getAllRoutePaths(routes: RouteConfig[]): string[] {
  const paths: string[] = []

  function traverse(routeList: RouteConfig[]) {
    routeList.forEach(route => {
      paths.push(route.path)
      if (route.children && route.children.length > 0) {
        traverse(route.children)
      }
    })
  }

  traverse(routes)
  return paths
}

/**
 * 动态路由管理器
 * 提供动态路由的添加、删除、重置等功能
 */
export function createDynamicRouteManager(router: any) {
  const dynamicRoutes: RouteConfig[] = []

  return {
    /**
     * 添加动态路由
     */
    addRoute(route: RouteConfig) {
      // 防止重复添加
      const existingIndex = dynamicRoutes.findIndex(r => r.path === route.path)
      if (existingIndex !== -1) {
        dynamicRoutes[existingIndex] = route
      } else {
        dynamicRoutes.push(route)
      }

      // 转换为 Vue Router 格式并添加
      const vueRoute = transformToVueRoutes([route])[0]
      if (!router.hasRoute(vueRoute.name)) {
        router.addRoute(vueRoute)
      }
    },

    /**
     * 批量添加动态路由
     */
    addRoutes(routes: RouteConfig[]) {
      routes.forEach(route => this.addRoute(route))
    },

    /**
     * 移除动态路由
     */
    removeRoute(name: string) {
      const index = dynamicRoutes.findIndex(r => r.name === name)
      if (index !== -1) {
        dynamicRoutes.splice(index, 1)
        if (router.hasRoute(name)) {
          router.removeRoute(name)
        }
      }
    },

    /**
     * 清空所有动态路由
     */
    clearRoutes() {
      dynamicRoutes.forEach(route => {
        if (route.name && router.hasRoute(route.name)) {
          router.removeRoute(route.name)
        }
      })
      dynamicRoutes.length = 0
    },

    /**
     * 获取所有动态路由
     */
    getRoutes() {
      return [...dynamicRoutes]
    },

    /**
     * 重置路由
     */
    resetRouter() {
      this.clearRoutes()
      // 这里可以重新添加静态路由
    },
  }
}

const modules = import.meta.glob('@/views/**/*.{vue,tsx}')
/**
 * 根据后端 component 字符串获取实际组件
 * @param componentName 例如 'login'、'permission-page'
 */
export function loadView(componentName: string) {
  // 将 componentName 以第一个 - 为分隔符，获取第一个字符串
  const firstPart = componentName.split('-')[0]
  // 可能路径集合
  const possiblePaths = [
    `/src/views/${componentName}/index.vue`, // 一级页面，例如 login -> /views/login/index.vue
    `/src/views/${componentName}/index.tsx`, // 一级页面，例如 login -> /views/login/index.tsx
    `/src/views/${firstPart}/views/${componentName}.vue`, // 子页面，例如 permission-page -> /views/permission/views/permission-page.vue
    `/src/views/${firstPart}/views/${componentName}.tsx`, // 子页面，例如 permission-page -> /views/permission/views/permission-page.tsx
  ]

  // 找匹配路径
  for (const path of Object.keys(modules)) {
    if (possiblePaths.some(pattern => matchPath(path, pattern))) {
      return modules[path]
    }
  }

  // fallback
  return modules['/src/views/notfound/not-found-page.vue']
}

/**
 * 简单的路径匹配工具，支持 pattern 中的 ** 通配符
 */
function matchPath(actual: string, pattern: string) {
  const regex = new RegExp(
    '^' +
      pattern
        .replace(/\*\*/g, '.*') // ** -> 任意目录
        .replace(/\./g, '\\.') // . -> \.
        .replace(/\//g, '\\/') + // / -> \/
      '$'
  )
  return regex.test(actual)
}
