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

export interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  [key: string]: any
}

export interface UploadConfig extends RequestConfig {
  onProgress?: (progress: number) => void
}
