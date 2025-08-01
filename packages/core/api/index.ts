/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - API接口
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// API 统一管理入口
import { autoImportModulesSync } from '@cc/early-bird-core/utils'

// 自动导入所有 API 模块
const apiModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedAPIs = autoImportModulesSync(apiModules)

// 默认导出所有 API
export { importedAPIs }

// 导出所有 API 模块
export * from './modules/auth'
