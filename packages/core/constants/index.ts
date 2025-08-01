/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 核心包
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */
import { autoImportModulesSync } from '@cc/early-bird-core/utils'

// 自动导入所有 common 模块
const commonModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedCommon = autoImportModulesSync(commonModules)

// 导出所有 common 模块
export { importedCommon }

// 导出所有 common 模块
export * from './modules/stores'
