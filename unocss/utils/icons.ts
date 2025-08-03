/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - icons
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import fs from 'fs'
import path from 'node:path'

// 类型定义
interface IconCollection {
  [key: string]: string[]
}

/**
 * 获取自定义图标集合
 * 优化：使用缓存和错误处理
 */
export function getCustomIcons(): IconCollection {
  const icons: IconCollection = {}
  const iconFiles = getSvgFiles('src/assets/icons')

  iconFiles.forEach(filePath => {
    try {
      const fileName = path.basename(filePath)
      const fileNameWithoutExt = path.parse(fileName).name
      const folderName = path.basename(path.dirname(filePath))

      if (!icons[folderName]) {
        icons[folderName] = []
      }
      icons[folderName].push(`i-${folderName}:${fileNameWithoutExt}`)
    } catch (error) {
      console.warn(`Failed to process icon file: ${filePath}`, error)
    }
  })

  return icons
}

/**
 * 递归获取SVG文件
 * 优化：添加性能优化和错误处理
 */
function getSvgFiles(dir: string): string[] {
  const files: string[] = []

  if (!fs.existsSync(dir)) {
    return files
  }

  function traverse(currentPath: string) {
    try {
      const items = fs.readdirSync(currentPath, { withFileTypes: true })

      items.forEach(item => {
        const fullPath = path.join(currentPath, item.name)

        if (item.isDirectory()) {
          traverse(fullPath)
        } else if (item.isFile() && item.name.endsWith('.svg')) {
          files.push(fullPath)
        }
      })
    } catch (error) {
      console.warn(`Failed to read directory: ${currentPath}`, error)
    }
  }

  traverse(dir)
  return files
}

/**
 * 获取TypeScript文件中的图标引用
 * 优化：更严格的图标名称验证和过滤
 */
export function getRouteMetaIcons(): string[] {
  const icons = new Set<string>()
  const files = getTsFiles('src/router/modules')

  // 更精确的正则表达式匹配图标
  const iconPatterns = [
    // 匹配 meta: { icon: 'icon-name' }
    /meta\s*:\s*\{[^}]*icon\s*:\s*['"]([^'"]+)['"]/g,
    // 匹配 meta.icon = 'icon-name'
    /meta\.icon\s*=\s*['"]([^'"]+)['"]/g,
    // 匹配 icon: 'icon-name'（单独的属性）
    /(?:^|\s|,)icon\s*:\s*['"]([^'"]+)['"]/g,
  ]

  // 扩展无效图标名称列表
  const invalidIcons = new Set([
    // JavaScript 关键字
    'return',
    'if',
    'else',
    'case',
    'switch',
    'for',
    'while',
    'do',
    'break',
    'continue',
    'function',
    'const',
    'let',
    'var',
    'class',
    'extends',
    'import',
    'export',
    'default',
    'try',
    'catch',
    'finally',
    'throw',
    'new',
    'this',
    'super',
    'static',
    'async',
    'await',

    // TypeScript 关键字
    'interface',
    'type',
    'enum',
    'namespace',
    'module',
    'declare',
    'public',
    'private',
    'protected',
    'readonly',
    'abstract',
    'implements',
    'extends',

    // 常见的非图标字符串
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'Tab',
    'Newline',
    'Return',
    'Space',
    'Enter',
    'Escape',
    'Backspace',
    'No-break',
    'space',
    'Byte',
    'Order',
    'Mark',
    'Line',
    'Separator',
    'trimmed',
    'undefined',
    'null',
    'true',
    'false',

    // 常见的变量名和方法名
    'data',
    'props',
    'methods',
    'computed',
    'watch',
    'created',
    'mounted',
    'updated',
    'destroyed',
    'setup',
    'ref',
    'reactive',
    'computed',

    // 其他可能的干扰字符串
    'text',
    'value',
    'label',
    'name',
    'id',
    'key',
    'index',
    'item',
    'list',
    'array',
    'object',
    'string',
    'number',
    'boolean',

    // 单字符
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',

    // 特殊字符
    '-',
    '_',
    '.',
    ',',
    ';',
    ':',
    '!',
    '?',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    '[',
    ']',
    '{',
    '}',
    '<',
    '>',
    '/',
    '\\',
    '|',
    '`',
    '~',
    '+',
    '=',
  ])

  /**
   * 验证图标名称是否有效
   * @param iconName 图标名称
   * @returns 是否有效
   */
  function isValidIconName(iconName: string): boolean {
    // 基本长度检查
    if (!iconName || iconName.length === 0 || iconName.length > 50) {
      return false
    }

    // 检查是否在无效列表中
    if (invalidIcons.has(iconName)) {
      return false
    }

    // 检查是否为纯数字
    if (/^\d+$/.test(iconName)) {
      return false
    }

    // 检查是否包含空白字符
    if (/\s/.test(iconName)) {
      return false
    }

    // 检查是否只包含有效字符（字母、数字、中划线、下划线、冒号）
    if (!/^[a-zA-Z0-9\-_:]+$/.test(iconName)) {
      return false
    }

    // 检查是否以字母开头（图标名通常以字母开头）
    if (!/^[a-zA-Z]/.test(iconName)) {
      return false
    }

    // 检查是否包含常见的图标前缀模式
    const commonIconPrefixes = ['i-', 'icon-', 'mdi-', 'fa-', 'ant-', 'el-']
    const hasValidPrefix = commonIconPrefixes.some(prefix => iconName.startsWith(prefix))

    // 如果没有常见前缀，检查是否是合理的图标名称（至少2个字符，包含字母）
    if (!hasValidPrefix && (iconName.length < 2 || !/[a-zA-Z]/.test(iconName))) {
      return false
    }

    return true
  }

  files.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')

      // 移除注释，避免从注释中提取图标名
      const cleanContent = content
        .replace(/\/\*[\s\S]*?\*\//g, '') // 移除块注释
        .replace(/\/\/.*$/gm, '') // 移除行注释

      iconPatterns.forEach(pattern => {
        let match
        // 重置正则表达式的 lastIndex
        pattern.lastIndex = 0

        while ((match = pattern.exec(cleanContent))) {
          const iconName = match[1]?.trim()

          if (iconName && isValidIconName(iconName)) {
            icons.add(iconName)
          }
        }
      })
    } catch (error) {
      console.warn(`Failed to read file: ${filePath}`, error)
    }
  })

  const result = Array.from(icons)

  // 开发环境下输出找到的图标，便于调试
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `[UnoCSS] Found ${result.length} valid icons:`,
      result.slice(0, 10),
      result.length > 10 ? '...' : ''
    )
  }

  return result
}

/**
 * 获取TypeScript文件列表
 */
function getTsFiles(dir: string): string[] {
  const files: string[] = []

  if (!fs.existsSync(dir)) {
    return files
  }

  function traverse(currentPath: string) {
    try {
      const items = fs.readdirSync(currentPath, { withFileTypes: true })

      items.forEach(item => {
        const fullPath = path.join(currentPath, item.name)

        if (item.isDirectory()) {
          traverse(fullPath)
        } else if (item.isFile() && (item.name.endsWith('.ts') || item.name.endsWith('.vue'))) {
          files.push(fullPath)
        }
      })
    } catch (error) {
      console.warn(`Failed to read directory: ${currentPath}`, error)
    }
  }

  traverse(dir)
  return files
}

/**
 * 生成自定义图标加载器
 */
export function getCustomCollections() {
  const customIcons = getCustomIcons()
  return Object.fromEntries(
    Object.keys(customIcons).map(folderName => [
      folderName,
      FileSystemIconLoader(`src/assets/icons/${folderName}`),
    ])
  )
}

/**
 * 获取动态安全列表
 */
export function getDynamicSafelist() {
  const customIcons = getCustomIcons()
  const routeMetaIcons = getRouteMetaIcons()

  return [
    // 功能色相关
    'color-primary100',
    'color-primary200',
    'color-primary300',
    'bg-primary100',
    'bg-primary200',
    'bg-primary300',
    'text-text100',
    'text-text200',
    'bg-bg100',
    'bg-bg200',
    'bg-bg300',
    'border-primary',
    'border-success',
    'border-warning',
    'border-error',
    'border-info',

    // 主题相关
    'text-theme',
    'bg-theme',
    'border-theme',
    'text-themeTextColor',
    'bg-themeTextColor',

    // 文字和背景
    'text-textColor',
    'text-textMutedColor',
    'bg-backgroundColor',
    'bg-backgroundHighlightColor',

    // 动态图标类
    ...Object.values(customIcons).flat(),
    ...routeMetaIcons,
  ]
}
