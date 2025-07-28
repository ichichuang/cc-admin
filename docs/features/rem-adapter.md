<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - REM适配指南
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

# REM 适配系统指南

## 📋 概述

CC-Admin 框架提供了完整的 REM 适配解决方案，支持大屏、移动端、不同屏幕宽度的自适应布局。本文档详细说明了 REM 适配的配置、使用方法和重构优化。

## 🎯 特点

- 🎯 **统一配置管理**：所有 REM 相关配置统一在 `src/utils/env.ts` 中管理
- 📱 **多端适配**：支持桌面端、移动端、大屏等多种设备
- 🔧 **灵活配置**：支持移动端优先和桌面端优先两种策略
- 🎨 **与 UnoCSS 集成**：断点配置与 UnoCSS 保持一致
- ⚡ **性能优化**：支持防抖和节流，避免频繁计算

## 🔧 配置重构

### 问题背景

在 CC-Admin 框架中，`VITE_REM_DESIGN_WIDTH` 等 REM 相关配置在多个文件中重复定义，导致维护困难：

#### 发现的问题

1. **重复定义**：`VITE_REM_DESIGN_WIDTH` 在多个文件中都有默认值
2. **不一致性**：不同文件中的默认值不一致（1800 vs 1920）
3. **维护困难**：修改默认值需要在多个地方同步修改
4. **配置分散**：相关配置分散在不同文件中

#### 影响文件

- `src/utils/env.ts` - 默认值：1800
- `src/utils/remAdapter.ts` - 默认值：1920
- `build/utils.ts` - 默认值：1800

### 解决方案

#### 1. 统一从环境变量读取

所有配置都直接从环境变量读取，不再使用硬编码的默认值：

```typescript
/**
 * 从环境变量解析 rem 配置
 */
export const parseRemConfig = (): RemConfig => {
  return {
    designWidth: Number(import.meta.env.VITE_REM_DESIGN_WIDTH),
    baseFontSize: Number(import.meta.env.VITE_REM_BASE_FONT_SIZE),
    minFontSize: Number(import.meta.env.VITE_REM_MIN_FONT_SIZE),
    maxFontSize: Number(import.meta.env.VITE_REM_MAX_FONT_SIZE),
    mobileFirst: import.meta.env.VITE_REM_MOBILE_FIRST === 'true',
    breakpoints: JSON.parse(import.meta.env.VITE_REM_BREAKPOINTS),
  }
}
```

#### 2. 保留默认配置作为 fallback

仅在环境变量解析失败时使用默认配置：

```typescript
/**
 * rem 适配系统默认配置
 * 仅在环境变量解析失败时使用
 */
export const REM_DEFAULT_CONFIG = {
  designWidth: 1800,
  baseFontSize: 16,
  minFontSize: 12,
  maxFontSize: 24,
  mobileFirst: false,
  breakpoints: {
    xs: 375,
    sm: 768,
    md: 1024,
    lg: 1400,
    xl: 1660,
    xls: 1920,
  },
} as const
```

#### 3. 统一调试配置

使用 `env.ts` 中统一的调试方法：

```typescript
import { env } from '@/utils/env'

// 在代码中使用
if (env.debug) {
  console.warn('解析环境变量中的 rem 配置失败，使用默认配置:', error)
}
```

## 🛠️ 环境变量配置

### 必需配置

- `VITE_REM_DESIGN_WIDTH`: 设计稿基准宽度
- `VITE_REM_BASE_FONT_SIZE`: 基准字体大小
- `VITE_REM_MIN_FONT_SIZE`: 最小字体大小
- `VITE_REM_MAX_FONT_SIZE`: 最大字体大小
- `VITE_REM_MOBILE_FIRST`: 是否启用移动端优先策略
- `VITE_REM_BREAKPOINTS`: 断点配置（JSON 格式）
- `VITE_POSTCSS_ROOT_VALUE`: PostCSS 根值

### 环境变量配置

所有配置都通过环境变量定义：

```bash
# .env 文件
VITE_REM_DESIGN_WIDTH=1800
VITE_REM_BASE_FONT_SIZE=16
VITE_REM_MIN_FONT_SIZE=12
VITE_REM_MAX_FONT_SIZE=24
VITE_REM_MOBILE_FIRST=false
VITE_REM_BREAKPOINTS='{"xs":375,"sm":768,"md":1024,"lg":1400,"xl":1660,"xls":1920}'
VITE_POSTCSS_ROOT_VALUE=16
```

## 🚀 使用方法

### 1. 基础使用

```typescript
import { RemAdapter } from '@/utils/remAdapter'

const adapter = new RemAdapter()
const deviceInfo = getDeviceInfo() // 获取设备信息
adapter.setRootFontSize(deviceInfo)
```

### 2. 自定义配置

```typescript
import { RemAdapter } from '@/utils/remAdapter'

const adapter = new RemAdapter({
  designWidth: 1920,
  baseFontSize: 18,
  mobileFirst: true,
})
```

### 3. 工具函数

```typescript
import { toRem, toPx, getRemBase } from '@/utils/remAdapter'

// px 转 rem
const remValue = toRem(16) // "1rem"

// rem 转 px
const pxValue = toPx(1) // 16

// 获取当前根字体大小
const baseFontSize = getRemBase() // 16
```

## 📱 适配策略

### 桌面端优先（默认）

适用于桌面端为主的应用，移动端作为补充：

```typescript
// 计算逻辑
const scale = viewportWidth / designWidth
const fontSize = Math.max(minFontSize, Math.min(maxFontSize, baseFontSize * scale))
```

### 移动端优先

适用于移动端为主的应用：

```typescript
// 计算逻辑
const scale = viewportWidth / designWidth
const fontSize = Math.max(minFontSize, Math.min(maxFontSize, baseFontSize * scale))
// 移动端优先策略可以设置不同的基准值
```

## 📁 文件结构

```
src/utils/
├── env.ts              # 环境变量解析
│   ├── parseRemConfig()      # 解析函数
│   ├── REM_DEFAULT_CONFIG    # 异常时 fallback
│   └── RemConfig            # 类型定义
└── remAdapter.ts        # 适配器实现
    └── parseRemConfigFromEnv() # 使用环境变量
```

## 🔧 重构过程

### 步骤 1：修正配置读取

1. 所有配置直接从环境变量读取
2. 移除硬编码的默认值回退
3. 仅在异常情况下使用默认配置

### 步骤 2：修正调试配置

1. 使用 `import.meta.env.VITE_DEBUG === "true"` 替代 `env.debug`
2. 移除对 `env` 对象的依赖

### 步骤 3：简化配置解析

1. 直接解析环境变量
2. 提供异常处理机制
3. 保持类型安全

## 📊 改进效果

### 1. 配置统一性

- ✅ **单一数据源**：所有配置都从环境变量读取
- ✅ **环境变量优先**：环境变量是唯一的配置来源
- ✅ **一致性保证**：所有文件使用相同的环境变量

### 2. 类型安全

- ✅ **完整类型定义**：`RemConfig` 接口确保类型安全
- ✅ **编译时检查**：TypeScript 编译时检查配置正确性
- ✅ **IDE 支持**：更好的代码提示和自动补全

### 3. 代码质量

- ✅ **消除重复**：不再有重复的配置定义
- ✅ **清晰结构**：配置、解析、使用分离明确
- ✅ **向后兼容**：保持现有 API 不变

### 4. 开发体验

- ✅ **环境变量驱动**：所有配置通过环境变量管理
- ✅ **错误处理**：提供 fallback 机制
- ✅ **调试支持**：开发环境下提供详细日志

## 📝 使用指南

### 环境变量配置

所有配置都在 `.env` 文件中定义：

```bash
# .env 文件
VITE_REM_DESIGN_WIDTH=1800
VITE_REM_BASE_FONT_SIZE=16
VITE_REM_MIN_FONT_SIZE=12
VITE_REM_MAX_FONT_SIZE=24
VITE_REM_MOBILE_FIRST=false
VITE_REM_BREAKPOINTS='{"xs":375,"sm":768,"md":1024,"lg":1400,"xl":1660,"xls":1920}'
VITE_POSTCSS_ROOT_VALUE=16
```

### 修改配置

只需要修改 `.env` 文件中的环境变量：

```bash
# 修改设计稿宽度
VITE_REM_DESIGN_WIDTH=1920

# 修改基准字体大小
VITE_REM_BASE_FONT_SIZE=18
```

### 类型安全使用

```typescript
import { parseRemConfig, type RemConfig } from '@/utils/env'

const config: RemConfig = parseRemConfig()
console.log(config.designWidth) // 类型安全
```

## ✅ 验证结果

### 构建验证

```bash
pnpm build
# ✓ 构建成功，无编译错误
```

### 功能验证

1. ✅ 环境变量解析正常
2. ✅ 异常处理正常
3. ✅ 类型检查通过
4. ✅ 向后兼容性保持

## 🎯 最佳实践

1. **环境变量驱动**：所有配置都从环境变量读取
2. **异常处理**：提供 fallback 机制，确保配置解析失败时使用默认值
3. **类型安全**：使用 TypeScript 类型定义确保类型安全
4. **调试支持**：在开发环境下提供详细的调试信息
5. **统一管理**：所有配置通过环境变量统一管理

## ⚠️ 注意事项

- 修改配置时，只需要修改 `.env` 文件中的环境变量
- 环境变量是唯一的配置来源
- 断点配置需要与 UnoCSS 保持一致
- 建议在开发环境下启用调试模式查看配置信息

## 📈 总结

通过这次重构，我们成功解决了 REM 配置重复定义的问题：

1. **统一了配置来源**：所有配置都从环境变量读取
2. **提高了维护性**：修改配置只需要改环境变量
3. **增强了类型安全**：完整的 TypeScript 类型定义
4. **改善了开发体验**：更清晰的代码结构和更好的 IDE 支持

这次重构为后续的配置管理提供了良好的基础，也为其他配置的统一管理提供了参考模式。
