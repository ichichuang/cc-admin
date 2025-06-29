// API 统一管理入口
import { autoImportModulesSync } from '@/utils/moduleLoader'

// 自动导入所有 API 模块
const apiModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedAPIs = autoImportModulesSync(apiModules)

// 导出所有 API 模块（使用解构赋值方式）
export const testAPI = importedAPIs.test
// 当有更多模块时，可以在这里添加：
// export const userAPI = importedAPIs.user
// export const dataAPI = importedAPIs.data

// 默认导出所有 API
export default importedAPIs

// 类型定义
export type APIModules = typeof importedAPIs

// 注意：当你在 modules/ 目录下添加新的 API 文件时，
// 它们会自动被导入并可以通过以下方式使用：
// import { testAPI, userAPI } from '@/api'
// 或者
// import api from '@/api'
// api.test.getTest()
// api.user.getUserInfo()
