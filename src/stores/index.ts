// Stores 统一管理入口
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 创建 Pinia 实例并配置持久化插件
const store = createPinia()
store.use(piniaPluginPersistedstate)

// 导出默认store实例
export default store

export * from './modules/app'
export * from './modules/color'
export * from './modules/layout'
export * from './modules/permission'
export * from './modules/size'
export * from './modules/user'
