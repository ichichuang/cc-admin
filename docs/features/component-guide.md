<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description cc-admin 企业级后台管理框架 - component-guide
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

# 组件开发指南

## 概述

cc-admin 采用 Vue 3.5+ 的组合式 API 和 `<script setup>` 语法，遵循现代化的组件开发模式。本指南涵盖组件设计原则、开发规范、最佳实践和复用策略。

## 🏗️ 组件架构

### 目录结构

```
src/components/
├── common/               # 🌐 通用组件
│   ├── LanguageSwitch.vue    # 语言切换组件
│   ├── ThemeToggle.vue       # 主题切换组件
│   └── LoadingSpinner.vue    # 加载动画组件
├── layout/               # 📐 布局组件
│   ├── Loading.vue           # 页面加载组件
│   ├── Sidebar.vue           # 侧边栏组件
│   ├── Header.vue            # 头部组件
│   └── Footer.vue            # 底部组件
├── form/                 # 📝 表单组件
│   ├── FormInput.vue         # 输入框组件
│   ├── FormSelect.vue        # 选择框组件
│   ├── FormCheckbox.vue      # 复选框组件
│   └── FormRadio.vue         # 单选框组件
├── ui/                   # 🎨 UI 组件
│   ├── Button.vue            # 按钮组件
│   ├── Modal.vue             # 模态框组件
│   ├── Table.vue             # 表格组件
│   └── Card.vue              # 卡片组件
└── business/             # 💼 业务组件
    ├── UserCard.vue          # 用户卡片
    ├── DataChart.vue         # 数据图表
    └── SearchPanel.vue       # 搜索面板
```

### 组件分类规范

| 分类         | 说明         | 示例                 | 复用性 |
| ------------ | ------------ | -------------------- | ------ |
| **common**   | 项目通用组件 | 语言切换、主题切换   | 高     |
| **layout**   | 布局相关组件 | 头部、侧边栏、底部   | 中     |
| **form**     | 表单控件组件 | 输入框、选择框、按钮 | 高     |
| **ui**       | 基础UI组件   | 模态框、表格、卡片   | 高     |
| **business** | 业务逻辑组件 | 用户卡片、数据图表   | 低     |

## 🎯 组件设计原则

### 1. 单一职责原则

每个组件应该只负责一个特定的功能，避免功能过于复杂。

### 2. 开闭原则

组件应该对扩展开放，对修改关闭，通过插槽和配置实现扩展。

### 3. 组合优于继承

使用组合式函数和插槽来实现功能复用，而不是通过继承。

## 📚 组件开发模板

### 1. 基础组件模板

- 使用 TypeScript 接口定义 Props
- 使用 `defineEmits` 定义事件
- 使用 `computed` 计算样式类名
- 使用 `defineExpose` 暴露方法

### 2. 表单组件模板

- 支持 v-model 双向绑定
- 提供错误状态和帮助信息
- 支持前缀和后缀插槽
- 完整的表单验证集成

### 3. 业务组件模板

- 集成状态管理和权限控制
- 支持多种交互模式
- 提供丰富的自定义选项

## 🔧 组合式函数集成

### 1. 状态管理集成

- 使用 Pinia 进行状态管理
- 提供响应式的数据访问
- 支持异步操作和错误处理

### 2. 表单验证集成

- 支持多种验证规则
- 提供实时验证和批量验证
- 支持自定义验证器

### 3. 权限控制集成

- 基于角色的权限控制
- 支持细粒度的权限检查
- 提供权限相关的UI状态

## 🎨 样式和主题

### 1. UnoCSS 集成

- 使用原子化CSS类名
- 支持主题变量和动态样式
- 提供响应式设计支持

### 2. 动态样式绑定

- 支持CSS变量动态绑定
- 提供多种样式变体
- 支持条件样式应用

## 🔧 最佳实践

### 1. 性能优化

- 使用 `v-once` 优化静态内容
- 使用 `v-memo` 优化列表渲染
- 实现虚拟滚动处理大量数据
- 使用防抖优化搜索功能

### 2. 错误边界

- 实现错误捕获和恢复
- 提供友好的错误提示
- 支持错误重试机制

### 3. 测试友好

- 添加测试相关的属性
- 提供测试辅助方法
- 支持无障碍访问

## 📋 组件清单

### 通用组件

| 组件名         | 路径                        | 描述         | 状态 |
| -------------- | --------------------------- | ------------ | ---- |
| LanguageSwitch | `common/LanguageSwitch.vue` | 语言切换组件 | ✅   |
| ThemeToggle    | `common/ThemeToggle.vue`    | 主题切换组件 | ✅   |
| LoadingSpinner | `common/LoadingSpinner.vue` | 加载动画组件 | ✅   |

### 表单组件

| 组件名       | 路径                    | 描述       | 状态 |
| ------------ | ----------------------- | ---------- | ---- |
| FormInput    | `form/FormInput.vue`    | 输入框组件 | ✅   |
| FormSelect   | `form/FormSelect.vue`   | 选择框组件 | 🚧   |
| FormCheckbox | `form/FormCheckbox.vue` | 复选框组件 | 🚧   |
| FormRadio    | `form/FormRadio.vue`    | 单选框组件 | 🚧   |

### UI 组件

| 组件名 | 路径            | 描述       | 状态 |
| ------ | --------------- | ---------- | ---- |
| Button | `ui/Button.vue` | 按钮组件   | ✅   |
| Modal  | `ui/Modal.vue`  | 模态框组件 | 🚧   |
| Table  | `ui/Table.vue`  | 表格组件   | 🚧   |
| Card   | `ui/Card.vue`   | 卡片组件   | ✅   |

### 业务组件

| 组件名      | 路径                       | 描述     | 状态 |
| ----------- | -------------------------- | -------- | ---- |
| UserCard    | `business/UserCard.vue`    | 用户卡片 | ✅   |
| DataChart   | `business/DataChart.vue`   | 数据图表 | 🚧   |
| SearchPanel | `business/SearchPanel.vue` | 搜索面板 | 🚧   |

## 🎯 总结

cc-admin 的组件开发体系具有以下特点：

- ✅ **现代化语法**: 使用 Vue 3.5+ 和组合式 API
- ✅ **类型安全**: 完整的 TypeScript 类型支持
- ✅ **模块化设计**: 清晰的组件分类和目录结构
- ✅ **可复用性**: 高度可配置和可扩展的组件设计
- ✅ **性能优化**: 虚拟滚动、懒加载等性能优化策略
- ✅ **主题集成**: 完美集成主题系统和响应式设计
- ✅ **测试友好**: 提供测试辅助属性和方法
- ✅ **开发体验**: 丰富的开发工具和最佳实践指南

通过统一的设计原则和开发规范，确保组件系统的一致性、可维护性和开发效率！🚀
