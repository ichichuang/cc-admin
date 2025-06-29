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
  redirect: '/dashboard',
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

// 路由守卫：权限检查
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - CC Admin`
  }

  // 这里可以添加权限检查逻辑
  // const userStore = useUserStore()
  // const userRoles = userStore.roles || []
  // const hasPermission = checkRoutePermission(route, userRoles)
  // if (!hasPermission) {
  //   next('/403')
  //   return
  // }

  next()
})

// 路由错误处理
router.onError(error => {
  console.error('路由错误:', error)
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
