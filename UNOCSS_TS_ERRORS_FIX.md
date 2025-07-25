# UnoCSS TypeScript 错误修复说明

## 问题描述

在 UnoCSS 模块化重构过程中，遇到了 ESLint 的 `@typescript-eslint/naming-convention` 规则报错，总共 74 个错误。

## 错误原因

ESLint 的 `@typescript-eslint/naming-convention` 规则要求对象属性名使用 camelCase 格式，但是 UnoCSS 配置中需要使用：

1. **CSS 属性名**：如 `font-size`、`padding-top`、`margin-left` 等
2. **CSS 类名**：如 `btn-primary`、`text-ellipsis`、`border-primary` 等

这些名称必须保持 kebab-case 格式才能正常工作。

## 解决方案

在相关文件中添加 ESLint 禁用注释：

```typescript
/* eslint-disable @typescript-eslint/naming-convention */
```

### 修复的文件

1. **`unocss/index.ts`** - 主配置文件
2. **`unocss/shortcuts/button.ts`** - 按钮快捷方式
3. **`unocss/shortcuts/index.ts`** - 快捷方式入口
4. **`unocss/shortcuts/layout.ts`** - 布局快捷方式
5. **`unocss/shortcuts/text.ts`** - 文本快捷方式

## 修复效果

### 修复前

```bash
pnpm lint
# 74 problems (74 errors, 0 warnings)
```

### 修复后

```bash
pnpm lint
# 0 problems (0 errors, 0 warnings)
```

## 验证结果

所有检查都通过：

```bash
# 构建测试
pnpm build          # ✅ 成功

# 类型检查
npx vue-tsc --noEmit # ✅ 通过

# ESLint 检查
pnpm lint           # ✅ 通过

# 开发环境
pnpm dev            # ✅ 正常启动
```

## 注意事项

1. **禁用范围**：只在必要的文件中禁用，不影响其他代码的命名规范
2. **功能保持**：修复后所有 UnoCSS 功能正常工作
3. **代码质量**：通过其他 ESLint 规则继续保证代码质量

## 总结

通过合理使用 ESLint 禁用注释，成功解决了 UnoCSS 配置中的命名规范冲突，既保持了代码的功能性，又符合项目的代码规范要求。
