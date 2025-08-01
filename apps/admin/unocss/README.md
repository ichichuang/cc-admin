<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description Early Bird 企业级后台管理框架 - README
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

# UnoCSS 模块化配置

本项目采用模块化的 UnoCSS 配置结构，将原本的单一大文件拆分为多个功能模块，提高代码的可维护性和可扩展性。

## 目录结构

```
unocss/
├── index.ts          # 主配置文件
├── theme.ts          # 主题配置
├── env.ts            # 环境配置
├── rules/            # 规则模块
│   ├── pixel-rules.ts     # 像素值规则
│   └── theme-rules.ts     # 主题变量规则
├── utils/            # 工具模块
│   └── icons.ts          # 图标工具
└── shortcuts/        # 快捷方式模块
    ├── index.ts          # 快捷方式入口
    ├── layout.ts         # 布局快捷方式
    ├── text.ts           # 文本快捷方式
    └── button.ts         # 按钮快捷方式
```

## 模块说明

### 1. 主配置文件 (`index.ts`)

整合所有模块的主配置文件，包含：

- 预设配置 (presets)
- 变换器 (transformers)
- 变体 (variants)
- 规则 (rules)
- 主题配置 (theme)

### 2. 主题配置 (`theme.ts`)

定义项目的主题配置，包括：

- 断点 (breakpoints)
- 颜色系统 (colors)
- 尺寸系统 (sizes)

与 `src/stores/modules/color.ts` 和 `src/stores/modules/size.ts` 保持完全一致。

### 3. 环境配置 (`env.ts`)

处理开发和生产环境的配置差异：

- 开发环境：启用 inspector 和 HMR
- 生产环境：启用压缩，禁用 inspector

### 4. 规则模块 (`rules/`)

#### `pixel-rules.ts`

创建像素值映射规则，支持设计稿到像素的精确映射。

#### `theme-rules.ts`

创建主题变量映射规则，支持动态主题变量。

### 5. 工具模块 (`utils/`)

#### `icons.ts`

图标相关的工具函数：

- `getCustomIcons()`: 获取自定义图标集合
- `getRouteMetaIcons()`: 获取路由元数据中的图标
- `getCustomCollections()`: 生成自定义图标加载器
- `getDynamicSafelist()`: 获取动态安全列表

### 6. 快捷方式模块 (`shortcuts/`)

#### `index.ts`

合并所有快捷方式模块的入口文件。

#### `layout.ts`

布局相关的快捷方式：

- 基础布局：`full`, `container`, `screen`
- Flex 布局：`center`, `between`, `around`, `start`, `end`
- Grid 布局：`grid-center`

#### `text.ts`

文本相关的快捷方式：

- 文本省略：`text-ellipsis`
- 文本样式：`text-title`, `text-subtitle`, `text-body`, `text-caption`

#### `button.ts`

按钮相关的快捷方式：

- 基础按钮：`btn`, `btn-default`
- 功能色按钮：`btn-primary`, `btn-success`, `btn-warning`, `btn-error`, `btn-info`
- 轮廓按钮：`btn-outline-*`

## 优化亮点

### 1. 删除冗余配置

- 删除了重复的 `line-clamp` 快捷方式
- 简化了变体配置，只保留必要的 `dark`, `hover`, `focus`, `active`

### 2. 模块化拆分

- 将快捷方式按功能分类，便于维护
- 将规则按类型分离，提高可读性
- 将工具函数独立，便于复用

### 3. 性能优化

- 图标 safelist 统一管理
- 环境配置抽离，避免重复判断
- 主题配置与状态管理保持一致

### 4. 类型安全

- 完整的 TypeScript 类型定义
- 严格的图标名称验证
- 错误处理和日志输出

## 使用方式

项目根目录的 `uno.config.ts` 文件现在只是一个简单的导出：

```typescript
/* eslint-disable @typescript-eslint/naming-convention */
// 使用模块化的 UnoCSS 配置
export { default } from './unocss/index'
```

所有的配置逻辑都在 `unocss/` 目录下的模块中，便于维护和扩展。

## 扩展指南

### 添加新的快捷方式

1. 在 `shortcuts/` 目录下创建新的模块文件
2. 在 `shortcuts/index.ts` 中导入并添加到 `shortcuts` 数组

### 添加新的规则

1. 在 `rules/` 目录下创建新的规则文件
2. 在 `index.ts` 中导入并添加到 `rules` 数组

### 修改主题配置

直接修改 `theme.ts` 文件，确保与状态管理模块保持一致。

## 注意事项

1. 所有图标相关的配置都在 `utils/icons.ts` 中统一管理
2. 主题配置必须与 `src/stores/modules/color.ts` 和 `size.ts` 保持一致
3. 环境配置会自动根据 `NODE_ENV` 切换
4. 快捷方式按功能分类，便于查找和维护
