<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - rem-adapter
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

# REM 适配系统

## 概述

CC-Admin 框架提供了完整的 REM 适配解决方案，支持大屏、移动端、不同屏幕宽度的自适应布局。

## 特点

- 🎯 **统一配置管理**：所有 REM 相关配置统一在 `src/utils/env.ts` 中管理
- 📱 **多端适配**：支持桌面端、移动端、大屏等多种设备
- 🔧 **灵活配置**：支持移动端优先和桌面端优先两种策略
- 🎨 **与 UnoCSS 集成**：断点配置与 UnoCSS 保持一致
- ⚡ **性能优化**：支持防抖和节流，避免频繁计算

## 环境变量配置

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

## 使用方法

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

## 适配策略

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

## 配置统一管理

### 问题解决

之前存在的问题：

- `VITE_REM_DESIGN_WIDTH` 在多个文件中重复定义
- 不同文件中的默认值不一致（1800 vs 1920）
- 维护困难，需要同步修改多个文件

### 解决方案

1. **环境变量驱动**：所有配置都从环境变量读取
2. **统一解析函数**：提供 `parseRemConfig()` 函数
3. **类型安全**：定义 `RemConfig` 接口
4. **向后兼容**：保持现有 API 不变

### 文件结构

```
src/utils/
├── env.ts              # 环境变量解析
│   ├── parseRemConfig()      # 解析函数
│   ├── REM_DEFAULT_CONFIG    # 异常时 fallback
│   └── RemConfig            # 类型定义
└── remAdapter.ts        # 适配器实现
    └── parseRemConfigFromEnv() # 使用环境变量
```

## 最佳实践

1. **环境变量驱动**：所有配置都从环境变量读取
2. **异常处理**：提供 fallback 机制，确保配置解析失败时使用默认值
3. **类型安全**：使用 TypeScript 类型定义确保类型安全
4. **调试支持**：在开发环境下提供详细的调试信息
5. **统一管理**：所有配置通过环境变量统一管理

## 注意事项

- 修改配置时，只需要修改 `.env` 文件中的环境变量
- 环境变量是唯一的配置来源
- 断点配置需要与 UnoCSS 保持一致
- 建议在开发环境下启用调试模式查看配置信息
