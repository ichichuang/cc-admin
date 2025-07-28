/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 应用环境配置
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 将布尔值字符串转换为布尔值
 */
export function toBool(value: string): boolean {
  return value === 'true'
}

/**
 * 将字符串转换为数字
 */
export function toNumber(value: string): number {
  const num = Number(value)
  if (isNaN(num)) {
    throw new Error(`Invalid number value: ${value}`)
  }
  return num
}

/**
 * 获取当前应用环境
 */
export function getAppEnv(): 'development' | 'production' {
  return import.meta.env.VITE_APP_ENV || 'development'
}

/**
 * 检查是否为开发环境
 */
export function isDev(): boolean {
  return getAppEnv() === 'development'
}

/**
 * 检查是否为生产环境
 */
export function isProd(): boolean {
  return getAppEnv() === 'production'
}

/**
 * 类型安全的环境变量访问器
 */
export const env = {
  // 应用基础配置
  get appTitle(): string {
    return import.meta.env.VITE_APP_TITLE || 'cc-admin'
  },

  get appVersion(): string {
    return import.meta.env.VITE_APP_VERSION || '1.0.0'
  },

  get appEnv(): 'development' | 'production' {
    return getAppEnv()
  },

  get publicPath(): string {
    return import.meta.env.VITE_PUBLIC_PATH || '/'
  },

  get port(): number {
    return toNumber(import.meta.env.VITE_PORT || '3000')
  },

  get piniaKeyPrefix(): string {
    return import.meta.env.VITE_PINIA_PERSIST_KEY_PREFIX || 'cc-admin'
  },

  get rootRedirect(): string {
    return import.meta.env.VITE_ROOT_REDIRECT || '/dashboard'
  },

  get loadingSize(): number {
    return toNumber(import.meta.env.VITE_LOADING_SIZE || '4')
  },

  // API 配置
  get apiBaseUrl(): string {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
  },

  get apiTimeout(): number {
    return toNumber(import.meta.env.VITE_API_TIMEOUT || '10000')
  },

  // 开发环境配置
  get devTools(): boolean {
    return toBool(import.meta.env.VITE_DEV_TOOLS || 'true')
  },

  get mockEnable(): boolean {
    return toBool(import.meta.env.VITE_MOCK_ENABLE || 'true')
  },

  get consoleLog(): boolean {
    return toBool(import.meta.env.VITE_CONSOLE_LOG || 'true')
  },

  get debug(): boolean {
    return toBool(import.meta.env.VITE_DEBUG || 'true')
  },

  // 构建配置
  get dropDebugger(): boolean {
    return toBool(import.meta.env.VITE_DROP_DEBUGGER || 'false')
  },

  get dropConsole(): boolean {
    return toBool(import.meta.env.VITE_DROP_CONSOLE || 'false')
  },

  get buildAnalyze(): boolean {
    return toBool(import.meta.env.VITE_BUILD_ANALYZE || 'false')
  },

  get buildSourcemap(): boolean {
    return toBool(import.meta.env.VITE_BUILD_SOURCEMAP || 'true')
  },

  get compression(): 'none' | 'gzip' | 'brotli' | 'both' {
    return (import.meta.env.VITE_COMPRESSION as any) || 'none'
  },

  get legacy(): boolean {
    return toBool(import.meta.env.VITE_LEGACY || 'false')
  },

  get cdn(): boolean {
    return toBool(import.meta.env.VITE_CDN || 'false')
  },

  // rem 适配配置
  get remDesignWidth(): number {
    return toNumber(import.meta.env.VITE_REM_DESIGN_WIDTH || '1800')
  },

  get remBaseFontSize(): number {
    return toNumber(import.meta.env.VITE_REM_BASE_FONT_SIZE || '16')
  },

  get remMinFontSize(): number {
    return toNumber(import.meta.env.VITE_REM_MIN_FONT_SIZE || '12')
  },

  get remMaxFontSize(): number {
    return toNumber(import.meta.env.VITE_REM_MAX_FONT_SIZE || '24')
  },

  get remMobileFirst(): boolean {
    return toBool(import.meta.env.VITE_REM_MOBILE_FIRST || 'false')
  },

  get remBreakpoints(): {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
    xls: number
  } {
    try {
      return JSON.parse(
        import.meta.env.VITE_REM_BREAKPOINTS ||
          '{"xs":375,"sm":768,"md":1024,"lg":1400,"xl":1660,"xls":1920}'
      )
    } catch {
      return {
        xs: 375,
        sm: 768,
        md: 1024,
        lg: 1400,
        xl: 1660,
        xls: 1920,
      }
    }
  },
} as const
