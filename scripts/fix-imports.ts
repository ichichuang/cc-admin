/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description early-bird 企业级后台管理框架 - 修复导入路径脚本
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import { join } from 'path'

// 导入路径映射
const importMappings = {
  // 旧的路径 -> 新的路径
  '@/stores': '@cc/early-bird-core/stores',
  '@/router': '@cc/early-bird-core/router',
  '@/api': '@cc/early-bird-core/api',
  '@/utils': '@cc/early-bird-core/utils',
  '@/common': '@cc/early-bird-core/utils',
  '@/hooks': '@cc/early-bird-core/utils',
  '@/locales': '@cc/early-bird-core/utils',
  '@/stores/modules/color': '@cc/early-bird-core/stores/modules/color',
  '@/stores/modules/locale': '@cc/early-bird-core/stores/modules/locale',
  '@/stores/modules/layout': '@cc/early-bird-core/stores/modules/layout',
  '@/stores/modules/postcss': '@cc/early-bird-core/stores/modules/postcss',
  '@/api/modules/auth': '@cc/early-bird-core/api/modules/auth',
  '@/utils/remAdapter': '@cc/early-bird-core/utils/remAdapter',
  '@/utils/moduleLoader': '@cc/early-bird-core/utils/moduleLoader',
  '@/router/utils': '@cc/early-bird-core/router/utils',
  '@/hooks/layout/useLoading': '@cc/early-bird-core/utils',
  '@/components/layout/Loading': '@cc/early-bird-ui/components/layout/Loading',
}

// 需要处理的目录
const directories = ['apps/admin/src', 'packages/core', 'packages/ui']

// 需要处理的文件扩展名
const extensions = ['.ts', '.vue', '.tsx']

function processFile(filePath: string) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    let modified = false
    let newContent = content

    // 应用导入路径映射
    for (const [oldPath, newPath] of Object.entries(importMappings)) {
      const regex = new RegExp(
        `from\\s+['"]${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`,
        'g'
      )
      if (regex.test(newContent)) {
        newContent = newContent.replace(regex, `from '${newPath}'`)
        modified = true
      }
    }

    // 修复特定的导入问题
    // 修复 @/stores 的导入
    newContent = newContent.replace(
      /from\s+['"]@\/stores['"]/g,
      "from '@cc/early-bird-core/stores'"
    )

    // 修复 @/router 的导入
    newContent = newContent.replace(
      /from\s+['"]@\/router['"]/g,
      "from '@cc/early-bird-core/router'"
    )

    // 修复 @/api 的导入
    newContent = newContent.replace(/from\s+['"]@\/api['"]/g, "from '@cc/early-bird-core/api'")

    // 修复 @/utils 的导入
    newContent = newContent.replace(/from\s+['"]@\/utils['"]/g, "from '@cc/early-bird-core/utils'")

    // 修复 @/common 的导入
    newContent = newContent.replace(/from\s+['"]@\/common['"]/g, "from '@cc/early-bird-core/utils'")

    // 修复 @/hooks 的导入
    newContent = newContent.replace(/from\s+['"]@\/hooks['"]/g, "from '@cc/early-bird-core/utils'")

    // 修复 @/locales 的导入
    newContent = newContent.replace(
      /from\s+['"]@\/locales['"]/g,
      "from '@cc/early-bird-core/utils'"
    )

    if (modified) {
      writeFileSync(filePath, newContent, 'utf-8')
      console.log(`✅ 已修复: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ 处理文件失败: ${filePath}`, error)
  }
}

function processDirectory(dirPath: string) {
  try {
    const items = readdirSync(dirPath)

    for (const item of items) {
      const fullPath = join(dirPath, item)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        // 跳过 node_modules 和 .git 目录
        if (item !== 'node_modules' && item !== '.git') {
          processDirectory(fullPath)
        }
      } else if (stat.isFile()) {
        const ext = item.split('.').pop()
        if (extensions.includes(`.${ext}`)) {
          processFile(fullPath)
        }
      }
    }
  } catch (error) {
    console.error(`❌ 处理目录失败: ${dirPath}`, error)
  }
}

// 主函数
function main() {
  console.log('🔧 开始修复导入路径...')

  for (const directory of directories) {
    console.log(`📁 处理目录: ${directory}`)
    processDirectory(directory)
  }

  console.log('✅ 导入路径修复完成!')
}

main()
