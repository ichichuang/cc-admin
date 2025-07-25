import type { MockMethod } from 'vite-plugin-mock'
import { mockServices } from './index'

/**
 * 自定义 Mock 服务
 * 用于在生产环境中提供 Mock 数据
 */
class MockService {
  private mockData: Map<string, any> = new Map()
  private isEnabled = false

  constructor() {
    this.init()
  }

  /**
   * 初始化 Mock 服务
   */
  private init() {
    const isMockEnabled = import.meta.env.VITE_MOCK_ENABLE === 'true'

    if (isMockEnabled) {
      this.isEnabled = true
      this.setupMockData()
      this.setupFetchInterceptor()
    }
  }

  /**
   * 设置 Mock 数据
   */
  private setupMockData() {
    mockServices.forEach((mock: MockMethod) => {
      if (mock.url && mock.response) {
        const key = `${mock.method?.toUpperCase() || 'GET'}:${mock.url}`
        this.mockData.set(key, mock.response)
      }
    })
  }

  /**
   * 设置 Fetch 拦截器
   */
  private setupFetchInterceptor() {
    const originalFetch = window.fetch

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString()
      const method = init?.method?.toUpperCase() || 'GET'
      const key = `${method}:${url}`

      // 检查是否是 Mock 请求
      if (this.isEnabled && this.mockData.has(key)) {
        console.log(`🎭 Mock 请求: ${method} ${url}`)

        const mockResponse = this.mockData.get(key)
        let responseData: any

        // 处理 Mock 响应函数
        if (typeof mockResponse === 'function') {
          try {
            // 解析请求体
            let body = {}
            if (init?.body) {
              if (typeof init.body === 'string') {
                body = JSON.parse(init.body)
              } else {
                body = init.body
              }
            }

            // 解析请求头
            const headers = init?.headers || {}

            // 调用 Mock 响应函数
            responseData = mockResponse({ body, headers })
          } catch (error) {
            console.error('Mock 响应函数执行失败:', error)
            responseData = { success: false, message: 'Mock 响应失败' }
          }
        } else {
          responseData = mockResponse
        }

        // 创建模拟响应
        const response = new Response(JSON.stringify(responseData), {
          status: 200,
        })
        response.headers.set('content-type', 'application/json')
        return response
      }

      // 如果不是 Mock 请求，使用原始 fetch
      return originalFetch(input, init)
    }
  }

  /**
   * 启用 Mock 服务
   */
  enable() {
    this.isEnabled = true
  }

  /**
   * 禁用 Mock 服务
   */
  disable() {
    this.isEnabled = false
  }

  /**
   * 检查 Mock 服务是否启用
   */
  isMockEnabled(): boolean {
    return this.isEnabled
  }
}

// 创建全局 Mock 服务实例
export const mockService = new MockService()

export default mockService
