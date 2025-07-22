import { createApp } from 'vue'

import 'uno.css'

// 导入全局样式
import '@/assets/styles/reset.scss'

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
