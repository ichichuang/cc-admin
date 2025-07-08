const isDebug = import.meta.env.VITE_DEBUG && false
// Router 统一管理入口
import { getAuthRoutes } from '@/api'
import { useLoading } from '@/hooks'
import { usePermissionStoreWithOut, useUserStoreWithOut } from '@/stores'
import { autoImportModulesSync } from '@/utils/moduleLoader'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import {
  createDynamicRouteManager,
  createRouteUtils,
  isOneOfArray,
  processAsyncRoutes,
  sortRoutes,
  transformToVueRoutes,
} from './utils'

const { loadingStart, loadingDone } = useLoading()

// 自动导入所有路由模块
const routeModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedRoutes = autoImportModulesSync<RouteConfig[]>(routeModules)

// 将所有路由模块合并为一个数组并排序
const staticRoutes: RouteConfig[] = Object.values(importedRoutes).flat()
const sortedStaticRoutes = sortRoutes(staticRoutes)
if (isDebug) {
  console.log('=======================开始初始化路由========================')
}

// 创建路由工具集（用于菜单渲染、面包屑等）
export const routeUtils = createRouteUtils(sortedStaticRoutes)
if (isDebug) {
  console.log('1-路由工具集: ', routeUtils)
  console.log('1-面包屑映射: ', routeUtils.breadcrumbMap)
  console.log('1-扁平化路由: ', routeUtils.flatRoutes)
  console.log('1-菜单树: ', routeUtils.menuTree)
}

// 添加根路径重定向
const rootRedirect: RouteConfig = {
  path: '/',
  name: 'RootRedirect',
  redirect: import.meta.env.VITE_ROOT_REDIRECT,
}

// 合并所有静态路由（包括根重定向）
const allStaticRoutesWithRedirect = [rootRedirect, ...sortedStaticRoutes]

// 转换为 Vue Router 兼容格式
const initialRoutes: RouteRecordRaw[] = allStaticRoutesWithRedirect.map(
  route => route as RouteRecordRaw
)

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: initialRoutes,
  // 滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// 创建动态路由管理器
export const dynamicRouteManager = createDynamicRouteManager(router)

// 路由白名单（无需登录即可访问）
const whiteList = ['/login', '/register', '/404', '/403', '/500']

// 标记动态路由是否已加载
let isDynamicRoutesLoaded = false

/**
 * 检查用户是否有访问路由的权限
 */
const checkRoutePermission = (route: any, userRoles: string[] = []): boolean => {
  const requiredRoles = route.meta?.roles

  // 如果路由没有权限要求，则允许访问
  if (!requiredRoles || requiredRoles.length === 0) {
    return true
  }

  // 检查用户角色是否包含所需角色
  return isOneOfArray(requiredRoles, userRoles)
}

/**
 * 处理路由错误
 */
const handleRouteError = (error: any, to?: any) => {
  console.error('路由错误:', error)

  // 转换错误为字符串
  const errorMsg = error instanceof Error ? error.message : String(error)
  const errorName = error instanceof Error ? error.name : 'UnknownError'

  // 根据错误类型跳转到不同的错误页面
  if (errorName === 'NavigationFailure') {
    // 导航失败，可能是路由不存在
    console.warn(`导航失败: ${to?.path || '未知路径'}`)
    router.push('/404')
  } else if (
    errorMsg.includes('Permission') ||
    errorMsg.includes('403') ||
    errorMsg.includes('Forbidden')
  ) {
    // 权限相关错误
    console.warn(`权限错误: ${errorMsg}`)
    router.push('/403')
  } else if (errorMsg.includes('Network') || errorMsg.includes('fetch')) {
    // 网络相关错误
    console.error(`网络错误: ${errorMsg}`)
    router.push('/500')
  } else if (errorMsg.includes('Timeout')) {
    // 超时错误
    console.error(`请求超时: ${errorMsg}`)
    router.push('/500')
  } else {
    // 其他错误，跳转到500页面
    console.error(`未知错误: ${errorMsg}`)
    router.push('/500')
  }

  // 可以在这里添加错误上报逻辑
  // 例如：reportError({ error: errorMsg, route: to?.path, timestamp: Date.now() })
}

/**
 * 初始化动态路由
 * 从后端获取路由配置并添加到路由系统
 */
export const initDynamicRoutes = async (retryCount = 0): Promise<void> => {
  if (isDynamicRoutesLoaded) {
    return
  }

  const maxRetries = 2 // 最大重试次数

  try {
    const permissionStore = usePermissionStoreWithOut()
    const userStore = useUserStoreWithOut()

    // 设置静态路由到 store
    permissionStore.setStaticRoutes(sortedStaticRoutes)

    // 检查是否有用户信息和权限
    const token = userStore.getToken
    const userId = userStore.getUserInfo.userId
    if (!token || !userId) {
      throw new Error('用户信息不存在，无法加载动态路由')
    }

    // 从 API 获取动态路由
    const backendRoutes = await getAuthRoutes()

    if (backendRoutes && backendRoutes.length > 0) {
      // 处理后端路由数据
      const processedRoutes = processAsyncRoutes(backendRoutes)
      if (isDebug) {
        console.log('3-处理后的动态路由: ', processedRoutes)
      }

      // 验证处理后的路由
      if (!processedRoutes || processedRoutes.length === 0) {
        throw new Error('处理后的动态路由为空')
      }

      // 设置动态路由到 store
      permissionStore.setDynamicRoutes(processedRoutes)

      // 添加到路由系统
      let addedCount = 0
      processedRoutes.forEach(route => {
        try {
          const vueRoute = transformToVueRoutes([route])[0]
          if (vueRoute.name && !router.hasRoute(vueRoute.name)) {
            router.addRoute(vueRoute)
            addedCount++
          }
        } catch (routeError) {
          console.warn(`添加路由失败: ${route.path}`, routeError)
        }
      })

      if (isDebug) {
        console.log(`3-动态路由加载成功，添加了 ${addedCount}/${processedRoutes.length} 个路由`)
      }
    } else {
      console.warn('后端返回的动态路由为空')
    }

    isDynamicRoutesLoaded = true
  } catch (error) {
    console.error(`动态路由初始化失败 (尝试 ${retryCount + 1}/${maxRetries + 1}):`, error)

    // 如果还有重试机会且不是权限错误，则重试
    const errorMsg = error instanceof Error ? error.message : String(error)
    if (retryCount < maxRetries && !errorMsg.includes('用户信息不存在')) {
      console.log(`${retryCount + 1} 秒后重试...`)
      await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000))
      return initDynamicRoutes(retryCount + 1)
    }

    // 重试失败或权限错误，抛出错误
    throw error
  }
}

/**
 * 重置路由系统
 * 清除所有动态路由，保留静态路由
 */
export const resetRouter = (): void => {
  const permissionStore = usePermissionStoreWithOut()

  // 清空权限 store
  permissionStore.resetAll()

  // 清空动态路由管理器
  dynamicRouteManager.clearRoutes()

  // 重置加载标记
  isDynamicRoutesLoaded = false

  console.log('路由系统已重置')
}

// 路由守卫：权限检查和错误处理
router.beforeEach(async (to, from, next) => {
  if (isDebug) {
    console.log('2-进入路由守卫-beforeEach')
    console.log('2-beforeEach-to: ', to)
    console.log('2-beforeEach-from: ', from)
  }

  loadingStart()

  try {
    // 设置页面标题
    if (to.meta?.title) {
      document.title = `${to.meta.title} - ${import.meta.env.VITE_APP_TITLE}`
    }

    // 检查是否是错误页面，如果是则直接通过
    const errorPages = ['/404', '/403', '/500']
    if (errorPages.includes(to.path)) {
      if (isDebug) {
        console.warn('3-这是错误页面，直接通过不检查权限: ', errorPages)
        debugger
      }
      next()
      return
    }

    // 检查是否在白名单中
    if (whiteList.includes(to.path)) {
      if (isDebug) {
        console.warn('3-这是白名单页面，直接通过不检查权限: ', whiteList)
        debugger
      }
      next()
      return
    }

    const permissionStore = usePermissionStoreWithOut()
    const userStore = useUserStoreWithOut()
    // 检查用户是否已登录
    const token = userStore.getToken
    if (!token) {
      if (isDebug) {
        console.warn('3-用户未登录，重定向到登录页')
        debugger
      }
      next({ path: '/login', query: { redirect: to.fullPath } })
      return
    }

    // 检查是否需要初始化动态路由
    if (!isDynamicRoutesLoaded && !permissionStore.isRoutesLoaded) {
      if (isDebug) {
        console.log('3-初始化动态路由')
      }
      try {
        await initDynamicRoutes()
        // 动态路由加载完成后，重新导航到目标路由
        next({ ...to, replace: true })
        return
      } catch (error) {
        console.error('动态路由初始化失败:', error)
        // 根据错误类型决定跳转页面
        const errorMsg = error instanceof Error ? error.message : String(error)
        if (errorMsg.includes('403') || errorMsg.includes('Forbidden')) {
          next('/403')
        } else {
          next('/500')
        }
        return
      }
    }

    // 权限检查逻辑
    const userRoles = userStore.getUserRoles
    const hasPermission = checkRoutePermission(to, userRoles)

    if (!hasPermission) {
      if (isDebug) {
        console.warn(`用户权限不足，无法访问路由: ${to.path}`)
        debugger
      }
      // 记录无权限访问尝试
      permissionStore.recordUnauthorizedAccess?.(to.path, userRoles)
      next('/403')
      return
    }

    // 处理页面缓存
    if (to.meta?.keepAlive && to.name) {
      permissionStore.cacheOperate({
        mode: 'add',
        name: String(to.name),
      })
    }

    // 检查路由是否存在（防止动态路由未正确加载）
    const routeExists = router.hasRoute(to.name as string)
    if (to.name && !routeExists && !errorPages.includes(to.path)) {
      console.warn(`路由不存在: ${to.path}`)
      next('/404')
      return
    }

    next()
  } catch (error) {
    console.error('路由守卫错误:', error)
    handleRouteError(error, to)
  }
})

// 路由错误处理
router.onError((error, to) => {
  handleRouteError(error, to)
})

// 路由后置守卫
router.afterEach((to, from) => {
  if (isDebug) {
    console.log(`路由跳转: ${from.path} -> ${to.path}`)
  }

  setTimeout(() => {
    loadingDone()
  }, 3000)
})

export default router

// 导出路由配置供其他地方使用
export { initialRoutes as routes, sortedStaticRoutes as staticRoutes }

// 导出工具函数
export {
  checkRoutePermission,
  createRouteUtils,
  filterAuthorizedRoutes,
  processAsyncRoutes,
  sortRoutes,
  transformToVueRoutes,
} from './utils'

// 注意：当你在 modules/ 目录下添加新的路由文件时，
// 它们会自动被导入并合并到路由配置中
// 每个路由模块应该导出一个 RouteConfig[] 数组

// 动态路由使用说明：
// 1. 用户登录后，系统会自动从后端获取动态路由
// 2. 动态路由会根据用户权限进行过滤
// 3. 权限检查包括页面级权限（roles）和按钮级权限（auths）
// 4. 路由会自动添加到 Vue Router 和权限 Store 中

/**
 * 验证路由配置完整性
 * 开发环境下的调试工具
 */
export const validateRouteConfig = () => {
  if (import.meta.env.DEV) {
    console.group('🔍 路由配置验证')

    // 验证静态路由
    console.log('静态路由数量:', sortedStaticRoutes.length)
    console.log(
      '静态路由列表:',
      sortedStaticRoutes.map(r => `${r.path} (${String(r.name || '未命名')})`)
    )

    const permissionStore = usePermissionStoreWithOut()
    // 验证动态路由
    console.log('动态路由数量:', permissionStore.dynamicRoutes.length)
    console.log(
      '动态路由列表:',
      permissionStore.dynamicRoutes.map((r: any) => `${r.path} (${String(r.name || '未命名')})`)
    )

    // 验证路由工具
    console.log('路由工具:', {
      扁平化路由数量: routeUtils.flatRoutes.length,
      菜单树节点数量: routeUtils.menuTree.length,
      面包屑映射数量: routeUtils.breadcrumbMap.size,
    })

    // 验证权限配置
    console.log('权限配置:', {
      用户信息: !!permissionStore.userInfo,
      动态路由已加载: permissionStore.isRoutesLoaded,
      动态路由数量: permissionStore.dynamicRoutes.length,
      缓存页面数量: permissionStore.cachePageList.length,
    })

    console.groupEnd()
  }
}

/**
 * 获取当前路由信息（调试用）
 */
export const getCurrentRouteInfo = () => {
  const currentRoute = router.currentRoute.value
  return {
    路径: currentRoute.path,
    名称: currentRoute.name,
    元信息: currentRoute.meta,
    参数: currentRoute.params,
    查询: currentRoute.query,
    匹配的路由: currentRoute.matched.map(m => String(m.name || '未命名')),
  }
}

/**
 * 路由健康检查
 */
export const routeHealthCheck = () => {
  const issues: string[] = []

  // 检查基础配置
  if (sortedStaticRoutes.length === 0) {
    issues.push('静态路由为空')
  }

  // 检查错误页面路由
  const errorRoutes = ['/404', '/403', '/500']
  errorRoutes.forEach(path => {
    if (!router.hasRoute(path.replace('/', ''))) {
      issues.push(`缺少错误页面路由: ${path}`)
    }
  })

  // 检查权限配置
  const permissionStore = usePermissionStoreWithOut()
  if (permissionStore.userInfo && !permissionStore.isRoutesLoaded && isDynamicRoutesLoaded) {
    issues.push('动态路由状态不一致')
  }

  return {
    healthy: issues.length === 0,
    issues,
    timestamp: new Date().toISOString(),
  }
}

// 开发环境下自动进行路由验证
if (import.meta.env.DEV && isDebug) {
  // 延迟验证，确保所有模块都已加载
  setTimeout(() => {
    validateRouteConfig()
    const health = routeHealthCheck()
    if (!health.healthy) {
      console.warn('⚠️ 路由配置存在问题:', health.issues)
    } else {
      console.log('✅ 路由配置健康检查通过')
    }
  }, 1000)
}
