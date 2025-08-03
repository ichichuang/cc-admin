/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 应用配置模块
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 应用基础配置
 */
export const appConfig = {
  // 应用标题
  title: 'cc-admin',

  // 应用版本
  version: '1.0.0',

  // 应用环境
  env: {
    development: 'development',
    production: 'production',
  },

  // 开发服务器端口
  port: 8888,

  // 公共路径
  publicPath: '/',

  // 根路径重定向
  rootRedirect: '/dashboard',

  // Pinia 持久化键前缀
  piniaPersistKeyPrefix: 'cc-admin',
} as const

/**
 * 加载配置
 */
export const loadingConfig = {
  // loading 组件大小（屏幕最小宽度 / 此值 → 数字越小，loading 越大）
  size: 5,

  // 最小大小
  minSize: 1,

  // 最大大小
  maxSize: 20,
} as const

/**
 * 调试配置
 */
export const debugConfig = {
  // 是否启用 debug 模式
  enabled: true,

  // 是否启用开发工具
  devTools: true,

  // 是否启用控制台日志
  consoleLog: true,

  // 是否启用 Mock 服务
  mockEnable: true,

  // 是否删除 debugger
  dropDebugger: false,

  // 是否删除 console
  dropConsole: false,

  // 是否启用构建分析
  buildAnalyze: false,

  // 是否启用 sourcemap
  buildSourcemap: true,

  // 压缩方式
  compression: 'gzip' as const,

  // 是否启用兼容模式
  legacy: false,

  // 是否启用 CDN
  cdn: false,
} as const

/**
 * 路由配置
 */
export const routerConfig = {
  // 路由模式
  mode: 'history' as const,

  // 路由基础路径
  base: '/',

  // 路由滚动行为
  scrollBehavior: 'smooth' as const,
} as const

/**
 * 主题配置
 */
export const themeConfig = {
  // 默认主题
  default: 'light',

  // 可用主题
  available: ['light', 'dark'] as const,

  // 主题切换动画时长（毫秒）
  transitionDuration: 300,
} as const

/**
 * 国际化配置
 */
export const i18nConfig = {
  // 默认语言
  defaultLocale: 'zh-CN',

  // 可用语言
  availableLocales: ['zh-CN', 'zh-TW', 'en-US'] as const,

  // 语言切换动画时长（毫秒）
  transitionDuration: 300,
} as const
