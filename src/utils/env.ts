/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 工具函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 环境变量工具函数
 * 提供类型安全的环境变量访问和转换
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
  return import.meta.env.VITE_APP_ENV
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
    return import.meta.env.VITE_APP_TITLE
  },

  get appVersion(): string {
    return import.meta.env.VITE_APP_VERSION
  },

  get appEnv(): 'development' | 'production' {
    return import.meta.env.VITE_APP_ENV
  },

  get publicPath(): string {
    return import.meta.env.VITE_PUBLIC_PATH
  },

  get port(): number {
    return toNumber(import.meta.env.VITE_PORT)
  },

  get piniaKeyPrefix(): string {
    return import.meta.env.VITE_PINIA_PERSIST_KEY_PREFIX
  },

  get rootRedirect(): string {
    return import.meta.env.VITE_ROOT_REDIRECT
  },

  get loadingSize(): number {
    return toNumber(import.meta.env.VITE_LOADING_SIZE)
  },

  // API 配置
  get apiBaseUrl(): string {
    return import.meta.env.VITE_API_BASE_URL
  },

  // 开发环境配置
  get devTools(): boolean {
    return toBool(import.meta.env.VITE_DEV_TOOLS)
  },

  get mockEnable(): boolean {
    return toBool(import.meta.env.VITE_MOCK_ENABLE)
  },

  get consoleLog(): boolean {
    return toBool(import.meta.env.VITE_CONSOLE_LOG)
  },

  get debug(): boolean {
    return toBool(import.meta.env.VITE_DEBUG)
  },

  // 构建配置
  get dropDebugger(): boolean {
    return toBool(import.meta.env.VITE_DROP_DEBUGGER)
  },

  get dropConsole(): boolean {
    return toBool(import.meta.env.VITE_DROP_CONSOLE)
  },

  get buildAnalyze(): boolean {
    return toBool(import.meta.env.VITE_BUILD_ANALYZE)
  },

  get buildSourcemap(): boolean {
    return toBool(import.meta.env.VITE_BUILD_SOURCEMAP)
  },

  get compression(): 'none' | 'gzip' | 'brotli' | 'both' {
    return import.meta.env.VITE_COMPRESSION
  },

  get legacy(): boolean {
    return toBool(import.meta.env.VITE_LEGACY)
  },

  get cdn(): boolean {
    return toBool(import.meta.env.VITE_CDN)
  },
} as const

/**
 * 环境变量验证器
 */
export class EnvValidator {
  /**
   * 验证必需的环境变量是否已设置
   */
  static validateRequired(): void {
    const required = ['VITE_APP_TITLE', 'VITE_API_BASE_URL', 'VITE_PINIA_PERSIST_KEY_PREFIX']

    const missing = required.filter(key => !import.meta.env[key])

    if (missing.length > 0) {
      throw new Error(`缺少必需的环境变量: ${missing.join(', ')}`)
    }
  }

  /**
   * 验证环境变量值的格式
   */
  static validateFormats(): void {
    // 验证 URL 格式
    try {
      new URL(env.apiBaseUrl)
    } catch {
      throw new Error(`VITE_API_BASE_URL 不是有效的 URL: ${env.apiBaseUrl}`)
    }

    // 验证端口范围
    if (env.port < 1024 || env.port > 65535) {
      throw new Error(`VITE_PORT 超出有效范围 (1024-65535): ${env.port}`)
    }

    // 验证 loading 大小
    if (env.loadingSize < 1 || env.loadingSize > 20) {
      throw new Error(`VITE_LOADING_SIZE 超出有效范围 (1-20): ${env.loadingSize}`)
    }
  }

  /**
   * 验证所有环境变量
   */
  static validateAll(): void {
    this.validateRequired()
    this.validateFormats()
  }
}

// 在开发环境下自动验证
if (isDev()) {
  try {
    EnvValidator.validateAll()
    console.log('✅ 环境变量验证通过')
  } catch (error) {
    console.error('❌ 环境变量验证失败:', error)
  }
}

// 注意：rem 配置统一从 src/constants/modules/rem.ts 获取
// 不再需要在此处定义默认配置，避免配置重复和不一致
