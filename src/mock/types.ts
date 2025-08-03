/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - types
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * Mock 方法类型定义
 * 替代 vite-plugin-mock 的类型，避免安全漏洞
 */

export interface MockMethod {
  url: string
  method?:
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'
    | 'HEAD'
    | 'OPTIONS'
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | 'patch'
    | 'head'
    | 'options'
  response?: any | ((opt: MockRequestOption) => any)
  statusCode?: number
  headers?: Record<string, string>
  timeout?: number
  rawResponse?: boolean
}

export interface MockRequestOption {
  body: any
  headers: Record<string, string>
  params: Record<string, string>
  query: Record<string, string>
}
