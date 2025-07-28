/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - mock-service
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { mockServices } from '@/mock/index'
import type { MockMethod } from '@/mock/types'
import { env } from '@/utils/env'

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
    const isMockEnabled = env.mockEnable

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
    mockServices.forEach((mock: MockMethod, _index: number) => {
      if (mock.url && mock.response) {
        const key = `${mock.method?.toUpperCase() || 'GET'}:${mock.url}`
        this.mockData.set(key, mock.response)
      }
    })
  }

  /**
   * 解析 URL 参数
   */
  private parseUrlParams(url: string, pattern: string) {
    const params: Record<string, string> = {}
    const urlParts = url.split('?')[0].split('/')
    const patternParts = pattern.split('/')

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        const paramName = patternParts[i].slice(1)
        params[paramName] = urlParts[i] || ''
      }
    }

    return params
  }

  /**
   * 解析查询参数
   */
  private parseQueryParams(url: string) {
    const queryString = url.split('?')[1]
    if (!queryString) {
      return {}
    }

    const params: Record<string, string> = {}
    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=')
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || '')
      }
    })

    return params
  }

  /**
   * 查找匹配的 Mock 配置
   */
  private findMockConfig(method: string, url: string) {
    // 提取 URL 路径，移除协议、域名和端口
    let urlPath = url.split('?')[0]

    // 如果是完整 URL，提取路径部分
    try {
      const urlObj = new URL(urlPath)
      urlPath = urlObj.pathname
    } catch {
      // 如果不是完整 URL，直接使用
    }

    for (const mock of mockServices) {
      if (mock.method?.toUpperCase() !== method.toUpperCase()) {
        continue
      }

      const mockUrl = mock.url || ''

      if (mockUrl.includes(':')) {
        // 处理动态路由参数
        const mockParts = mockUrl.split('/')
        const urlParts = urlPath.split('/')

        if (mockParts.length === urlParts.length) {
          let isMatch = true
          for (let i = 0; i < mockParts.length; i++) {
            if (!mockParts[i].startsWith(':') && mockParts[i] !== urlParts[i]) {
              isMatch = false
              break
            }
          }
          if (isMatch) {
            return { mock, params: this.parseUrlParams(urlPath, mockUrl) }
          }
        }
      } else if (mockUrl === urlPath) {
        return { mock, params: {} }
      }
    }

    return null
  }

  /**
   * 设置 Fetch 拦截器
   */
  private setupFetchInterceptor() {
    const originalFetch = window.fetch

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString()
      const method = init?.method?.toUpperCase() || 'GET'

      // 检查是否是 Mock 请求
      if (this.isEnabled) {
        const mockConfig = this.findMockConfig(method, url)

        if (mockConfig) {
          const { mock, params } = mockConfig
          let responseData: any

          // 处理 Mock 响应函数
          if (typeof mock.response === 'function') {
            try {
              // 解析请求体
              let body = {}
              if (init?.body) {
                if (typeof init.body === 'string') {
                  try {
                    body = JSON.parse(init.body)
                  } catch {
                    body = init.body
                  }
                } else {
                  body = init.body
                }
              }

              // 解析请求头
              const headers = init?.headers || {}

              // 解析查询参数
              const query = this.parseQueryParams(url)

              // 调用 Mock 响应函数
              responseData = mock.response({
                body,
                headers,
                params,
                query,
              })
            } catch {
              responseData = {
                success: false,
                message: 'Mock 响应失败',
                code: 50001,
              }
            }
          } else {
            responseData = mock.response
          }

          // 创建模拟响应
          const response = new Response(JSON.stringify(responseData), {
            status: 200,
          })
          response.headers.set('content-type', 'application/json')
          response.headers.set('access-control-allow-origin', '*')
          response.headers.set('access-control-allow-methods', 'GET, POST, PUT, DELETE, OPTIONS')
          response.headers.set('access-control-allow-headers', 'Content-Type, Authorization')
          return response
        }
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

  /**
   * 获取所有 Mock 接口列表
   */
  getMockList() {
    return mockServices.map(mock => ({
      url: mock.url,
      method: mock.method || 'GET',
    }))
  }
}

// 创建全局 Mock 服务实例
export const mockService = new MockService()

export default mockService
