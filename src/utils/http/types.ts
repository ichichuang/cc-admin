/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 工具函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// src/utils/http/types.ts
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  code?: number
  total?: number
  page?: number
  pageSize?: number
}

// 扩展的请求配置，包含自定义属性
export interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  enableCache?: boolean // 是否启用缓存（避免与 fetch cache 冲突）
  cacheTTL?: number // 缓存生存时间（毫秒）
  retry?: RetryConfig // 重试配置
  deduplicate?: boolean // 是否启用请求去重
  security?: SecurityConfig // 安全配置
  [key: string]: any
}

// Alova 兼容的请求配置
export interface AlovaRequestConfig {
  headers?: Record<string, string>
  timeout?: number
  cache?: RequestCache // 使用标准的 RequestCache 类型
  [key: string]: any
}

// 安全配置
export interface SecurityConfig {
  enableCSRF?: boolean // 是否启用 CSRF 保护
  enableSignature?: boolean // 是否启用请求签名
  enableRateLimit?: boolean // 是否启用速率限制
  maxRequestsPerMinute?: number // 每分钟最大请求数
  sensitiveFields?: string[] // 敏感字段列表
}

export interface UploadConfig extends RequestConfig {
  onProgress?: (progress: number) => void
  onSuccess?: (response: any) => void
  onError?: (error: Error) => void
}

export interface DownloadConfig {
  filename?: string
  headers?: Record<string, string>
  onProgress?: (progress: number) => void
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export interface RetryConfig {
  retries: number // 重试次数
  retryDelay: number // 重试延迟（毫秒）
  retryCondition?: (error: Error) => boolean // 重试条件
}

export interface HttpError extends Error {
  status?: number
  statusText?: string
  data?: any
}

// 连接状态管理
export interface ConnectionState {
  isConnected: boolean
  isReconnecting: boolean
  lastConnectedAt?: Date
  disconnectReason?: string
  reconnectAttempts: number
  maxReconnectAttempts: number
}

export interface ConnectionConfig {
  autoReconnect: boolean
  maxReconnectAttempts: number
  reconnectDelay: number
  healthCheckUrl?: string
  healthCheckInterval: number
}

// 缓存相关类型
export interface CacheConfig {
  enabled: boolean
  ttl: number // 生存时间（毫秒）
  maxSize?: number // 最大缓存条目数
}

export interface CacheStats {
  size: number
  hitRate?: number
  missRate?: number
}

// 请求统计类型
export interface RequestStats {
  pendingRequests: number
  queueLength: number
  runningCount: number
  maxConcurrent: number
}

// 文件分片上传相关类型
export interface ChunkInfo {
  chunkIndex: number
  totalChunks: number
  chunkSize: number
  fileSize: number
  chunk: Blob
  fileId: string
  fileName: string
  fileHash: string
}

export interface UploadChunkConfig extends UploadConfig {
  chunkSize?: number // 分片大小，默认 2MB
  concurrentChunks?: number // 并发上传分片数，默认 3
  onChunkProgress?: (chunkIndex: number, progress: number) => void
  onChunkSuccess?: (chunkIndex: number, response: any) => void
  onChunkError?: (chunkIndex: number, error: Error) => void
  onMergeProgress?: (progress: number) => void
}

export interface UploadTask {
  id: string
  file: File
  chunks: ChunkInfo[]
  uploadedChunks: Set<number>
  failedChunks: Set<number>
  status: 'pending' | 'uploading' | 'merging' | 'completed' | 'failed' | 'cancelled'
  progress: number
  startTime: Date
  cancelToken?: AbortController
}

export interface UploadManager {
  tasks: Map<string, UploadTask>
  addTask: (file: File, config?: UploadChunkConfig) => string
  removeTask: (taskId: string) => void
  cancelTask: (taskId: string) => void
  pauseTask: (taskId: string) => void
  resumeTask: (taskId: string) => void
  getTask: (taskId: string) => UploadTask | undefined
  getAllTasks: () => UploadTask[]
}
