/**
 * @copyright Copyright (c) 2025 chichuang
 * @license 自定义商业限制许可证
 * @description CC-Admin 版权保护脚本 v2.1
 * 本文件受版权保护，商业使用需要授权。
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 修复 ES 模块问题
const filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(filename)

interface CopyrightConfig {
  author: string
  year: string
  license: string
  project: string
  commercialContact: string
}

const COPYRIGHT_CONFIG: CopyrightConfig = {
  author: 'chichuang',
  year: '2025',
  license: '自定义商业限制许可证',
  project: 'CC-Admin 企业级后台管理框架',
  commercialContact: 'https://github.com/ichichuang/CC-Admin/issues',
}

// 增强的排除规则
const EXCLUDE_PATTERNS = [
  // 依赖目录
  /node_modules/,
  /\.git/,
  /\.hg/,
  /\.svn/,

  // 构建输出目录
  /dist/,
  /build/,
  /out/,
  /\.vite/,
  /\.nuxt/,
  /\.next/,
  /\.svelte-kit/,

  // 缓存目录
  /\.cache/,
  /\.temp/,
  /\.tmp/,
  /\.nyc_output/,
  /coverage/,

  // 系统文件
  /\.DS_Store/,
  /Thumbs\.db/,
  /desktop\.ini/,

  // 编辑器文件
  /\.vscode/,
  /\.idea/,
  /\.vs/,
  /\.swp/,
  /\.swo/,
  /\.sublime-/,

  // 日志文件
  /\.log/,
  /logs/,

  // 临时文件
  /\.bak/,
  /\.backup/,
  /\.old/,
  /\.orig/,

  // 压缩文件
  /\.zip/,
  /\.tar/,
  /\.gz/,
  /\.rar/,
  /\.7z/,

  // 二进制文件
  /\.exe/,
  /\.dll/,
  /\.so/,
  /\.dylib/,
  /\.bin/,
  /\.dat/,

  // 图片和媒体文件
  /\.png/,
  /\.jpg/,
  /\.jpeg/,
  /\.gif/,
  /\.bmp/,
  /\.svg/,
  /\.ico/,
  /\.mp3/,
  /\.mp4/,
  /\.avi/,
  /\.mov/,

  // 字体文件
  /\.ttf/,
  /\.otf/,
  /\.woff/,
  /\.woff2/,
  /\.eot/,

  // 其他不需要处理的文件
  /\.lock/,
  /\.pid/,
  /\.socket/,
  /\.fifo/,
]

// 完全跳过的目录（不进入遍历）
const SKIP_DIRECTORIES = [
  'node_modules',
  '.git',
  '.hg',
  '.svn',
  'dist',
  'build',
  'out',
  '.vite',
  '.nuxt',
  '.next',
  '.svelte-kit',
  '.cache',
  '.temp',
  '.tmp',
  '.nyc_output',
  'coverage',
  '.vscode',
  '.idea',
  '.vs',
  'logs',
]

// 支持的文件类型及其注释格式
const FILE_TYPES = {
  script: {
    extensions: ['.ts', '.js', '.mjs', '.cjs'],
    template: (config: CopyrightConfig, description: string) => `/**
 * @copyright Copyright (c) ${config.year} ${config.author}
 * @license ${config.license}
 * @description ${config.project} - ${description}
 *
 * 本文件受版权保护，商业使用需要授权。
 * 联系方式: ${config.commercialContact}
 *
 * This file is protected by copyright. Commercial use requires authorization.
 * Contact: ${config.commercialContact}
 */`,
  },
  vue: {
    extensions: ['.vue'],
    template: (config: CopyrightConfig, description: string) => `<!--
  @copyright Copyright (c) ${config.year} ${config.author}
  @license ${config.license}
  @description ${config.project} - ${description}

  本文件受版权保护，商业使用需要授权。
  联系方式: ${config.commercialContact}

  This file is protected by copyright. Commercial use requires authorization.
  Contact: ${config.commercialContact}
-->`,
  },
  style: {
    extensions: ['.css', '.scss', '.sass', '.less'],
    template: (config: CopyrightConfig, description: string) => `/**
 * @copyright Copyright (c) ${config.year} ${config.author}
 * @license ${config.license}
 * @description ${config.project} - ${description}
 *
 * 本文件受版权保护，商业使用需要授权。
 * This file is protected by copyright. Commercial use requires authorization.
 */`,
  },
  markdown: {
    extensions: ['.md', '.markdown'],
    template: (config: CopyrightConfig, description: string) => `<!--
  @copyright Copyright (c) ${config.year} ${config.author}
  @license ${config.license}
  @description ${config.project} - ${description}

  本文件受版权保护，商业使用需要授权。
  联系方式: ${config.commercialContact}

  This file is protected by copyright. Commercial use requires authorization.
  Contact: ${config.commercialContact}
-->`,
  },
}

class CopyrightProtector {
  private config: CopyrightConfig
  private processedCount = 0
  private skippedCount = 0
  private errorCount = 0
  private isCheckMode = false
  private silentMode = false

  constructor(config: CopyrightConfig, checkMode = false, silentMode = false) {
    this.config = config
    this.isCheckMode = checkMode
    this.silentMode = silentMode
  }

  // 检查目录是否应该被完全跳过
  shouldSkipDirectory(dirName: string): boolean {
    return SKIP_DIRECTORIES.includes(dirName)
  }

  // 检查文件是否应该被处理
  shouldProcess(filePath: string): boolean {
    const relativePath = path.relative(process.cwd(), filePath)

    // 检查排除模式
    if (EXCLUDE_PATTERNS.some(pattern => pattern.test(relativePath))) {
      return false
    }

    // 检查文件扩展名
    const ext = path.extname(filePath)
    const allExtensions = Object.values(FILE_TYPES).flatMap(type => type.extensions)

    return allExtensions.includes(ext)
  }

  // 获取版权模板
  getCopyrightTemplate(filePath: string, description: string): string | null {
    const ext = path.extname(filePath)

    for (const [, typeConfig] of Object.entries(FILE_TYPES)) {
      if (typeConfig.extensions.includes(ext)) {
        return typeConfig.template(this.config, description)
      }
    }

    return null
  }

  // 检查文件是否已有版权注释
  hasCopyright(content: string): boolean {
    const patterns = [
      new RegExp(`@copyright Copyright \\(c\\) ${this.config.year} ${this.config.author}`),
      new RegExp(`Copyright \\(c\\) ${this.config.year} ${this.config.author}`),
      /商业使用需要授权/,
      /Commercial use requires authorization/,
    ]

    return patterns.some(pattern => pattern.test(content))
  }

  // 为单个文件添加版权注释
  processFile(filePath: string): boolean {
    try {
      if (!fs.existsSync(filePath)) {
        return false
      }

      const content = fs.readFileSync(filePath, 'utf-8')

      if (this.hasCopyright(content)) {
        this.skippedCount++
        return true
      }

      if (this.isCheckMode) {
        console.log(`❌ ${filePath} - 缺少版权注释`)
        this.errorCount++
        return false
      }

      const description = this.generateDescription(filePath)
      const template = this.getCopyrightTemplate(filePath, description)

      if (!template) {
        this.skippedCount++
        return false
      }

      const newContent = template + '\n\n' + content
      fs.writeFileSync(filePath, newContent, 'utf-8')

      console.log(`✅ ${filePath} - 版权注释已添加`)
      this.processedCount++
      return true
    } catch (error) {
      console.error(`❌ ${filePath} - 处理失败:`, error)
      this.errorCount++
      return false
    }
  }

  // 生成文件描述
  generateDescription(filePath: string): string {
    const relativePath = path.relative(process.cwd(), filePath)
    const segments = relativePath.split(path.sep)

    // 特殊文件描述映射
    const specialDescriptions = new Map<string, string>([
      ['src/main.ts', '应用程序入口'],
      ['src/App.vue', '根组件'],
      ['vite.config.ts', 'Vite 构建配置'],
      ['uno.config.ts', 'UnoCSS 配置'],
      ['eslint.config.ts', 'ESLint 配置'],
      ['package.json', '项目配置'],
      ['tsconfig.json', 'TypeScript 配置'],
      ['LICENSE', '许可证文件'],
      ['README.md', '项目说明文档'],
    ])

    if (specialDescriptions.has(relativePath)) {
      return specialDescriptions.get(relativePath)!
    }

    // 根据目录结构生成描述
    if (segments.includes('utils')) {
      return '工具函数'
    }
    if (segments.includes('components')) {
      return '组件'
    }
    if (segments.includes('views')) {
      return '页面'
    }
    if (segments.includes('stores')) {
      return '状态管理'
    }
    if (segments.includes('api')) {
      return 'API 接口'
    }
    if (segments.includes('types')) {
      return '类型定义'
    }
    if (segments.includes('hooks')) {
      return '组合式函数'
    }
    if (segments.includes('styles')) {
      return '样式文件'
    }
    if (segments.includes('scripts')) {
      return '构建脚本'
    }
    if (segments.includes('docs')) {
      return '文档'
    }
    if (segments.includes('layouts')) {
      return '布局组件'
    }
    if (segments.includes('locales')) {
      return '国际化'
    }
    if (segments.includes('mock')) {
      return '模拟数据'
    }
    if (segments.includes('router')) {
      return '路由管理'
    }

    return path.basename(filePath, path.extname(filePath))
  }

  // 改进的目录遍历
  walkDirectory(dir: string, callback: (filePath: string) => void): void {
    try {
      if (!fs.existsSync(dir)) {
        return
      }

      const stat = fs.statSync(dir)
      if (!stat.isDirectory()) {
        return
      }

      const files = fs.readdirSync(dir)

      for (const file of files) {
        const filePath = path.join(dir, file)

        try {
          const fileStat = fs.statSync(filePath)

          // 跳过符号链接
          if (fileStat.isSymbolicLink()) {
            continue
          }

          if (fileStat.isDirectory()) {
            // 检查是否应该跳过整个目录
            if (this.shouldSkipDirectory(file)) {
              continue
            }

            // 递归遍历子目录
            this.walkDirectory(filePath, callback)
          } else if (fileStat.isFile()) {
            callback(filePath)
          }
        } catch (_error) {
          // 静默处理权限错误等常见问题
          if (!this.silentMode) {
            console.warn(`⚠️  无法访问: ${filePath}`)
          }
          continue
        }
      }
    } catch (_error) {
      if (!this.silentMode) {
        console.warn(`⚠️  无法读取目录: ${dir}`)
      }
    }
  }

  // 执行版权保护
  protect(): void {
    console.log('🔒 开始版权保护处理...')
    console.log(`📁 处理目录: ${process.cwd()}`)
    console.log(`👤 版权所有者: ${this.config.author}`)
    console.log(`📄 许可证: ${this.config.license}`)
    console.log(`🔍 模式: ${this.isCheckMode ? '检查模式' : '添加模式'}`)
    if (this.silentMode) {
      console.log(`🔇 静默模式: 已启用`)
    }

    this.walkDirectory(process.cwd(), filePath => {
      if (this.shouldProcess(filePath)) {
        this.processFile(filePath)
      }
    })

    this.printSummary()
  }

  // 打印处理结果
  printSummary(): void {
    // console.log(`✅ 处理成功: ${this.processedCount} 个文件`)
    // console.log(`⏭️ 跳过文件: ${this.skippedCount} 个文件`)
    // console.log(`❌ 处理失败: ${this.errorCount} 个文件`)
    console.log('✅ \x1b[32m项目版权保护检查完成，一切正常\x1b[0m')

    if (this.errorCount > 0) {
      console.log('⚠️  存在处理失败的文件，请检查上方的错误信息')
      process.exit(1)
    }
  }
}

// 主函数
export function main(): void {
  const isCheckMode = process.argv.includes('--check')
  const silentMode = process.argv.includes('--silent')
  const protector = new CopyrightProtector(COPYRIGHT_CONFIG, isCheckMode, silentMode)
  protector.protect()
}

// 命令行执行
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
