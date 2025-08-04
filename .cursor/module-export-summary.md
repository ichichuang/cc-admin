<!--
  @copyright Copyright (c) 2025 chichuang
  @license 自定义商业限制许可证
  @description cc-admin 企业级后台管理框架 - module-export-summary

  本文件受版权保护，商业使用需要授权。
  联系方式: https://github.com/ichichuang/cc-admin/issues

  This file is protected by copyright. Commercial use requires authorization.
  Contact: https://github.com/ichichuang/cc-admin/issues
-->

# 模块导出规范优化总结

## 📋 概述

本文档总结了 cc-admin 项目中模块导出规范的优化情况，确保所有模块都遵循统一的导出策略。

## ✅ 已优化的模块

### 1. API 模块 (`src/api/index.ts`)

**优化内容：**

- ✅ 保持统一导出所有 API 模块
- ✅ 按需导出常用 API 函数：`login`, `getUserInfo`, `getAuthRoutes`
- ✅ 提供类型支持

**使用方式：**

```typescript
// 统一导入
import { login, getUserInfo } from '@/api'

// 按需导入
import { login } from '@/api'
```

### 2. 常量模块 (`src/constants/index.ts`)

**优化内容：**

- ✅ 删除未使用的配置项
- ✅ 保留已使用的配置：`errorPages`, `routeWhiteList`, `remConfig` 等
- ✅ 分类导出，便于理解

**使用方式：**

```typescript
// 路由相关
import { errorPages, routeWhiteList } from '@/constants'

// REM 适配相关
import { remConfig, breakpoints } from '@/constants'
```

### 3. 状态管理模块 (`src/stores/index.ts`)

**优化内容：**

- ✅ 统一导出所有 Store 模块
- ✅ 按需导出常用 Store：`useAppStore`, `useUserStore`, `usePermissionStore` 等
- ✅ 提供 `WithOut` 版本，便于在非组件中使用

**使用方式：**

```typescript
// 统一导入
import { useUserStore, useAppStore } from '@/stores'

// 在非组件中使用
import { useUserStoreWithOut } from '@/stores'
```

### 4. 工具函数模块 (`src/utils/index.ts`)

**优化内容：**

- ✅ 新增统一导出文件
- ✅ 按需导出常用工具：`env`, `isDev`, `getDeviceInfo` 等
- ✅ 提供类型安全的工具函数

**使用方式：**

```typescript
// 环境变量
import { env, isDev, isProd } from '@/utils'

// 设备信息
import { getDeviceInfo, isMobile } from '@/utils'

// REM 适配
import { toRem, toPx, getRemBase } from '@/utils'
```

### 5. 组合式函数模块 (`src/hooks/index.ts`)

**优化内容：**

- ✅ 保持自动导入机制
- ✅ 按需导出常用 Hooks：`useLoading`, `useLocale`, `usePageTitle`
- ✅ 提供类型支持

**使用方式：**

```typescript
// 统一导入
import { useLoading, useLocale } from '@/hooks'

// 按需导入
import { useLoading } from '@/hooks'
```

### 6. 公共模块 (`src/common/index.ts`)

**优化内容：**

- ✅ 保持自动导入机制
- ✅ 使用 `export *` 方式导出所有模块（因为方法较多）
- ✅ 提供完整的工具函数集合

**使用方式：**

```typescript
// 日期工具（50+ 个方法）
import { DateUtils, format, fromNow, getFriendlyTime } from '@/common'

// 函数工具
import { getSystemColorMode, applyOpacityToColor, toKebabCase } from '@/common'

// 验证工具
import { cloneDeep } from '@/common'

// 路由工具（30+ 个方法）
import { goBack, getFlatRouteList, getRouteByName } from '@/common'
```

### 7. 国际化模块 (`src/locales/index.ts`)

**优化内容：**

- ✅ 保持现有功能
- ✅ 明确导出常用函数：`t`, `setLocale`, `getCurrentLocale`
- ✅ 提供类型支持

**使用方式：**

```typescript
// 翻译函数
import { t, setLocale, getCurrentLocale } from '@/locales'

// 格式化函数
import { d, n } from '@/locales'
```

### 8. 路由模块 (`src/router/index.ts`)

**优化内容：**

- ✅ 保持自动导入机制
- ✅ 按需导出常用工具：`initDynamicRoutes`, `registerRouterGuards`
- ✅ 提供路由工具函数

**使用方式：**

```typescript
// 路由工具
import { routeUtils, dynamicRouteManager } from '@/router'

// 路由守卫
import { registerRouterGuards } from '@/router'
```

### 9. 类型定义模块 (`src/Types/index.ts`)

**优化内容：**

- ✅ 保持全局类型声明
- ✅ 使用 `export *` 方式导出所有类型（类型定义较多）
- ✅ 按需导出常用类型：`UserInfo`, `RouteConfig`, `DeviceInfo` 等
- ✅ 提供类型分类

**使用方式：**

```typescript
// 用户相关类型
import type { UserInfo, UserRole } from '@/Types'

// 路由相关类型
import type { RouteConfig, MenuItem } from '@/Types'

// 设备相关类型
import type { DeviceInfo, ScreenSize } from '@/Types'
```

## 🎯 优化效果

### 1. 开发体验提升

- **简化导入路径**：从 `@/stores/modules/user` 简化为 `@/stores`
- **统一导入方式**：所有模块都支持统一导入
- **智能提示**：IDE 能更好地提供代码提示

### 2. 代码维护性提升

- **集中管理**：所有导出都在 `index.ts` 中管理
- **类型安全**：提供完整的 TypeScript 类型支持
- **向后兼容**：支持多种导入方式

### 3. 性能优化

- **按需导入**：避免不必要的模块加载
- **明确导出**：只导出实际使用的功能
- **打包优化**：减少打包体积

## 📝 使用规范

### 1. 导入优先级

```typescript
// ✅ 推荐：统一导入
import { useUserStore, useAppStore } from '@/stores'

// ✅ 推荐：按需导入
import { useUserStore } from '@/stores'

// ✅ 推荐：工具函数统一导入（方法较多时）
import { DateUtils, format, fromNow } from '@/common'

// ❌ 不推荐：直接导入模块
import { useUserStore } from '@/stores/modules/user'
```

### 2. 类型导入

```typescript
// ✅ 推荐：从 Types 模块导入
import type { UserInfo, RouteConfig } from '@/Types'

// ✅ 推荐：从具体模块导入
import type { UserInfo } from '@/stores/modules/user'
```

### 3. 工具函数导入

```typescript
// ✅ 推荐：从 utils 统一导入
import { env, isDev, getDeviceInfo } from '@/utils'

// ✅ 推荐：从具体模块导入
import { env } from '@/utils/env'

// ✅ 推荐：从 common 统一导入（方法较多时）
import { DateUtils, goBack, cloneDeep } from '@/common'
```

### 4. 导出策略选择

**使用 `export *` 的场景：**

- 模块导出方法很多（如 `src/common/modules/date.ts` 有 50+ 个方法）
- 工具函数集合（如 lodash 风格的函数库）
- 类型定义模块（如 `src/Types/`）
- 常量配置模块（如 `src/constants/`）

**使用按需导出的场景：**

- 模块导出方法较少（如 API 模块通常只有几个方法）
- 需要明确控制导出的模块
- 性能敏感的场景（避免打包体积过大）

**混合策略：**

- 主要使用 `export *` 导出所有
- 同时按需导出常用项，便于使用

## 🔄 后续维护

### 1. 新增模块时

- 在对应目录下创建 `modules/` 文件夹
- 在 `index.ts` 中添加导出
- 提供类型支持

### 2. 修改导出时

- 更新 `index.ts` 文件
- 更新相关文档
- 确保向后兼容

### 3. 删除模块时

- 从 `index.ts` 中移除导出
- 删除相关文件
- 更新依赖关系

---

> **注意**: 所有模块都应遵循此导出规范，确保项目的一致性和可维护性。
