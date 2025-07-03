# Cursor 编辑器 UnoCSS 配置说明

## 🎯 配置目标

为 Cursor 编辑器配置 UnoCSS 支持，实现智能提示、语法高亮和自动完成功能。

## 📦 已安装的扩展

### 主要扩展

- **antfu.unocss** - UnoCSS 官方扩展，提供智能提示和语法支持

### 已移除的扩展

- ~~bradlc.vscode-tailwindcss~~ - 已替换为 UnoCSS 扩展

## ⚙️ 配置详情

### UnoCSS 核心设置

```json
{
  "unocss.root": "./", // 项目根目录
  "unocss.configFile": "uno.config.ts", // 配置文件路径
  "unocss.remToPxPreview": true, // rem 到 px 的预览
  "unocss.colorPreview": true, // 颜色预览
  "unocss.enableIntelliSense": true, // 启用智能提示
  "unocss.intelliSense.autocomplete": true, // 自动完成
  "unocss.intelliSense.matchHighlight": true, // 匹配高亮
  "unocss.intelliSense.remToPxHover": true, // 悬停显示 px 值
  "unocss.intelliSense.strictDetection": false // 非严格检测模式
}
```

### CSS 验证优化

```json
{
  "css.validate": false // 禁用 CSS 验证以避免 UnoCSS 类名报错
}
```

### 文件类型关联

```json
{
  "uno.config.ts": "typescript" // UnoCSS 配置文件识别为 TypeScript
}
```

### 语言特定支持

- **Vue 文件**: 启用 UnoCSS 自动完成
- **HTML 文件**: 启用 UnoCSS 自动完成

## 🚀 功能特性

### 1. 智能自动完成

- 输入 `flex-` 会自动提示所有 flex 相关的类名
- 支持自定义快捷类的提示（如 `btn-primary`, `card-hover` 等）
- 根据 `uno.config.ts` 中的配置动态提示

### 2. 颜色预览

- 颜色类名旁边显示颜色块预览
- 支持自定义主题色（primary, success, warning, danger, info, gray）
- 十六进制颜色规则预览

### 3. 单位转换

- rem 值自动显示对应的 px 值
- 悬停时显示详细的单位信息

### 4. 语法高亮

- UnoCSS 类名高亮显示
- 错误类名提示和警告

## 🔧 使用方法

### 1. 在 Vue 组件中使用

```vue
<template>
  <!-- 智能提示会显示所有可用的类名 -->
  <div class="flex-center bg-primary-500 text-white">
    <button class="btn-primary">点击我</button>
  </div>
</template>
```

### 2. 属性化模式

```vue
<template>
  <!-- 属性化模式也支持智能提示 -->
  <div
    uno-flex="center"
    uno-bg="primary-500"
    uno-text="white"
  >
    内容
  </div>
</template>
```

### 3. 自定义快捷类

```vue
<template>
  <!-- 会提示项目中定义的快捷类 -->
  <div class="card-hover">
    <div class="card-body">
      <input class="input-success" />
    </div>
  </div>
</template>
```

## 📝 注意事项

1. **重启编辑器**: 配置更改后建议重启 Cursor 编辑器
2. **扩展更新**: 确保 UnoCSS 扩展是最新版本
3. **配置同步**: 团队成员需要安装推荐的扩展才能获得完整体验
4. **性能优化**: 大型项目可能需要调整 `strictDetection` 设置

## 🛠️ 故障排除

### 智能提示不工作

1. 检查扩展是否正确安装
2. 确认 `uno.config.ts` 文件路径正确
3. 重启编辑器或重新加载窗口

### 类名报错

1. 确认 `css.validate` 设置为 `false`
2. 检查 ESLint 配置是否冲突

### 颜色预览不显示

1. 确认 `unocss.colorPreview` 设置为 `true`
2. 检查颜色定义格式是否正确

## 🎨 自定义配置文件位置

当前配置文件位置：`uno.config.ts` (项目根目录)

如需更改配置文件位置，请同时更新：

- `vite.config.ts` 中的 UnoCSS 插件配置
- `.vscode/settings.json` 中的 `unocss.configFile` 设置

# UnoCSS 配置指南

本文档介绍CC-Admin项目中UnoCSS的完整配置，包括预设、快捷类、主题颜色变量和动态主题系统的配置。

## 目录

- [基础配置](#基础配置)
- [预设配置](#预设配置)
- [快捷类配置](#快捷类配置)
- [主题颜色变量](#主题颜色变量)
- [动态主题系统](#动态主题系统)
- [尺寸变量配置](#尺寸变量配置)
- [使用示例](#使用示例)
- [最佳实践](#最佳实践)

## 基础配置

### 预设配置

项目使用以下UnoCSS预设：

- `presetUno()` - 基础预设，提供Tailwind CSS兼容的实用类
- `presetAttributify()` - 属性化模式，可以将样式写成HTML属性
- `presetIcons()` - 图标预设，支持多种图标库
- `presetTypography()` - 排版预设，提供丰富的文本样式

### 转换器配置

- `transformerDirectives()` - 支持@apply等指令
- `transformerVariantGroup()` - 支持变体组语法

## 快捷类配置

### 布局相关快捷类

```typescript
// 水平居中对齐
'flex-center' // 等价于: flex items-center justify-center

// 两端对齐
'flex-between' // 等价于: flex items-center justify-between

// 均匀分布
'flex-around' // 等价于: flex items-center justify-around

// 垂直居中
'flex-col-center' // 等价于: flex flex-col items-center justify-center
```

### 按钮相关快捷类

```typescript
// 基础按钮（使用动态主题变量）
'btn-primary' // 主要按钮，使用主题primary颜色
'btn-success' // 成功按钮，使用主题success颜色
'btn-danger' // 危险按钮，使用主题error颜色
'btn-warning' // 警告按钮，使用主题warning颜色
'btn-info' // 信息按钮，使用主题info颜色
```

### 卡片相关快捷类

```typescript
// 基础卡片（使用动态主题变量）
'card' // 基础卡片样式，使用主题背景色
'card-hover' // 带悬停效果的卡片
'card-body' // 卡片主体，使用主题间距
'card-header' // 卡片头部，使用主题间距
'card-footer' // 卡片底部，使用主题间距
```

### 输入框相关快捷类

```typescript
// 输入框（使用动态主题变量）
'input' // 基础输入框，使用主题颜色和圆角
'input-error' // 错误状态输入框
'input-success' // 成功状态输入框
```

## 主题颜色变量

### 基础功能色变量

这些变量直接映射到theme.ts中的CSS变量：

```scss
// Primary 主色系
bg-theme-primary          // var(--theme-primary-color)
bg-theme-primary-hover    // var(--theme-primary-hover)
bg-theme-primary-active   // var(--theme-primary-active)
bg-theme-primary-disabled // var(--theme-primary-disabled)
bg-theme-primary-light    // var(--theme-primary-light)

// Success 成功色系
bg-theme-success          // var(--theme-success-color)
bg-theme-success-hover    // var(--theme-success-hover)
bg-theme-success-active   // var(--theme-success-active)
bg-theme-success-disabled // var(--theme-success-disabled)
bg-theme-success-light    // var(--theme-success-light)

// Warning 警告色系
bg-theme-warning          // var(--theme-warning-color)
bg-theme-warning-hover    // var(--theme-warning-hover)
bg-theme-warning-active   // var(--theme-warning-active)
bg-theme-warning-disabled // var(--theme-warning-disabled)
bg-theme-warning-light    // var(--theme-warning-light)

// Error 错误色系
bg-theme-error            // var(--theme-error-color)
bg-theme-error-hover      // var(--theme-error-hover)
bg-theme-error-active     // var(--theme-error-active)
bg-theme-error-disabled   // var(--theme-error-disabled)
bg-theme-error-light      // var(--theme-error-light)

// Info 信息色系
bg-theme-info             // var(--theme-info-color)
bg-theme-info-hover       // var(--theme-info-hover)
bg-theme-info-active      // var(--theme-info-active)
bg-theme-info-disabled    // var(--theme-info-disabled)
bg-theme-info-light       // var(--theme-info-light)
```

### 主题相关颜色

```scss
// 基础主题颜色
bg-theme                  // var(--theme-color)
text-theme-text           // var(--theme-text-color)
bg-theme-bg               // var(--background-color)
bg-theme-bg-highlight     // var(--background-highlight-color)
text-theme-text-color     // var(--text-color)
text-theme-text-muted     // var(--text-muted-color)
```

## 动态主题系统

### 当前活跃主题颜色（Active Colors）

这些颜色会跟随当前主题模式（浅色/深色）自动变化：

```scss
// Active Primary 当前活跃主色系
bg-active-primary         // var(--theme-active-primary-color)
bg-active-primary-hover   // var(--theme-active-primary-hover)
bg-active-primary-active  // var(--theme-active-primary-active)
bg-active-primary-disabled // var(--theme-active-primary-disabled)
bg-active-primary-light   // var(--theme-active-primary-light)

// 其他功能色同样有active版本
bg-active-success, bg-active-warning, bg-active-error, bg-active-info
text-active-success, text-active-warning, text-active-error, text-active-info
border-active-success, border-active-warning, border-active-error, border-active-info
```

### 对比主题颜色（Contrast Colors）

这些颜色始终使用与当前主题模式相反的颜色：

```scss
// Contrast Primary 对比主色系
bg-contrast-primary       // var(--theme-contrast-primary-color)
bg-contrast-primary-hover // var(--theme-contrast-primary-hover)
text-contrast-primary     // 文字颜色
border-contrast-primary   // 边框颜色

// 其他功能色同样有contrast版本
bg-contrast-success, bg-contrast-warning, bg-contrast-error, bg-contrast-info
text-contrast-success, text-contrast-warning, text-contrast-error, text-contrast-info
```

## 尺寸变量配置

### 动态尺寸控制系统

项目新增了动态尺寸控制功能，每个尺寸预设（紧凑/默认/舒适）都内置了尺寸选择器：

```typescript
// 每个尺寸预设都包含以下控制变量：
activeGapSize: 'md' // 当前选中的间距尺寸（xs/sm/md/lg/xl）
activeRadiusSize: 'md' // 当前选中的圆角尺寸（xs/sm/md/lg/xl）

// 以及对应的选项配置：
gapOptions: [
  { label: '超小', value: 'xs' },
  { label: '小', value: 'sm' },
  { label: '中等', value: 'md' },
  { label: '大', value: 'lg' },
  { label: '超大', value: 'xl' },
]
radiusOptions: [
  { label: '超小圆角', value: 'xs' },
  { label: '小圆角', value: 'sm' },
  { label: '中等圆角', value: 'md' },
  { label: '大圆角', value: 'lg' },
  { label: '超大圆角', value: 'xl' },
]
```

这样设计的好处：

- **灵活控制**：可以在同一个尺寸预设内独立控制间距和圆角的大小
- **用户友好**：通过中文标签让用户更容易理解选项含义
- **响应式设计**：不同预设模式有不同的默认选择（紧凑=sm, 默认=md, 舒适=lg）

### 间距变量

```scss
// 基础间距（直接映射到CSS变量）
p-theme-xs        // padding: var(--gap-xs)
p-theme-sm        // padding: var(--gap-sm)
p-theme-md        // padding: var(--gap-md)
p-theme-lg        // padding: var(--gap-lg)
p-theme-xl        // padding: var(--gap-xl)

// 动态间距（跟随尺寸预设变化）
p-active-xs       // padding: var(--theme-active-gap-xs)
p-active-sm       // padding: var(--theme-active-gap-sm)
p-active-md       // padding: var(--theme-active-gap-md)
p-active-lg       // padding: var(--theme-active-gap-lg)
p-active-xl       // padding: var(--theme-active-gap-xl)

// 当前选中的动态间距尺寸
p-active-size     // padding: var(--theme-active-gap-size)
```

### 布局尺寸变量

```scss
// 基础布局尺寸
w-sidebar                 // width: var(--sidebar-width)
w-sidebar-collapsed       // width: var(--sidebar-collapsed-width)
h-header                  // height: var(--header-height)
h-breadcrumb              // height: var(--breadcrumb-height)
h-footer                  // height: var(--footer-height)
h-tabs                    // height: var(--tabs-height)

// 动态布局尺寸（跟随尺寸预设变化）
w-active-sidebar          // width: var(--theme-active-sidebar-width)
w-active-sidebar-collapsed // width: var(--theme-active-sidebar-collapsed-width)
h-active-header           // height: var(--theme-active-header-height)
h-active-breadcrumb       // height: var(--theme-active-breadcrumb-height)
h-active-footer           // height: var(--theme-active-footer-height)
h-active-tabs             // height: var(--theme-active-tabs-height)
```

### 圆角变量

```scss
// 基础圆角
rounded-theme-xs          // border-radius: var(--radius-xs)
rounded-theme-sm          // border-radius: var(--radius-sm)
rounded-theme-md          // border-radius: var(--radius-md)
rounded-theme-lg          // border-radius: var(--radius-lg)
rounded-theme-xl          // border-radius: var(--radius-xl)
// 注意：rounded-full由UnoCSS原生提供，不需要额外配置

// 动态圆角（跟随尺寸预设变化）
rounded-active-xs         // border-radius: var(--theme-active-radius-xs)
rounded-active-sm         // border-radius: var(--theme-active-radius-sm)
rounded-active-md         // border-radius: var(--theme-active-radius-md)
rounded-active-lg         // border-radius: var(--theme-active-radius-lg)
rounded-active-xl         // border-radius: var(--theme-active-radius-xl)

// 当前选中的动态圆角尺寸
rounded-active-size       // border-radius: var(--theme-active-radius-size)
```

## 使用示例

### 1. 动态主题按钮

```vue
<template>
  <!-- 使用当前活跃主题颜色的按钮 -->
  <button class="btn-primary">主要操作</button>

  <!-- 使用对比主题颜色的按钮 -->
  <button class="bg-contrast-primary text-contrast-bg p-active-sm rounded-active-md">
    对比色按钮
  </button>
</template>
```

### 2. 自适应卡片

```vue
<template>
  <!-- 使用动态主题变量的卡片 -->
  <div class="card">
    <div class="card-header">
      <h3 class="text-active-text">卡片标题</h3>
    </div>
    <div class="card-body">
      <p class="text-active-text-muted">卡片内容</p>
    </div>
    <div class="card-footer">
      <button class="btn-primary">操作</button>
    </div>
  </div>
</template>
```

### 3. 状态指示器

```vue
<template>
  <!-- 不同状态的指示器 -->
  <div class="flex gap-active-sm">
    <span class="bg-active-success text-white px-active-sm py-1 rounded-active-sm"> 成功 </span>
    <span class="bg-active-warning text-white px-active-sm py-1 rounded-active-sm"> 警告 </span>
    <span class="bg-active-error text-white px-active-sm py-1 rounded-active-sm"> 错误 </span>
  </div>
</template>
```

### 4. 响应式布局

```vue
<template>
  <!-- 使用动态尺寸变量的布局 -->
  <div class="flex">
    <aside class="w-active-sidebar bg-active-bg-highlight">侧边栏</aside>
    <main class="flex-1">
      <header class="h-active-header bg-active-bg">头部</header>
      <div class="p-active-md">主要内容</div>
    </main>
  </div>
</template>
```

### 5. 动态尺寸控制

```vue
<template>
  <!-- 使用当前选中的动态尺寸 -->
  <div class="p-active-size rounded-active-size bg-active-bg-highlight">
    <h3 class="mb-active-size">智能尺寸卡片</h3>
    <p class="text-active-text-muted">这个卡片的间距和圆角会根据用户当前选择的尺寸动态调整</p>
    <div class="mt-active-size space-y-active-size">
      <button class="px-active-size py-2 bg-active-primary text-white rounded-active-size">
        智能按钮
      </button>
      <div class="flex gap-active-size">
        <span
          class="px-active-size py-1 bg-active-success-light text-active-success rounded-active-size"
        >
          标签1
        </span>
        <span
          class="px-active-size py-1 bg-active-warning-light text-active-warning rounded-active-size"
        >
          标签2
        </span>
      </div>
    </div>
  </div>
</template>
```

## 最佳实践

### 1. 优先使用动态主题变量

```vue
<!-- ✅ 推荐：使用动态主题变量 -->
<div class="bg-active-primary text-white">
  主要内容
</div>

<!-- ❌ 不推荐：使用固定颜色 -->
<div class="bg-blue-500 text-white">
  主要内容
</div>
```

### 2. 合理使用对比色

```vue
<!-- ✅ 推荐：在深色背景上使用对比色文字 -->
<div class="bg-active-primary text-contrast-text">
  清晰可读的文字
</div>

<!-- ✅ 推荐：制作主题切换指示器 -->
<div class="bg-contrast-bg text-contrast-text p-active-sm rounded-active-sm">
  预览对比主题效果
</div>
```

### 3. 响应式尺寸

```vue
<!-- ✅ 推荐：使用动态尺寸变量 -->
<div class="p-active-md rounded-active-lg">
  自适应间距和圆角
</div>

<!-- ✅ 推荐：响应式布局组件 -->
<header class="h-active-header px-active-lg">
  自适应高度和间距的头部
</header>
```

### 4. 状态表示

```vue
<!-- ✅ 推荐：使用语义化的状态颜色 -->
<div class="border-l-4 border-active-success bg-active-success-light p-active-sm">
  <p class="text-active-success">操作成功！</p>
</div>

<div class="border-l-4 border-active-error bg-active-error-light p-active-sm">
  <p class="text-active-error">操作失败！</p>
</div>
```

### 5. 组合使用

```vue
<!-- ✅ 推荐：组合使用多种动态变量 -->
<button
  class="
  bg-active-primary
  hover:bg-active-primary-hover
  active:bg-active-primary-active
  disabled:bg-active-primary-disabled
  text-white
  px-active-md
  py-active-sm
  rounded-active-md
  transition-colors
"
>
  完美的动态按钮
</button>
```

### 6. 智能尺寸控制

```vue
<!-- ✅ 推荐：使用动态尺寸控制 -->
<div class="p-active-size rounded-active-size">
  <!-- 根据用户选择的尺寸自动调整间距和圆角 -->
  智能适应的组件
</div>

<!-- ✅ 推荐：完全圆角使用UnoCSS原生类 -->
<div class="rounded-full">
  <!-- 使用UnoCSS原生的rounded-full，而不是自定义变量 -->
  圆形头像
</div>

<!-- ✅ 推荐：混合使用固定和动态尺寸 -->
<div class="p-active-size rounded-full border-2">
  <!-- 间距动态，圆角固定为完全圆形，边框固定宽度 -->
  平衡的设计
</div>
```

## 注意事项

1. **CSS变量的响应性**：所有动态主题变量都会在主题切换时自动更新，无需手动处理。

2. **性能考虑**：UnoCSS会在构建时生成实际使用的CSS类，未使用的变量不会包含在最终文件中。

3. **类型安全**：建议在TypeScript项目中为常用的主题变量创建类型定义，确保使用正确。

4. **调试技巧**：可以在浏览器开发者工具中查看计算后的CSS变量值，方便调试主题效果。

5. **兼容性**：所有现代浏览器都支持CSS变量，可以放心使用。

6. **radiusRound移除**：项目中已移除`radiusRound`相关配置，因为UnoCSS原生提供`rounded-full`类，功能完全相同且更标准化。

7. **动态尺寸控制**：新增的`activeGapSize`和`activeRadiusSize`变量提供更灵活的尺寸控制，可以在同一预设内独立调整间距和圆角大小。

通过这套完整的主题变量系统，你可以轻松创建出既美观又具有良好用户体验的动态主题界面。
