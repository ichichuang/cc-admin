/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 构建脚本
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { spawn } from 'child_process'

console.log('🚀 启动 cc-admin 开发环境...')
console.log('📝 启动命名规范监听...')

// 启动 Vite 开发服务器
const viteProcess = spawn('pnpm', ['exec', 'vite'], {
  stdio: 'inherit',
  shell: true,
})

// 启动命名规范监听
const namingWatchProcess = spawn('pnpm', ['naming-watch'], {
  stdio: 'inherit',
  shell: true,
})

// 处理进程退出
process.on('SIGINT', () => {
  console.log('\n🛑 正在停止开发环境...')
  viteProcess.kill('SIGINT')
  namingWatchProcess.kill('SIGINT')
  process.exit(0)
})

// 处理子进程退出
viteProcess.on('exit', code => {
  console.log(`\n📝 Vite 开发服务器已退出 (代码: ${code})`)
  namingWatchProcess.kill('SIGINT')
  process.exit(code || 0)
})

namingWatchProcess.on('exit', code => {
  console.log(`\n🔍 命名规范监听已退出 (代码: ${code})`)
  viteProcess.kill('SIGINT')
  process.exit(code || 0)
})
