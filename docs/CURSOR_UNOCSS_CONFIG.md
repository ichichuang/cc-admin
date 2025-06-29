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
