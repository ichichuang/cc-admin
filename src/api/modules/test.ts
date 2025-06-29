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
