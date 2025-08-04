/**
 * @copyright Copyright (c) 2025 chichuang
 * @license 自定义商业限制许可证
 * @description cc-admin 企业级后台管理框架 - 工具函数
 *
 * 本文件受版权保护，商业使用需要授权。
 * 联系方式: https://github.com/ichichuang/cc-admin/issues
 *
 * This file is protected by copyright. Commercial use requires authorization.
 * Contact: https://github.com/ichichuang/cc-admin/issues
 */

import { env } from '@/utils/env'
import {
  addConnectionListener,
  addUploadTask,
  cancelUploadTask,
  clearCache,
  clearRequests,
  del,
  disconnect,
  ErrorType,
  // HTTP 方法
  get,
  getAllUploadTasks,
  getCacheStats,
  getConnectionState,
  getRequestStats,
  getUploadTask,
  HttpRequestError,
  isRetryableError,
  pauseUploadTask,
  post,
  put,
  reconnect,
  removeUploadTask,
  resumeUploadTask,
  // 类型
  type ConnectionState,
  type RequestConfig,
  type SecurityConfig,
  type UploadChunkConfig,
} from './index'

/**
 * 连接管理使用示例
 */
export class ConnectionExample {
  private unsubscribe?: () => void

  constructor() {
    this.setupConnectionListener()
  }

  /**
   * 设置连接状态监听
   */
  private setupConnectionListener() {
    this.unsubscribe = addConnectionListener((state: ConnectionState) => {
      console.log('🔗 连接状态变化:', {
        isConnected: state.isConnected,
        isReconnecting: state.isReconnecting,
        reconnectAttempts: state.reconnectAttempts,
        disconnectReason: state.disconnectReason,
      })

      // 根据连接状态更新 UI
      this.updateConnectionUI(state)
    })
  }

  /**
   * 更新连接状态 UI
   */
  private updateConnectionUI(state: ConnectionState) {
    // 这里可以更新 UI 显示连接状态
    if (!state.isConnected) {
      console.warn('⚠️ 网络连接已断开')
      // 显示重连按钮或提示
    } else if (state.isReconnecting) {
      console.log('🔄 正在重连...')
      // 显示重连进度
    } else {
      console.log('✅ 网络连接正常')
      // 隐藏连接状态提示
    }
  }

  /**
   * 手动断开连接
   */
  disconnectConnection() {
    disconnect('用户手动断开')
  }

  /**
   * 手动重连
   */
  async reconnectConnection() {
    const success = await reconnect()
    if (success) {
      console.log('✅ 重连成功')
    } else {
      console.error('❌ 重连失败')
    }
  }

  /**
   * 获取当前连接状态
   */
  getCurrentConnectionState() {
    return getConnectionState()
  }

  /**
   * 清理监听器
   */
  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}

/**
 * 文件上传使用示例
 */
export class UploadExample {
  /**
   * 上传单个文件
   */
  async uploadSingleFile(file: File) {
    const config: UploadChunkConfig = {
      chunkSize: 2 * 1024 * 1024, // 2MB 分片
      concurrentChunks: 3, // 3个并发
      onProgress: progress => {
        console.log(`📤 上传进度: ${progress}%`)
      },
      onSuccess: response => {
        console.log('✅ 上传成功:', response)
      },
      onError: error => {
        console.error('❌ 上传失败:', error)
      },
    }

    const taskId = addUploadTask(file, config)
    console.log('📁 开始上传文件:', file.name, '任务ID:', taskId)

    return taskId
  }

  /**
   * 上传多个文件
   */
  async uploadMultipleFiles(files: File[]) {
    const taskIds: string[] = []

    for (const file of files) {
      const taskId = await this.uploadSingleFile(file)
      taskIds.push(taskId)
    }

    return taskIds
  }

  /**
   * 暂停上传
   */
  pauseUpload(taskId: string) {
    pauseUploadTask(taskId)
    console.log('⏸️ 暂停上传任务:', taskId)
  }

  /**
   * 恢复上传
   */
  resumeUpload(taskId: string) {
    resumeUploadTask(taskId)
    console.log('▶️ 恢复上传任务:', taskId)
  }

  /**
   * 取消上传
   */
  cancelUpload(taskId: string) {
    cancelUploadTask(taskId)
    console.log('❌ 取消上传任务:', taskId)
  }

  /**
   * 获取上传任务信息
   */
  getUploadInfo(taskId: string) {
    const task = getUploadTask(taskId)
    if (task) {
      console.log('📊 上传任务信息:', {
        fileName: task.file.name,
        fileSize: task.file.size,
        progress: task.progress,
        status: task.status,
        uploadedChunks: task.uploadedChunks.size,
        totalChunks: task.chunks.length,
      })
    }
    return task
  }

  /**
   * 获取所有上传任务
   */
  getAllUploads() {
    const tasks = getAllUploadTasks()
    console.log('📋 所有上传任务:', tasks.length)
    return tasks
  }

  /**
   * 清理已完成的任务
   */
  cleanupCompletedTasks() {
    const tasks = getAllUploadTasks()
    tasks.forEach(task => {
      if (task.status === 'completed' || task.status === 'failed') {
        removeUploadTask(task.id)
      }
    })
  }
}

/**
 * HTTP 请求使用示例
 */
export class HttpExample {
  /**
   * 获取用户信息（带缓存和安全配置）
   */
  async getUserInfo(userId: string) {
    try {
      const securityConfig: SecurityConfig = {
        enableCSRF: true,
        enableSignature: true,
        enableRateLimit: true,
        maxRequestsPerMinute: 60,
        sensitiveFields: ['password', 'token'],
      }

      const config: RequestConfig = {
        enableCache: true, // 启用缓存
        cacheTTL: 5 * 60 * 1000, // 5分钟缓存
        deduplicate: true, // 启用请求去重
        security: securityConfig,
        retry: {
          retries: 3,
          retryDelay: 1000,
          retryCondition: (error: Error) => {
            if (error instanceof HttpRequestError) {
              return isRetryableError(error)
            }
            return false
          },
        },
      }

      const response = await get(`/api/users/${userId}`, config)
      console.log('👤 用户信息:', response)
      return response
    } catch (error) {
      console.error('❌ 获取用户信息失败:', error)
      throw error
    }
  }

  /**
   * 创建用户（带安全配置）
   */
  async createUser(userData: any) {
    try {
      const securityConfig: SecurityConfig = {
        enableCSRF: true,
        enableSignature: true,
        sensitiveFields: ['password', 'ssn', 'creditCard'],
      }

      const config: RequestConfig = {
        retry: {
          retries: 2,
          retryDelay: 2000,
        },
        security: securityConfig,
      }

      const response = await post('/api/users', userData, config)
      console.log('✅ 用户创建成功:', response)
      return response
    } catch (error) {
      console.error('❌ 创建用户失败:', error)
      throw error
    }
  }

  /**
   * 更新用户信息
   */
  async updateUser(userId: string, userData: any) {
    try {
      const response = await put(`/api/users/${userId}`, userData)
      console.log('✅ 用户信息更新成功:', response)
      return response
    } catch (error) {
      console.error('❌ 更新用户信息失败:', error)
      throw error
    }
  }

  /**
   * 删除用户
   */
  async deleteUser(userId: string) {
    try {
      const response = await del(`/api/users/${userId}`)
      console.log('✅ 用户删除成功:', response)
      return response
    } catch (error) {
      console.error('❌ 删除用户失败:', error)
      throw error
    }
  }

  /**
   * 错误处理示例
   */
  async handleErrors() {
    try {
      await get('/api/nonexistent')
    } catch (error) {
      if (error instanceof HttpRequestError) {
        switch (error.type) {
          case ErrorType.NETWORK:
            console.error('网络错误:', error.message)
            break
          case ErrorType.AUTH:
            console.error('认证错误:', error.message)
            break
          case ErrorType.SERVER:
            console.error('服务器错误:', error.message)
            break
          case ErrorType.CLIENT:
            console.error('客户端错误:', error.message)
            break
          case ErrorType.SECURITY:
            console.error('安全错误:', error.message)
            break
          default:
            console.error('未知错误:', error.message)
        }
      }
    }
  }

  /**
   * 缓存管理示例
   */
  async cacheManagement() {
    // 获取缓存统计
    const cacheStats = getCacheStats()
    console.log('📊 缓存统计:', cacheStats)

    // 获取请求统计
    const requestStats = getRequestStats()
    console.log('📊 请求统计:', requestStats)

    // 清除缓存
    clearCache()
    console.log('🗑️ 缓存已清除')

    // 清理所有请求
    clearRequests()
    console.log('🗑️ 所有请求已清理')
  }

  /**
   * 性能优化示例
   */
  async performanceOptimization() {
    // 并发请求示例
    const promises = []
    for (let i = 1; i <= 10; i++) {
      promises.push(get(`/api/users/${i}`, { enableCache: true }))
    }

    try {
      const results = await Promise.all(promises)
      console.log('✅ 并发请求完成:', results.length)
    } catch (error) {
      console.error('❌ 并发请求失败:', error)
    }
  }
}

// 创建全局实例
export const connectionExample = new ConnectionExample()
export const uploadExample = new UploadExample()
export const httpExample = new HttpExample()

// 在开发环境下输出使用示例
if (env.debug) {
  console.log('📚 HTTP 模块使用示例已加载')
  console.log('🔗 连接管理:', connectionExample)
  console.log('📁 文件上传:', uploadExample)
  console.log('🌐 HTTP 请求:', httpExample)
}
