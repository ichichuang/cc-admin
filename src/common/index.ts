/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - index
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// Common 统一管理入口
import { autoImportModulesSync } from '@/utils/moduleLoader'

// 自动导入所有公共模块
const commonModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedCommons = autoImportModulesSync(commonModules)

// 导出所有公共模块
export * from './modules/date'
export * from './modules/function'
export * from './modules/helpers'
export * from './modules/router'

// 导出所有公共模块
export default importedCommons

// 类型定义
export type CommonModules = typeof importedCommons
