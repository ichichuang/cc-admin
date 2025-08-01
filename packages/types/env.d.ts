/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - env.d
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

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
 * 应用环境类型
 */
type AppEnvironment = 'development' | 'production'

/**
 * 压缩方式类型
 */
type CompressionType = 'none' | 'gzip' | 'brotli' | 'both'

/**
 * 布尔值字符串类型（环境变量中的布尔值以字符串形式存储）
 */
type BooleanString = 'true' | 'false'

/**
 * 数字字符串类型（环境变量中的数字以字符串形式存储）
 */
type NumberString = string

/**
 * URL 字符串类型
 */
type UrlString = string

/**
 * 路径字符串类型
 */
type PathString = string

/**
 * 扩展 Vite 的环境变量接口
 * 定义项目中使用的所有自定义环境变量及其类型
 */
declare interface ImportMetaEnv {
  /**
   * ==========================================
   * 应用基础配置
   * ==========================================
   */

  /** 应用标题 - 显示在浏览器标题栏和页面中 */
  readonly VITE_APP_TITLE: string

  /** 应用版本号 - 用于版本控制和显示 */
  readonly VITE_APP_VERSION: string

  /** 应用 pinia 持久化存储 关键 key 前缀 */
  readonly VITE_PINIA_PERSIST_KEY_PREFIX: string

  /** 当前运行环境 - 用于区分不同的部署环境 */
  readonly VITE_APP_ENV: AppEnvironment

  /** 应用根路径 */
  readonly VITE_PUBLIC_PATH: PathString

  /** 开发服务器端口 */
  readonly VITE_PORT: NumberString

  /** rootRedirect 重定向路径 */
  readonly VITE_ROOT_REDIRECT: string

  /** loading 组件大小 - 控制 loading 组件的大小 (屏幕最小宽度 / VITE_LOADING_SIZE) */
  readonly VITE_LOADING_SIZE: NumberString

  /** 是否启用 debug 模式 - 控制调试信息 */
  readonly VITE_DEBUG: BooleanString

  /**
   * ==========================================
   * API 接口配置
   * ==========================================
   */

  /** API 服务器基础地址 - 所有 API 请求的根路径 */
  readonly VITE_API_BASE_URL: UrlString

  /** API 请求超时时间(毫秒) - 防止请求长时间无响应 */
  readonly VITE_API_TIMEOUT: NumberString

  /**
   * ==========================================
   * 开发环境配置
   * ==========================================
   */

  /** 是否启用开发者工具 - 控制 Vue DevTools 等开发工具的显示 */
  readonly VITE_DEV_TOOLS: BooleanString

  /** 是否启用 Mock 数据 - 用于开发阶段模拟 API 响应 */
  readonly VITE_MOCK_ENABLE: BooleanString

  /** 是否启用控制台日志 - 控制 console.log 等调试信息的输出 */
  readonly VITE_CONSOLE_LOG: BooleanString

  /**
   * ==========================================
   * 构建优化配置
   * ==========================================
   */

  /** 生产构建时是否移除 debugger 语句 - 提升生产环境性能 */
  readonly VITE_DROP_DEBUGGER: BooleanString

  /** 生产构建时是否移除 console 语句 - 减少生产包大小 */
  readonly VITE_DROP_CONSOLE: BooleanString

  /** 是否启用构建分析 - 生成打包分析报告 */
  readonly VITE_BUILD_ANALYZE: BooleanString

  /** 是否生成 sourcemap */
  readonly VITE_BUILD_SOURCEMAP: BooleanString

  /** 压缩方式 none | gzip | brotli | both */
  readonly VITE_COMPRESSION: CompressionType

  /** 是否启用 legacy 浏览器支持 */
  readonly VITE_LEGACY: BooleanString

  /** 是否启用 CDN */
  readonly VITE_CDN: BooleanString

  /**
   * ==========================================
   * rem 适配系统配置
   * ==========================================
   */

  /** 设计稿基准宽度（像素） */
  readonly VITE_REM_DESIGN_WIDTH: NumberString

  /** 基准字体大小（像素） */
  readonly VITE_REM_BASE_FONT_SIZE: NumberString

  /** 最小字体大小（像素） */
  readonly VITE_REM_MIN_FONT_SIZE: NumberString

  /** 最大字体大小（像素） */
  readonly VITE_REM_MAX_FONT_SIZE: NumberString

  /** 是否启用移动端优先策略（true | false） */
  readonly VITE_REM_MOBILE_FIRST: BooleanString

  /** 响应式断点配置（JSON 格式，与 UnoCSS 保持一致） */
  readonly VITE_REM_BREAKPOINTS: string

  /** PostCSS px-to-rem 转换基准值（与 REM_BASE_FONT_SIZE 保持一致） */
  readonly VITE_POSTCSS_ROOT_VALUE: NumberString
}

/**
 * 扩展 ImportMeta 接口
 * 为 import.meta.env 提供类型支持
 */
declare interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * 类型辅助工具 - 在运行时将字符串转换为对应类型
 */
declare namespace EnvUtils {
  /**
   * 将布尔值字符串转换为布尔值
   */
  function toBool(value: BooleanString): boolean

  /**
   * 将数字字符串转换为数字
   */
  function toNumber(value: NumberString): number

  /**
   * 获取应用环境
   */
  function getAppEnv(): AppEnvironment

  /**
   * 检查是否为开发环境
   */
  function isDev(): boolean

  /**
   * 检查是否为生产环境
   */
  function isProd(): boolean
}
