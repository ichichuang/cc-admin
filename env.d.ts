/**
 * Vite 环境变量类型定义
 *
 * 此文件为项目中使用的所有环境变量提供 TypeScript 类型支持
 * 所有以 VITE_ 开头的环境变量都会在客户端代码中可用
 *
 * @see https://cn.vitejs.dev/guide/env-and-mode.html
 */

/// <reference types="vite/client" />

/**
 * 扩展 Vite 的环境变量接口
 * 定义项目中使用的所有自定义环境变量及其类型
 */
interface ImportMetaEnv {
  /**
   * ==========================================
   * 应用基础配置
   * ==========================================
   */

  /** 应用标题 - 显示在浏览器标题栏和页面中 */
  readonly VITE_APP_TITLE: string

  /** 应用版本号 - 用于版本控制和显示 */
  readonly VITE_APP_VERSION: string

  /** 当前运行环境 - 用于区分不同的部署环境 */
  readonly VITE_APP_ENV: 'development' | 'production' | 'test'

  /**
   * ==========================================
   * API 接口配置
   * ==========================================
   */

  /** API 服务器基础地址 - 所有 API 请求的根路径 */
  readonly VITE_API_BASE_URL: string

  /** API 请求超时时间(毫秒) - 防止请求长时间无响应 */
  readonly VITE_API_TIMEOUT: string

  /**
   * ==========================================
   * 开发环境配置
   * ==========================================
   */

  /** 是否启用开发者工具 - 控制 Vue DevTools 等开发工具的显示 */
  readonly VITE_DEV_TOOLS: string

  /** 是否启用 Mock 数据 - 用于开发阶段模拟 API 响应 */
  readonly VITE_MOCK_ENABLE: string

  /** 是否启用控制台日志 - 控制 console.log 等调试信息的输出 */
  readonly VITE_CONSOLE_LOG: string

  /**
   * ==========================================
   * 构建优化配置
   * ==========================================
   */

  /** 生产构建时是否移除 debugger 语句 - 提升生产环境性能 */
  readonly VITE_DROP_DEBUGGER: string

  /** 生产构建时是否移除 console 语句 - 减少生产包大小 */
  readonly VITE_DROP_CONSOLE: string

  /** 是否启用 Gzip 压缩 - 减少传输文件大小 */
  readonly VITE_BUILD_GZIP: string

  /** 是否启用构建分析 - 生成打包分析报告 */
  readonly VITE_BUILD_ANALYZE: string

  /**
   * ==========================================
   * 其他功能配置
   * ==========================================
   */

  /** 是否使用 Mock 服务 - 全局 Mock 开关 */
  readonly VITE_USE_MOCK: string
}

/**
 * 扩展 ImportMeta 接口
 * 为 import.meta.env 提供类型支持
 */
interface ImportMeta {
  readonly env: ImportMetaEnv
}
