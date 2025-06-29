// Stores 统一管理入口
import { autoImportModulesSync } from '@/utils/moduleLoader'

// 自动导入所有 Store 模块
const storeModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedStores = autoImportModulesSync(storeModules)

// 导出所有 Store 模块
export const useAppStore = importedStores.app
export const useUserStore = importedStores.user
// 当有更多模块时，可以在这里添加：
// export const useAuthStore = importedStores.auth

// Layout Store
export { useLayoutStore } from './modules/layout'

// Theme Store
export { useThemeStore } from './modules/theme'

// 默认导出所有 Store
export default importedStores

// 类型定义
export type StoreModules = typeof importedStores

// 注意：当你在 modules/ 目录下添加新的 Store 文件时，
// 它们会自动被导入并可以通过以下方式使用：
// import { useAppStore, useUserStore } from '@/stores'
// 或者
// import stores from '@/stores'
// stores.app() // 调用 useAppStore
// stores.user() // 调用 useUserStore
