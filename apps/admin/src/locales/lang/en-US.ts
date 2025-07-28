/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 国际化
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 英文语言包 (en-US)
 */
import { authEnUS } from '@/locales/modules/auth'
import { commonEnUS } from '@/locales/modules/common'
import { dashboardEnUS } from '@/locales/modules/dashboard'
import { routerEnUS } from '@/locales/modules/router'
import { userEnUS } from '@/locales/modules/user'

// 为了保持向后兼容，同时导出具名导出和默认导出
export const enUS = {
  common: commonEnUS,
  auth: authEnUS,
  user: userEnUS,
  dashboard: dashboardEnUS,
  router: routerEnUS,
}

// i18n Ally 期望的默认导出
export default enUS
