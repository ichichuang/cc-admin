/**
 * 日文语言包 (ja-JP)
 */
import { authJaJP } from '../modules/auth'
import { commonJaJP } from '../modules/common'
import { dashboardJaJP } from '../modules/dashboard'
import { routerJaJP } from '../modules/router'
import { userJaJP } from '../modules/user'

// 为了保持向后兼容，同时导出具名导出和默认导出
export const jaJP = {
  common: commonJaJP,
  auth: authJaJP,
  user: userJaJP,
  dashboard: dashboardJaJP,
  router: routerJaJP,
}

// i18n Ally 期望的默认导出
export default jaJP
