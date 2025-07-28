/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - API接口
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { alovaInstance } from '@/utils/http'

// 测试接口类型定义
export interface TestResponse {
  success: boolean
  message: string
  data?: any
  timestamp: string
}

// 测试 API
export const testAPI = {
  // 测试接口
  getTest: () => alovaInstance.Get('/test'),

  // 带参数的测试接口
  getTestWithParams: (params: { message?: string; type?: string }) =>
    alovaInstance.Get('/test', { params }),

  // POST 测试接口
  postTest: (data: { message: string; [key: string]: any }) => alovaInstance.Post('/test', data),
}

export default testAPI
