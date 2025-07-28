# 🔍 CC-Admin 框架代码监控指南

## 📋 概述

CC-Admin 框架配备了完整的代码监控系统，用于检测潜在的代码抄袭行为。本指南详细介绍如何配置和使用代码监控功能。

## 🎯 监控原理

### 独特标识符检测

CC-Admin 框架包含以下独特标识符，用于识别抄袭行为：

#### 版权声明

```typescript
/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */
```

#### 项目特征

- **项目名称**: `CC-Admin 企业级后台管理框架`
- **作者标识**: `chichuang`
- **技术栈标识**: `Vue 3.5+` + `TypeScript 5+` + `UnoCSS 0.66+` + `pnpm 10.12.4`
- **框架标识**: `CC-ADMIN-FRAMEWORK-CHICHUANG-2025`

#### 独特文件结构

```
src/stores/modules/     # 状态管理模块
src/api/modules/        # API接口模块
src/router/modules/     # 路由模块
src/hooks/modules/      # 组合式函数模块
src/common/modules/     # 公共模块
src/locales/modules/    # 国际化模块
src/mock/modules/       # Mock数据模块
unocss/rules/          # UnoCSS规则
unocss/shortcuts/      # UnoCSS快捷方式
scripts/               # 自定义脚本
```

## 🛠️ 配置步骤

### 1. 设置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

**必需配置：**

- `GITHUB_TOKEN` - GitHub API 访问令牌（通常自动提供）

**可选配置：**

- `EMAIL_USERNAME` - 邮件通知用户名
- `EMAIL_PASSWORD` - 邮件通知密码
- `NOTIFICATION_EMAIL` - 通知邮箱地址
- `WECHAT_WEBHOOK_URL` - 企业微信 Webhook URL
- `DINGTALK_WEBHOOK_URL` - 钉钉 Webhook URL

### 2. 自定义配置

修改 `.github/workflows/cc-admin-monitor.yml` 中的环境变量：

```yaml
env:
  FRAMEWORK_NAME: 'CC-Admin'
  FRAMEWORK_AUTHOR: 'chichuang'
  FRAMEWORK_SIGNATURE: 'CC-Admin 企业级后台管理框架'
  YOUR_GITHUB_USERNAME: 'ichichuang' # 你的GitHub用户名
  REPO_NAME: 'cc-admin'
```

### 3. 手动运行监控

#### 使用 GitHub Actions

1. 进入 GitHub 仓库的 Actions 页面
2. 选择 "🛡️ CC-Admin 框架保护监控" 工作流
3. 点击 "Run workflow" 手动触发

#### 使用本地脚本

```bash
# 设置环境变量
export GITHUB_TOKEN="your_github_token"
export YOUR_USERNAME="your_github_username"

# 运行完整监控脚本
./scripts/cc-admin-monitor.sh

# 或使用 pnpm 命令
pnpm monitor

# 快速搜索
pnpm monitor:quick
```

## 📊 监控功能

### 自动监控

- **定时扫描**: 每周一上午9点自动执行
- **Fork监控**: 当有新fork时自动触发
- **手动触发**: 支持随时手动执行
- **搜索强度**: 支持 light/standard/intensive 三种模式

### 检测内容

1. **版权标识符检测**
   - 版权声明文本
   - 项目名称和描述
   - 作者标识信息
   - 技术栈版本信息
   - 框架唯一标识符

2. **文件结构检测**
   - 目录结构匹配
   - 文件名模式匹配
   - 模块组织方式
   - 特殊目录组合

3. **技术栈组合检测**
   - Vue 3.5+ + TypeScript 5+ + Vite 7+
   - UnoCSS 0.66+ + pnpm 10.12.4
   - Pinia 3+ + Alova 3+ + Vue I18n 10+
   - 企业级后台管理框架

### 报告生成

监控系统会生成详细的 Markdown 报告，包含：

- 扫描时间和范围
- 发现的匹配项列表
- 相关仓库链接
- 项目统计数据
- 保护建议

## 🔔 通知配置

### 邮件通知

```yaml
- name: 📧 发送邮件通知
  if: secrets.EMAIL_USERNAME
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 587
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: '🚨 CC-Admin 框架保护警报 - 发现可疑抄袭行为'
    body: file://cc_admin_protection_report.md
    to: ${{ secrets.NOTIFICATION_EMAIL }}
```

### 企业微信通知

```yaml
- name: 💬 企业微信通知
  if: secrets.WECHAT_WEBHOOK_URL
  run: |
    curl -X POST \
      -H 'Content-Type: application/json' \
      -d '{"msgtype": "text", "text": {"content": "🚨 检测到可能的 CC-Admin 框架代码抄袭行为"}}' \
      ${{ secrets.WECHAT_WEBHOOK_URL }}
```

### 钉钉通知

```yaml
- name: 📱 钉钉通知
  if: secrets.DINGTALK_WEBHOOK_URL
  run: |
    curl -X POST \
      -H 'Content-Type: application/json' \
      -d '{"msgtype": "text", "text": {"content": "🚨 检测到可能的 CC-Admin 框架代码抄袭行为"}}' \
      ${{ secrets.DINGTALK_WEBHOOK_URL }}
```

## 📈 监控效果

### 检测能力

- ✅ **高精度检测**: 基于独特标识符的精确匹配
- ✅ **结构分析**: 检测文件组织和模块结构
- ✅ **技术栈识别**: 识别相似的技术栈组合
- ✅ **实时监控**: 自动定时扫描和即时通知
- ✅ **彩色输出**: 本地脚本支持彩色终端输出
- ✅ **详细报告**: 生成完整的监控报告

### 误报处理

- ⚠️ **人工审核**: 所有检测结果需要人工审核
- ⚠️ **学习用途**: 区分学习用途和商业抄袭
- ⚠️ **巧合排除**: 排除技术栈巧合的情况

## 🚨 发现抄袭的处理流程

### 1. 自动检测

当监控系统发现潜在抄袭时：

1. 生成详细报告
2. 创建 GitHub Issue
3. 发送通知消息
4. 保存监控日志

### 2. 人工审核

收到警报后：

1. 查看详细报告
2. 访问相关仓库
3. 分析代码相似度
4. 判断是否为抄袭

### 3. 处理措施

确认抄袭后：

1. **联系作者**: 通过 GitHub Issues 联系
2. **要求删除**: 要求删除抄袭内容
3. **法律途径**: 必要时采取法律措施
4. **公开声明**: 在社区中公开声明

## 📞 联系方式

如需商业使用授权或报告抄袭行为，请联系：

- **作者**: chichuang
- **项目**: CC-Admin 企业级后台管理框架
- **GitHub**: https://github.com/ichichuang
- **邮箱**: 通过 GitHub Issues 联系

## ⚖️ 版权声明

CC-Admin 框架采用自定义商业限制许可证：

### 允许的行为

- ✅ 个人学习、研究使用
- ✅ 开源项目中的非商业使用
- ✅ Fork 和贡献代码
- ✅ 在保留版权声明的前提下修改和分发

### 禁止的行为

- ❌ **商业用途**: 未经授权不得用于商业项目
- ❌ **删除署名**: 不得删除或修改原作者版权信息
- ❌ **冒充原创**: 不得声称是原创作品
- ❌ **恶意抄袭**: 不得直接复制项目结构用于商业产品

## 🔧 故障排除

### 常见问题

1. **GitHub API 限制**
   - 解决方案: 增加请求间隔时间
   - 配置: 在脚本中添加 `sleep 2`

2. **误报问题**
   - 解决方案: 人工审核所有结果
   - 建议: 联系相关仓库作者确认

3. **通知失败**
   - 检查: Secrets 配置是否正确
   - 验证: Webhook URL 是否有效

4. **本地脚本权限问题**
   - 解决方案: `chmod +x scripts/cc-admin-monitor.sh`
   - 检查: 确保脚本有执行权限

### 调试方法

```bash
# 启用调试模式
export DEBUG=true
./scripts/cc-admin-monitor.sh

# 查看详细日志
tail -f monitoring_results/*/cc_admin_protection_report.md

# 检查环境变量
echo $GITHUB_TOKEN
echo $YOUR_USERNAME
```

## 🚀 完整配置步骤

### 1. 立即配置 GitHub Actions

```bash
# 创建工作流目录
mkdir -p .github/workflows

# 复制监控配置文件
cp .github/workflows/cc-admin-monitor.yml .github/workflows/
```

### 2. 设置 GitHub Secrets

在仓库设置中添加：

- `GITHUB_TOKEN` (GitHub自动提供)
- `EMAIL_USERNAME` (你的邮箱)
- `EMAIL_PASSWORD` (邮箱密码或应用密码)
- `NOTIFICATION_EMAIL` (接收通知的邮箱)

### 3. 本地监控脚本使用

```bash
# 设置环境变量
export GITHUB_TOKEN="your_github_token"

# 运行监控
chmod +x scripts/cc-admin-monitor.sh
./scripts/cc-admin-monitor.sh

# 或使用 pnpm
pnpm monitor
```

### 4. 增强保护措施

在代码中添加更多标识：

```typescript
/**
 * CC-Admin 企业级后台管理框架
 * @copyright Copyright (c) 2025 chichuang
 * @author chichuang
 * @license 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途
 * @framework CC-Admin v1.0
 * @created 2025-01-XX
 * @unique-id CC-ADMIN-FRAMEWORK-CHICHUANG-2025
 */
```

### 5. 监控频率建议

- **GitHub Actions**: 每周一次自动执行
- **本地脚本**: 每月手动执行
- **重要更新后**: 立即执行一次
- **发现问题时**: 每日监控

## 📚 相关文档

- [项目架构设计](./architecture-guide.md)
- [版权保护指南](./copyright-guide.md)
- [安全管理指南](./security-guide.md)
- [部署指南](./deployment-guide.md)

---

_本指南为 CC-Admin 框架代码监控系统的完整使用说明_

## 🎯 快速开始

### 1. Token 已配置 ✅

你的 GitHub Token 已经成功配置：

- **Token**: `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`
- **用户**: `ichichuang`
- **权限**: `read:org, read:user, repo, user:email`
- **状态**: ✅ 已验证有效

### 2. 运行监控

```bash
# 测试 Token
pnpm token:test

# 运行完整监控
pnpm monitor

# 快速搜索
pnpm monitor:quick
```

### 3. 查看结果

监控结果将保存在 `monitor_reports/` 目录中，包含：

- 📊 详细分析报告
- 🚨 版权侵犯列表
- 📁 结构相似项目
- ⚡ 技术栈匹配结果
