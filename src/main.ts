import { createApp } from 'vue'

import 'uno.css'

// 导入全局样式
import '@/assets/styles/reset.scss'

// 初始化 Mock 服务（vite-plugin-mock 会自动处理 Mock 请求）
// 自定义 Mock 服务仅作为备用方案
if (import.meta.env.VITE_MOCK_ENABLE === 'true' && import.meta.env.DEV) {
  console.log('🎭 Mock 服务已启用（由 vite-plugin-mock 处理）')
}

import App from '@/App.vue'
import { setupI18n } from '@/locales'
import router from '@/router'
import store from '@/stores'

const app = createApp(App)

// 配置路由和状态管理
app.use(router)
app.use(store)

// 配置国际化
setupI18n(app)

app.mount('#app')
