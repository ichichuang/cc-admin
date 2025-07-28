/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - HTTP实例配置
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import { env } from '../env'

// 创建 Alova 实例
export const alovaInstance = createAlova({
  // 请求适配器
  requestAdapter: adapterFetch(),

  // 基础配置
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,

  // 请求拦截器
  beforeRequest: method => {
    // 添加认证头
    const token = localStorage.getItem('token')
    if (token) {
      method.config.headers.Authorization = `Bearer ${token}`
    }

    // 添加内容类型
    if (!method.config.headers['Content-Type']) {
      method.config.headers['Content-Type'] = 'application/json'
    }
  },

  // 响应拦截器
  responded: response => {
    return response.json()
  },
})
