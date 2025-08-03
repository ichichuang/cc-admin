/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 工具函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// src/utils/http/instance.ts
import { env } from '@/utils/env'
import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'
import { beforeRequest, responseHandler } from './interceptors'

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

export default alovaInstance
