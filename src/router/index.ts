/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - 路由管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// Router 统一管理入口
import { createDynamicRouteManager, createRouteUtils, sortRoutes } from '@/router/utils'
import { registerRouterGuards } from '@/router/utils/customs'
import { env } from '@/utils/env'
import { autoImportModulesSync } from '@/utils/moduleLoader'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { initDynamicRoutes } from './utils/helper'

// 自动导入所有路由模块
const routeModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedRoutes = autoImportModulesSync<RouteConfig[]>(routeModules)

// 将所有路由模块合并为一个数组并排序
const staticRoutes: RouteConfig[] = (Object.values(importedRoutes).flat() as any[]).filter(
  (r): r is RouteConfig => r && typeof r.path === 'string'
)
const sortedStaticRoutes = sortRoutes(staticRoutes)

// 创建路由工具集（用于菜单渲染、面包屑等）
export const routeUtils = createRouteUtils(sortedStaticRoutes)

// 添加根路径重定向
const rootRedirect: RouteConfig = {
  path: '/',
  name: 'RootRedirect',
  redirect: env.rootRedirect,
}

// 合并所有静态路由（包括根重定向）
const allStaticRoutesWithRedirect = [rootRedirect, ...sortedStaticRoutes]

// 转换为 Vue Router 兼容格式
const initialRoutes: RouteRecordRaw[] = allStaticRoutesWithRedirect.map(
  route => route as RouteRecordRaw
)

// 创建路由实例
const router = createRouter({
  // history 模式
  history: createWebHistory(env.publicPath),
  // history: createWebHashHistory(env.publicPath),
  routes: initialRoutes,
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

// 注册路由守卫
registerRouterGuards(router, {
  initDynamicRoutes,
  sortedStaticRoutes,
  isDebug: env.debug,
})

// 导出路由配置供其他地方使用
export { initialRoutes as routes, sortedStaticRoutes as staticRoutes }

// 注意：当你在 modules/ 目录下添加新的路由文件时，
// 它们会自动被导入并合并到路由配置中
// 每个路由模块应该导出一个 RouteConfig[] 数组

// 动态路由使用说明：
// 1. 用户登录后，系统会自动从后端获取动态路由
// 2. 动态路由会根据用户权限进行过滤
// 3. 权限检查包括页面级权限（roles）和按钮级权限（auths）
// 4. 路由会自动添加到 Vue Router 和权限 Store 中

export default router
