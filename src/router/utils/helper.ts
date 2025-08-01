/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - 路由管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { getAuthRoutes } from '@/api'
import { errorPages } from '@/constants'
import { processAsyncRoutes, transformToVueRoutes } from '@/router/utils'
import { usePermissionStoreWithOut, useUserStoreWithOut } from '@/stores'
import { isDev } from '@/utils/env'
import { computed } from 'vue'

/**
 * 初始化动态路由
 *
 * @description 从后端获取用户权限路由，处理后添加到 Vue Router 中
 * @param router - Vue Router 实例
 * @param sortedStaticRoutes - 已排序的静态路由数组
 * @param isDebug - 是否开启调试模式，默认 false
 * @param retryCount - 重试次数，默认 0
 * @returns Promise<void> - 初始化完成后的 Promise
 * @throws {InitDynamicRouteError} 当动态路由初始化失败时抛出错误
 */
export const initDynamicRoutes = async (
  router: any,
  sortedStaticRoutes: any,
  isDebug = false,
  retryCount = 0
): Promise<void> => {
  const permissionStore = usePermissionStoreWithOut()
  const isDynamicRoutesLoaded = computed(() => permissionStore.getIsRoutesLoaded)
  if (isDynamicRoutesLoaded.value) {
    return
  }
  const maxRetries = 3
  try {
    const permissionStore = usePermissionStoreWithOut()
    const userStore = useUserStoreWithOut()
    permissionStore.setStaticRoutes(sortedStaticRoutes)
    const token = userStore.getToken
    const userId = userStore.getUserInfo.userId
    if (!token || !userId) {
      throw new Error('用户信息不存在，无法加载动态路由')
    }
    const backendRoutes = await getAuthRoutes()
    if (backendRoutes && backendRoutes.length > 0) {
      const processedRoutes = processAsyncRoutes(backendRoutes as BackendRouteConfig[])
      if (isDebug) {
        console.log('🔄 处理后的动态路由:', processedRoutes)
      }
      if (!processedRoutes || processedRoutes.length === 0) {
        throw new Error('处理后的动态路由为空')
      }
      permissionStore.setDynamicRoutes(processedRoutes)
      let addedCount = 0
      processedRoutes.forEach(route => {
        try {
          const vueRoute = transformToVueRoutes([route])[0]
          if (vueRoute.name && !router.hasRoute(vueRoute.name)) {
            router.addRoute(vueRoute)
            addedCount++
          }
        } catch (routeError) {
          console.warn(`添加路由失败: ${route.path}, routeError: ${routeError}`)
        }
      })
      if (isDebug) {
        console.log(`✅ 动态路由加载成功，添加了 ${addedCount}/${processedRoutes.length} 个路由`)
      }
    } else {
      console.warn('后端返回的动态路由为空')
    }
    permissionStore.setIsRoutesLoaded(true)
  } catch (error) {
    // 只在最终失败时设置标志
    if (retryCount >= maxRetries) {
      permissionStore.setIsRoutesLoaded(false)
    }

    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error(`动态路由初始化失败 (尝试 ${retryCount + 1}/${maxRetries + 1}):`, errorMsg)
    if (retryCount < maxRetries && !errorMsg.includes('用户信息不存在')) {
      const delay = (retryCount + 1) * 1000
      console.log(`${delay / 1000}s 后重试 …`)
      await new Promise(r => setTimeout(r, delay))
      permissionStore.setIsRoutesLoaded(false)
      return initDynamicRoutes(router, sortedStaticRoutes, isDebug, retryCount + 1)
    }
    permissionStore.setIsRoutesLoaded(true)
    class InitDynamicRouteError extends Error {
      constructor(msg: string) {
        super(msg)
        this.name = 'InitDynamicRouteError'
      }
    }
    throw new InitDynamicRouteError(errorMsg || '动态路由初始化失败')
  }
}

/**
 * 重置路由器状态
 *
 * @description 清除权限存储中的路由信息，重置动态路由管理器，并标记路由为未加载状态
 * @param router - Vue Router 实例
 * @param dynamicRouteManager - 动态路由管理器实例
 * @returns void
 */
export const resetRouter = (router: any, dynamicRouteManager: any): void => {
  const permissionStore = usePermissionStoreWithOut()
  permissionStore.reset()
  dynamicRouteManager.clearRoutes()
  permissionStore.setIsRoutesLoaded(false)
}

/**
 * 验证路由配置
 *
 * @description 在开发环境下验证路由配置的完整性，输出详细的调试信息
 * @param sortedStaticRoutes - 已排序的静态路由数组
 * @param routeUtils - 路由工具对象，包含扁平化路由、菜单树等信息
 * @returns void
 */
export const validateRouteConfig = (sortedStaticRoutes: any, routeUtils: any) => {
  if (isDev()) {
    console.group('🔍 路由配置验证')
    console.log('📊 静态路由数量:', sortedStaticRoutes.length)
    console.log(
      '📋 静态路由列表:',
      sortedStaticRoutes.map((r: any) => `${r.path} (${String(r.name || '未命名')})`)
    )
    const permissionStore = usePermissionStoreWithOut()
    const userStore = useUserStoreWithOut()
    console.log('📊 动态路由数量:', permissionStore.dynamicRoutes.length)
    console.log(
      '📋 动态路由列表:',
      permissionStore.dynamicRoutes.map((r: any) => `${r.path} (${String(r.name || '未命名')})`)
    )
    console.log('🛠️ 路由工具:', {
      扁平化路由数量: routeUtils.flatRoutes.length,
      菜单树节点数量: routeUtils.menuTree.length,
      面包屑映射数量: routeUtils.breadcrumbMap.size,
    })
    console.log('🔐 权限配置:', {
      用户信息: !!userStore.getUserInfo,
      动态路由已加载: permissionStore.isRoutesLoaded,
      动态路由数量: permissionStore.dynamicRoutes.length,
    })
    console.groupEnd()
  }
}

/**
 * 获取当前路由信息
 *
 * @description 获取当前激活路由的详细信息，包括路径、名称、元信息、参数等
 * @param router - Vue Router 实例
 * @returns {Object} 当前路由的详细信息对象
 * @returns {string} returns.路径 - 当前路由路径
 * @returns {string} returns.名称 - 当前路由名称
 * @returns {Object} returns.元信息 - 当前路由元信息
 * @returns {Object} returns.参数 - 当前路由参数
 * @returns {Object} returns.查询 - 当前路由查询参数
 * @returns {string[]} returns.匹配的路由 - 当前路由匹配的路由数组
 */
export const getCurrentRouteInfo = (router: any) => {
  const currentRoute = router.currentRoute.value
  return {
    路径: currentRoute.path,
    名称: currentRoute.name,
    元信息: currentRoute.meta,
    参数: currentRoute.params,
    查询: currentRoute.query,
    匹配的路由: currentRoute.matched.map((m: any) => String(m.name || '未命名')),
  }
}

/**
 * 路由健康检查
 *
 * @description 检查路由系统的健康状态，检测潜在的问题和配置错误
 * @param router - Vue Router 实例
 * @param sortedStaticRoutes - 已排序的静态路由数组
 * @param _routeUtils - 路由工具对象（未使用，但保留参数以保持接口一致性）
 * @returns {Object} 健康检查结果对象
 * @returns {boolean} returns.healthy - 路由系统是否健康
 * @returns {string[]} returns.issues - 发现的问题列表
 * @returns {string} returns.timestamp - 检查时间戳
 */
export const routeHealthCheck = (router: any, sortedStaticRoutes: any, _routeUtils: any) => {
  const issues: string[] = []
  if (sortedStaticRoutes.length === 0) {
    issues.push('静态路由为空')
  }
  errorPages.forEach(path => {
    if (!router.hasRoute(path.replace('/', ''))) {
      issues.push(`缺少错误页面路由: ${path}`)
    }
  })
  const permissionStore = usePermissionStoreWithOut()
  const userStore = useUserStoreWithOut()
  const isDynamicRoutesLoaded = computed(() => permissionStore.getIsRoutesLoaded)
  if (userStore.getUserInfo && !permissionStore.isRoutesLoaded && isDynamicRoutesLoaded.value) {
    issues.push('动态路由状态不一致')
  }
  return {
    healthy: issues.length === 0,
    issues,
    timestamp: new Date().toISOString(),
  }
}
