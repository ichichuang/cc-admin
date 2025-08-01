/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - 路由辅助工具
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { useUserStore } from '@/stores/modules/user'
import { filterAuthorizedRoutes, transformToVueRoutes } from '@cc/early-bird-core/router'
import { usePermissionStore } from '@cc/early-bird-core/stores'
import { useRoute, useRouter } from 'vue-router'

/**
 * 获取当前路由信息
 */
export function getCurrentRouteInfo() {
  const router = useRouter()
  const route = useRoute()

  return {
    currentRoute: route,
    currentPath: route.path,
    currentName: route.name,
    currentMeta: route.meta,
    router,
  }
}

/**
 * 初始化动态路由
 */
export function initDynamicRoutes() {
  const router = useRouter()
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  // 获取用户角色
  const userRoles = userStore.getUserRoles || []

  // 过滤有权限的动态路由
  const authorizedRoutes = filterAuthorizedRoutes(permissionStore.dynamicRoutes, userRoles)

  // 添加动态路由到路由器
  authorizedRoutes.forEach(route => {
    const vueRoute = transformToVueRoutes([route])[0]
    if (!router.hasRoute(vueRoute.name)) {
      router.addRoute(vueRoute)
    }
  })

  return authorizedRoutes
}

/**
 * 重置路由器
 */
export function resetRouter() {
  const router = useRouter()

  // 移除所有动态路由
  router.getRoutes().forEach(route => {
    if (route.name && route.name !== 'RootRedirect') {
      router.removeRoute(route.name)
    }
  })
}

/**
 * 路由健康检查
 */
export function routeHealthCheck() {
  const router = useRouter()
  const routes = router.getRoutes()

  const issues = []

  // 检查是否有重复的路由名称
  const routeNames = routes.map(r => r.name).filter(Boolean)
  const duplicateNames = routeNames.filter((name, index) => routeNames.indexOf(name) !== index)

  if (duplicateNames.length > 0) {
    issues.push(`发现重复的路由名称: ${duplicateNames.join(', ')}`)
  }

  // 检查是否有无效的路径
  const invalidPaths = routes.filter(r => !r.path || r.path === '')
  if (invalidPaths.length > 0) {
    issues.push(`发现无效的路由路径: ${invalidPaths.map(r => r.name).join(', ')}`)
  }

  return {
    totalRoutes: routes.length,
    issues,
    isHealthy: issues.length === 0,
  }
}

/**
 * 验证路由配置
 */
export function validateRouteConfig(sortedStaticRoutes: any, _routeUtils: any) {
  const issues = []

  // 检查路由配置的完整性
  sortedStaticRoutes.forEach((route: any) => {
    if (!route.path) {
      issues.push(`路由缺少路径: ${route.name || 'unnamed'}`)
    }

    if (!route.name && route.component) {
      issues.push(`路由缺少名称: ${route.path}`)
    }

    if (route.children) {
      route.children.forEach((child: any) => {
        if (!child.path) {
          issues.push(`子路由缺少路径: ${child.name || 'unnamed'}`)
        }
      })
    }
  })

  return {
    isValid: issues.length === 0,
    issues,
  }
}
