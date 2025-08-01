/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - REM 适配配置模块
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * REM 适配系统配置
 */
export const remConfig = {
  // 设计稿基准宽度
  designWidth: 1800,

  // 基准字体大小（设计稿上的基准值）
  baseFontSize: 16,

  // 最小字体大小
  minFontSize: 12,

  // 最大字体大小
  maxFontSize: 24,

  // 是否启用移动端优先策略
  mobileFirst: false,

  // PostCSS root 值
  postcssRootValue: 16,
} as const

/**
 * 断点配置（与 UnoCSS 保持一致）
 */
export const breakpoints = {
  xs: 375, // 超小屏 (375px+)
  sm: 768, // 小屏 (768px+)
  md: 1024, // 中屏 (1024px+)
  lg: 1400, // 大屏 (1400px+)
  xl: 1660, // 超大屏 (1660px+)
  xls: 1920, // 特大屏 (1920px+)
} as const

/**
 * 设备类型
 */
export const deviceTypes = {
  pc: 'PC',
  mobile: 'Mobile',
} as const

/**
 * 适配策略
 */
export const adapterStrategies = {
  mobileFirst: 'mobile-first',
  desktopFirst: 'desktop-first',
} as const

/**
 * 移动端特殊配置
 */
export const mobileConfig = {
  // 移动端最大设计稿宽度
  maxDesignWidth: 768,

  // 移动端最大基准字体大小
  maxBaseFontSize: 14,

  // 移动端最小字体大小
  minFontSize: 10,

  // 移动端最大字体大小
  maxFontSize: 18,
} as const

/**
 * 桌面端特殊配置
 */
export const desktopConfig = {
  // 桌面端最小设计稿宽度
  minDesignWidth: 1024,

  // 桌面端最小基准字体大小
  minBaseFontSize: 14,

  // 桌面端最小字体大小
  minFontSize: 12,

  // 桌面端最大字体大小
  maxFontSize: 28,
} as const

/**
 * 调试配置
 */
export const debugConfig = {
  // 是否启用调试模式
  enabled: false,

  // 调试信息显示间隔（毫秒）
  logInterval: 1000,

  // 是否在控制台显示适配信息
  showAdapterInfo: false,

  // 是否显示断点信息
  showBreakpointInfo: false,
} as const
