/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 工具函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// src/utils/http/index.ts
export {
  alovaInstance,
  createHttpInstance,
  alovaInstance as default,
  getHttpConfig,
  setHttpConfig,
  type HttpConfig,
} from './instance'
export { createHttpMethods, del, get, patch, post, put } from './methods'
export type { ApiResponse, RequestConfig, UploadConfig } from './types'
