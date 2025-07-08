# 环境变量管理指南

## 概述

CC-Admin 项目采用分层环境变量管理方式，避免配置重复，提高维护效率。

## 文件结构

```
├── .env.example          # 配置模板文件（包含所有变量和默认值）
├── .env.development      # 开发环境配置（只覆盖特定配置）
├── .env.production       # 生产环境配置（只覆盖特定配置）
└── env.d.ts              # TypeScript 类型定义
```

## 分层管理策略

### 1. 基础配置层（.env.example）

包含所有环境变量的默认值和详细注释，作为配置的"真相之源"。

**特点：**

- 包含完整的变量列表
- 提供详细的注释说明
- 设置合理的默认值
- 作为其他环境文件的参考

### 2. 环境特定配置层（.env.development/.env.production）

只包含需要根据环境变化的配置，继承基础配置的默认值。

**特点：**

- 只覆盖环境特定的配置
- 避免重复定义相同值
- 清晰的环境差异对比
- 易于维护和更新

### 3. 类型定义层（env.d.ts）

为所有环境变量提供 TypeScript 类型支持。

**特点：**

- 完整的类型定义
- 与配置文件保持同步
- 提供智能提示和类型检查

## 配置分类

### 应用基础配置

- `VITE_APP_TITLE` - 应用标题
- `VITE_APP_VERSION` - 应用版本号
- `VITE_PINIA_PERSIST_KEY_PREFIX` - Pinia 持久化 key 前缀
- `VITE_APP_ENV` - 运行环境
- `VITE_PUBLIC_PATH` - 应用根路径
- `VITE_PORT` - 开发服务器端口

### API 接口配置

- `VITE_API_BASE_URL` - API 基础地址
- `VITE_API_TIMEOUT` - 请求超时时间

### 开发环境配置

- `VITE_DEV_TOOLS` - 开发者工具开关
- `VITE_MOCK_ENABLE` - Mock 数据开关
- `VITE_CONSOLE_LOG` - 控制台日志开关

### 构建优化配置

- `VITE_DROP_DEBUGGER` - 移除 debugger 语句
- `VITE_DROP_CONSOLE` - 移除 console 语句
- `VITE_BUILD_GZIP` - Gzip 压缩开关
- `VITE_BUILD_ANALYZE` - 构建分析开关
- `VITE_BUILD_SOURCEMAP` - Sourcemap 生成开关
- `VITE_COMPRESSION` - 压缩方式
- `VITE_LEGACY` - Legacy 浏览器支持
- `VITE_CDN` - CDN 开关

### 其他功能配置

- `VITE_USE_MOCK` - 全局 Mock 服务开关

## 最佳实践

### 1. 添加新环境变量

1. 在 `.env.example` 中添加变量和注释
2. 在 `env.d.ts` 中添加类型定义
3. 在相应的环境文件中设置具体值

### 2. 修改现有配置

1. 优先修改 `.env.example` 中的默认值
2. 在环境特定文件中只覆盖需要变化的配置
3. 确保 `env.d.ts` 类型定义同步更新

### 3. 环境变量命名规范

- 所有客户端可用的变量必须以 `VITE_` 开头
- 使用大写字母和下划线分隔
- 名称要具有描述性，清晰表达用途

### 4. 敏感信息处理

- 敏感信息（如 API 密钥）放在 `.env.local` 文件中
- `.env.local` 文件已被 `.gitignore` 忽略
- 在 `.env.example` 中提供占位符和说明

## 使用示例

### 在代码中使用环境变量

```typescript
// 获取 API 基础地址
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

// 检查是否为开发环境
const isDev = import.meta.env.VITE_APP_ENV === 'development'

// 获取应用标题
const appTitle = import.meta.env.VITE_APP_TITLE
```

### 在 Vite 配置中使用

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    port: parseInt(process.env.VITE_PORT) || 5173,
  },
  build: {
    sourcemap: process.env.VITE_BUILD_SOURCEMAP === 'true',
  },
})
```

## 迁移指南

如果您从旧版本迁移，请按以下步骤操作：

1. 备份现有的环境变量文件
2. 使用新的 `.env.example` 作为模板
3. 将原有的自定义配置迁移到相应的环境文件中
4. 删除重复的配置项
5. 验证所有功能正常工作

## 常见问题

### Q: 为什么有些变量在 .env.example 中但在实际环境文件中没有？

A: 这是分层管理的设计。环境特定文件只包含需要覆盖的配置，其他配置继承自 `.env.example` 的默认值。

### Q: 如何添加新的环境变量？

A: 按照"最佳实践"中的步骤操作，确保在三个地方都进行相应的更新。

### Q: 环境变量值都是字符串类型吗？

A: 是的，Vite 中的环境变量都是字符串类型。使用时需要根据需要进行类型转换。
