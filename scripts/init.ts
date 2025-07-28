/**
 * @copyright Copyright (c) 2025 chichuang
 * @license 自定义商业限制许可证
 * @description CC-Admin 企业级后台管理框架 - 初始化脚本
 * 本文件受版权保护，商业使用需要授权。
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

// 修复 ES 模块问题
const filename = fileURLToPath(import.meta.url)
const _dirname = join(filename, '..')
const projectRoot = join(_dirname, '..')

/* -------------------- 彩色输出 -------------------- */
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
}

const log = (msg: string, color: keyof typeof colors = 'reset'): void => {
  console.log(`${colors[color]}${msg}${colors.reset}`)
}

/* -------------------- 初始化步骤配置 -------------------- */
interface InitStep {
  name: string
  command: string
  description: string
  required: boolean
  skipIfFailed: boolean
}

const INIT_STEPS: InitStep[] = [
  {
    name: '版权保护',
    command: 'pnpm copyright:add',
    description: '为所有源代码文件添加版权声明',
    required: true,
    skipIfFailed: false,
  },
  {
    name: '环境检查',
    command: 'pnpm env-check',
    description: '检查环境变量配置是否正确',
    required: true,
    skipIfFailed: false,
  },
  {
    name: '命名规范检查',
    command: 'pnpm naming-check',
    description: '检查项目命名规范是否符合要求',
    required: true,
    skipIfFailed: false,
  },
  {
    name: '代码格式检查',
    command: 'pnpm lint',
    description: '检查并修复代码格式问题',
    required: false,
    skipIfFailed: true,
  },
  {
    name: '类型检查',
    command: 'pnpm type-check',
    description: '检查 TypeScript 类型定义',
    required: false,
    skipIfFailed: true,
  },
  {
    name: '依赖安装',
    command: 'pnpm install',
    description: '安装项目依赖包',
    required: true,
    skipIfFailed: false,
  },
  {
    name: 'Git Hooks 设置',
    command: 'pnpm prepare',
    description: '设置 Git Hooks（husky）',
    required: false,
    skipIfFailed: true,
  },
]

/* -------------------- 执行函数 -------------------- */

/**
 * 执行单个初始化步骤
 */
function executeStep(step: InitStep): boolean {
  log(`\n🔄 正在执行: ${step.name}`, 'cyan')
  log(`📝 描述: ${step.description}`, 'blue')

  try {
    log(`⚡ 执行命令: ${step.command}`, 'yellow')
    execSync(step.command, {
      stdio: 'inherit',
      cwd: projectRoot,
      encoding: 'utf-8',
    })
    log(`✅ ${step.name} 执行成功`, 'green')
    return true
  } catch (error) {
    log(`❌ ${step.name} 执行失败`, 'red')
    if (error instanceof Error) {
      log(`错误信息: ${error.message}`, 'red')
    }

    if (step.required && !step.skipIfFailed) {
      log(`⚠️  ${step.name} 是必需步骤，初始化终止`, 'yellow')
      return false
    } else {
      log(`⚠️  ${step.name} 执行失败，但将继续执行后续步骤`, 'yellow')
      return true
    }
  }
}

/**
 * 检查项目环境
 */
function checkProjectEnvironment(): boolean {
  log('\n🔍 检查项目环境...', 'cyan')

  // 检查 package.json
  if (!existsSync(join(projectRoot, 'package.json'))) {
    log('❌ 未找到 package.json 文件', 'red')
    return false
  }

  // 检查 pnpm-lock.yaml
  if (!existsSync(join(projectRoot, 'pnpm-lock.yaml'))) {
    log('⚠️  未找到 pnpm-lock.yaml 文件，可能需要安装依赖', 'yellow')
  }

  // 检查 .env 文件
  const envFiles = ['.env', '.env.local', '.env.development', '.env.production']
  const foundEnvFiles = envFiles.filter(file => existsSync(join(projectRoot, file)))

  if (foundEnvFiles.length === 0) {
    log('⚠️  未找到环境变量文件，建议创建 .env 文件', 'yellow')
  } else {
    log(`✅ 找到环境变量文件: ${foundEnvFiles.join(', ')}`, 'green')
  }

  log('✅ 项目环境检查完成', 'green')
  return true
}

/**
 * 显示初始化总结
 */
function showSummary(successSteps: string[], failedSteps: string[]): void {
  log('\n📊 初始化总结', 'cyan')
  log('='.repeat(50), 'cyan')

  if (successSteps.length > 0) {
    log('\n✅ 成功执行的步骤:', 'green')
    successSteps.forEach((step, index) => {
      log(`  ${index + 1}. ${step}`, 'green')
    })
  }

  if (failedSteps.length > 0) {
    log('\n❌ 失败的步骤:', 'red')
    failedSteps.forEach((step, index) => {
      log(`  ${index + 1}. ${step}`, 'red')
    })
  }

  log('\n📋 后续建议:', 'cyan')
  log('1. 运行 pnpm dev 启动开发服务器', 'blue')
  log('2. 运行 pnpm check 进行完整检查', 'blue')
  log('3. 查看 docs/ 目录了解项目文档', 'blue')
  log('4. 运行 pnpm monitor:setup 设置监控', 'blue')

  if (failedSteps.length === 0) {
    log('\n🎉 初始化完成！项目已准备就绪', 'green')
  } else {
    log('\n⚠️  初始化部分完成，请检查失败的步骤', 'yellow')
  }
}

/**
 * 主函数
 */
function main(): void {
  log('🚀 CC-Admin 项目初始化脚本', 'magenta')
  log('='.repeat(50), 'magenta')

  // 检查项目环境
  if (!checkProjectEnvironment()) {
    log('❌ 项目环境检查失败，初始化终止', 'red')
    process.exit(1)
  }

  const successSteps: string[] = []
  const failedSteps: string[] = []

  // 执行初始化步骤
  for (const step of INIT_STEPS) {
    const success = executeStep(step)
    if (success) {
      successSteps.push(step.name)
    } else {
      failedSteps.push(step.name)
      if (step.required && !step.skipIfFailed) {
        break
      }
    }
  }

  // 显示总结
  showSummary(successSteps, failedSteps)

  // 根据结果设置退出码
  if (failedSteps.length > 0) {
    process.exit(1)
  }
}

// 执行主函数
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { main }
