/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 路由管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 路由统一管理入口
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

// 导入路由模块
import { autoImportModulesSync } from '@cc/early-bird-core/utils'

// 自动导入所有路由模块
const routerModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedRouters = autoImportModulesSync(routerModules)

// 导出所有路由模块
export { importedRouters }

// 合并所有路由
const routes: RouteRecordRaw[] = []
Object.values(importedRouters).forEach((routerModule: any) => {
  if (Array.isArray(routerModule)) {
    routes.push(...routerModule)
  } else if (routerModule && typeof routerModule === 'object') {
    routes.push(routerModule)
  }
})

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 导出路由实例
export default router

// 导出路由工具
export * from './utils'
