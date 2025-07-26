# 文档更新日志

## 2025-01-XX - Mock 数据简化重构

### 📝 主要更新

#### 1. Mock 数据简化

- **移除 faker 依赖** - 简化 Mock 数据生成，使用静态数据
- **简化 auth.ts** - 移除复杂的用户数据生成，保留核心认证功能
- **简化 router.ts** - 移除菜单和权限接口，专注路由配置
- **更新 mock-guide.md** - 简化文档内容，移除 faker 相关内容

#### 2. 文档优化

- **mock-guide.md** - 大幅简化，移除冗余代码示例和复杂配置
- **保持核心功能** - 专注认证和路由两个核心 Mock 模块
- **提升可读性** - 使用简洁明了的语言和结构

### 🎯 简化原则

1. **去除冗余内容**
   - 删除 faker 相关的复杂数据生成
   - 移除过多的接口和功能
   - 精简冗长的代码示例

2. **保留核心功能**
   - 用户认证（登录、用户信息）
   - 路由配置获取
   - 基础的 Mock 服务

3. **提升可读性**
   - 使用简洁明了的语言
   - 优化文档结构层次
   - 减少代码示例的复杂度

### 📋 文档结构

```
docs/
├── README.md              # 📋 项目文档总览
├── architecture-guide.md  # 🏗️ 架构设计指南
├── api-guide.md          # 🔧 API 管理指南
├── pinia-guide.md        # 📦 状态管理指南
├── router-guide.md       # 🛣️ 路由管理指南
├── mock-guide.md         # 🎭 Mock 数据指南（已简化）
├── component-guide.md    # 🧩 组件开发指南
├── build-guide.md        # 🚀 构建指南
├── unocss-guide.md       # 🎨 样式系统指南
├── locale.md             # 🌐 国际化指南
├── testing-guide.md      # 🧪 测试指南
├── performance-guide.md  # ⚡ 性能优化指南
├── security-guide.md     # 🔒 安全指南
├── troubleshooting-guide.md # 🔧 故障排除指南
└── CHANGELOG.md          # 📝 更新日志
```

### 🔄 更新内容

#### Mock 数据简化

- **auth.ts** - 简化认证模块，移除 faker 依赖，使用静态用户数据
- **router.ts** - 简化路由模块，只保留 `/auth/routes` 接口
- **移除功能** - 删除用户管理、仪表盘等复杂模块
- **Token 统一** - 使用统一的 `fake-jwt-token-123456` Token

#### 文档更新

- **mock-guide.md** - 大幅简化，移除 faker 相关内容
- **移除冗余** - 删除复杂的代码示例和配置说明
- **保持简洁** - 专注核心功能的使用说明

### 🎯 使用建议

1. **新用户** - 从 `README.md` 开始，了解项目概览
2. **开发者** - 查看 `mock-guide.md` 了解简化的 Mock 服务
3. **维护者** - 参考架构设计指南了解整体设计

### 📞 反馈

如有文档问题或建议，请通过以下方式反馈：

- 提交 Issue 到项目仓库
- 发送邮件到项目维护者
- 在项目讨论区提出建议
