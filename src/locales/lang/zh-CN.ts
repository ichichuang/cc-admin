/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - 国际化
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 中文语言包 (zh-CN)
 */
import { authZhCN } from '../modules/auth'
import { commonZhCN } from '../modules/common'
import { dashboardZhCN } from '../modules/dashboard'
import { routerZhCN } from '../modules/router'
import { userZhCN } from '../modules/user'

// 为了保持向后兼容，同时导出具名导出和默认导出
export const zhCN = {
  common: commonZhCN,
  auth: authZhCN,
  user: userZhCN,
  dashboard: dashboardZhCN,
  router: routerZhCN,
}

// i18n Ally 期望的默认导出
export default zhCN
