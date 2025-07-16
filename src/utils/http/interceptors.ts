// src/utils/http/interceptors.ts
import { useUserStoreWithOut } from '@/stores'
import type { Method } from 'alova'

const isDebug = import.meta.env.VITE_DEBUG

/**
 * 全局请求拦截器
 */
export const beforeRequest = (method: Method) => {
  // 设置默认请求头
  method.config.headers = {
    ...method.config.headers,
  }
  method.config.headers['Content-Type'] = 'application/json'

  // 添加认证 token
  const token = useUserStoreWithOut().getToken
  if (token) {
    method.config.headers.authorization = `Bearer ${token}`
  }

  // 开发环境下打印请求信息
  if (isDebug) {
    console.log(`🚀 [${method.type}] ${method.url}`, method.data ?? '')
  }
}

/**
 * 全局响应拦截器 - 适配 cc-server 的响应格式
 */
export const responseHandler = async (response: Response, _method: Method) => {
  try {
    const json = await response.json()

    if (isDebug) {
      console.log('📥 响应数据:', json)
    }

    // 处理 HTTP 状态码错误
    if (!response.ok) {
      handleHttpError(response.status, json)
      throw new Error(json.message || `HTTP ${response.status}`)
    }

    // cc-server 使用 success 字段而不是 code
    if (json.success === false) {
      throw new Error(json.message || '请求失败')
    }

    // 如果有 success 字段，返回整个响应对象（包含分页等信息）
    // 如果没有 success 字段，说明是根路径等简单响应，直接返回
    return json.success !== undefined ? json : json.data || json
  } catch (error) {
    handleRequestError(error as Error)
    throw error
  }
}

/**
 * 处理 HTTP 状态码错误
 */
const handleHttpError = (status: number, data: any) => {
  if (isDebug) {
    console.error(`❌ HTTP ${status} 错误:`, data)
  }

  switch (status) {
    case 401:
      // 处理未授权错误
      useUserStoreWithOut().resetUserInfo()
      useUserStoreWithOut().resetToken()
      window.location.href = '/login'
      break
    case 403:
      // 处理权限不足错误
      console.warn('权限不足')
      break
    case 404:
      console.warn('请求的资源不存在')
      break
    case 500:
      console.error('服务器内部错误')
      break
    default:
      console.error(`HTTP ${status} 错误`)
  }
}

/**
 * 处理请求错误
 */
const handleRequestError = (error: Error) => {
  if (isDebug) {
    console.error('❌ 请求错误:', error)
  }

  // 根据错误类型进行不同处理
  if (error.message.includes('timeout')) {
    console.warn('请求超时')
  } else if (error.message.includes('Network')) {
    console.warn('网络错误')
  }
}
