/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 公共模块
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 公共模块统一管理入口
import { autoImportModulesSync } from '@cc-admin/core/utils'

// 自动导入所有公共模块
const commonModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedCommon = autoImportModulesSync(commonModules)

// 导出所有公共模块
export default importedCommon

// 类型定义
export type CommonModules = typeof importedCommon
