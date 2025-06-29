// Hooks 统一管理入口
import { autoImportModulesSync } from '@/utils/moduleLoader'

// 自动导入所有 Hook 模块
const hookModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedHooks = autoImportModulesSync(hookModules)

// 导出所有 Hook 模块
// 例如：
// export const useRequest = importedHooks.request
// export const useStorage = importedHooks.storage

// 默认导出所有 Hook
export default importedHooks

// 类型定义
export type HookModules = typeof importedHooks

// 注意：当你在 modules/ 目录下添加新的 Hook 文件时，
// 它们会自动被导入并可以通过以下方式使用：
// import { useRequest, useStorage } from '@/hooks'
// 或者
// import hooks from '@/hooks'
// hooks.request() // 调用 useRequest
// hooks.storage() // 调用 useStorage
