/**
 * 环境配置
 */
const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

/**
 * 开发环境配置
 */
export const devOptions = isDev
  ? {
      inspector: true,
      hmr: true,
    }
  : {}

/**
 * 生产环境配置
 */
export const prodOptions = isProd
  ? {
      minify: true,
      inspector: false,
    }
  : {}
