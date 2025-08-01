/**
 * @copyright Copyright (c) 2025 chichuang
 * @license 自定义商业限制许可证
 * @description cc-admin 企业级后台管理框架 - 构建脚本
 *
 * 本文件受版权保护，商业使用需要授权。
 * 联系方式: https://github.com/ichichuang/cc-admin/issues
 *
 * This file is protected by copyright. Commercial use requires authorization.
 * Contact: https://github.com/ichichuang/cc-admin/issues
 */

/* eslint-disable */

/**
 * 项目命名规范检查脚本
 * 检查文件名、目录名、变量名、函数名是否符合项目规范
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import { basename, dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const _dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(_dirname, '..')

// 命名规范配置
const NAMING_RULES = {
  // 文件名规范
  files: {
    // kebab-case 文件名（不含扩展名）
    kebabCase: /^[a-z0-9]+(-[a-z0-9]+)*$/,
    // camelCase 文件名（不含扩展名）
    camelCase: /^[a-z][a-zA-Z0-9]*$/,
    // PascalCase 文件名（不含扩展名）
    pascalCase: /^[A-Z][a-zA-Z0-9]*$/,
    // 其他文件：kebab-case
    others: /^[a-z0-9]+(-[a-z0-9]+)*(\.[a-z0-9]+)*$/,
  },

  // 目录名规范
  directories: {
    // kebab-case 目录名
    kebabCase: /^[a-z0-9]+(-[a-z0-9]+)*$/,
    // camelCase 目录名
    camelCase: /^[a-z][a-zA-Z0-9]*$/,
  },

  // 变量名规范：camelCase
  variables: /^[a-z][a-zA-Z0-9]*$/,

  // 函数名规范：camelCase
  functions: /^[a-z][a-zA-Z0-9]*$/,

  // 常量名规范：SCREAMING_SNAKE_CASE
  constants: /^[A-Z][A-Z0-9_]*$/,
}

// 错误收集器
const errors: any[] = []

/**
 * 添加错误
 */
function addError(type, file, line, message) {
  errors.push({
    type,
    file: file.replace(projectRoot, ''),
    line,
    message,
  })
}

/**
 * 检查文件名是否符合规范
 */
function checkFileName(filePath, fileName) {
  const ext = extname(fileName)
  const nameWithoutExt = basename(fileName, ext)
  const normalizedPath = filePath.replace(/\\/g, '/')

  // 特殊文件跳过检查
  const skipFiles = [
    'index.vue',
    'index.ts',

    'README.md',
    'CHANGELOG.md',
    '.gitignore',
    '.gitkeep',
    'package.json',
    'pnpm-lock.yaml',
    'vite.config.ts',
    'tsconfig.json',
    'eslint.config.ts',
    'commitlint.config.ts',
    'types.ts',
  ]

  // 跳过.d.ts文件检查
  if (ext === '.d.ts') return

  // 国际化文件名规则（允许语言代码格式如 en-US.ts）
  const isI18nFile =
    normalizedPath.includes('/locales/lang/') && /^[a-z]{2}-[A-Z]{2}\.ts$/.test(fileName)

  if (skipFiles.includes(fileName) || isI18nFile) return

  // 判断文件所在目录类型
  const isInComponents = normalizedPath.includes('/components/')
  const isInViews = normalizedPath.includes('/views/')
  const isInViewsComponents =
    normalizedPath.includes('/views/') && normalizedPath.includes('/components/')
  const isInViewsViews = normalizedPath.includes('/views/') && normalizedPath.includes('/views/')
  const isInApi = normalizedPath.includes('/api/')
  const isInHooks = normalizedPath.includes('/hooks/')
  const isInStores = normalizedPath.includes('/stores/')
  const isInRouter = normalizedPath.includes('/router/')
  const isInLocales = normalizedPath.includes('/locales/')
  const isInUtils = normalizedPath.includes('/utils/')
  const isInCommon = normalizedPath.includes('/common/')
  const isVueFile = ext === '.vue'

  if (isVueFile) {
    if (isInViewsComponents) {
      // views/components/ 目录下的 Vue 文件：PascalCase
      if (!NAMING_RULES.files.pascalCase.test(nameWithoutExt)) {
        addError(
          'file-naming',
          filePath,
          0,
          `页面内部组件文件名应使用PascalCase命名：${fileName} -> 建议：${toPascalCase(nameWithoutExt)}.vue`
        )
      }
    } else if (isInViewsViews) {
      // views/views/ 目录下的 Vue 文件：kebab-case
      if (!NAMING_RULES.files.kebabCase.test(nameWithoutExt)) {
        addError(
          'file-naming',
          filePath,
          0,
          `子页面文件名应使用kebab-case命名：${fileName} -> 建议：${toKebabCase(nameWithoutExt)}.vue`
        )
      }
    } else if (isInViews && fileName !== 'index.vue') {
      // views 目录下的其他 Vue 文件：kebab-case
      if (!NAMING_RULES.files.kebabCase.test(nameWithoutExt)) {
        addError(
          'file-naming',
          filePath,
          0,
          `页面文件名应使用kebab-case命名：${fileName} -> 建议：${toKebabCase(nameWithoutExt)}.vue`
        )
      }
    } else if (isInComponents) {
      // components 目录下的 Vue 文件：PascalCase
      if (!NAMING_RULES.files.pascalCase.test(nameWithoutExt)) {
        addError(
          'file-naming',
          filePath,
          0,
          `全局组件文件名应使用PascalCase命名：${fileName} -> 建议：${toPascalCase(nameWithoutExt)}.vue`
        )
      }
    }
  } else if (['.ts', '.js'].includes(ext)) {
    // 功能模块相关文件：camelCase
    if (
      isInApi ||
      isInHooks ||
      isInStores ||
      isInRouter ||
      isInLocales ||
      isInUtils ||
      isInCommon
    ) {
      if (!NAMING_RULES.files.camelCase.test(nameWithoutExt)) {
        addError(
          'file-naming',
          filePath,
          0,
          `功能模块文件名应使用camelCase命名：${fileName} -> 建议：${toCamelCase(nameWithoutExt)}${ext}`
        )
      }
    } else {
      // 其他 TypeScript/JavaScript 文件：kebab-case
      if (!NAMING_RULES.files.kebabCase.test(nameWithoutExt)) {
        addError(
          'file-naming',
          filePath,
          0,
          `脚本文件名应使用kebab-case命名：${fileName} -> 建议：${toKebabCase(nameWithoutExt)}${ext}`
        )
      }
    }
  }
}

/**
 * 检查目录名是否符合规范
 */
function checkDirectoryName(dirPath, dirName) {
  const normalizedPath = dirPath.replace(/\\/g, '/')

  // 特殊目录跳过检查
  const skipDirs = ['node_modules', '.git', '.vscode', '.husky', 'dist', 'coverage', 'public']

  if (skipDirs.includes(dirName)) return

  // 判断目录类型
  const isInViews = normalizedPath.includes('/views/')
  const isInApi = normalizedPath.includes('/api/')
  const isInHooks = normalizedPath.includes('/hooks/')
  const isInStores = normalizedPath.includes('/stores/')
  const isInRouter = normalizedPath.includes('/router/')
  const isInLocales = normalizedPath.includes('/locales/')
  const isInUtils = normalizedPath.includes('/utils/')
  const isInCommon = normalizedPath.includes('/common/')

  // 功能模块相关目录：camelCase
  if (isInApi || isInHooks || isInStores || isInRouter || isInLocales || isInUtils || isInCommon) {
    if (!NAMING_RULES.directories.camelCase.test(dirName)) {
      addError(
        'directory-naming',
        dirPath,
        0,
        `功能模块目录名应使用camelCase命名：${dirName} -> 建议：${toCamelCase(dirName)}`
      )
    }
  } else {
    // 其他目录：kebab-case
    if (!NAMING_RULES.directories.kebabCase.test(dirName)) {
      addError(
        'directory-naming',
        dirPath,
        0,
        `目录名应使用kebab-case命名：${dirName} -> 建议：${toKebabCase(dirName)}`
      )
    }
  }
}

/**
 * 检查Vue文件中的变量和函数命名
 */
async function checkVueFileNaming(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8')
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      const lineNumber = index + 1

      // 检查变量声明：const, let, var
      const varMatch = line.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g)
      if (varMatch) {
        varMatch.forEach(match => {
          const varName = match.replace(/(?:const|let|var)\s+/, '')

          // 判断是否为常量（全大写）
          if (varName === varName.toUpperCase() && varName.includes('_')) {
            if (!NAMING_RULES.constants.test(varName)) {
              addError(
                'variable-naming',
                filePath,
                lineNumber,
                `常量名应使用SCREAMING_SNAKE_CASE：${varName}`
              )
            }
          } else if (varName.startsWith('_')) {
            // 以下划线开头的未使用变量，检查剩余部分是否符合camelCase
            const remainingName = varName.slice(1)
            if (remainingName && !NAMING_RULES.variables.test(remainingName)) {
              addError(
                'variable-naming',
                filePath,
                lineNumber,
                `未使用变量名应使用camelCase：${varName} -> 建议：_${toCamelCase(remainingName)}`
              )
            }
          } else {
            if (!NAMING_RULES.variables.test(varName)) {
              addError(
                'variable-naming',
                filePath,
                lineNumber,
                `变量名应使用camelCase：${varName} -> 建议：${toCamelCase(varName)}`
              )
            }
          }
        })
      }

      // 检查函数声明
      const funcMatch = line.match(/(?:function\s+|const\s+)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?:\(|=)/g)
      if (funcMatch) {
        funcMatch.forEach(match => {
          const funcName = match
            .replace(/(?:function\s+|const\s+)/, '')
            .replace(/\s*(?:\(|=).*/, '')

          if (funcName.startsWith('_')) {
            // 以下划线开头的未使用函数，检查剩余部分是否符合camelCase
            const remainingName = funcName.slice(1)
            if (remainingName && !NAMING_RULES.functions.test(remainingName)) {
              addError(
                'function-naming',
                filePath,
                lineNumber,
                `未使用函数名应使用camelCase：${funcName} -> 建议：_${toCamelCase(remainingName)}`
              )
            }
          } else if (!NAMING_RULES.functions.test(funcName)) {
            addError(
              'function-naming',
              filePath,
              lineNumber,
              `函数名应使用camelCase：${funcName} -> 建议：${toCamelCase(funcName)}`
            )
          }
        })
      }
    })
  } catch (_error) {
    console.warn(`读取文件失败: ${filePath}`)
  }
}

/**
 * 递归扫描目录
 */
async function scanDirectory(dirPath) {
  try {
    const items = await readdir(dirPath)

    for (const item of items) {
      const itemPath = join(dirPath, item)
      const stats = await stat(itemPath)

      if (stats.isDirectory()) {
        const relativePath = itemPath.replace(projectRoot, '').replace(/\\/g, '/')

        // 排除node_modules、.git、dist等目录
        if (
          relativePath.includes('/node_modules') ||
          relativePath.includes('/.git') ||
          relativePath.includes('/dist') ||
          relativePath.includes('/coverage') ||
          relativePath.includes('/.vite') ||
          relativePath.includes('/.nuxt') ||
          relativePath.includes('/.next') ||
          relativePath.includes('/.svelte-kit') ||
          relativePath.includes('/.cache') ||
          relativePath.includes('/.temp') ||
          relativePath.includes('/.tmp')
        )
          continue

        checkDirectoryName(itemPath, item)
        await scanDirectory(itemPath)
      } else {
        // 检查apps和packages目录下的文件
        const relativePath = itemPath.replace(projectRoot, '').replace(/\\/g, '/')
        if (relativePath.startsWith('/apps/') || relativePath.startsWith('/packages/')) {
          // 跳过构建产物文件
          if (
            relativePath.includes('/dist/') ||
            relativePath.includes('/coverage/') ||
            relativePath.includes('/.vite/') ||
            relativePath.includes('/.nuxt/') ||
            relativePath.includes('/.next/') ||
            relativePath.includes('/.svelte-kit/') ||
            relativePath.includes('/.cache/') ||
            relativePath.includes('/.temp/') ||
            relativePath.includes('/.tmp/')
          ) {
            continue
          }

          // 跳过.d.ts文件检查
          if (!item.endsWith('.d.ts')) {
            checkFileName(itemPath, item)
          }

          // 检查Vue文件内容
          if (item.endsWith('.vue')) {
            await checkVueFileNaming(itemPath)
          }
        }
      }
    }
  } catch (_error) {
    console.warn(`扫描目录失败: ${dirPath}`)
  }
}

/**
 * 转换为camelCase
 */
function toCamelCase(str) {
  return str.replace(/[-_](.)/g, (_, char) => char.toUpperCase())
}

/**
 * 转换为kebab-case
 */
function toKebabCase(str) {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
}

/**
 * 转换为PascalCase
 */
function toPascalCase(str) {
  const camel = toCamelCase(str)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

/**
 * 输出检查结果
 */
function outputResults() {
  if (errors.length === 0) {
    console.log('✅ \x1b[32m项目命名规范检查完成，一切正常\x1b[0m')
    return true
  }

  console.log(`❌ 发现 ${errors.length} 个命名规范问题：`)

  const groupedErrors = errors.reduce((groups: any, error: any) => {
    if (!groups[error.type]) groups[error.type] = []
    groups[error.type].push(error)
    return groups
  }, {})

  Object.entries(groupedErrors).forEach(([type, typeErrors]: any) => {
    const typeNames = {
      'file-naming': '📁 文件命名',
      'directory-naming': '📂 目录命名',
      'variable-naming': '🔤 变量命名',
      'function-naming': '⚙️ 函数命名',
    }

    console.log(`${typeNames[type]} (${typeErrors.length}个问题):`)
    typeErrors.forEach(error => {
      console.log(`  ${error.file}${error.line > 0 ? `:${error.line}` : ''}`)
      console.log(`    ${error.message}`)
    })
  })

  return false
}

/**
 * 主函数
 */
async function main() {
  console.log('\x1b[32m🔍 开始检查项目命名规范...\x1b[0m')

  // 扫描apps和packages目录
  const directories = [join(projectRoot, 'apps'), join(projectRoot, 'packages')]

  for (const dirPath of directories) {
    // 检查目录是否存在
    try {
      await stat(dirPath)
      console.log('\x1b[32m📁 扫描目录:\x1b[0m', dirPath)
      await scanDirectory(dirPath)
    } catch (error) {
      console.warn(`⚠️ 目录不存在: ${dirPath}`)
    }
  }

  // 输出结果
  const isValid = outputResults()

  // 如果是CI环境，不符合规范时退出
  if (process.env.CI && !isValid) {
    process.exit(1)
  }
}

// 运行检查
main().catch(console.error)
