/**
 * 模块自动加载工具
 * 用于自动导入 modules 目录下的所有模块
 */

/**
 * 自动导入模块的通用函数
 * @param modules - import.meta.glob 返回的模块对象
 * @returns 导入的模块对象集合
 */
export async function autoImportModules<T = any>(
  modules: Record<string, () => Promise<any>>
): Promise<Record<string, T>> {
  const importedModules: Record<string, T> = {}

  for (const [path, moduleLoader] of Object.entries(modules)) {
    try {
      // 从路径中提取模块名（去掉路径和扩展名）
      const moduleName = path
        .replace('./modules/', '')
        .replace(/\.(ts|js)$/, '')
        .replace(/\/index$/, '') // 如果是 index 文件，使用父目录名

      // 动态导入模块
      const moduleExports = await moduleLoader()

      // 如果模块有默认导出，使用默认导出；否则使用整个模块
      const moduleContent = moduleExports.default || moduleExports

      importedModules[moduleName] = moduleContent
    } catch (error) {
      console.warn(`Failed to load module from ${path}:`, error)
    }
  }

  return importedModules
}

/**
 * 同步版本的模块自动导入（适用于已经处理好的模块）
 * @param modules - 已经导入的模块对象
 * @returns 整理后的模块对象集合
 */
export function autoImportModulesSync<T = any>(modules: Record<string, any>): Record<string, T> {
  const importedModules: Record<string, T> = {}

  for (const [path, moduleExports] of Object.entries(modules)) {
    try {
      // 从路径中提取模块名
      const moduleName = path
        .replace('./modules/', '')
        .replace(/\.(ts|js)$/, '')
        .replace(/\/index$/, '')

      // 如果模块有默认导出，使用默认导出；否则使用整个模块
      const moduleContent = moduleExports.default || moduleExports

      importedModules[moduleName] = moduleContent
    } catch (error) {
      console.warn(`Failed to process module from ${path}:`, error)
    }
  }

  return importedModules
}

/**
 * 类型定义：模块导出的基本结构
 */
export interface ModuleExport {
  [key: string]: any
}

/**
 * 类型定义：模块集合
 */
export type ModuleCollection<T = any> = Record<string, T>
