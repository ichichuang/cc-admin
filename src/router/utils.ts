import type { RouteRecordRaw } from 'vue-router'
import type { MenuItem, RouteConfig, RouteUtils } from './types'

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
      showLink: meta.showLink ?? true, // 修复：使用默认值而不是比较
      rank: meta.rank ?? 999,
      roles: meta.roles,
      children: [],
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
