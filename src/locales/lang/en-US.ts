/**
 * 英文语言包 (en-US)
 */
import { authEnUS } from '../modules/auth'
import { commonEnUS } from '../modules/common'
import { dashboardEnUS } from '../modules/dashboard'
import { routerEnUS } from '../modules/router'
import { userEnUS } from '../modules/user'

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
