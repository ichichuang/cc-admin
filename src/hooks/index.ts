/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 组合式函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

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

// 导出所有 Hook 模块
export * from './layout/useLoading'

// 按需导出常用 Hooks，便于使用
export { useLoading } from './layout/useLoading'
export { useLocale } from './modules/useLocale'
export { usePageTitle } from './modules/usePageTitle'

// 类型定义
export type HookModules = typeof importedHooks
export type HookLayoutModules = typeof importedHookLayouts
