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
