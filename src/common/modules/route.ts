/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - route
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import router, { routeUtils } from '@/router'
import type { LocationQueryRaw, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

/**
 * 返回上一页
 * 如果有历史记录则返回上一页，否则跳转到首页
 */
export const goBack = (): void => {
  if (history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}

/**
 * 获取扁平化的路由列表
 * @param menuList - 菜单列表，默认使用系统路由
 * @returns 扁平化的路由数组
 */
export const getFlatRouteList = (menuList?: RouteRecordRaw[]): RouteRecordRaw[] => {
  const routes = menuList || router.getRoutes()

  if (!Array.isArray(routes)) {
    return []
  }

  const addPath = (parent: RouteRecordRaw, children: RouteRecordRaw[]): RouteRecordRaw[] =>
    children.map(child => ({
      ...child,
      path: `${parent.path}/${child.path}`.replace(/\/+/g, '/'),
    }))

  return routes.flatMap(item => [
    item,
    ...(item.children ? getFlatRouteList(addPath(item, item.children as RouteRecordRaw[])) : []),
  ])
}

/**
 * 根据路由名称获取路由信息
 * @param name - 路由名称，如果不提供则从当前 URL 提取
 * @returns 匹配的路由数组
 */
export const getRouteByName = (name?: string): RouteRecordRaw[] => {
  const parseNameFromURL = (): string => {
    const urlPath = location.pathname
    const pathSegments = urlPath.split('/').filter(Boolean)
    return pathSegments[pathSegments.length - 1] || ''
  }

  name = name || parseNameFromURL()
  const flatRoutes = getFlatRouteList()

  return flatRoutes.filter(
    route => typeof route.name === 'string' && route.name?.toLowerCase() === name?.toLowerCase()
  )
}

/**
 * 根据路径获取路由信息
 * @param path - 路由路径
 * @returns 匹配的路由信息
 */
export const getRouteByPath = (path: string): RouteRecordRaw | null => {
  const flatRoutes = getFlatRouteList()
  return flatRoutes.find(route => route.path === path) || null
}

/**
 * 跳转到指定路由
 * @param name - 路由名称
 * @param query - 查询参数
 * @param newWindow - 是否新开窗口
 * @param checkPermission - 是否检查权限
 */
export const goToRoute = (
  name: string | null,
  query?: LocationQueryRaw,
  newWindow = false,
  checkPermission = false
): void => {
  // 如果目标路由名称为空，跳转到首页
  if (!name) {
    router.push('/')
    return
  }

  // 如果当前路由就是目标路由，直接返回
  if (router.currentRoute.value.name === name) {
    return
  }

  const targetRoutes = getRouteByName(name)
  if (targetRoutes.length === 0) {
    console.warn(`路由 "${name}" 未找到`)
    return
  }

  const targetRoute = targetRoutes[0]

  // 权限检查
  if (checkPermission) {
    // 这里可以集成用户权限检查逻辑
    // const userStore = useUserStore()
    // const userRoles = userStore.roles || []
    // const hasPermission = checkRoutePermission(targetRoute, userRoles)
    // if (!hasPermission) {
    //   console.warn(`没有权限访问路由 "${name}"`)
    //   return
    // }
  }

  // 跳转逻辑
  if (newWindow) {
    const location = window.location
    const path = location.origin + '/#' + targetRoute.path
    window.open(path, '_blank')
  } else {
    router.push({ path: targetRoute.path, query })
  }
}

/**
 * 动态更新路由信息
 * @param name - 路由名称
 * @param keyPath - 键路径（例如：meta.title、name）
 * @param value - 新值
 */
export const updateRoute = (name: string, keyPath: string, value: unknown): void => {
  const targetRoutes = getRouteByName(name)
  const index = targetRoutes.findIndex(item => item.name === name)

  if (index === -1) {
    console.warn(`路由 "${name}" 未找到，无法更新`)
    return
  }

  const targetRoute = targetRoutes[index]
  const keys = keyPath.split('.')
  let current: any = targetRoute

  // 遍历键路径，创建嵌套对象结构
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!current[key]) {
      current[key] = {}
    }
    current = current[key]
  }

  // 设置最终值
  current[keys[keys.length - 1]] = value

  // 更新路由注册表
  const allRoutes = router.getRoutes()
  allRoutes.forEach(route => {
    if (route.name === name) {
      Object.assign(route, targetRoute)
    }
  })
}

/**
 * 获取路由面包屑路径
 * @param name - 路由名称，默认使用当前路由
 * @returns 面包屑路径数组
 */
export const getBreadcrumbByRoute = (name?: string): string[] => {
  const currentRouteName = name || (router.currentRoute.value.name as string)

  if (!currentRouteName) {
    return []
  }

  // 优先使用我们的面包屑映射
  const currentPath = router.currentRoute.value.path
  const breadcrumbMap = routeUtils.breadcrumbMap

  if (breadcrumbMap.has(currentPath)) {
    return breadcrumbMap.get(currentPath) || []
  }

  // 回退到原有的逻辑处理
  const allRoutes = router.getRoutes()
  const breadcrumbPaths: string[] = []

  // 处理包含分隔符"-"的路由名称
  if (currentRouteName.includes('-')) {
    const parts = currentRouteName.split('-')
    let currentRouteNameBuilder = ''

    parts.forEach(part => {
      currentRouteNameBuilder = currentRouteNameBuilder
        ? `${currentRouteNameBuilder}-${part}`
        : part

      const matchedRoute = allRoutes.find(r => r.name === currentRouteNameBuilder)
      if (matchedRoute && matchedRoute.meta?.title) {
        breadcrumbPaths.push(matchedRoute.meta.title as string)
      }
    })

    return breadcrumbPaths.length > 0 ? breadcrumbPaths : [currentRouteName]
  }

  // 处理普通路由名称
  const currentRoute = allRoutes.find(r => r.name === currentRouteName)
  if (currentRoute && currentRoute.meta?.title) {
    return [currentRoute.meta.title as string]
  }

  return [currentRouteName]
}

/**
 * 获取菜单树结构
 * @returns 菜单树数组
 */
export const getMenuTree = (): MenuItem[] => {
  return routeUtils.menuTree
}

/**
 * 根据权限过滤菜单
 * @param userRoles - 用户角色数组
 * @param menuTree - 菜单树，默认使用系统菜单
 * @returns 过滤后的菜单树
 */
export const getAuthorizedMenuTree = (userRoles: string[], menuTree?: MenuItem[]): MenuItem[] => {
  const menus = menuTree || getMenuTree()

  return menus.filter(menu => {
    // 检查当前菜单项权限
    if (menu.roles && menu.roles.length > 0) {
      const hasPermission = menu.roles.some(role => userRoles.includes(role))
      if (!hasPermission) {
        return false
      }
    }

    // 递归过滤子菜单
    if (menu.children && menu.children.length > 0) {
      menu.children = getAuthorizedMenuTree(userRoles, menu.children)
    }

    return true
  })
}

/**
 * 检查当前路由权限
 * @param userRoles - 用户角色数组
 * @param routeName - 路由名称，默认使用当前路由
 * @returns 是否有权限
 */
export const checkCurrentRoutePermission = (userRoles: string[], routeName?: string): boolean => {
  const targetRouteName = routeName || (router.currentRoute.value.name as string)

  if (!targetRouteName) {
    return true
  }

  const targetRoutes = getRouteByName(targetRouteName)
  if (targetRoutes.length === 0) {
    return true
  }

  const targetRoute = targetRoutes[0]
  const roles = targetRoute.meta?.roles as string[] | undefined

  // 如果没有设置权限要求，则允许访问
  if (!roles || roles.length === 0) {
    return true
  }

  // 检查用户角色是否匹配
  return roles.some(role => userRoles.includes(role))
}

/**
 * 获取路由的完整信息（包含增强的 meta 信息）
 * @param name - 路由名称
 * @returns 路由配置信息
 */
export const getRouteConfig = (name: string): RouteConfig | null => {
  const flatRoutes = routeUtils.flatRoutes
  return flatRoutes.find(route => route.name === name) || null
}

/**
 * 获取当前路由信息
 * @returns 当前路由的完整信息
 */
export const getCurrentRoute = (): RouteLocationNormalized => {
  return router.currentRoute.value
}

/**
 * 获取当前路由的 Meta 信息
 * @returns 当前路由的 meta 配置
 */
export const getCurrentRouteMeta = (): Record<string, any> => {
  return router.currentRoute.value.meta || {}
}

/**
 * 判断路由是否为外链
 * @param routeName - 路由名称
 * @returns 是否为外链
 */
export const isExternalLink = (routeName: string): boolean => {
  const routeConfig = getRouteConfig(routeName)
  return routeConfig?.meta?.isLink === true
}

/**
 * 获取外链地址
 * @param routeName - 路由名称
 * @returns 外链地址，如果不是外链则返回 null
 */
export const getExternalLinkUrl = (routeName: string): string | null => {
  const routeConfig = getRouteConfig(routeName)
  return routeConfig?.meta?.linkUrl || null
}

/**
 * 刷新当前路由
 */
export const refreshCurrentRoute = (): void => {
  router.go(0)
}

/**
 * 替换当前路由（不会在历史记录中留下记录）
 * @param path - 目标路径
 * @param query - 查询参数
 */
export const replaceRoute = (path: string, query?: LocationQueryRaw): void => {
  router.replace({ path, query })
}

/**
 * 获取路由历史记录数量
 * @returns 历史记录数量
 */
export const getHistoryLength = (): number => {
  return history.length
}

// 兼容性别名（保持与原有代码的兼容性）
export const getRouter = getRouteByName
export const goName = goToRoute
export const getParentRoute = getBreadcrumbByRoute

// 默认导出所有工具函数
export default {
  // 导航相关
  goBack,
  goToRoute,
  goName,
  replaceRoute,
  refreshCurrentRoute,

  // 路由查询
  getRouteByName,
  getRouteByPath,
  getRouteConfig,
  getCurrentRoute,
  getCurrentRouteMeta,
  getFlatRouteList,

  // 面包屑和菜单
  getBreadcrumbByRoute,
  getMenuTree,
  getAuthorizedMenuTree,

  // 权限相关
  checkCurrentRoutePermission,

  // 外链相关
  isExternalLink,
  getExternalLinkUrl,

  // 路由更新
  updateRoute,

  // 工具函数
  getHistoryLength,

  // 兼容性别名
  getRouter,
  getParentRoute,
}
