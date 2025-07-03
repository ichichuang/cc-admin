// Router 统一管理入口
import { autoImportModulesSync } from '@/utils/moduleLoader'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteConfig, RouteModule } from './types'
import { createRouteUtils, sortRoutes } from './utils'

// 自动导入所有路由模块
const routeModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedRoutes = autoImportModulesSync<RouteConfig[]>(routeModules)

// 将所有路由模块合并为一个数组并排序
const allRoutes: RouteConfig[] = Object.values(importedRoutes).flat()
const sortedRoutes = sortRoutes(allRoutes)

// 创建路由工具集（用于菜单渲染、面包屑等）
export const routeUtils = createRouteUtils(sortedRoutes)

// 添加根路径重定向
const rootRedirect: RouteConfig = {
  path: '/',
  redirect: '/home',
}

// 合并所有路由（包括根重定向）
const allRoutesWithRedirect = [rootRedirect, ...sortedRoutes]

// 转换为 Vue Router 兼容格式
const routes: RouteRecordRaw[] = allRoutesWithRedirect.map(route => route as RouteRecordRaw)

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

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
  return requiredRoles.some((role: string) => userRoles.includes(role))
}

/**
 * 处理路由错误
 */
const handleRouteError = (error: any, _to?: any) => {
  console.error('路由错误:', error)

  // 根据错误类型跳转到不同的错误页面
  if (error.name === 'NavigationFailure') {
    // 导航失败，可能是路由不存在
    router.push('/404')
  } else if (error.message?.includes('Permission')) {
    // 权限相关错误
    router.push('/403')
  } else {
    // 其他错误，跳转到500页面
    router.push('/500')
  }
}

// 路由守卫：权限检查和错误处理
router.beforeEach(async (to, from, next) => {
  try {
    // 设置页面标题
    if (to.meta?.title) {
      document.title = `${to.meta.title} - CC Admin`
    }

    // 检查是否是错误页面，如果是则直接通过
    const errorPages = ['/404', '/403', '/500']
    if (errorPages.includes(to.path)) {
      next()
      return
    }

    // 权限检查逻辑
    const userRoles: string[] = [] // 这里应该从用户store中获取
    // const userStore = useUserStore()
    // const userRoles = userStore.roles || []

    const hasPermission = checkRoutePermission(to, userRoles)
    if (!hasPermission) {
      console.warn(`用户权限不足，无法访问路由: ${to.path}`)
      next('/403')
      return
    }

    // 可以在这里添加其他检查
    // 例如：用户登录状态检查、路由是否存在等

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

export default router

// 导出路由配置供其他地方使用
export { routes, sortedRoutes }
export type { RouteConfig, RouteModule }

// 导出工具函数
export { createRouteUtils, filterAuthorizedRoutes, sortRoutes, transformToVueRoutes } from './utils'

// 注意：当你在 modules/ 目录下添加新的路由文件时，
// 它们会自动被导入并合并到路由配置中
// 每个路由模块应该导出一个 RouteConfig[] 数组
