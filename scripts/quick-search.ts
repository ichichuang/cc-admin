#!/usr/bin/env -S npx tsx

/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 快速搜索脚本
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { spawn } from 'child_process'
import { existsSync, readFileSync } from 'fs'

interface SearchConfig {
  githubUsername: string
  repoName: string
  frameworkName: string
}

class QuickSearcher {
  private config: SearchConfig
  private githubToken: string | null = null

  constructor(config: SearchConfig) {
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
      // 快速测试Token有效性
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

  private async quickSearch(
    query: string,
    searchType: 'code' | 'repositories' = 'code'
  ): Promise<any[]> {
    try {
      const response = await this.executeCommand('curl', [
        '-s',
        '-H',
        `Authorization: token ${this.githubToken}`,
        '-H',
        'Accept: application/vnd.github.v3+json',
        `https://api.github.com/search/${searchType}?q=${encodeURIComponent(query)}&per_page=5`,
      ])

      const searchResult = JSON.parse(response)
      return searchResult.items || []
    } catch (error) {
      console.warn(`⚠️ 搜索 "${query}" 时出错:`, error)
      return []
    }
  }

  async run(): Promise<void> {
    console.log('🔍 cc-admin 快速搜索工具 (跨平台版)')
    console.log('=======================================')
    console.log(`搜索时间: ${new Date().toLocaleString('zh-CN')}`)
    console.log(`框架名称: ${this.config.frameworkName}`)
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
    console.log('🚀 开始快速搜索...\n')

    try {
      // 快速搜索关键词
      const searchQueries = [
        'cc-admin chichuang',
        'vue3 typescript vite unocss',
        'vue3 admin framework',
      ]

      let totalResults = 0

      for (const query of searchQueries) {
        console.log(`🔍 搜索: "${query}"`)

        const codeResults = await this.quickSearch(query, 'code')
        const repoResults = await this.quickSearch(query, 'repositories')

        // 过滤掉自己的仓库
        const filteredCodeResults = codeResults.filter(
          (item: any) =>
            item.repository?.full_name !== `${this.config.githubUsername}/${this.config.repoName}`
        )
        const filteredRepoResults = repoResults.filter(
          (item: any) => item.full_name !== `${this.config.githubUsername}/${this.config.repoName}`
        )

        if (filteredCodeResults.length > 0) {
          console.log(`📄 代码搜索结果 (${filteredCodeResults.length} 个):`)
          filteredCodeResults.forEach((item: any) => {
            console.log(`  - ${item.repository?.full_name}: ${item.path}`)
          })
          totalResults += filteredCodeResults.length
        }

        if (filteredRepoResults.length > 0) {
          console.log(`📦 仓库搜索结果 (${filteredRepoResults.length} 个):`)
          filteredRepoResults.forEach((item: any) => {
            console.log(`  - ${item.full_name}: ${item.description || 'No description'}`)
          })
          totalResults += filteredRepoResults.length
        }

        if (filteredCodeResults.length === 0 && filteredRepoResults.length === 0) {
          console.log('  ✅ 未发现相关结果')
        }

        console.log('')
      }

      console.log('✅ 快速搜索完成！')
      console.log(`📊 总共发现 ${totalResults} 个相关结果`)

      if (totalResults > 0) {
        console.log('')
        console.log('💡 建议:')
        console.log('- 如需详细分析，请运行: pnpm monitor')
        console.log('- 如需完整报告，请运行: pnpm monitor:full')
      }
    } catch (error) {
      console.error('❌ 搜索过程中出现错误:', error)
    }
  }
}

// 使用示例
const searcher = new QuickSearcher({
  githubUsername: 'ichichuang',
  repoName: 'cc-admin',
  frameworkName: 'cc-admin',
})

// ES 模块方式检查是否是主模块
if (import.meta.url === `file://${process.argv[1]}`) {
  searcher.run().catch(console.error)
}

export { QuickSearcher }
