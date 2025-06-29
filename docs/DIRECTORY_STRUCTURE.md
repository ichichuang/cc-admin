# 项目目录结构规范

## 概述

为了保持项目结构的清晰和一致性，我们建立了统一的目录结构规范。所有功能性目录都遵循相同的模式：`index.ts` 入口文件 + `modules/` 子目录的结构。

## 统一结构模式

```
src/
├── api/              # API 接口管理
│   ├── index.ts      # 入口文件，自动导入 modules 下的所有模块
│   └── modules/      # API 模块目录
│       ├── test.ts   # 测试相关 API
│       └── ...       # 其他 API 模块
├── stores/           # 状态管理
│   ├── index.ts      # 入口文件
│   └── modules/      # Store 模块目录
│       ├── app.ts    # 应用状态
│       └── ...       # 其他 Store 模块
├── router/           # 路由管理
│   ├── index.ts      # 入口文件
│   └── modules/      # 路由模块目录
│       ├── dashboard.ts  # 仪表盘路由
│       ├── test.ts       # 测试路由
│       └── ...           # 其他路由模块
├── hooks/            # 自定义 Hook
│   ├── index.ts      # 入口文件
│   └── modules/      # Hook 模块目录
│       └── ...       # Hook 模块
├── common/           # 公共模块
│   ├── index.ts      # 入口文件
│   └── modules/      # 公共模块目录
│       ├── constants.ts  # 常量定义
│       ├── helpers.ts    # 工具函数
│       └── ...           # 其他公共模块
└── utils/            # 工具函数
    ├── moduleLoader.ts   # 模块自动加载工具
    └── ...
```

## 自动导入机制

### 核心工具函数

位于 `src/utils/moduleLoader.ts`，提供以下功能：

- `autoImportModulesSync()`: 同步自动导入模块
- `createModuleImporter()`: 创建模块导入器工厂函数

### 工作原理

1. 每个功能目录的 `index.ts` 使用 `import.meta.glob()` 扫描 `modules/` 目录
2. 通过 `autoImportModulesSync()` 处理并导入所有模块
3. 自动生成统一的导出接口

## 各目录详细说明

### API 目录 (`src/api/`)

**结构**：

```typescript
// api/index.ts
import { autoImportModulesSync } from '@/utils/moduleLoader'

const apiModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedAPIs = autoImportModulesSync(apiModules)

export const testAPI = importedAPIs.test
// 添加新模块时在这里导出
```

**使用方式**：

```typescript
// 具名导入
import { testAPI } from '@/api'

// 默认导入
import api from '@/api'
api.test.getTest()
```

### Stores 目录 (`src/stores/`)

**模块规范**：每个 store 模块应该使用 Pinia 的 `defineStore()`

**使用方式**：

```typescript
import { useAppStore } from '@/stores'
```

### Router 目录 (`src/router/`)

**模块规范**：每个路由模块应该导出 `RouteRecordRaw[]` 数组

**使用方式**：路由会自动合并到主路由配置中

### Hooks 目录 (`src/hooks/`)

**模块规范**：每个 hook 模块应该导出自定义 hook 函数

**使用方式**：

```typescript
import { useStorage } from '@/hooks'
```

### Common 目录 (`src/common/`)

**模块规范**：

- `constants.ts`: 应用常量定义
- `helpers.ts`: 工具函数集合

**使用方式**：

```typescript
import { constants, helpers } from '@/common'

// 使用常量
const baseUrl = constants.API_CONFIG.baseUrl

// 使用工具函数
const formattedDate = helpers.formatDate(new Date())
```

## 添加新模块的步骤

### 1. 创建模块文件

在对应目录的 `modules/` 下创建新的 `.ts` 文件：

```typescript
// 例如：src/api/modules/user.ts
export const userAPI = {
  getUser: () => alovaInstance.Get('/user'),
  // ... 其他接口
}

export default userAPI
```

### 2. 更新入口文件

在对应的 `index.ts` 中添加导出：

```typescript
// src/api/index.ts
export const testAPI = importedAPIs.test
export const userAPI = importedAPIs.user // 新增这行
```

### 3. 无需手动导入

由于使用了自动导入机制，新模块会自动被扫描和导入，你只需要在入口文件中添加具体的导出即可。

## 优势

1. **结构统一**：所有功能目录都遵循相同的结构模式
2. **自动化**：新增模块时减少手动维护导入导出的工作
3. **类型安全**：TypeScript 支持完整的类型推断
4. **易于维护**：清晰的目录结构便于代码组织和查找
5. **扩展性好**：可以轻松添加新的功能目录

## 注意事项

1. 模块文件名将作为导入后的属性名（去掉扩展名）
2. 每个模块应该有明确的默认导出
3. 遵循项目的命名规范（camelCase）
4. 在入口文件中添加必要的类型定义和注释

## 路径别名

项目配置了以下路径别名：

- `@/` → `src/`
- `@api/` → `src/api/`
- `@stores/` → `src/stores/`
- `@router/` → `src/router/`
- `@hooks/` → `src/hooks/`
- `@common/` → `src/common/`

可以直接使用这些别名进行导入，提高开发效率。
