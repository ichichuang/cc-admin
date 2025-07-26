import type { MockMethod } from 'vite-plugin-mock'

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
  const isMockEnabled = import.meta.env.VITE_MOCK_ENABLE === 'true'

  if (isMockEnabled) {
    // 使用自定义 Mock 服务，支持生产环境
    import('./mock-service')
      .then(() => {
        console.log('✅ Mock 服务已启动')
        console.log('🎭 使用 @faker-js/faker 生成真实模拟数据')
        console.log('📊 包含模块：认证、路由')
      })
      .catch(error => {
        console.error('❌ Mock 服务启动失败:', error)
      })
  } else {
    console.log('🔇 Mock 服务已禁用')
  }
}

export default mockServices
