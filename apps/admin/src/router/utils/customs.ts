/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - 路由守卫
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { usePermissionStore } from '@cc/early-bird-core/stores'
import type { Router } from 'vue-router'
import { useUserStore } from '../../stores/modules/user'

/**
 * 路由守卫配置接口
 */
interface RouterGuardConfig {
  initDynamicRoutes: () => any[]
  sortedStaticRoutes: any[]
  isDebug?: boolean
}

/**
 * 注册路由守卫
 */
export function registerRouterGuards(router: Router, config: RouterGuardConfig) {
  const { initDynamicRoutes, isDebug = false } = config

  // 全局前置守卫
  router.beforeEach(async (to, from, next) => {
    if (isDebug) {
      console.log(`[Router Guard] 路由跳转: ${from.path} -> ${to.path}`)
    }

    const userStore = useUserStore()
    const permissionStore = usePermissionStore()

    // 检查是否需要登录
    if (to.meta?.requiresAuth !== false) {
      // 检查用户是否已登录
      if (!userStore.getToken) {
        // 保存目标路由，登录后跳转
        userStore.setRedirectPath(to.fullPath)
        next('/login')
        return
      }
    }

    // 检查路由权限
    if (to.meta?.roles && Array.isArray(to.meta.roles) && to.meta.roles.length > 0) {
      const userRoles = userStore.getUserRoles || []
      const hasPermission = (to.meta.roles as string[]).some((role: string) =>
        userRoles.includes(role)
      )

      if (!hasPermission) {
        if (isDebug) {
          console.warn(
            `[Router Guard] 权限不足: ${to.path}, 用户角色: ${userRoles.join(', ')}, 需要角色: ${(to.meta.roles as string[]).join(', ')}`
          )
        }
        next('/403')
        return
      }
    }

    // 初始化动态路由（如果需要）
    if (permissionStore.dynamicRoutes.length === 0) {
      try {
        const dynamicRoutes = initDynamicRoutes()
        if (dynamicRoutes.length > 0) {
          permissionStore.setDynamicRoutes(dynamicRoutes)
        }
      } catch (error) {
        console.error('[Router Guard] 初始化动态路由失败:', error)
      }
    }

    next()
  })

  // 全局后置守卫
  router.afterEach((to, from) => {
    if (isDebug) {
      console.log(`[Router Guard] 路由跳转完成: ${from.path} -> ${to.path}`)
    }

    // 设置页面标题
    if (to.meta?.title) {
      document.title = `${to.meta.title} - CC-Admin`
    }
  })

  // 路由错误处理
  router.onError(error => {
    console.error('[Router Error] 路由错误:', error)

    // 如果是路由不存在，跳转到 404 页面
    if (error.message.includes('No match found')) {
      router.push('/404')
    }
  })
}

/**
 * 检查路由权限
 */
export function checkRoutePermission(route: any, userRoles: string[]): boolean {
  if (!route.meta?.roles || !Array.isArray(route.meta.roles) || route.meta.roles.length === 0) {
    return true
  }

  return (route.meta.roles as string[]).some((role: string) => userRoles.includes(role))
}

/**
 * 获取路由权限信息
 */
export function getRoutePermissionInfo(route: any) {
  return {
    requiresAuth: route.meta?.requiresAuth !== false,
    roles: (route.meta?.roles as string[]) || [],
    auths: (route.meta?.auths as string[]) || [],
    title: route.meta?.title || '',
  }
}
