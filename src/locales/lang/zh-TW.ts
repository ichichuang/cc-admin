/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - 国际化
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 繁体中文语言包 (zh-TW)
 */
import { authZhTW } from '../modules/auth'
import { commonZhTW } from '../modules/common'
import { dashboardZhTW } from '../modules/dashboard'
import { routerZhTW } from '../modules/router'
import { userZhTW } from '../modules/user'

// 为了保持向后兼容，同时导出具名导出和默认导出
export const zhTW = {
  common: commonZhTW,
  auth: authZhTW,
  user: userZhTW,
  dashboard: dashboardZhTW,
  router: routerZhTW,
}

// i18n Ally 期望的默认导出
export default zhTW
