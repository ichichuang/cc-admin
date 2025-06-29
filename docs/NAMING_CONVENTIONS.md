# 项目命名规范

本文档定义了项目中所有文件、目录、变量、函数的命名规范，确保代码的一致性和可维护性。

## 📁 文件命名规范

### Vue 页面文件

- **位置**: `@/views/*/index.vue` 或 `@/views/*/views/*.vue`
- **命名**: `kebab-case` (小写字母，单词间用 `-` 连接)
- **示例**:

  ```
  ✅ user-profile.vue
  ✅ order-history.vue
  ✅ product-detail.vue

  ❌ UserProfile.vue
  ❌ user_profile.vue
  ❌ userProfile.vue
  ```

### Vue 组件文件

- **位置**: `@/views/*/components/*.vue` 或 `@/components/*.vue`
- **命名**: `PascalCase` (大写字母开头，每个单词首字母大写)
- **示例**:

  ```
  ✅ UserCard.vue
  ✅ ProductList.vue
  ✅ HomeBanner.vue

  ❌ user-card.vue
  ❌ user_card.vue
  ❌ userCard.vue
  ```

### TypeScript/JavaScript 文件

- **命名**: `kebab-case`
- **示例**:

  ```
  ✅ user-api.ts
  ✅ form-utils.ts
  ✅ date-helper.js

  ❌ UserAPI.ts
  ❌ user_api.ts
  ❌ userApi.ts
  ```

## 📂 目录命名规范

### 所有目录

- **命名**: `kebab-case` (小写字母，单词间用 `-` 连接)
- **示例**:

  ```
  ✅ user-management/
  ✅ order-history/
  ✅ product-detail/

  ❌ UserManagement/
  ❌ user_management/
  ❌ userManagement/
  ```

## 🔤 代码命名规范

### 变量名

- **命名**: `camelCase` (小写字母开头，后续单词首字母大写)
- **示例**:

  ```typescript
  ✅ const userName = 'john'
  ✅ const isUserLoggedIn = true
  ✅ const formData = {}

  ❌ const user_name = 'john'
  ❌ const UserName = 'john'
  ❌ const user-name = 'john'
  ```

### 常量名

- **命名**: `SCREAMING_SNAKE_CASE` (全大写，单词间用 `_` 连接)
- **示例**:

  ```typescript
  ✅ const API_BASE_URL = 'https://api.example.com'
  ✅ const MAX_RETRY_COUNT = 3
  ✅ const USER_ROLES = ['admin', 'user']

  ❌ const apiBaseUrl = 'https://api.example.com'
  ❌ const maxRetryCount = 3
  ```

### 函数名

- **命名**: `camelCase`
- **示例**:

  ```typescript
  ✅ function getUserInfo() {}
  ✅ const handleFormSubmit = () => {}
  ✅ const validateUserInput = (input) => {}

  ❌ function get_user_info() {}
  ❌ function GetUserInfo() {}
  ❌ const handle-form-submit = () => {}
  ```

### 方法名

- **命名**: `camelCase`
- **示例**:

  ```typescript
  class UserService {
    ✅ getUserById(id: string) {}
    ✅ updateUserProfile(data: object) {}
    ✅ deleteUserAccount() {}

    ❌ get_user_by_id(id: string) {}
    ❌ GetUserById(id: string) {}
  }
  ```

## 🎯 项目结构示例

```
src/views/user-management/
├── index.vue                          # 页面入口 (kebab-case)
├── components/                        # 组件目录
│   ├── UserProfile.vue               # 组件 (PascalCase)
│   ├── UserList.vue                  # 组件 (PascalCase)
│   └── UserSearchForm.vue            # 组件 (PascalCase)
├── views/                            # 子页面目录
│   ├── user-detail.vue              # 子页面 (kebab-case)
│   └── user-settings.vue            # 子页面 (kebab-case)
├── utils/                            # 工具函数目录
│   └── user-utils.ts                # 工具文件 (kebab-case)
└── types/                            # 类型定义目录
    └── user-types.ts                # 类型文件 (kebab-case)
```

## 🔍 自动检查

项目配置了自动检查命名规范的工具：

### 命令行检查

```bash
# 检查所有命名规范
pnpm naming-check

# ESLint 检查代码命名
pnpm lint

# 完整代码检查（包含命名规范）
pnpm code-check
```

### Git 提交检查

- 每次提交前会自动检查命名规范
- 不符合规范的代码无法提交
- 可以通过 `pnpm pre-commit` 手动触发检查

### VSCode 实时检查

- ESLint 插件会实时提示变量和函数命名问题
- 保存文件时自动修复可修复的问题

## ⚠️ 特殊情况

### 例外文件

以下文件不受命名规范约束：

- `index.vue` - 入口文件
- `index.ts` / `index.js` - 导出文件
- `README.md` - 文档文件
- 配置文件 (`vite.config.ts`, `package.json` 等)

### 私有变量

允许使用下划线前缀表示私有变量：

```typescript
✅ const _privateVariable = 'secret'
✅ const _unusedParam = 'temp'
```

### 第三方库

引入第三方库时保持其原有命名：

```typescript
✅ import { createApp } from 'vue'  // Vue 原生命名
✅ import dayjs from 'dayjs'        // 库原有命名
```

## 📖 最佳实践

1. **文件创建时**: 先确定文件类型，再按规范命名
2. **变量声明时**: 优先使用有意义的 camelCase 命名
3. **函数定义时**: 使用动词开头的 camelCase 命名 (如: `getUserInfo`, `handleClick`)
4. **组件开发时**: 组件名要能清楚表达其功能 (如: `UserProfileCard`, `ProductSearchForm`)
5. **提交代码前**: 运行 `pnpm pre-commit` 确保符合规范

## 🤝 团队协作

团队成员应该：

- 熟读本规范文档
- 在 VSCode 中安装 ESLint 插件
- 提交前运行检查命令
- 代码评审时检查命名规范
- 遇到特殊情况时讨论并更新规范

---

**注意**: 此规范是强制性的，所有不符合规范的代码都无法通过 Git 提交检查。
