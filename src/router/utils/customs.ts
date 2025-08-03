/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 路由管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { errorPages, routeWhiteList } from '@/constants'
import { useLoading } from '@/hooks'
import { t } from '@/locales'
import { recordUnauthorizedAccess } from '@/router/utils'
import { useAppStoreWithOut, usePermissionStoreWithOut, useUserStoreWithOut } from '@/stores'
import type { Router } from 'vue-router'

const { loadingStart, loadingDone } = useLoading()

/**
 * 获取路由页面标题（支持多语言）
 * @param route 路由对象
 * @param appTitle 应用标题
 * @returns 页面标题
 */
export const getRouteTitle = (route: any, appTitle: string): string => {
  if (route.meta?.titleKey) {
    // 使用 titleKey 获取多语言标题
    return `${t(route.meta.titleKey)} - ${appTitle}`
  } else if (route.meta?.title) {
    // 兼容直接设置 title 的情况
    return `${route.meta.title} - ${appTitle}`
  }
  return appTitle
}

/**
 * 更新当前页面标题（支持语言切换时动态更新）
 */
export const updateCurrentPageTitle = (router: Router) => {
  const appStore = useAppStoreWithOut()
  const env = import.meta.env
  const title = env.VITE_APP_TITLE || appStore.getTitle

  // 获取当前路由
  const currentRoute = router.currentRoute.value

  // 更新页面标题
  document.title = getRouteTitle(currentRoute, title)
}

/**
 * 检查用户是否有访问路由的权限
 */
export const checkRoutePermission = (route: any, userRoles: string[] = []): boolean => {
  const requiredRoles = route.meta?.roles
  if (!requiredRoles || requiredRoles.length === 0) {
    return true
  }
  // 检查用户角色是否包含所需角色
  return (
    Array.isArray(requiredRoles) && requiredRoles.some((role: string) => userRoles.includes(role))
  )
}

/**
 * 处理路由错误
 */
export const handleRouteError = (error: any, to?: any, router?: Router) => {
  console.error('路由错误:', error)
  const errorMsg = error instanceof Error ? error.message : String(error)
  const errorName = error instanceof Error ? error.name : 'UnknownError'
  if (!router) {
    return
  }
  if (errorName === 'NavigationFailure') {
    console.warn(`导航失败: ${to?.path || '未知路径'}`)
    router.push('/404')
  } else if (
    errorMsg.includes('Permission') ||
    errorMsg.includes('403') ||
    errorMsg.includes('Forbidden')
  ) {
    console.warn(`权限错误: ${errorMsg}`)
    router.push('/403')
  } else if (errorMsg.includes('Network') || errorMsg.includes('fetch')) {
    console.error(`网络错误: ${errorMsg}`)
    router.push('/500')
  } else if (errorMsg.includes('Timeout')) {
    console.error(`请求超时: ${errorMsg}`)
    router.push('/500')
  } else {
    console.error(`未知错误: ${errorMsg}`)
    router.push('/500')
  }
}

/**
 * 注册路由守卫（beforeEach、afterEach、onError），支持动态路由初始化
 */
export function registerRouterGuards(
  router: Router,
  options: {
    initDynamicRoutes: (router: Router, sortedStaticRoutes: any, isDebug: boolean) => Promise<void>
    sortedStaticRoutes: any
    isDebug: boolean
  }
) {
  // 监听语言切换事件，动态更新页面标题
  window.addEventListener('locale-changed', () => {
    updateCurrentPageTitle(router)
  })

  router.beforeEach(async (to, from, next) => {
    loadingStart()
    try {
      const appStore = useAppStoreWithOut()
      const env = import.meta.env
      const title = env.VITE_APP_TITLE || appStore.getTitle

      // 使用工具函数处理页面标题多语言
      document.title = getRouteTitle(to, title)

      if (errorPages.includes(to.path as any)) {
        next()
        return
      }
      if (routeWhiteList.includes(to.path as any)) {
        next()
        return
      }
      const permissionStore = usePermissionStoreWithOut()
      const userStore = useUserStoreWithOut()
      const token = userStore.getToken
      if (!token) {
        next({ path: '/login', query: { redirect: to.fullPath } })
        return
      }
      // 动态路由未加载时自动初始化
      if (!permissionStore.isRoutesLoaded) {
        try {
          await options.initDynamicRoutes(router, options.sortedStaticRoutes, options.isDebug)
          // 动态路由已加载：
          if (to.name && router.hasRoute(to.name as string)) {
            next()
          } else {
            next({ ...to, replace: true })
          }
          return
        } catch (error) {
          if (error instanceof Error && error.name === 'InitDynamicRouteError') {
            userStore.resetToken()
            next({ path: '/login', query: { redirect: to.fullPath } })
            return
          }
          const errorMsg = error instanceof Error ? error.message : String(error)
          if (errorMsg.includes('403') || errorMsg.includes('Forbidden')) {
            next('/403')
          } else {
            next('/500')
          }
          return
        }
      }
      const userRoles = userStore.getUserRoles
      const hasPermission = checkRoutePermission(to, userRoles)
      if (!hasPermission) {
        recordUnauthorizedAccess(to.path, userRoles)
        next('/403')
        return
      }
      const routeExists = router.hasRoute(to.name as string)
      if (to.name && !routeExists && !errorPages.includes(to.path as any)) {
        next('/404')
        return
      }
      next()
    } catch (error) {
      handleRouteError(error, to, router)
    }
  })

  router.onError((error, to) => {
    handleRouteError(error, to, router)
  })

  router.afterEach((_to, _from) => {
    loadingDone()
  })
}
