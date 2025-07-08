import { useUserStoreWithOut } from '@/stores'
import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'
const isDebug = import.meta.env.VITE_DEBUG

// 创建全局 alova 实例
export const alovaInstance = createAlova({
  // 连接到本地 cc-server
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',

  // 使用 fetch 作为请求适配器
  requestAdapter: adapterFetch(),

  // 使用 Vue 钩子
  statesHook: VueHook,

  // 全局请求拦截器
  beforeRequest(method) {
    // 添加请求头
    method.config.headers = {
      ...method.config.headers,
      ['content-type']: 'application/json',
    }

    // 添加认证 token
    const token = useUserStoreWithOut().getToken
    if (token) {
      method.config.headers.authorization = `Bearer ${token}`
    }

    if (isDebug) {
      console.log(`🚀 [${method.type}] ${method.url}`, method.data ?? '')
    }
  },

  // 全局响应拦截器 - 适配 cc-server 的响应格式
  async responded(response) {
    const json = await response.json()

    if (isDebug) {
      console.log('📥 响应数据:', json)
    }

    // cc-server 使用 success 字段而不是 code
    if (json.success === false) {
      throw new Error(json.message || '请求失败')
    }

    // 如果有 success 字段，返回整个响应对象（包含分页等信息）
    // 如果没有 success 字段，说明是根路径等简单响应，直接返回
    return json.success !== undefined ? json : json.data || json
  },

  // 全局超时时间 (毫秒)
  timeout: 10000,
})

// 导出常用的 API 方法 (使用正确的Alova API)
export const get = (url: string, config?: any) => alovaInstance.Get(url, config)
export const post = (url: string, data?: any, config?: any) => alovaInstance.Post(url, data, config)
export const put = (url: string, data?: any, config?: any) => alovaInstance.Put(url, data, config)
export const del = (url: string, config?: any) => alovaInstance.Delete(url, config)
export const patch = (url: string, data?: any, config?: any) =>
  alovaInstance.Patch(url, data, config)

// 工具函数：处理文件上传
export const uploadFile = (url: string, file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  /* return post(url, formData, {
    headers: {
      ['content-type']: 'multipart/form-data',
    },
  }) */
  return post(url, formData)
}

export default alovaInstance
