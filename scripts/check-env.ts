#!/usr/bin/env node
/* eslint-disable */
import { existsSync, readFileSync } from 'fs'
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
  required: ['VITE_APP_TITLE', 'VITE_API_BASE_URL', 'VITE_PINIA_PERSIST_KEY_PREFIX'],

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
    if (!options) return false
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
  if (!existsSync(filePath)) return {}

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
  if (!existsSync(filePath)) return []

  const content = readFileSync(filePath, 'utf8')
  const regex = /readonly\s+(VITE_\w+):\s*[^;\n]+/g
  const vars: string[] = []
  let match: RegExpExecArray | null

  while ((match = regex.exec(content))) {
    vars.push(match[1])
  }

  return vars
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

/* -------------------- 主函数 -------------------- */
function checkEnvConfig(): void {
  log('🔍  开始检查环境变量配置...', 'blue')

  /* 读取文件 */
  const root = process.cwd()
  const baseVars = parseEnvFile(join(root, '.env'))
  const devVars = parseEnvFile(join(root, '.env.development'))
  const prodVars = parseEnvFile(join(root, '.env.production'))
  const typeVars = parseEnvTypes(join(root, 'src/Types/env.d.ts'))

  /* 当前环境 */
  const currentEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development'
  const currentVars = currentEnv === 'production' ? prodVars : devVars
  log(`\n🌐  当前环境: ${currentEnv}`, 'blue')

  let hasError = false
  let hasWarning = false

  /* ---------- 1. 类型定义完整性 ---------- */
  log('\n📋  检查类型定义完整性...', 'blue')
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
    log('\n⚠️  发现已废弃的环境变量:', 'yellow')
    deprecatedVarsFound.forEach((name: string) => {
      log(`   ${name} - 建议移除或使用新的替代变量`, 'yellow')
    })
  }

  // 检查活跃变量的类型定义
  activeVarNames.forEach((name: string) => {
    if (!typeVars.includes(name)) {
      log(`❌  缺少类型定义: ${name}`, 'red')
      hasError = true
    } else {
      log(`✅  已声明类型: ${name}`, 'green')
    }
  })

  /* ---------- 2. 必需变量检查 ---------- */
  log('\n🎯  检查必需变量...', 'blue')
  validationRules.required.forEach((name: string) => {
    const val = currentVars[name] ?? baseVars[name]
    if (!val) {
      log(`❌  缺少必需变量: ${name}`, 'red')
      hasError = true
    } else {
      log(`✅  必需变量已设置: ${name}`, 'green')
    }
  })

  /* ---------- 3. 运行环境缺失变量 ---------- */
  log('\n🚦  校验当前运行环境所有变量...', 'blue')
  activeVarNames.forEach((name: string) => {
    // 按照环境变量读取优先级：当前环境文件 -> .env 文件
    const val = currentVars[name] ?? baseVars[name]
    if (val === undefined) {
      log(`❌  运行时缺失变量: ${name}`, 'red')
      hasError = true
    } else {
      log(`✅  运行时变量已设置: ${name}`, 'green')
    }
  })

  /* ---------- 4. 值格式和类型验证 ---------- */
  log('\n🔬  检查环境变量值的格式和类型...', 'blue')
  const allCurrentVars: EnvVariables = { ...baseVars, ...currentVars }

  Object.entries(allCurrentVars).forEach(([name, value]: [string, string]) => {
    // 跳过非VITE变量和已废弃变量
    if (!name.startsWith('VITE_') || validationRules.deprecated.includes(name)) return

    const errors = validateValue(name, value)
    if (errors.length > 0) {
      log(`❌  ${name}: ${errors.join(', ')}`, 'red')
      hasError = true
    } else if (
      validationRules.types[name] ||
      validationRules.formats[name] ||
      validationRules.ranges[name]
    ) {
      log(`✅  ${name}: "${value}" 格式正确`, 'green')
    }
  })

  /* ---------- 5. env.d.ts 多余定义 ---------- */
  log('\n🧐  检查 env.d.ts 是否有多余定义...', 'blue')
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
  } else {
    log('✅  没有多余类型定义', 'green')
  }

  /* ---------- 6. 重复定义提示 ---------- */
  log('\n🔄  检查重复定义...', 'blue')
  const duplicates = activeVarNames.filter(
    (n: string) => (baseVars[n] && devVars[n]) || (baseVars[n] && prodVars[n])
  )
  if (duplicates.length) {
    log(`⚠️   发现重复定义 ${duplicates.length} 个 (环境覆盖属正常)`, 'yellow')
    duplicates.forEach((name: string) => {
      const sources: string[] = []
      if (baseVars[name]) sources.push('.env')
      if (devVars[name]) sources.push('.env.development')
      if (prodVars[name]) sources.push('.env.production')
      log(`   ${name}: ${sources.join(' + ')}`, 'yellow')
    })
    hasWarning = true
  } else {
    log('✅  无重复定义', 'green')
  }

  /* ---------- 7. 安全性检查 ---------- */
  log('\n🔒  安全性检查...', 'blue')
  const sensitivePatterns = ['password', 'secret', 'token']
  const securityIssues: string[] = []

  Object.entries({ ...baseVars, ...devVars, ...prodVars }).forEach(
    ([name, value]: [string, string]) => {
      if (!name.startsWith('VITE_')) return

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
    hasWarning = true
  } else {
    log('✅  未发现明显的安全问题', 'green')
  }

  /* ---------- 8. 统计 ---------- */
  log('\n📊  配置统计:', 'blue')
  const countVite = (obj: EnvVariables): number =>
    Object.keys(obj).filter((k: string) => k.startsWith('VITE_')).length
  const countActive = (obj: EnvVariables): number =>
    Object.keys(obj).filter(
      (k: string) => k.startsWith('VITE_') && !validationRules.deprecated.includes(k)
    ).length
  const countDeprecated = (obj: EnvVariables): number =>
    Object.keys(obj).filter((k: string) => validationRules.deprecated.includes(k)).length

  log(
    `- .env: ${countVite(baseVars)} 个变量 (活跃: ${countActive(baseVars)}, 废弃: ${countDeprecated(baseVars)})`
  )
  log(
    `- .env.development: ${countVite(devVars)} 个变量 (活跃: ${countActive(devVars)}, 废弃: ${countDeprecated(devVars)})`
  )
  log(
    `- .env.production: ${countVite(prodVars)} 个变量 (活跃: ${countActive(prodVars)}, 废弃: ${countDeprecated(prodVars)})`
  )
  log(`- env.d.ts 定义: ${typeVars.length} 个类型`)
  log(
    `- 当前环境生效: ${countVite(allCurrentVars)} 个变量 (活跃: ${countActive(allCurrentVars)}, 废弃: ${countDeprecated(allCurrentVars)})`
  )

  /* ---------- 结束 ---------- */
  if (hasError) {
    log('\n❌  检查完成，发现错误！请修复后重试。', 'red')
    process.exit(1)
  } else if (hasWarning) {
    log('\n⚠️   检查完成，有警告但可以继续运行。', 'yellow')
  } else {
    log('\n✅  检查完成，一切正常！', 'green')
  }
}

/* -------------------- 导出 -------------------- */
// export { checkEnvConfig, validationRules, validators }
// export type { Colors, EnvVariables, ValidationRules, Validators }
export { checkEnvConfig, validationRules, validators }

/* -------------------- 执行 -------------------- */
if (import.meta.url === `file://${process.argv[1]}`) {
  checkEnvConfig()
}
