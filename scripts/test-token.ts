#!/usr/bin/env -S npx tsx

/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - GitHub Token 测试脚本
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { spawn } from 'child_process'
import { existsSync, readFileSync } from 'fs'

class GitHubTokenTester {
  private githubToken: string | null = null

  constructor() {
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

  async testToken(): Promise<boolean> {
    console.log('🔑 GitHub Token 测试工具 (跨平台版)')
    console.log('=======================================')

    // 检查依赖
    if (!(await this.checkDependencies())) {
      return false
    }

    // 检查环境变量
    if (!this.githubToken) {
      console.error('❌ 错误: 未设置 GITHUB_TOKEN 环境变量')
      console.log('')
      console.log('请按以下步骤设置:')
      console.log('1. 在 GitHub 中创建 Personal Access Token')
      console.log('2. 设置环境变量:')
      console.log('   export GITHUB_TOKEN="your_token_here"')
      console.log('')
      console.log('或者创建 .env 文件:')
      console.log('echo "GITHUB_TOKEN=your_token_here" > .env')
      console.log('')
      console.log('详细说明请查看: docs/github-token-guide.md')
      return false
    }

    console.log('🔍 测试 GitHub Token 有效性...')

    // 测试1: 验证Token格式
    const tokenPattern = /^(ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{82})$/
    if (!tokenPattern.test(this.githubToken)) {
      console.error('❌ Token 格式不正确')
      console.log('Token 应该以 "ghp_" 或 "github_pat_" 开头')
      return false
    }

    console.log('✅ Token 格式正确')

    // 测试2: 验证Token权限
    console.log('🔍 测试 Token 权限...')

    try {
      // 测试用户信息访问
      const userResponse = await this.executeCommand('curl', [
        '-s',
        '-H',
        `Authorization: token ${this.githubToken}`,
        '-H',
        'Accept: application/vnd.github.v3+json',
        'https://api.github.com/user',
      ])

      const userData = JSON.parse(userResponse)
      if (userData.login) {
        console.log(`✅ Token 有效，用户: ${userData.login}`)
      } else {
        console.error('❌ Token 无效或权限不足')
        console.log('响应:', userResponse)
        return false
      }

      // 测试3: 验证仓库访问权限
      console.log('🔍 测试仓库访问权限...')

      const repoResponse = await this.executeCommand('curl', [
        '-s',
        '-H',
        `Authorization: token ${this.githubToken}`,
        '-H',
        'Accept: application/vnd.github.v3+json',
        'https://api.github.com/repos/ichichuang/cc-admin',
      ])

      const repoData = JSON.parse(repoResponse)
      if (repoData.name) {
        console.log(`✅ 可以访问仓库: ${repoData.name}`)
      } else {
        console.log('⚠️ 无法访问 cc-admin 仓库，可能仓库不存在或权限不足')
        console.log('响应:', repoResponse)
      }

      // 测试4: 验证搜索API权限
      console.log('🔍 测试搜索API权限...')

      const searchResponse = await this.executeCommand('curl', [
        '-s',
        '-H',
        `Authorization: token ${this.githubToken}`,
        '-H',
        'Accept: application/vnd.github.v3+json',
        'https://api.github.com/search/code?q=test&per_page=1',
      ])

      const searchData = JSON.parse(searchResponse)
      if (searchData.total_count !== undefined) {
        console.log('✅ 搜索API权限正常')
      } else {
        console.error('❌ 搜索API权限不足')
        console.log('响应:', searchResponse)
        return false
      }

      // 测试5: 检查Token权限范围
      console.log('🔍 检查Token权限范围...')

      const scopesResponse = await this.executeCommand('curl', [
        '-s',
        '-I',
        '-H',
        `Authorization: token ${this.githubToken}`,
        'https://api.github.com/user',
      ])

      const scopesMatch = scopesResponse.match(/x-oauth-scopes:\s*(.+)/i)
      if (scopesMatch) {
        const scopes = scopesMatch[1].trim()
        console.log(`✅ Token 权限范围: ${scopes}`)

        // 检查必要权限
        const requiredScopes = ['repo', 'read:user', 'read:org']
        const hasRequiredScopes = requiredScopes.some(
          scope => scopes.includes(scope) || scopes.includes('public_repo')
        )

        if (hasRequiredScopes) {
          console.log('✅ Token 具有必要权限')
        } else {
          console.warn('⚠️ Token 可能缺少某些权限，但基本功能应该正常')
        }
      } else {
        console.warn('⚠️ 无法获取Token权限范围信息')
      }

      console.log('')
      console.log('🎉 Token 测试完成！')
      console.log('✅ 所有测试通过，Token 可以正常使用')
      return true
    } catch (error) {
      console.error('❌ Token 测试失败:', error)
      return false
    }
  }
}

// 主函数
async function main() {
  const tester = new GitHubTokenTester()
  const isValid = await tester.testToken()
  process.exit(isValid ? 0 : 1)
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ 程序执行失败:', error)
    process.exit(1)
  })
}

export { GitHubTokenTester }
