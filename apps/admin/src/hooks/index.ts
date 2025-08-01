/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - Hooks
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// Hooks 统一管理入口
import { autoImportModulesSync } from '@cc/early-bird-core/utils'

// 自动导入所有 Hooks 模块
const hookModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedHooks = autoImportModulesSync(hookModules)

// 自动导入所有 Layout Hooks 模块
const hookLayoutModules = import.meta.glob('./layout/**/*.ts', { eager: true })
const importedLayoutHooks = autoImportModulesSync(hookLayoutModules)

// 合并所有 Hooks
const allHooks = { ...importedHooks, ...importedLayoutHooks }

// 导出所有 Hooks
export default allHooks

// 类型定义
export type HookModules = typeof allHooks
