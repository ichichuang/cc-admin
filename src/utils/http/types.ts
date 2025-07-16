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

export interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  [key: string]: any
}

export interface UploadConfig extends RequestConfig {
  onProgress?: (progress: number) => void
}
