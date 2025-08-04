/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 配置统一导出
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 导出所有配置模块
export * from './modules/app'
export * from './modules/http'
export * from './modules/rem'
export * from './modules/router'

// 重新导出常用配置，方便使用
export {
  adapterStrategies,
  breakpoints,
  desktopConfig,
  deviceTypes,
  mobileConfig,
  remConfig,
} from './modules/rem'

export { errorPages, routeWhiteList } from './modules/router'
