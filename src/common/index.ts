// Common 统一管理入口
import { autoImportModulesSync } from '@/utils/moduleLoader'

// 自动导入所有公共模块
const commonModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedCommons = autoImportModulesSync(commonModules)

// 导出所有公共模块
export const constants = importedCommons.constants
export const helpers = importedCommons.helpers
export const router = importedCommons.router
// 当有更多模块时，可以在这里添加：
// export const validators = importedCommons.validators
// export const formatters = importedCommons.formatters

// 默认导出所有公共模块
export default importedCommons

// 类型定义
export type CommonModules = typeof importedCommons

// 注意：当你在 modules/ 目录下添加新的公共模块时，
// 它们会自动被导入并可以通过以下方式使用：
// import { constants, helpers, router } from '@/common'
// 或者
// import common from '@/common'
// common.constants.apiConfig.baseUrl
// common.helpers.formatDate(new Date())
// common.router.goToRoute('dashboard')
