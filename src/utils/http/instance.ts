// src/utils/http/instance.ts
import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'
import { beforeRequest, responseHandler } from './interceptors'

/**
 * 创建全局 Alova 实例
 */
export const alovaInstance = createAlova({
  // 连接到本地 cc-server
  baseURL:
    import.meta.env.VITE_MOCK_ENABLE === 'true'
      ? '/mock' // Mock 模式下不需要 baseURL 前缀
      : import.meta.env.VITE_APP_ENV === 'development'
        ? '/api'
        : import.meta.env.VITE_API_BASE_URL,

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
