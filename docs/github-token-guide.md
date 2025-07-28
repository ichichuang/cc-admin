<!--
  @copyright Copyright (c) 2025 chichuang
  @license 自定义商业限制许可证
  @description CC-Admin 企业级后台管理框架 - 文档

  本文件受版权保护，商业使用需要授权。
  联系方式: https://github.com/chichuang/cc-admin/issues

  This file is protected by copyright. Commercial use requires authorization.
  Contact: https://github.com/chichuang/cc-admin/issues
-->

# 🔑 GitHub Token 获取和使用指南

## 📋 概述

GitHub Token 是使用 CC-Admin 框架代码监控系统的必要凭证。本指南详细介绍如何获取和配置 GitHub Token。

## 🎯 为什么需要 GitHub Token

CC-Admin 框架的代码监控系统需要访问 GitHub API 来：

- 🔍 搜索代码库中的抄袭行为
- 📊 获取仓库统计信息
- 🍴 监控 Fork 和 Star 情况
- 📝 创建 Issue 和发送通知

## 🔑 获取 GitHub Token

### 方法一：Personal Access Token (Classic) - 推荐

#### 步骤1: 进入 GitHub 设置

1. 登录你的 GitHub 账号
2. 点击右上角头像 → **Settings**
3. 在左侧菜单中找到 **Developer settings**
4. 点击 **Personal access tokens**
5. 选择 **Tokens (classic)**

#### 步骤2: 生成新 Token

1. 点击 **Generate new token (classic)**
2. 输入 Token 描述，例如：`CC-Admin 代码监控系统`
3. 设置过期时间：
   - **No expiration** (推荐，但需要定期检查)
   - **90 days** (更安全的选择)

#### 步骤3: 选择权限范围

勾选以下权限：

**必需权限：**

- ✅ **repo** (完整的仓库访问权限)
- ✅ **read:org** (读取组织信息)
- ✅ **read:user** (读取用户信息)
- ✅ **read:email** (读取邮箱信息)

**可选权限：**

- ✅ **write:org** (如果需要组织级别监控)
- ✅ **admin:org** (如果需要管理组织设置)

#### 步骤4: 生成 Token

1. 点击页面底部的 **Generate token**
2. **立即复制生成的 Token**（重要：页面刷新后无法再次查看）
3. 保存到安全的地方

### 方法二：Fine-grained Personal Access Token (新方式)

#### 步骤1: 创建 Fine-grained Token

1. 在 **Personal access tokens** 页面
2. 选择 **Fine-grained tokens**
3. 点击 **Generate new token**

#### 步骤2: 配置 Token

1. **Token name**: `CC-Admin 监控系统`
2. **Expiration**: 选择合适的时间
3. **Repository access**:
   - 选择 **Only select repositories**
   - 添加你的 CC-Admin 仓库

#### 步骤3: 设置权限

在 **Permissions** 部分设置：

**Repository permissions:**

- ✅ **Contents**: Read
- ✅ **Metadata**: Read
- ✅ **Pull requests**: Read

**Organization permissions:**

- ✅ **Members**: Read

#### 步骤4: 生成 Token

1. 点击 **Generate token**
2. 复制生成的 Token

## 🧪 测试 Token 有效性

### 使用测试脚本

```bash
# 设置环境变量
export GITHUB_TOKEN="your_token_here"

# 运行测试脚本
./scripts/test-github-token.sh
```

### 手动测试

```bash
# 测试用户信息访问
curl -H "Authorization: token YOUR_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/user

# 测试搜索API
curl -H "Authorization: token YOUR_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     "https://api.github.com/search/code?q=test&per_page=1"
```

## ⚙️ 配置 Token

### 方法一：环境变量 (推荐)

#### 临时设置

```bash
# 在当前终端会话中设置
export GITHUB_TOKEN="your_token_here"

# 测试Token
./scripts/test-github-token.sh

# 运行监控
pnpm monitor
```

#### 永久设置

```bash
# 添加到 shell 配置文件
echo 'export GITHUB_TOKEN="your_token_here"' >> ~/.zshrc
# 或
echo 'export GITHUB_TOKEN="your_token_here"' >> ~/.bashrc

# 重新加载配置
source ~/.zshrc
# 或
source ~/.bashrc
```

### 方法二：直接传递

```bash
# 直接在命令中传递Token
GITHUB_TOKEN="your_token_here" pnpm monitor
```

### 方法三：使用 .env 文件

```bash
# 创建 .env 文件
echo "GITHUB_TOKEN=your_token_here" > .env

# 在脚本中加载
source .env
```

## 🔒 安全注意事项

### Token 安全

1. **不要提交到代码库**

   ```bash
   # 确保 .env 文件在 .gitignore 中
   echo ".env" >> .gitignore
   ```

2. **定期轮换 Token**
   - 建议每 90 天更换一次
   - 在 GitHub 设置中删除旧 Token

3. **限制权限范围**
   - 只授予必要的权限
   - 使用 Fine-grained tokens 更安全

4. **监控 Token 使用**
   - 定期检查 Token 的使用情况
   - 发现异常时立即撤销

### 最佳实践

```bash
# 检查Token是否泄露
grep -r "ghp_" . --exclude-dir=node_modules --exclude-dir=.git

# 检查环境变量
env | grep GITHUB_TOKEN
```

## 🚨 常见问题

### 问题1: Token 无效

**症状：**

```
❌ Token 无效或权限不足
```

**解决方案：**

1. 检查 Token 是否正确复制
2. 确认 Token 未过期
3. 验证权限设置是否正确

### 问题2: 权限不足

**症状：**

```
❌ 搜索API权限不足
```

**解决方案：**

1. 重新生成 Token 并添加必要权限
2. 使用 Fine-grained token 并设置正确的仓库权限

### 问题3: 仓库访问失败

**症状：**

```
⚠️ 无法访问 CC-Admin 仓库
```

**解决方案：**

1. 确认仓库名称是否正确
2. 检查 Token 是否有仓库访问权限
3. 确认仓库是否为私有仓库

### 问题4: API 限制

**症状：**

```
API rate limit exceeded
```

**解决方案：**

1. 等待限制重置（通常1小时）
2. 减少 API 调用频率
3. 使用认证 Token 获得更高的限制

## 📊 Token 权限对照表

| 功能     | 所需权限                | 说明             |
| -------- | ----------------------- | ---------------- |
| 用户信息 | `read:user`             | 获取用户基本信息 |
| 仓库访问 | `repo` 或 `public_repo` | 访问仓库内容     |
| 搜索代码 | `repo`                  | 搜索私有仓库代码 |
| 组织信息 | `read:org`              | 读取组织信息     |
| 邮箱信息 | `read:email`            | 读取用户邮箱     |

## 🔧 故障排除

### 检查 Token 状态

```bash
# 检查Token格式
echo $GITHUB_TOKEN | grep -E "^(ghp_|github_pat_)"

# 检查Token长度
echo $GITHUB_TOKEN | wc -c

# 测试基本连接
curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/user
```

### 调试 API 调用

```bash
# 启用详细输出
curl -v -H "Authorization: token $GITHUB_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/user
```

### 检查权限范围

```bash
# 获取Token权限信息
curl -I -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/user | grep -i "x-oauth-scopes"
```

## 📚 相关文档

- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub API 文档](https://docs.github.com/en/rest)
- [代码监控指南](./code-monitoring-guide.md)

## 🎯 快速开始

1. **获取 Token**

   ```bash
   # 按照上述步骤在 GitHub 中创建 Token
   ```

2. **测试 Token**

   ```bash
   export GITHUB_TOKEN="your_token_here"
   ./scripts/test-github-token.sh
   ```

3. **运行监控**
   ```bash
   pnpm monitor
   ```

---

_本指南为 CC-Admin 框架 GitHub Token 配置的完整说明_
