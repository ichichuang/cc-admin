/**
 * 环境变量工具函数模块
 *
 * 提供对 Vite 环境变量的封装和便捷访问方法
 * 支持类型安全的环境变量读取和常用环境判断功能
 *
 * @author CC Admin Team
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * import { getAppConfig, isDev, getApiConfig } from '@/utils/env'
 *
 * // 获取应用配置
 * const app = getAppConfig()
 * console.log(app.title) // "CC-Admin"
 *
 * // 环境判断
 * if (isDev()) {
 *   console.log('当前是开发环境')
 * }
 *
 * // 获取API配置
 * const api = getApiConfig()
 * console.log(api.baseURL) // "http://localhost:3003"
 * ```
 */

/**
 * 应用配置接口
 */
export interface AppConfig {
  /** 应用标题 */
  title: string
  /** 应用版本 */
  version: string
  /** 运行环境 */
  env: string
}

/**
 * API配置接口
 */
export interface ApiConfig {
  /** API基础地址 */
  baseURL: string
  /** 请求超时时间（毫秒） */
  timeout: number
}

/**
 * 开发环境配置接口
 */
export interface DevConfig {
  /** 是否为开发环境 */
  isDev: boolean
  /** 是否为生产环境 */
  isProd: boolean
  /** 是否启用开发工具 */
  devTools: boolean
  /** 是否启用Mock数据 */
  mock: boolean
  /** 是否启用控制台日志 */
  consoleLog: boolean
}

/**
 * 完整环境配置接口
 */
export interface EnvConfig {
  /** 应用配置 */
  app: AppConfig
  /** API配置 */
  api: ApiConfig
  /** 开发配置 */
  dev: DevConfig
}

/**
 * 获取应用基础配置信息
 *
 * 包含应用标题、版本号、运行环境等基础信息
 * 这些信息通常用于页面标题显示、版本控制等场景
 *
 * @returns {AppConfig} 应用配置对象
 *
 * @example
 * ```typescript
 * const appConfig = getAppConfig()
 * document.title = appConfig.title // 设置页面标题
 * console.log(`当前版本: ${appConfig.version}`) // 显示版本信息
 * ```
 */
export const getAppConfig = (): AppConfig => {
  return {
    title: import.meta.env.VITE_APP_TITLE,
    version: import.meta.env.VITE_APP_VERSION,
    env: import.meta.env.VITE_APP_ENV,
  }
}

/**
 * 获取API接口配置信息
 *
 * 包含API服务器地址、超时时间等网络请求相关配置
 * 用于初始化HTTP客户端、配置请求拦截器等
 *
 * @returns {ApiConfig} API配置对象
 *
 * @example
 * ```typescript
 * const apiConfig = getApiConfig()
 *
 * // 创建axios实例
 * const httpClient = axios.create({
 *   baseURL: apiConfig.baseURL,
 *   timeout: apiConfig.timeout
 * })
 * ```
 */
export const getApiConfig = (): ApiConfig => {
  return {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // 将字符串转换为数字，如果转换失败则使用默认值30秒
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  }
}

/**
 * 判断当前是否为开发环境
 *
 * 基于 VITE_APP_ENV 环境变量进行判断
 * 开发环境通常启用更多调试功能、详细日志等
 *
 * @returns {boolean} 如果是开发环境返回 true，否则返回 false
 *
 * @example
 * ```typescript
 * if (isDev()) {
 *   console.log('开发环境，启用调试模式')
 *   // 启用开发者工具
 *   enableDevTools()
 * }
 * ```
 */
export const isDev = (): boolean => {
  return import.meta.env.VITE_APP_ENV === 'development'
}

/**
 * 判断当前是否为生产环境
 *
 * 基于 VITE_APP_ENV 环境变量进行判断
 * 生产环境通常禁用调试功能、启用性能优化等
 *
 * @returns {boolean} 如果是生产环境返回 true，否则返回 false
 *
 * @example
 * ```typescript
 * if (isProd()) {
 *   console.log('生产环境，启用性能优化')
 *   // 禁用调试信息
 *   disableDebugLogs()
 * }
 * ```
 */
export const isProd = (): boolean => {
  return import.meta.env.VITE_APP_ENV === 'production'
}

/**
 * 判断是否启用开发者工具
 *
 * 控制 Vue DevTools、React DevTools 等开发调试工具的显示
 * 通常在开发环境启用，生产环境禁用
 *
 * @returns {boolean} 如果启用开发工具返回 true，否则返回 false
 *
 * @example
 * ```typescript
 * if (isDevToolsEnabled()) {
 *   // 显示开发者工具提示
 *   console.log('Vue DevTools 已启用')
 * }
 * ```
 */
export const isDevToolsEnabled = (): boolean => {
  return import.meta.env.VITE_DEV_TOOLS === 'true'
}

/**
 * 判断是否启用Mock数据功能
 *
 * 用于控制是否使用模拟数据代替真实API请求
 * 在开发阶段和测试环境中通常启用，便于前端独立开发
 *
 * @returns {boolean} 如果启用Mock功能返回 true，否则返回 false
 *
 * @example
 * ```typescript
 * if (isMockEnabled()) {
 *   // 使用Mock数据
 *   import('./mock/index.js').then(mock => mock.setup())
 * } else {
 *   // 使用真实API
 *   setupRealApi()
 * }
 * ```
 */
export const isMockEnabled = (): boolean => {
  return import.meta.env.VITE_MOCK_ENABLE === 'true'
}

/**
 * 判断是否启用控制台日志输出
 *
 * 控制应用中 console.log、console.warn 等调试信息的显示
 * 开发环境通常启用，生产环境为了性能考虑通常禁用
 *
 * @returns {boolean} 如果启用控制台日志返回 true，否则返回 false
 *
 * @example
 * ```typescript
 * // 条件性日志输出
 * if (isConsoleLogEnabled()) {
 *   console.log('用户登录成功', userInfo)
 * }
 *
 * // 或者创建日志工具函数
 * const log = (...args) => {
 *   if (isConsoleLogEnabled()) {
 *     console.log(...args)
 *   }
 * }
 * ```
 */
export const isConsoleLogEnabled = (): boolean => {
  return import.meta.env.VITE_CONSOLE_LOG === 'true'
}

/**
 * 获取完整的环境配置信息
 *
 * 汇总所有环境变量配置，提供统一的配置访问入口
 * 包含应用配置、API配置、开发环境配置等所有相关信息
 *
 * @returns {EnvConfig} 完整的环境配置对象
 *
 * @example
 * ```typescript
 * const envConfig = getAllEnvConfig()
 *
 * // 一次性获取所有配置
 * console.log('应用信息:', envConfig.app)
 * console.log('API配置:', envConfig.api)
 * console.log('开发配置:', envConfig.dev)
 *
 * // 用于配置面板显示
 * const configPanel = {
 *   title: envConfig.app.title,
 *   apiUrl: envConfig.api.baseURL,
 *   isDevelopment: envConfig.dev.isDev
 * }
 * ```
 */
export const getAllEnvConfig = (): EnvConfig => {
  return {
    app: getAppConfig(),
    api: getApiConfig(),
    dev: {
      isDev: isDev(),
      isProd: isProd(),
      devTools: isDevToolsEnabled(),
      mock: isMockEnabled(),
      consoleLog: isConsoleLogEnabled(),
    },
  }
}
