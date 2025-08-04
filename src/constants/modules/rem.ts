/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - REM 适配配置模块
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * REM 适配系统配置
 */
export const remConfig = {
  // 设计稿基准宽度（桌面端）
  designWidth: 1800,

  // 基准字体大小（设计稿上的基准值，桌面端）
  baseFontSize: 16,

  // 最小字体大小（桌面端）
  minFontSize: 12,

  // 最大字体大小（桌面端）
  maxFontSize: 24,

  // 是否启用移动端优先策略
  // 注意：移动端优先时会自动使用 mobileConfig 中的配置
  mobileFirst: false,

  // PostCSS root 值（与 baseFontSize 保持一致）
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
  xxl: 2560, // 超宽屏 (2560px+)
  xxxl: 3840, // 4K屏 (3840px+)
} as const

/**
 * 设备类型
 */
export const deviceTypes = {
  pc: 'PC',
  mobile: 'Mobile',
  tablet: 'Tablet',
  largeScreen: 'LargeScreen',
  ultraWide: 'UltraWide',
  fourK: 'FourK',
} as const

/**
 * 适配策略
 */
export const adapterStrategies = {
  mobileFirst: 'mobile-first',
  desktopFirst: 'desktop-first',
  largeScreenFirst: 'large-screen-first',
  adaptive: 'adaptive',
} as const

/**
 * 移动端特殊配置
 *
 * 当启用移动端优先策略时，会自动使用这些配置：
 * - 设计稿宽度：768px（而不是桌面端的 1800px）
 * - 基准字体大小：14px（而不是桌面端的 16px）
 * - 字体大小范围：12px - 18px
 */
export const mobileConfig = {
  // 移动端最大设计稿宽度
  maxDesignWidth: 768,

  // 移动端最大基准字体大小
  maxBaseFontSize: 16,

  // 移动端最小字体大小
  minFontSize: 12,

  // 移动端最大字体大小
  maxFontSize: 18,
} as const

/**
 * 桌面端特殊配置
 *
 * 当使用桌面端优先策略时，会使用这些配置：
 * - 设计稿宽度：1800px（来自 remConfig.designWidth）
 * - 基准字体大小：16px（来自 remConfig.baseFontSize）
 * - 字体大小范围：12px - 28px
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
 * 大屏特殊配置
 *
 * 当屏幕宽度 > 1920px 时，会使用这些配置：
 * - 设计稿宽度：2560px
 * - 基准字体大小：18px
 * - 字体大小范围：14px - 32px
 */
export const largeScreenConfig = {
  // 大屏设计稿宽度
  designWidth: 2560,

  // 大屏基准字体大小
  baseFontSize: 18,

  // 大屏最小字体大小
  minFontSize: 14,

  // 大屏最大字体大小
  maxFontSize: 32,

  // 大屏最小宽度阈值
  minWidth: 1920,
} as const

/**
 * 超大屏特殊配置
 *
 * 当屏幕宽度 > 2560px 时，会使用这些配置：
 * - 设计稿宽度：3200px
 * - 基准字体大小：20px
 * - 字体大小范围：16px - 36px
 */
export const ultraWideConfig = {
  // 超大屏设计稿宽度
  designWidth: 3200,

  // 超大屏基准字体大小
  baseFontSize: 20,

  // 超大屏最小字体大小
  minFontSize: 16,

  // 超大屏最大字体大小
  maxFontSize: 36,

  // 超大屏最小宽度阈值
  minWidth: 2560,
} as const

/**
 * 4K屏特殊配置
 *
 * 当屏幕宽度 > 3840px 时，会使用这些配置：
 * - 设计稿宽度：3840px
 * - 基准字体大小：24px
 * - 字体大小范围：20px - 48px
 */
export const fourKConfig = {
  // 4K屏设计稿宽度
  designWidth: 3840,

  // 4K屏基准字体大小
  baseFontSize: 24,

  // 4K屏最小字体大小
  minFontSize: 20,

  // 4K屏最大字体大小
  maxFontSize: 48,

  // 4K屏最小宽度阈值
  minWidth: 3840,
} as const

/**
 * 自适应配置
 *
 * 根据屏幕宽度自动选择合适的配置：
 * - 移动端：768px 设计稿
 * - 桌面端：1800px 设计稿
 * - 大屏：2560px 设计稿
 * - 超大屏：3200px 设计稿
 * - 4K屏：3840px 设计稿
 */
export const adaptiveConfig = {
  // 自适应策略配置
  strategies: {
    mobile: {
      maxWidth: 768,
      designWidth: 768,
      baseFontSize: 14,
      minFontSize: 12,
      maxFontSize: 18,
    },
    tablet: {
      minWidth: 768,
      maxWidth: 1024,
      designWidth: 1024,
      baseFontSize: 15,
      minFontSize: 12,
      maxFontSize: 20,
    },
    desktop: {
      minWidth: 1024,
      maxWidth: 1920,
      designWidth: 1800,
      baseFontSize: 16,
      minFontSize: 12,
      maxFontSize: 28,
    },
    largeScreen: {
      minWidth: 1920,
      maxWidth: 2560,
      designWidth: 2560,
      baseFontSize: 18,
      minFontSize: 14,
      maxFontSize: 32,
    },
    ultraWide: {
      minWidth: 2560,
      maxWidth: 3840,
      designWidth: 3200,
      baseFontSize: 20,
      minFontSize: 16,
      maxFontSize: 36,
    },
    fourK: {
      minWidth: 3840,
      designWidth: 3840,
      baseFontSize: 24,
      minFontSize: 20,
      maxFontSize: 48,
    },
  },
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
