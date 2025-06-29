import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'

// 导入 UnoCSS 样式 - 必须在其他样式之前
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

// 导入全局样式
import '@/assets/styles/reset.scss'

import App from '@/App.vue'
import router from '@/router'
import { useThemeStore } from '@/stores/modules/theme'

const app = createApp(App)

// 创建 Pinia 实例并配置持久化插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

// 初始化主题
const themeStore = useThemeStore()
themeStore.initTheme()

app.mount('#app')
