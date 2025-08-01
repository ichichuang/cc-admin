/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 构建脚本
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { existsSync, readFileSync, readdirSync } from 'fs'
import { join } from 'path'

/* -------------------- 类型定义 -------------------- */
interface Colors {
  red: string
  green: string
  yellow: string
  blue: string
  magenta: string
  cyan: string
  reset: string
}

interface ValidationRules {
  required: string[]
  deprecated: string[]
  types: Record<string, string>
  formats: Record<string, string>
  ranges: Record<string, { min: number; max: number }>
}

interface EnvVariables {
  [key: string]: string
}

interface Validators {
  number: (value: string) => boolean
  boolean: (value: string) => boolean
  enum: (value: string, options?: string) => boolean
  url: (value: string) => boolean
  path: (value: string) => boolean
  route: (value: string) => boolean
}

interface ProjectConfig {
  name: string
  path: string
  envPath: string
  typePath: string
}

/* -------------------- 彩色输出 -------------------- */
const colors: Colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
}

const log = (msg: string, color: keyof Colors = 'reset'): void => {
  console.log(`${colors[color]}${msg}${colors.reset}`)
}

/* -------------------- 环境变量验证规则 -------------------- */
const validationRules: ValidationRules = {
  // 必需的环境变量（所有环境都必须有）
  required: ['VITE_APP_TITLE', 'VITE_API_BASE_URL'],

  // 已废弃的环境变量（检查时忽略）
  deprecated: [
    'VITE_BUILD_GZIP', // 已废弃，使用 VITE_COMPRESSION 替代
  ],

  // 类型验证规则
  types: {
    VITE_PORT: 'number',
    VITE_LOADING_SIZE: 'number',
    VITE_API_TIMEOUT: 'number',
    VITE_DEV_TOOLS: 'boolean',
    VITE_MOCK_ENABLE: 'boolean',
    VITE_CONSOLE_LOG: 'boolean',
    VITE_DEBUG: 'boolean',
    VITE_DROP_DEBUGGER: 'boolean',
    VITE_DROP_CONSOLE: 'boolean',
    VITE_BUILD_ANALYZE: 'boolean',
    VITE_BUILD_SOURCEMAP: 'boolean',
    VITE_LEGACY: 'boolean',
    VITE_CDN: 'boolean',
    VITE_APP_ENV: 'enum:development,production',
    VITE_COMPRESSION: 'enum:none,gzip,brotli,both',
  },

  // 格式验证规则
  formats: {
    VITE_API_BASE_URL: 'url',
    VITE_PUBLIC_PATH: 'path',
    VITE_ROOT_REDIRECT: 'route',
  },

  // 值范围验证
  ranges: {
    VITE_PORT: { min: 1024, max: 65535 },
    VITE_LOADING_SIZE: { min: 1, max: 20 },
    VITE_API_TIMEOUT: { min: 1000, max: 60000 },
  },
}

/* -------------------- 值验证器 -------------------- */
const validators: Validators = {
  number: (value: string): boolean => {
    const num = Number(value)
    return !isNaN(num) && isFinite(num)
  },

  boolean: (value: string): boolean => {
    return value === 'true' || value === 'false'
  },

  enum: (value: string, options?: string): boolean => {
    if (!options) {
      return false
    }
    return options.split(',').includes(value)
  },

  url: (value: string): boolean => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  },

  path: (value: string): boolean => {
    return typeof value === 'string' && value.length > 0
  },

  route: (value: string): boolean => {
    return typeof value === 'string' && value.length > 0
  },
}

/* -------------------- 读取 .env 文件 -------------------- */
const parseEnvFile = (filePath: string): EnvVariables => {
  if (!existsSync(filePath)) {
    return {}
  }

  return readFileSync(filePath, 'utf8')
    .split('\n')
    .map((l: string) => l.trim())
    .filter((l: string) => l && !l.startsWith('#') && l.includes('='))
    .reduce((acc: EnvVariables, line: string) => {
      const [k, ...v] = line.split('=')
      acc[k.trim()] = v.join('=').trim()
      return acc
    }, {})
}

/* -------------------- 读取 env.d.ts 类型 -------------------- */
const parseEnvTypes = (filePath: string): string[] => {
  if (!existsSync(filePath)) {
    return []
  }

  const content = readFileSync(filePath, 'utf8')
  const regex = /readonly\s+(VITE_\w+):\s*[^;\n]+/g
  const vars: string[] = []
  let match: RegExpExecArray | null

  while ((match = regex.exec(content))) {
    vars.push(match[1])
  }

  return vars
}

/* -------------------- 获取项目配置 -------------------- */
const getProjectConfigs = (root: string): ProjectConfig[] => {
  const projects: ProjectConfig[] = []

  // 检查 apps 目录
  const appsPath = join(root, 'apps')
  if (existsSync(appsPath)) {
    const appDirs = readdirSync(appsPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    for (const appDir of appDirs) {
      const appPath = join(appsPath, appDir)
      const envPath = join(appPath, '.env')
      const typePath = join(appPath, 'src/types/env.d.ts')

      // 如果存在 .env 文件，则添加到项目列表
      if (existsSync(envPath)) {
        projects.push({
          name: appDir,
          path: appPath,
          envPath: envPath,
          typePath: typePath,
        })
      }
    }
  }

  // 如果没有找到任何项目，默认检查 apps/admin
  if (projects.length === 0) {
    const adminPath = join(root, 'apps/admin')
    projects.push({
      name: 'admin',
      path: adminPath,
      envPath: join(adminPath, '.env'),
      typePath: join(adminPath, 'src/types/env.d.ts'),
    })
  }

  return projects
}

/* -------------------- 验证环境变量值 -------------------- */
const validateValue = (name: string, value: string): string[] => {
  const errors: string[] = []

  // 类型验证
  if (validationRules.types[name]) {
    const typeRule = validationRules.types[name]
    const [type, options] = typeRule.includes(':') ? typeRule.split(':') : [typeRule, null]

    if (!validators[type as keyof Validators](value, options || undefined)) {
      if (type === 'enum') {
        errors.push(`值 "${value}" 不在允许的选项中: ${options}`)
      } else {
        errors.push(`值 "${value}" 不是有效的 ${type} 类型`)
      }
    }
  }

  // 格式验证
  if (validationRules.formats[name]) {
    const format = validationRules.formats[name] as keyof Validators
    if (!validators[format](value)) {
      errors.push(`值 "${value}" 不符合 ${format} 格式要求`)
    }
  }

  // 范围验证
  if (validationRules.ranges[name] && validators.number(value)) {
    const { min, max } = validationRules.ranges[name]
    const num = Number(value)
    if (num < min || num > max) {
      errors.push(`值 ${value} 超出允许范围 ${min}-${max}`)
    }
  }

  return errors
}

/* -------------------- 检查单个项目 -------------------- */
const checkProject = (project: ProjectConfig, _root: string): boolean => {
  log(`\n🔍 检查项目: ${project.name}`, 'cyan')

  /* 读取文件 */
  const baseVars = parseEnvFile(join(project.path, '.env'))
  const devVars = parseEnvFile(join(project.path, '.env.development'))
  const prodVars = parseEnvFile(join(project.path, '.env.production'))
  const typeVars = parseEnvTypes(project.typePath)

  /* 当前环境 */
  const currentEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development'
  const currentVars = currentEnv === 'production' ? prodVars : devVars

  let hasError = false
  let _hasWarning = false

  /* ---------- 1. 类型定义完整性 ---------- */
  const allVarNames = [
    ...new Set([...Object.keys(baseVars), ...Object.keys(devVars), ...Object.keys(prodVars)]),
  ].filter((k: string) => k.startsWith('VITE_'))

  // 过滤掉已废弃的变量
  const activeVarNames = allVarNames.filter(
    (name: string) => !validationRules.deprecated.includes(name)
  )
  const deprecatedVarsFound = allVarNames.filter((name: string) =>
    validationRules.deprecated.includes(name)
  )

  // 检查已废弃变量并给出警告
  if (deprecatedVarsFound.length > 0) {
    log(`⚠️  发现已废弃的环境变量:`, 'yellow')
    deprecatedVarsFound.forEach((name: string) => {
      log(`   ${name} - 建议移除或使用新的替代变量`, 'yellow')
    })
  }

  // 检查活跃变量的类型定义
  activeVarNames.forEach((name: string) => {
    if (!typeVars.includes(name)) {
      log(`❌  缺少类型定义: ${name}`, 'red')
      hasError = true
    }
  })

  /* ---------- 2. 必需变量检查 ---------- */
  validationRules.required.forEach((name: string) => {
    const val = currentVars[name] ?? baseVars[name]
    if (!val) {
      log(`❌  缺少必需变量: ${name}`, 'red')
      hasError = true
    }
  })

  /* ---------- 3. 运行环境缺失变量 ---------- */
  activeVarNames.forEach((name: string) => {
    // 按照环境变量读取优先级：当前环境文件 -> .env 文件
    const val = currentVars[name] ?? baseVars[name]
    if (val === undefined) {
      log(`❌  运行时缺失变量: ${name}`, 'red')
      hasError = true
    }
  })

  /* ---------- 4. 值格式和类型验证 ---------- */
  const allCurrentVars: EnvVariables = { ...baseVars, ...currentVars }

  Object.entries(allCurrentVars).forEach(([name, value]: [string, string]) => {
    // 跳过非VITE变量和已废弃变量
    if (!name.startsWith('VITE_') || validationRules.deprecated.includes(name)) {
      return
    }

    const errors = validateValue(name, value)
    if (errors.length > 0) {
      log(`❌  ${name}: ${errors.join(', ')}`, 'red')
      hasError = true
    }
  })

  /* ---------- 5. env.d.ts 多余定义 ---------- */
  // 检查 env.d.ts 中定义的变量是否在环境文件中存在
  // 按照环境变量读取优先级：当前环境文件 -> .env 文件
  const extraTypes = typeVars.filter((name: string) => {
    // 检查当前环境文件和 .env 文件中是否存在该变量
    const existsInCurrentEnv = currentVars[name] !== undefined
    const existsInBaseEnv = baseVars[name] !== undefined
    return !existsInCurrentEnv && !existsInBaseEnv
  })

  if (extraTypes.length) {
    extraTypes.forEach((n: string) => {
      log(`❌  类型定义但未在任何 .env* 中出现: ${n}`, 'red')
      hasError = true
    })
  }

  /* ---------- 6. 重复定义提示 ---------- */
  const duplicates = activeVarNames.filter(
    (n: string) => (baseVars[n] && devVars[n]) || (baseVars[n] && prodVars[n])
  )
  if (duplicates.length) {
    log(`⚠️   发现重复定义 ${duplicates.length} 个 (环境覆盖属正常)`, 'yellow')
    duplicates.forEach((name: string) => {
      const sources: string[] = []
      if (baseVars[name]) {
        sources.push('.env')
      }
      if (devVars[name]) {
        sources.push('.env.development')
      }
      if (prodVars[name]) {
        sources.push('.env.production')
      }
      log(`   ${name}: ${sources.join(' + ')}`, 'yellow')
    })
    _hasWarning = true
  }

  /* ---------- 7. 安全性检查 ---------- */
  const sensitivePatterns = ['password', 'secret', 'token']
  const securityIssues: string[] = []

  Object.entries({ ...baseVars, ...devVars, ...prodVars }).forEach(
    ([name, value]: [string, string]) => {
      if (!name.startsWith('VITE_')) {
        return
      }

      // 检查是否包含敏感信息
      const nameLower = name.toLowerCase()
      const hasSensitive = sensitivePatterns.some((pattern: string) => nameLower.includes(pattern))

      if (hasSensitive && value && value.length > 0) {
        const status = validationRules.deprecated.includes(name) ? '(已废弃)' : ''
        securityIssues.push(`${name}${status}: 可能包含敏感信息`)
      }
    }
  )

  if (securityIssues.length > 0) {
    securityIssues.forEach((issue: string) => log(`⚠️   ${issue}`, 'yellow'))
    _hasWarning = true
  }

  return !hasError
}

/* -------------------- 主函数 -------------------- */
function checkEnvConfig(): void {
  const root = process.cwd()
  const projects = getProjectConfigs(root)

  log(`🔍 开始检查 ${projects.length} 个项目的环境变量配置...`, 'blue')

  let allProjectsPassed = true

  for (const project of projects) {
    const projectPassed = checkProject(project, root)
    if (!projectPassed) {
      allProjectsPassed = false
    }
  }

  /* ---------- 结束 ---------- */
  if (allProjectsPassed) {
    log('\n✅ 所有项目的环境变量检查完成，一切正常', 'green')
  } else {
    log('\n❌ 检查完成，发现错误，请修复后重试', 'red')
    process.exit(1)
  }
}

/* -------------------- 导出 -------------------- */
export { checkEnvConfig, validationRules, validators }

/* -------------------- 执行 -------------------- */
if (import.meta.url === `file://${process.argv[1]}`) {
  checkEnvConfig()
}
