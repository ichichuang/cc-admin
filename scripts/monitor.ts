#!/usr/bin/env -S npx tsx

/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 跨平台监控脚本
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { spawn } from 'child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const _filename = fileURLToPath(import.meta.url)
const _dirname = dirname(_filename)

interface MonitorConfig {
  githubUsername: string
  repoName: string
  frameworkName: string
  outputDir: string
}

interface MonitorResult {
  copyrightViolations: string[]
  structureSimilarities: string[]
  techstackMatches: string[]
  timestamp: string
}

class CrossPlatformMonitor {
  private config: MonitorConfig
  private githubToken: string | null = null
  private result: MonitorResult = {
    copyrightViolations: [],
    structureSimilarities: [],
    techstackMatches: [],
    timestamp: new Date().toISOString(),
  }

  constructor(config: MonitorConfig) {
    this.config = config
    this.loadEnvironment()
  }

  private loadEnvironment(): void {
    // 从 .env 文件加载环境变量
    if (existsSync('.env')) {
      const envContent = readFileSync('.env', 'utf-8')
      const tokenMatch = envContent.match(/GITHUB_TOKEN=([^\n]+)/)
      if (tokenMatch) {
        this.githubToken = tokenMatch[1]
      }
    }

    // 从环境变量加载
    if (!this.githubToken) {
      this.githubToken = process.env.GITHUB_TOKEN || null
    }
  }

  private async checkDependencies(): Promise<boolean> {
    const requiredTools = ['curl', 'jq']
    const missingTools: string[] = []

    for (const tool of requiredTools) {
      try {
        await this.executeCommand(tool, ['--version'])
      } catch {
        missingTools.push(tool)
      }
    }

    if (missingTools.length > 0) {
      console.error(`❌ 缺少必要工具: ${missingTools.join(', ')}`)
      console.log('请安装缺少的工具后重试')
      return false
    }

    return true
  }

  private async executeCommand(command: string, args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, { stdio: 'pipe' })
      let stdout = ''
      let stderr = ''

      process.stdout?.on('data', data => {
        stdout += data.toString()
      })

      process.stderr?.on('data', data => {
        stderr += data.toString()
      })

      process.on('close', code => {
        if (code === 0) {
          resolve(stdout)
        } else {
          reject(new Error(`Command failed: ${stderr}`))
        }
      })
    })
  }

  private async checkGitHubToken(): Promise<boolean> {
    if (!this.githubToken) {
      console.error('❌ 错误: 未设置 GITHUB_TOKEN 环境变量')
      console.log('请设置 GitHub Token 或创建 .env 文件')
      return false
    }

    // 验证Token格式
    const tokenPattern = /^(ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{82})$/
    if (!tokenPattern.test(this.githubToken)) {
      console.error('❌ Token 格式不正确')
      console.log('Token 应该以 "ghp_" 或 "github_pat_" 开头')
      return false
    }

    try {
      // 测试Token有效性
      const response = await this.executeCommand('curl', [
        '-s',
        '-H',
        `Authorization: token ${this.githubToken}`,
        '-H',
        'Accept: application/vnd.github.v3+json',
        'https://api.github.com/user',
      ])

      const userData = JSON.parse(response)
      if (userData.login) {
        console.log(`✅ Token 有效，用户: ${userData.login}`)
        return true
      } else {
        console.error('❌ Token 无效或权限不足')
        return false
      }
    } catch (error) {
      console.error('❌ Token 验证失败:', error)
      return false
    }
  }

  private async searchCopyrightViolations(): Promise<void> {
    console.log('🔍 搜索版权违规...')

    const searchQueries = [
      'cc-admin chichuang',
      'cc-admin framework',
      'chichuang admin',
      'cc-admin enterprise',
    ]

    for (const query of searchQueries) {
      try {
        const response = await this.executeCommand('curl', [
          '-s',
          '-H',
          `Authorization: token ${this.githubToken}`,
          '-H',
          'Accept: application/vnd.github.v3+json',
          `https://api.github.com/search/code?q=${encodeURIComponent(query)}&per_page=10`,
        ])

        const searchResult = JSON.parse(response)
        if (searchResult.items && searchResult.items.length > 0) {
          for (const item of searchResult.items) {
            // 排除自己的仓库
            if (
              item.repository.full_name !== `${this.config.githubUsername}/${this.config.repoName}`
            ) {
              this.result.copyrightViolations.push(`${item.repository.full_name}: ${item.path}`)
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️ 搜索 "${query}" 时出错:`, error)
      }
    }
  }

  private async searchStructureSimilarities(): Promise<void> {
    console.log('🔍 搜索结构相似性...')

    const structurePatterns = [
      'src/stores/modules',
      'src/api/modules',
      'src/router/modules',
      'src/hooks/modules',
      'src/common/modules',
    ]

    for (const pattern of structurePatterns) {
      try {
        const response = await this.executeCommand('curl', [
          '-s',
          '-H',
          `Authorization: token ${this.githubToken}`,
          '-H',
          'Accept: application/vnd.github.v3+json',
          `https://api.github.com/search/code?q=${encodeURIComponent(pattern)}&per_page=10`,
        ])

        const searchResult = JSON.parse(response)
        if (searchResult.items && searchResult.items.length > 0) {
          for (const item of searchResult.items) {
            if (
              item.repository.full_name !== `${this.config.githubUsername}/${this.config.repoName}`
            ) {
              this.result.structureSimilarities.push(`${item.repository.full_name}: ${item.path}`)
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️ 搜索结构 "${pattern}" 时出错:`, error)
      }
    }
  }

  private async searchTechstackMatches(): Promise<void> {
    console.log('🔍 搜索技术栈匹配...')

    const techstackQueries = [
      'vue3 typescript vite unocss',
      'vue3 pinia alova',
      'vue3 admin framework',
      'vue3 typescript admin',
    ]

    for (const query of techstackQueries) {
      try {
        const response = await this.executeCommand('curl', [
          '-s',
          '-H',
          `Authorization: token ${this.githubToken}`,
          '-H',
          'Accept: application/vnd.github.v3+json',
          `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=10`,
        ])

        const searchResult = JSON.parse(response)
        if (searchResult.items && searchResult.items.length > 0) {
          for (const item of searchResult.items) {
            if (item.full_name !== `${this.config.githubUsername}/${this.config.repoName}`) {
              this.result.techstackMatches.push(
                `${item.full_name}: ${item.description || 'No description'}`
              )
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️ 搜索技术栈 "${query}" 时出错:`, error)
      }
    }
  }

  private generateReport(): void {
    console.log('📊 生成监控报告...')

    // 创建输出目录
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const outputDir = join(this.config.outputDir, timestamp)
    mkdirSync(outputDir, { recursive: true })

    // 生成版权违规报告
    if (this.result.copyrightViolations.length > 0) {
      const copyrightFile = join(outputDir, 'copyright_violations.txt')
      const copyrightContent = this.result.copyrightViolations.join('\n')
      writeFileSync(copyrightFile, copyrightContent, 'utf-8')
      console.log(`📄 版权违规报告: ${copyrightFile}`)
    }

    // 生成结构相似性报告
    if (this.result.structureSimilarities.length > 0) {
      const structureFile = join(outputDir, 'structure_similarities.txt')
      const structureContent = this.result.structureSimilarities.join('\n')
      writeFileSync(structureFile, structureContent, 'utf-8')
      console.log(`📄 结构相似性报告: ${structureFile}`)
    }

    // 生成技术栈匹配报告
    if (this.result.techstackMatches.length > 0) {
      const techstackFile = join(outputDir, 'techstack_matches.txt')
      const techstackContent = this.result.techstackMatches.join('\n')
      writeFileSync(techstackFile, techstackContent, 'utf-8')
      console.log(`📄 技术栈匹配报告: ${techstackFile}`)
    }

    // 生成综合报告
    const reportFile = join(outputDir, 'cc_admin_monitor_report.md')
    const reportContent = this.generateMarkdownReport()
    writeFileSync(reportFile, reportContent, 'utf-8')
    console.log(`📄 综合监控报告: ${reportFile}`)
  }

  private generateMarkdownReport(): string {
    const { copyrightViolations, structureSimilarities, techstackMatches } = this.result

    return `# cc-admin 框架监控报告

## 📊 监控概览

- **监控时间**: ${new Date().toLocaleString('zh-CN')}
- **框架名称**: ${this.config.frameworkName}
- **GitHub用户**: ${this.config.githubUsername}
- **仓库名称**: ${this.config.repoName}

## 🔍 监控结果

### 版权违规检测
- **发现数量**: ${copyrightViolations.length} 个
- **详情**: ${copyrightViolations.length > 0 ? '见 copyright_violations.txt' : '无违规发现'}

### 结构相似性检测
- **发现数量**: ${structureSimilarities.length} 个
- **详情**: ${structureSimilarities.length > 0 ? '见 structure_similarities.txt' : '无相似结构发现'}

### 技术栈匹配检测
- **发现数量**: ${techstackMatches.length} 个
- **详情**: ${techstackMatches.length > 0 ? '见 techstack_matches.txt' : '无技术栈匹配发现'}

## 📈 统计摘要

| 检测类型 | 发现数量 | 状态 |
|---------|---------|------|
| 版权违规 | ${copyrightViolations.length} | ${copyrightViolations.length > 0 ? '⚠️ 需要关注' : '✅ 正常'} |
| 结构相似 | ${structureSimilarities.length} | ${structureSimilarities.length > 0 ? '⚠️ 需要关注' : '✅ 正常'} |
| 技术栈匹配 | ${techstackMatches.length} | ${techstackMatches.length > 0 ? '⚠️ 需要关注' : '✅ 正常'} |

## 🔧 建议行动

${copyrightViolations.length > 0 ? '- 检查版权违规情况，必要时采取法律行动' : ''}
${structureSimilarities.length > 0 ? '- 分析结构相似性，评估创新性' : ''}
${techstackMatches.length > 0 ? '- 关注技术栈匹配项目，了解竞争情况' : ''}

---
*报告生成时间: ${new Date().toLocaleString('zh-CN')}*
*监控系统: cc-admin 跨平台监控脚本*
`
  }

  async run(): Promise<void> {
    console.log('🛡️ cc-admin 框架代码监控系统 (跨平台版)')
    console.log('=======================================')
    console.log(`监控时间: ${new Date().toLocaleString('zh-CN')}`)
    console.log(`框架名称: ${this.config.frameworkName}`)
    console.log(`GitHub用户: ${this.config.githubUsername}`)
    console.log(`仓库名称: ${this.config.repoName}`)
    console.log('=======================================')

    // 检查依赖
    if (!(await this.checkDependencies())) {
      return
    }

    // 检查 GitHub Token
    if (!(await this.checkGitHubToken())) {
      return
    }

    console.log('✅ 环境检查通过')
    console.log('🚀 开始监控...\n')

    try {
      // 执行监控任务
      await this.searchCopyrightViolations()
      await this.searchStructureSimilarities()
      await this.searchTechstackMatches()

      // 生成报告
      this.generateReport()

      console.log('\n✅ 监控完成！')
      console.log(`📊 发现 ${this.result.copyrightViolations.length} 个版权违规`)
      console.log(`📊 发现 ${this.result.structureSimilarities.length} 个结构相似`)
      console.log(`📊 发现 ${this.result.techstackMatches.length} 个技术栈匹配`)
    } catch (error) {
      console.error('❌ 监控过程中出现错误:', error)
    }
  }
}

// 解析命令行参数
const args = process.argv.slice(2)
const _isQuickMode = args.includes('--quick')
const isTestToken = args.includes('--test-token')

// 使用示例
const monitor = new CrossPlatformMonitor({
  githubUsername: 'ichichuang',
  repoName: 'cc-admin',
  frameworkName: 'cc-admin',
  outputDir: 'monitor_reports',
})

if (require.main === module) {
  if (isTestToken) {
    // 仅测试 Token
    monitor['checkGitHubToken']().then(isValid => {
      process.exit(isValid ? 0 : 1)
    })
  } else {
    // 运行完整监控
    monitor.run().catch(console.error)
  }
}

export { CrossPlatformMonitor }
