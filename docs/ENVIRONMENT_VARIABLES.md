# 环境变量配置说明

## 概述

CC-Admin 项目使用 Vite 的环境变量系统来管理不同环境下的配置。本文档详细说明了环境变量的配置方法、使用规范和最佳实践。

## 📁 文件结构

```
Ant-Design-UI/
├── .env.example          # 环境变量模板文件（提供参考配置）
├── .env.development      # 开发环境配置（会被提交到版本控制）
├── .env.production       # 生产环境配置（会被提交到版本控制）
├── .env.local           # 本地环境配置（包含敏感信息，被 git 忽略）
├── env.d.ts             # TypeScript 类型定义文件
└── src/utils/env.ts     # 环境变量工具函数
```

## 🔧 环境变量类型

### 应用基础配置

| 变量名             | 类型   | 说明                           | 示例值                                  |
| ------------------ | ------ | ------------------------------ | --------------------------------------- |
| `VITE_APP_TITLE`   | string | 应用标题，显示在浏览器标题栏   | `CC-Admin`                              |
| `VITE_APP_VERSION` | string | 应用版本号，建议遵循语义化版本 | `1.0.0`                                 |
| `VITE_APP_ENV`     | string | 运行环境标识                   | `development` \| `production` \| `test` |

### API 接口配置

| 变量名              | 类型   | 说明                     | 示例值                  |
| ------------------- | ------ | ------------------------ | ----------------------- |
| `VITE_API_BASE_URL` | string | API 服务器基础地址       | `http://localhost:3003` |
| `VITE_API_TIMEOUT`  | string | API 请求超时时间（毫秒） | `30000`                 |

### 开发环境配置

| 变量名             | 类型   | 说明               | 示例值            |
| ------------------ | ------ | ------------------ | ----------------- |
| `VITE_DEV_TOOLS`   | string | 是否启用开发者工具 | `true` \| `false` |
| `VITE_MOCK_ENABLE` | string | 是否启用 Mock 数据 | `true` \| `false` |
| `VITE_CONSOLE_LOG` | string | 是否启用控制台日志 | `true` \| `false` |

### 构建优化配置

| 变量名               | 类型   | 说明                   | 示例值            |
| -------------------- | ------ | ---------------------- | ----------------- |
| `VITE_DROP_DEBUGGER` | string | 是否移除 debugger 语句 | `true` \| `false` |
| `VITE_DROP_CONSOLE`  | string | 是否移除 console 语句  | `true` \| `false` |
| `VITE_BUILD_GZIP`    | string | 是否启用 Gzip 压缩     | `true` \| `false` |
| `VITE_BUILD_ANALYZE` | string | 是否启用构建分析       | `true` \| `false` |

## 🚀 使用方法

### 基础用法

```typescript
// 直接访问环境变量
const apiUrl = import.meta.env.VITE_API_BASE_URL
const appTitle = import.meta.env.VITE_APP_TITLE

// 判断环境
if (import.meta.env.VITE_APP_ENV === 'development') {
  console.log('开发环境')
}
```

### 推荐用法（使用工具函数）

```typescript
import {
  getAppConfig,
  getApiConfig,
  isDev,
  isProd,
  isDevToolsEnabled,
  isMockEnabled,
  getAllEnvConfig,
} from '@/utils/env'

// 获取应用配置
const app = getAppConfig()
console.log(app.title) // CC-Admin
console.log(app.version) // 1.0.0
console.log(app.env) // development

// 获取API配置
const api = getApiConfig()
console.log(api.baseURL) // http://localhost:3003
console.log(api.timeout) // 30000 (number类型)

// 环境判断
if (isDev()) {
  console.log('当前是开发环境')
}

if (isProd()) {
  console.log('当前是生产环境')
}

// 功能开关判断
if (isDevToolsEnabled()) {
  // 启用开发者工具
}

if (isMockEnabled()) {
  // 使用 Mock 数据
  import('./mock/index.js').then(mock => mock.setup())
}

// 获取完整配置
const envConfig = getAllEnvConfig()
console.log(envConfig)
```

### 在组件中使用

```vue
<script setup lang="ts">
import { getAppConfig, getApiConfig, isDev } from '@/utils/env'

// 获取配置
const appConfig = getAppConfig()
const apiConfig = getApiConfig()

// 条件渲染
const showDebugInfo = isDev()
</script>

<template>
  <div>
    <h1>{{ appConfig.title }}</h1>
    <p>版本: {{ appConfig.version }}</p>
    <p>API: {{ apiConfig.baseURL }}</p>

    <!-- 只在开发环境显示调试信息 -->
    <div
      v-if="showDebugInfo"
      class="debug-info"
    >
      调试信息...
    </div>
  </div>
</template>
```

## 🔐 安全注意事项

### ✅ 可以提交到版本控制的配置

- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置
- `.env.example` - 模板文件

这些文件不包含敏感信息，可以安全地提交到 Git 仓库。

### ❌ 不应提交到版本控制的配置

- `.env.local` - 本地环境配置
- `.env` - 通用环境配置（如果包含敏感信息）

这些文件可能包含 API 密钥、数据库连接字符串等敏感信息，应该被 Git 忽略。

### 敏感信息处理

```bash
# 错误示例 - 不要在环境变量文件中包含真实的敏感信息
VITE_API_SECRET=real-secret-key-123

# 正确示例 - 使用占位符或从其他安全渠道获取
VITE_API_SECRET=your-api-secret-here
```

对于敏感信息，建议：

1. 使用 CI/CD 系统的环境变量注入
2. 使用服务器端环境变量
3. 使用专用的配置管理服务

## 🌍 环境配置策略

### 开发环境 (.env.development)

```bash
# 开发环境特点：
# - 启用所有调试功能
# - 使用本地 API 或 Mock 数据
# - 详细的日志输出
# - 不进行代码压缩

VITE_APP_TITLE=CC-Admin (开发环境)
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:3003
VITE_DEV_TOOLS=true
VITE_MOCK_ENABLE=true
VITE_CONSOLE_LOG=true
VITE_DROP_DEBUGGER=false
VITE_DROP_CONSOLE=false
```

### 生产环境 (.env.production)

```bash
# 生产环境特点：
# - 禁用调试功能
# - 使用真实 API 地址
# - 启用性能优化
# - 移除调试信息

VITE_APP_TITLE=CC-Admin
VITE_APP_ENV=production
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_DEV_TOOLS=false
VITE_MOCK_ENABLE=false
VITE_CONSOLE_LOG=false
VITE_DROP_DEBUGGER=true
VITE_DROP_CONSOLE=true
VITE_BUILD_GZIP=true
```

### 测试环境配置

如果需要测试环境，可以创建 `.env.test` 文件：

```bash
VITE_APP_TITLE=CC-Admin (测试环境)
VITE_APP_ENV=test
VITE_API_BASE_URL=https://test-api.yourdomain.com
VITE_DEV_TOOLS=true
VITE_MOCK_ENABLE=false
VITE_CONSOLE_LOG=true
```

## 📝 最佳实践

### 1. 命名规范

- 所有客户端环境变量必须以 `VITE_` 开头
- 使用全大写字母和下划线分隔
- 命名应该清晰表达变量的用途

```bash
# ✅ 正确
VITE_APP_TITLE=MyApp
VITE_API_BASE_URL=https://api.example.com

# ❌ 错误
APP_TITLE=MyApp          # 缺少 VITE_ 前缀
vite_api_url=api.com     # 使用小写字母
VITE_URL=api.com         # 命名不够清晰
```

### 2. 类型转换

环境变量都是字符串类型，使用时需要适当转换：

```typescript
// ✅ 正确的类型转换
const timeout = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000
const isEnabled = import.meta.env.VITE_FEATURE_ENABLED === 'true'

// ❌ 错误的使用方式
const timeout = import.meta.env.VITE_API_TIMEOUT // string类型
const isEnabled = import.meta.env.VITE_FEATURE_ENABLED // 总是truthy
```

### 3. 默认值处理

始终提供默认值，确保应用的健壮性：

```typescript
// ✅ 提供默认值
const apiTimeout = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000
const apiUrl = import.meta.env.VITE_API_BASE_URL || '/api'

// 使用工具函数（已包含默认值处理）
const apiConfig = getApiConfig() // 内部已处理默认值
```

### 4. 文档维护

- 在 `.env.example` 中提供所有环境变量的示例
- 及时更新环境变量的说明文档
- 在代码中添加适当的注释

### 5. 验证和错误处理

```typescript
// 验证必需的环境变量
function validateEnv() {
  const required = ['VITE_API_BASE_URL', 'VITE_APP_TITLE']

  for (const key of required) {
    if (!import.meta.env[key]) {
      throw new Error(`缺少必需的环境变量: ${key}`)
    }
  }
}

// 在应用启动时验证
validateEnv()
```

## 🔍 调试和故障排除

### 查看当前环境变量

1. **在浏览器控制台中查看**：

   ```javascript
   console.log(import.meta.env)
   ```

2. **使用工具函数查看**：

   ```typescript
   import { getAllEnvConfig } from '@/utils/env'
   console.log(getAllEnvConfig())
   ```

3. **在页面中显示**：
   访问首页的"环境配置"区域，查看当前配置状态。

### 常见问题

1. **环境变量不生效**
   - 确保变量名以 `VITE_` 开头
   - 重启开发服务器
   - 检查文件名是否正确

2. **类型错误**
   - 记住所有环境变量都是字符串
   - 使用适当的类型转换
   - 使用工具函数获得类型安全

3. **配置未加载**
   - 检查文件是否存在
   - 确保文件编码为 UTF-8
   - 验证语法是否正确

## 📚 相关资源

- [Vite 环境变量文档](https://cn.vitejs.dev/guide/env-and-mode.html)
- [项目环境变量工具函数源码](../src/utils/env.ts)
- [TypeScript 类型定义](../env.d.ts)
- [项目 README](../README.md)

---

最后更新：2024年6月
