/* eslint-disable */

/**
 * 项目命名规范检查脚本
 * 检查文件名、目录名、变量名、函数名是否符合项目规范
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import { basename, dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

// 命名规范配置
const NAMING_RULES = {
  // 文件名规范
  files: {
    // Vue页面文件：kebab-case + .vue
    vuePages: /^[a-z0-9]+(-[a-z0-9]+)*\.vue$/,
    // Vue组件文件：PascalCase + .vue
    vueComponents: /^[A-Z][a-zA-Z0-9]*\.vue$/,
    // TypeScript/JavaScript文件：kebab-case
    scripts: /^[a-z0-9]+(-[a-z0-9]+)*\.(ts|js)$/,
    // camelCase 文件名（不含扩展名）
    camelCase: /^[a-z][a-zA-Z0-9]*\.(ts|js)$/,
    // 其他文件：kebab-case
    others: /^[a-z0-9]+(-[a-z0-9]+)*(\.[a-z0-9]+)*$/,
  },

  // 目录名规范：kebab-case
  directories: /^[a-z0-9]+(-[a-z0-9]+)*$/,

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

  // 特殊文件跳过检查
  const skipFiles = [
    'index.vue',
    'index.ts',
    'index.js',
    'README.md',
    'CHANGELOG.md',
    '.gitignore',
    '.gitkeep',
    'package.json',
    'pnpm-lock.yaml',
    'vite.config.ts',
    'tsconfig.json',
    'eslint.config.ts',
    'commitlint.config.js',
  ]

  // 国际化文件名规则（允许语言代码格式如 en-US.ts）
  const isI18nFile = filePath.includes('/locales/') && /^[a-z]{2}-[A-Z]{2}\.ts$/.test(fileName)

  if (skipFiles.includes(fileName) || isI18nFile) return

  // 判断是否在 src/common、src/hooks、src/router、src/stores、src/utils 目录下
  const isInSpecialCamelCaseDir = /\/src\/(common|hooks|router|stores|utils)\//.test(filePath)
  const isInComponents = filePath.includes('/components/')
  const isInViews = filePath.includes('/views/')
  const isVueFile = ext === '.vue'

  if (isInSpecialCamelCaseDir && ['.ts', '.js'].includes(ext)) {
    // 这些目录下必须用 camelCase
    if (!NAMING_RULES.files.camelCase.test(fileName)) {
      addError(
        'file-naming',
        filePath,
        0,
        `src/${filePath.split('/src/')[1].split('/')[0]} 目录下文件必须使用 camelCase 命名：${fileName} -> 建议：${toCamelCase(nameWithoutExt)}${ext}`
      )
    }
    return
  }

  if (isVueFile) {
    if (isInComponents) {
      // 组件文件：PascalCase
      if (!NAMING_RULES.files.vueComponents.test(fileName)) {
        addError(
          'file-naming',
          filePath,
          0,
          `组件文件名应使用PascalCase命名：${fileName} -> 建议：${toPascalCase(nameWithoutExt)}.vue`
        )
      }
    } else if (isInViews && fileName !== 'index.vue') {
      // 页面文件：kebab-case
      if (!NAMING_RULES.files.vuePages.test(fileName)) {
        addError(
          'file-naming',
          filePath,
          0,
          `页面文件名应使用kebab-case命名：${fileName} -> 建议：${toKebabCase(nameWithoutExt)}.vue`
        )
      }
    }
  } else if (['.ts', '.js'].includes(ext)) {
    // 其他目录 TypeScript/JavaScript文件：kebab-case
    if (!NAMING_RULES.files.scripts.test(fileName)) {
      addError(
        'file-naming',
        filePath,
        0,
        `脚本文件名应使用kebab-case命名：${fileName} -> 建议：${toKebabCase(nameWithoutExt)}${ext}`
      )
    }
  }
}

/**
 * 检查目录名是否符合规范
 */
function checkDirectoryName(dirPath, dirName) {
  // 特殊目录跳过检查
  const skipDirs = ['node_modules', '.git', '.vscode', '.husky', 'dist', 'coverage', 'public']

  if (skipDirs.includes(dirName)) return

  if (!NAMING_RULES.directories.test(dirName)) {
    addError(
      'directory-naming',
      dirPath,
      0,
      `目录名应使用kebab-case命名：${dirName} -> 建议：${toKebabCase(dirName)}`
    )
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

          if (!NAMING_RULES.functions.test(funcName)) {
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

        // 排除 src/Types 目录（大小写敏感）
        if (relativePath.includes('/src/Types')) continue

        checkDirectoryName(itemPath, item)
        await scanDirectory(itemPath)
      } else {
        checkFileName(itemPath, item)

        // 检查Vue文件内容
        if (item.endsWith('.vue')) {
          await checkVueFileNaming(itemPath)
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
    console.log('✅ 所有文件和代码都符合命名规范！')
    return true
  }

  console.log(`❌ 发现 ${errors.length} 个命名规范问题：\n`)

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
    console.log()
  })

  return false
}

/**
 * 主函数
 */
async function main() {
  console.log('🔍 开始检查项目命名规范...\n')

  // 扫描src目录
  const srcPath = join(projectRoot, 'src')
  await scanDirectory(srcPath)

  // 输出结果
  const isValid = outputResults()

  // 如果是CI环境，不符合规范时退出
  if (process.env.CI && !isValid) {
    process.exit(1)
  }
}

// 运行检查
main().catch(console.error)
