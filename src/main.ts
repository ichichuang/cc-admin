/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 应用入口文件
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import '@/mock'
import 'uno.css'

import { createApp } from 'vue'

// 导入全局样式
import '@/assets/styles/reset.scss'

import App from '@/App.vue'
import { setupI18n } from '@/locales'
import { initMockService } from '@/mock'
import router from '@/router'
import store from '@/stores'

const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err: unknown, instance, info) => {
  // 过滤掉浏览器扩展相关的错误
  const errorMessage = err instanceof Error ? err.message : String(err)
  if (errorMessage.includes('message port closed') || errorMessage.includes('runtime.lastError')) {
    console.warn('浏览器扩展相关错误，已忽略:', errorMessage)
    return
  }

  console.error('应用错误:', err, info)
}

// 全局警告处理
app.config.warnHandler = (msg, instance, trace) => {
  // 过滤掉一些常见的无害警告
  if (msg.includes('message port closed') || msg.includes('runtime.lastError')) {
    return
  }

  console.warn('应用警告:', msg, trace)
}

// 配置路由和状态管理
app.use(router)
app.use(store)

// 配置国际化
setupI18n(app)

// 初始化 Mock 服务
initMockService()

app.mount('#app')
