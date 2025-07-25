// Hooks 统一管理入口
import { autoImportModulesSync } from '@/utils/moduleLoader'

// 自动导入所有 Hook 模块
const hookModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedHooks = autoImportModulesSync(hookModules)

const hookLayoutModules = import.meta.glob('./layout/**/*.ts', { eager: true })
const importedHookLayouts = autoImportModulesSync(hookLayoutModules)

export default {
  ...importedHooks,
  ...importedHookLayouts,
}

export * from './layout/useLoading'

export type HookModules = typeof importedHooks
export type HookLayoutModules = typeof importedHookLayouts
