/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - 工具函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// src/utils/http/methods.ts
import { useUserStoreWithOut } from '@/stores'
import { env } from '@/utils/env'
import { alovaInstance } from './instance'
import type { RequestConfig, UploadConfig } from './types'

/**
 * GET 请求
 */
export const get = <T = any>(url: string, config?: RequestConfig) => {
  return alovaInstance.Get<T>(url, config)
}

/**
 * POST 请求
 */
export const post = <T = any>(url: string, data?: any, config?: RequestConfig) => {
  return alovaInstance.Post<T>(url, data, config)
}

/**
 * PUT 请求
 */
export const put = <T = any>(url: string, data?: any, config?: RequestConfig) => {
  return alovaInstance.Put<T>(url, data, config)
}

/**
 * DELETE 请求
 */
export const del = <T = any>(url: string, config?: RequestConfig) => {
  return alovaInstance.Delete<T>(url, config)
}

/**
 * PATCH 请求
 */
export const patch = <T = any>(url: string, data?: any, config?: RequestConfig) => {
  return alovaInstance.Patch<T>(url, data, config)
}

/**
 * 文件上传
 */
export const uploadFile = <T = any>(url: string, file: File, config?: UploadConfig) => {
  const formData = new FormData()
  formData.append('file', file)

  const uploadConfig = {
    ...config,
    headers: {
      ...config?.headers,
    },
  }

  // 让浏览器自动设置 Content-Type 以包含正确的 boundary
  delete uploadConfig.headers['Content-Type']

  return post<T>(url, formData, uploadConfig)
}

/**
 * 多文件上传
 */
export const uploadFiles = <T = any>(url: string, files: File[], config?: UploadConfig) => {
  const formData = new FormData()
  files.forEach((file, index) => {
    formData.append(`files[${index}]`, file)
  })

  const uploadConfig = {
    ...config,
    headers: {
      ...config?.headers,
    },
  }

  // 让浏览器自动设置 Content-Type 以包含正确的 boundary
  delete uploadConfig.headers['Content-Type']

  return post<T>(url, formData, uploadConfig)
}

/**
 * 下载文件
 */
export const downloadFile = async (url: string, filename?: string) => {
  try {
    // 使用原生 fetch 来处理文件下载，因为 Alova 的 fetch 适配器不直接支持 blob 响应
    const response = await fetch(`${env.apiBaseUrl}${url}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${useUserStoreWithOut().getToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('文件下载失败:', error)
    throw error
  }
}

/**
 * 下载文件（使用 Alova 实例的替代方案）
 */
export const downloadFileWithAlova = async (url: string, filename?: string) => {
  try {
    const response = await alovaInstance.Get(url, {
      // 设置自定义 transform 来处理 blob 响应
      transform: (data: any, _headers: any) => data,
    })

    // 如果响应是 blob 类型
    if (response instanceof Blob) {
      const downloadUrl = window.URL.createObjectURL(response)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } else {
      throw new Error('响应不是 Blob 类型')
    }
  } catch (error) {
    console.error('文件下载失败:', error)
    throw error
  }
}
