# UnoCSS 使用指南

## 概述

CC-Admin 使用 UnoCSS 作为原子化 CSS 引擎，提供即时编译、高性能、高度可定制的样式解决方案。完美集成了主题系统、响应式设计和 rem 适配方案。

## 🚀 核心特性

- ✅ **即时编译**: 按需生成样式，零运行时开销
- ✅ **Tailwind 兼容**: 支持 Tailwind CSS 语法
- ✅ **原子化设计**: 小而专一的工具类
- ✅ **高度定制**: 灵活的配置和预设系统
- ✅ **性能优异**: 比传统 CSS 框架更小的包体积
- ✅ **开发友好**: VS Code 插件支持，智能提示

## 🛠️ 配置详解

### UnoCSS 配置文件

- 使用 `defineConfig` 进行配置
- 集成多个预设：Uno、Attributify、Icons、Typography
- 配置转换器支持指令和变量组语法
- 自定义断点、颜色、间距等主题变量

### 预设配置

- **presetUno**: 默认预设，兼容 Tailwind CSS
- **presetAttributify**: 属性化预设，支持属性语法
- **presetIcons**: 图标预设，支持多种图标库
- **presetTypography**: 排版预设，提供排版样式

### 主题配置

- **断点系统**: 支持 xs、sm、md、lg、xl、xls 等断点
- **颜色系统**: 集成主题色系、背景色系、文字色系、边框色系
- **间距系统**: 自定义间距和布局尺寸
- **字体系统**: 支持多种字体族和字体大小

## 🎨 使用方式

### 1. 原子化类名

- 直接使用原子化 CSS 类名
- 支持组合和嵌套使用
- 提供丰富的工具类

### 2. 属性化语法

- 使用属性语法简化类名
- 支持布尔属性和值属性
- 提供更直观的写法

### 3. 响应式设计

- 使用断点前缀实现响应式
- 支持移动优先的设计理念
- 提供灵活的布局控制

### 4. 状态变体

- 支持 hover、focus、active 等状态
- 提供 dark 模式支持
- 支持自定义状态变体

## 🔧 自定义规则

### 1. 快捷方式

- 定义常用的类名组合
- 支持参数化快捷方式
- 提供语义化的类名

### 2. 自定义规则

- 创建特定的样式规则
- 支持动态值生成
- 提供灵活的样式定制

### 3. 主题扩展

- 扩展颜色、字体、间距等主题
- 支持 CSS 变量集成
- 提供主题切换支持

## 📱 响应式设计

### 断点系统

- **xs**: 375px - 超小屏（手机）
- **sm**: 768px - 小屏（平板）
- **md**: 1024px - 中屏（小桌面）
- **lg**: 1400px - 大屏（大桌面）
- **xl**: 1660px - 超大屏（大显示器）
- **xls**: 1920px - 特大屏（4K显示器）

### 响应式类名

- 使用断点前缀控制响应式行为
- 支持隐藏、显示、布局等响应式控制
- 提供灵活的响应式策略

## 🎯 最佳实践

### 1. 类名组织

- 按功能分组组织类名
- 使用语义化的类名
- 避免过度嵌套和复杂组合

### 2. 性能优化

- 合理使用原子化类名
- 避免生成过多未使用的样式
- 利用 UnoCSS 的按需编译特性

### 3. 主题集成

- 使用 CSS 变量实现主题切换
- 保持颜色系统的一致性
- 支持深色模式和无障碍访问

### 4. 开发体验

- 安装 VS Code 插件获得智能提示
- 使用 TypeScript 获得类型支持
- 遵循项目的样式规范

## 🔍 调试和优化

### 1. 开发工具

- 使用浏览器开发者工具检查样式
- 利用 UnoCSS 的调试功能
- 监控样式生成和性能

### 2. 性能监控

- 检查生成的 CSS 体积
- 优化未使用的样式
- 监控样式加载时间

### 3. 兼容性检查

- 确保在不同浏览器中的兼容性
- 测试响应式布局效果
- 验证主题切换功能

## 📚 参考资源

### 官方文档

- [UnoCSS 官方文档](https://unocss.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [图标库文档](https://icones.js.org/)

### 社区资源

- UnoCSS 社区和讨论
- 样式设计最佳实践
- 响应式设计指南

## 🎯 总结

UnoCSS 为 CC-Admin 提供了强大而灵活的样式解决方案：

- ✅ **高性能**: 按需编译，零运行时开销
- ✅ **易用性**: 兼容 Tailwind 语法，学习成本低
- ✅ **可定制**: 灵活的配置和扩展系统
- ✅ **主题集成**: 完美支持主题切换和响应式设计
- ✅ **开发体验**: 优秀的工具支持和智能提示

通过合理使用 UnoCSS，可以构建出高效、美观、易维护的用户界面！🚀
