<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - Token 安全指南
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

# Token 安全指南

## 重要提醒

**⚠️ 永远不要将真实的 API Token、密钥或密码提交到版本控制系统中！**

## 安全最佳实践

### 1. 环境变量管理

- 使用 `.env` 文件存储本地开发的环境变量
- 将 `.env` 文件添加到 `.gitignore` 中，确保不会被提交
- 使用 `.env.example` 作为模板，包含所有必要的变量但不包含真实值

### 2. GitHub Token 安全

- **立即撤销已暴露的 Token**：如果 Token 被意外提交到代码库，立即在 GitHub 设置中撤销
- **创建新的 Token**：使用最小权限原则创建新的 Token
- **定期轮换**：定期更新 Token 以提高安全性
- **使用环境变量**：在代码中使用 `process.env.GITHUB_TOKEN` 而不是硬编码

### 3. 正确的配置方式

```bash
# .env 文件（本地开发，不提交到 Git）
GITHUB_TOKEN=your_actual_token_here

# .env.example 文件（提交到 Git，作为模板）
GITHUB_TOKEN=your_github_token_here
```

### 4. 检查清单

在提交代码前，请检查：

- [ ] 没有硬编码的 Token 或密码
- [ ] `.env` 文件没有被意外提交
- [ ] 所有敏感信息都使用环境变量
- [ ] 示例文件不包含真实值

### 5. 如果 Token 被暴露

1. **立即撤销**：在 GitHub 设置中撤销暴露的 Token
2. **创建新 Token**：生成新的 Token 替换旧的
3. **更新本地配置**：更新本地 `.env` 文件
4. **检查历史记录**：确保 Token 没有在 Git 历史中保留

## 相关链接

- [GitHub Token 管理](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [审查授权的 OAuth 应用](https://docs.github.com/en/apps/oauth-apps/using-oauth-apps/reviewing-your-authorized-oauth-apps)
- [Token 过期和撤销](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/token-expiration-and-revocation)

## 团队责任

每个团队成员都有责任：

1. 遵循安全最佳实践
2. 在提交代码前进行安全检查
3. 及时报告发现的安全问题
4. 参与安全培训和意识提升
