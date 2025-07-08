#!/usr/bin/env node

/* eslint-disable */

const fs = require('fs')

/**
 * 环境变量配置检查脚本
 *
 * 此脚本用于检查环境变量配置文件的一致性：
 * 1. 检查 .env 中的变量是否在 env.d.ts 中有类型定义
 * 2. 检查环境特定文件中的变量是否在 .env 中存在
 * 3. 检查是否有重复的变量定义
 */

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// 解析环境变量文件
function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {}
  }

  const content = fs.readFileSync(filePath, 'utf8')
  const variables = {}

  content.split('\n').forEach(line => {
    line = line.trim()
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...valueParts] = line.split('=')
      variables[key.trim()] = valueParts.join('=').trim()
    }
  })

  return variables
}

// 解析 TypeScript 类型定义文件
function parseEnvTypes(filePath) {
  if (!fs.existsSync(filePath)) {
    return []
  }

  const content = fs.readFileSync(filePath, 'utf8')
  const variables = []

  // 匹配 readonly VITE_XXX: 类型 模式（包括联合类型）
  const regex = /readonly\s+(VITE_\w+):\s*[^;\n]+/g
  let match

  while ((match = regex.exec(content)) !== null) {
    variables.push(match[1])
  }

  return variables
}

// 主检查函数
function checkEnvConfig() {
  log('🔍 开始检查环境变量配置...', 'blue')

  const baseVars = parseEnvFile('.env')
  const devVars = parseEnvFile('.env.development')
  const prodVars = parseEnvFile('.env.production')
  const typeVars = parseEnvTypes('env.d.ts')

  let hasError = false

  // 检查 .env 中的变量是否在 env.d.ts 中有类型定义
  log('\n📋 检查类型定义完整性...', 'blue')
  const baseVarNames = Object.keys(baseVars).filter(key => key.startsWith('VITE_'))

  baseVarNames.forEach(varName => {
    if (!typeVars.includes(varName)) {
      log(`❌ 缺少类型定义: ${varName}`, 'red')
      hasError = true
    } else {
      log(`✅ 类型定义完整: ${varName}`, 'green')
    }
  })

  // 检查环境特定文件中的变量是否在 .env 中存在
  log('\n🔧 检查开发环境配置...', 'blue')
  Object.keys(devVars)
    .filter(key => key.startsWith('VITE_'))
    .forEach(varName => {
      if (!Object.prototype.hasOwnProperty.call(baseVars, varName)) {
        log(`❌ 开发环境中有未定义的变量: ${varName}`, 'red')
        hasError = true
      } else {
        log(`✅ 开发环境配置正确: ${varName}`, 'green')
      }
    })

  log('\n🚀 检查生产环境配置...', 'blue')
  Object.keys(prodVars)
    .filter(key => key.startsWith('VITE_'))
    .forEach(varName => {
      if (!Object.prototype.hasOwnProperty.call(baseVars, varName)) {
        log(`❌ 生产环境中有未定义的变量: ${varName}`, 'red')
        hasError = true
      } else {
        log(`✅ 生产环境配置正确: ${varName}`, 'green')
      }
    })

  // 检查重复定义（分层管理中的正常现象）
  log('\n🔄 检查重复定义...', 'blue')
  const allVars = [...Object.keys(baseVars), ...Object.keys(devVars), ...Object.keys(prodVars)]
  const duplicates = allVars.filter((item, index) => allVars.indexOf(item) !== index)

  if (duplicates.length > 0) {
    log(`⚠️  发现重复定义（分层管理正常现象）: ${duplicates.length} 个变量`, 'yellow')
    log('   这是分层环境变量管理的正常现象，环境特定文件会覆盖基础配置', 'yellow')
  } else {
    log('✅ 没有重复定义', 'green')
  }

  // 统计信息
  log('\n📊 配置统计:', 'blue')
  log(`- .env: ${Object.keys(baseVars).filter(key => key.startsWith('VITE_')).length} 个变量`)
  log(
    `- .env.development: ${Object.keys(devVars).filter(key => key.startsWith('VITE_')).length} 个变量`
  )
  log(
    `- .env.production: ${Object.keys(prodVars).filter(key => key.startsWith('VITE_')).length} 个变量`
  )
  log(`- env.d.ts: ${typeVars.length} 个类型定义`)

  if (hasError) {
    log('\n❌ 检查完成，发现问题！', 'red')
    process.exit(1)
  } else {
    log('\n✅ 检查完成，配置一致！', 'green')
  }
}

// 运行检查
if (require.main === module) {
  checkEnvConfig()
}

module.exports = { checkEnvConfig }
