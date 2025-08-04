/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 连接管理模块
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// src/utils/http/instance.ts
import { env } from '@/utils/env'
import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'
import { addConnectionListener } from './connection'
import { beforeRequest, responseHandler } from './interceptors'

/**
 * 验证 Alova 配置
 */
const validateAlovaConfig = () => {
  const errors: string[] = []
  const warnings: string[] = []

  // 检查基础配置
  if (!env.apiBaseUrl && !env.mockEnable) {
    warnings.push('未设置 API 基础 URL，且未启用 Mock 模式')
  }

  // 检查超时配置
  const timeout = 10000
  if (timeout < 1000) {
    errors.push('请求超时时间不能小于 1 秒')
  }

  // 检查环境配置
  if (env.appEnv !== 'development' && env.appEnv !== 'production') {
    errors.push(`无效的应用环境: ${env.appEnv}`)
  }

  // 输出错误和警告
  if (errors.length > 0) {
    console.error('❌ Alova 配置错误:', errors)
    throw new Error(`Alova 配置错误: ${errors.join(', ')}`)
  }

  if (warnings.length > 0) {
    console.warn('⚠️ Alova 配置警告:', warnings)
  }

  if (env.debug) {
    console.log('🔧 Alova 配置:', {
      baseURL: env.mockEnable
        ? 'Mock 模式'
        : env.appEnv === 'development'
          ? '/api'
          : env.apiBaseUrl,
      timeout,
      mockEnable: env.mockEnable,
      appEnv: env.appEnv,
    })
  }
}

/**
 * 创建全局 Alova 实例
 */
export const alovaInstance = createAlova({
  // 连接到本地 cc-server
  baseURL: env.mockEnable
    ? '' // Mock 模式下不需要 baseURL 前缀
    : env.appEnv === 'development'
      ? '/api'
      : env.apiBaseUrl,

  // 使用 fetch 作为请求适配器
  requestAdapter: adapterFetch(),

  // 使用 Vue 钩子
  statesHook: VueHook,

  // 全局请求拦截器
  beforeRequest,

  // 全局响应拦截器
  responded: responseHandler,

  // 全局超时时间 (毫秒)
  timeout: 10000,
})

// 验证配置
validateAlovaConfig()

// 监听连接状态变化
addConnectionListener(state => {
  if (env.debug) {
    console.log('🔗 连接状态变化:', state)
  }

  // 当连接断开时，可以在这里做一些清理工作
  if (!state.isConnected && !state.isReconnecting) {
    console.warn('⚠️ 网络连接已断开')
  }
})

// 全局错误处理 - 通过拦截器处理
// Alova 的错误处理通过响应拦截器实现

export default alovaInstance
