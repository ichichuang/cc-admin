import type { MockMethod } from './types'

// 导入所有 Mock 模块
import authMock from './modules/auth'
import exampleMock from './modules/expmple'
import routerMock from './modules/router'

/**
 * Mock 服务配置
 * 统一管理所有的 Mock 接口
 */
export const mockServices: MockMethod[] = [...authMock, ...routerMock, ...exampleMock]

/**
 * 初始化 Mock 服务
 * 根据环境变量决定是否启用 Mock
 */
export function initMockService() {
  const isMockEnabled = import.meta.env.VITE_MOCK_ENABLE === 'true'

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

// 初始化 Mock 服务（自定义 Mock 服务）
if (import.meta.env.VITE_MOCK_ENABLE === 'true') {
  // 导入并初始化 Mock 服务
  import('@/mock')
    .then(({ initMockService }) => {
      initMockService()
    })
    .catch(error => {
      console.error('Mock 服务初始化失败:', error)
    })
}
