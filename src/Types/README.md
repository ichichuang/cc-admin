<!--
  @copyright Copyright (c) 2025 chichuang
  @license 自定义商业限制许可证
  @description cc-admin 企业级后台管理框架 - 类型声明模块化结构说明

  本文件受版权保护，商业使用需要授权。
  联系方式: https://github.com/ichichuang/cc-admin/issues

  This file is protected by copyright. Commercial use requires authorization.
  Contact: https://github.com/ichichuang/cc-admin/issues
-->

# 类型声明模块化结构

## 概述

本项目采用模块化的类型声明结构，将不同类型的声明分离到独立的模块中，便于维护和管理。

## 目录结构

```
src/types/
├── index.ts              # 主入口文件，导入所有模块
├── modules/              # 类型声明模块目录
│   ├── router.ts         # 路由相关类型
│   ├── user.ts           # 用户相关类型
│   ├── device.ts         # 设备相关类型
│   ├── utils.ts          # 工具类型
│   └── vue.ts            # Vue 相关类型
└── README.md             # 说明文档
```

## 模块说明

### 1. router.ts - 路由类型声明

包含所有路由相关的类型定义：

- `LayoutMode` - 布局模式类型
- `RouteConfig` - 路由配置接口
- `RouteMeta` - 路由元信息接口
- `MenuItem` - 菜单项类型
- `RouteUtils` - 路由工具类型
- `DynamicRouteManager` - 动态路由管理器
- `PermissionResult` - 权限检查结果
- `CacheOperation` - 缓存操作类型

### 2. user.ts - 用户类型声明

包含用户相关的类型定义：

- `UserInfo` - 用户信息接口

### 3. device.ts - 设备类型声明

包含设备相关的类型定义：

- `DeviceInfo` - 设备信息接口

### 4. utils.ts - 工具类型声明

包含通用的工具类型：

- `Nullable<T>` - 可空类型
- `ElRef<T>` - 元素引用类型
- `Recordable<T, K>` - 记录类型
- `ComponentRef<T>` - 组件引用类型

### 5. vue.ts - Vue 类型声明

包含 Vue 相关的类型声明：

- Vue I18n 全局类型声明
- Window 全局接口扩展

## 使用方式

### 全局使用

所有类型声明都是全局可用的，无需导入即可直接使用：

```typescript
// 直接使用，无需导入
const route: RouteConfig = {
  path: '/example',
  name: 'Example',
  component: () => import('@/views/example.vue'),
  meta: {
    title: '示例页面',
    rank: 1,
  },
}

const user: UserInfo = {
  userId: '1',
  username: 'admin',
  roles: ['admin'],
  permissions: ['read', 'write'],
}
```

### 模块化导入

如果需要显式导入类型，可以使用：

```typescript
import type { RouteConfig, UserInfo, DeviceInfo } from '@/types'
```

## 维护指南

### 添加新类型

1. 确定类型所属的模块
2. 在对应的模块文件中添加类型声明
3. 确保使用 `declare global` 块
4. 在文件末尾添加 `export {}` 使其成为外部模块

### 修改现有类型

1. 找到对应的模块文件
2. 在 `declare global` 块中修改类型定义
3. 确保修改不会影响其他模块

### 添加新模块

1. 在 `src/types/modules/` 目录下创建新的 `.ts` 文件
2. 添加版权声明和模块说明
3. 使用 `declare global` 块声明类型
4. 在文件末尾添加 `export {}`
5. 在 `src/types/index.ts` 中导入新模块

## 注意事项

1. **全局声明**：所有类型都使用 `declare global` 块声明，确保全局可用
2. **模块化**：每个模块都是独立的，便于维护和扩展
3. **外部模块**：每个模块文件末尾都有 `export {}`，使其成为外部模块
4. **类型冲突**：避免在不同模块中声明相同的类型名称
5. **导入顺序**：在 `src/types/index.ts` 中注意模块的导入顺序，确保依赖关系正确

## 优势

1. **可维护性**：类型声明按功能模块分离，便于维护
2. **可扩展性**：可以轻松添加新的类型模块
3. **可读性**：代码结构清晰，易于理解
4. **类型安全**：全局类型声明确保类型安全
5. **开发效率**：无需导入即可使用类型，提高开发效率
