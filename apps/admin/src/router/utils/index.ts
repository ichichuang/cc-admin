/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - 路由工具
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 重新导出核心路由工具
export {
  createDynamicRouteManager,
  createRouteUtils,
  filterAuthorizedRoutes,
  processAsyncRoutes,
  sortRoutes,
  transformToVueRoutes,
} from '@cc/early-bird-core/router'

// 导出路由工具函数
export * from './customs'
export * from './helper'
