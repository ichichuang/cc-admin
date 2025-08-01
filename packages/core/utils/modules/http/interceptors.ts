/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - HTTP拦截器
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { env } from '../env'

// 请求拦截器
export const beforeRequest = (method: any) => {
  // 添加认证头
  const token = localStorage.getItem('token')
  if (token) {
    method.config.headers.Authorization = `Bearer ${token}`
  }

  // 添加内容类型
  if (!method.config.headers['Content-Type']) {
    method.config.headers['Content-Type'] = 'application/json'
  }

  // 开发环境日志
  if (env.debug) {
    console.log('🚀 请求:', method.config.url, method.config.data)
  }
}

// 响应拦截器
export const responseHandler = (response: any) => {
  // 开发环境日志
  if (env.debug) {
    console.log('📥 响应:', response)
  }

  return response.json()
}
