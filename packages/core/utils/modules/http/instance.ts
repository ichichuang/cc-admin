/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - HTTP实例配置
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'

// HTTP 配置接口
export interface HttpConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
}

// 默认配置
const defaultConfig: HttpConfig = {
  baseURL: '',
  timeout: 10000,
  headers: {
    contentType: 'application/json',
  },
}

// 全局配置存储
let globalConfig: HttpConfig = { ...defaultConfig }

// 创建 Alova 实例的工厂函数
export const createHttpInstance = (config: HttpConfig = {}) => {
  // 合并配置
  const mergedConfig = { ...defaultConfig, ...globalConfig, ...config }

  return createAlova({
    // 请求适配器
    requestAdapter: adapterFetch(),

    // 基础配置
    baseURL: mergedConfig.baseURL,
    timeout: mergedConfig.timeout,

    // 请求拦截器
    beforeRequest: method => {
      // 添加认证头
      const token = localStorage.getItem('token')
      if (token) {
        method.config.headers.Authorization = `Bearer ${token}`
      }

      // 添加默认请求头
      Object.assign(method.config.headers, mergedConfig.headers)
    },

    // 响应拦截器
    responded: response => {
      return response.json()
    },
  })
}

// 设置全局配置
export const setHttpConfig = (config: HttpConfig) => {
  globalConfig = { ...globalConfig, ...config }
}

// 获取当前配置
export const getHttpConfig = (): HttpConfig => {
  return { ...globalConfig }
}

// 默认实例（使用全局配置）
export const alovaInstance = createHttpInstance()
