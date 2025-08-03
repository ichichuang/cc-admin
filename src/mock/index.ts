/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - index
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { env } from '@/utils/env'
import type { MockMethod } from './types'

// 导入所有 Mock 模块
import authMock from './modules/auth'
import routerMock from './modules/router'

/**
 * Mock 服务配置
 * 统一管理所有的 Mock 接口
 */
export const mockServices: MockMethod[] = [...authMock, ...routerMock]

/**
 * 初始化 Mock 服务
 * 根据环境变量决定是否启用 Mock
 */
export function initMockService() {
  const isMockEnabled = env.mockEnable

  if (isMockEnabled) {
    // 使用自定义 Mock 服务，支持生产环境
    import('./mock-service')
      .then(() => {
        console.log('✅ Mock 服务已启动')
      })
      .catch(error => {
        console.error('❌ Mock 服务启动失败:', error)
      })
  } else {
    console.log('🔇 Mock 服务已禁用')
  }
}

export default mockServices
