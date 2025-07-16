import { getAuthRoutes } from '@/api'
import { processAsyncRoutes, transformToVueRoutes } from '@/router/utils'
import { usePermissionStoreWithOut, useUserStoreWithOut } from '@/stores'
import { computed } from 'vue'

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
        console.log('3-处理后的动态路由: ', processedRoutes)
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
        console.log(`3-动态路由加载成功，添加了 ${addedCount}/${processedRoutes.length} 个路由`)
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

export const resetRouter = (router: any, dynamicRouteManager: any): void => {
  const permissionStore = usePermissionStoreWithOut()
  permissionStore.reset()
  dynamicRouteManager.clearRoutes()
  permissionStore.setIsRoutesLoaded(false)
  console.log('路由系统已重置')
}

export const validateRouteConfig = (sortedStaticRoutes: any, routeUtils: any) => {
  if (import.meta.env.DEV) {
    console.group('🔍 路由配置验证')
    console.log('静态路由数量:', sortedStaticRoutes.length)
    console.log(
      '静态路由列表:',
      sortedStaticRoutes.map((r: any) => `${r.path} (${String(r.name || '未命名')})`)
    )
    const permissionStore = usePermissionStoreWithOut()
    const userStore = useUserStoreWithOut()
    console.log('动态路由数量:', permissionStore.dynamicRoutes.length)
    console.log(
      '动态路由列表:',
      permissionStore.dynamicRoutes.map((r: any) => `${r.path} (${String(r.name || '未命名')})`)
    )
    console.log('路由工具:', {
      扁平化路由数量: routeUtils.flatRoutes.length,
      菜单树节点数量: routeUtils.menuTree.length,
      面包屑映射数量: routeUtils.breadcrumbMap.size,
    })
    console.log('权限配置:', {
      用户信息: !!userStore.getUserInfo,
      动态路由已加载: permissionStore.isRoutesLoaded,
      动态路由数量: permissionStore.dynamicRoutes.length,
    })
    console.groupEnd()
  }
}

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

export const routeHealthCheck = (router: any, sortedStaticRoutes: any, _routeUtils: any) => {
  const issues: string[] = []
  if (sortedStaticRoutes.length === 0) {
    issues.push('静态路由为空')
  }
  const errorRoutes = ['/404', '/403', '/500']
  errorRoutes.forEach(path => {
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
