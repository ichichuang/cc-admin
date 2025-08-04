/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 工具函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// src/utils/http/index.ts
export { alovaInstance, alovaInstance as default } from './instance'
export {
  clearCache,
  clearRequests,
  del,
  downloadFile,
  get,
  getCacheStats,
  getRequestStats,
  patch,
  post,
  put,
  uploadFile,
  uploadFiles,
} from './methods'
export type { ApiResponse, RequestConfig, UploadConfig } from './types'

// 连接管理功能
export {
  addConnectionListener,
  connectionManager,
  disconnect,
  getConnectionState,
  reconnect,
} from './connection'

// 文件上传管理功能
export {
  addUploadTask,
  cancelUploadTask,
  getAllUploadTasks,
  getUploadTask,
  pauseUploadTask,
  removeUploadTask,
  resumeUploadTask,
  uploadManager,
} from './uploadManager'

// 错误处理功能
export { ErrorType, HttpRequestError, isRetryableError } from './interceptors'

// 导出所有类型
export type {
  AlovaRequestConfig,
  CacheConfig,
  CacheStats,
  ChunkInfo,
  ConnectionConfig,
  ConnectionState,
  DownloadConfig,
  HttpError,
  RequestStats,
  RetryConfig,
  SecurityConfig,
  UploadChunkConfig,
  UploadManager,
  UploadTask,
} from './types'
