/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 应用入口
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import App from '@/App.vue'
import { createApp } from 'vue'

// 导入核心包
import { router, store } from '@cc-admin/core'

// 导入样式
import 'virtual:uno.css'
import './assets/styles/reset.scss'

// 导入Mock服务
import '@/mock'

// 创建应用实例
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

// 使用插件
app.use(store)
app.use(router)

// 挂载应用
app.mount('#app')
