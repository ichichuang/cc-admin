/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - env
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

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
