/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - API接口
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// API 统一管理入口
import { autoImportModulesSync } from '@/utils/moduleLoader'

// 自动导入所有 API 模块
const apiModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedAPIs = autoImportModulesSync(apiModules)

// 导出所有 API 模块（使用解构赋值方式）
export const authAPI = importedAPIs.auth
export * from './modules/auth'

// 默认导出所有 API
export default importedAPIs

// 类型定义
export type APIModules = typeof importedAPIs
