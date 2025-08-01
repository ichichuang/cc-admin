/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 应用入口
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import '@cc/early-bird-types'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

// 导入应用配置
import App from './App.vue'
import i18n from './locales'
import router from './router'

// 导入样式
import 'uno.css'
import './assets/styles/reset.scss'

// 导入 HTTP 配置
import { setHttpConfig } from '@cc/early-bird-core/utils'

// 初始化 HTTP 配置
setHttpConfig({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    xProject: 'admin',
  },
})

// 创建应用实例
const app = createApp(App)

// 注册插件
app.use(createPinia())
app.use(router)
app.use(i18n)

// 挂载应用
app.mount('#app')
