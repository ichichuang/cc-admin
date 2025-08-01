<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description cc-admin 企业级后台管理框架 - 代码监控指南
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

# 🔍 cc-admin 框架代码监控指南

## 📋 概述

cc-admin 框架配备了完整的代码监控系统，用于检测潜在的代码抄袭行为。本指南详细介绍如何配置和使用代码监控功能，以及验证监控系统是否正常工作。

## 🎯 监控原理

### 独特标识符检测

cc-admin 框架包含以下独特标识符，用于识别抄袭行为：

#### 版权声明

```typescript
/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */
```

#### 项目特征

- **项目名称**: `cc-admin 企业级后台管理框架`
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
  FRAMEWORK_NAME: 'cc-admin'
  FRAMEWORK_AUTHOR: 'chichuang'
  FRAMEWORK_SIGNATURE: 'cc-admin 企业级后台管理框架'
  YOUR_GITHUB_USERNAME: 'ichichuang' # 你的GitHub用户名
  REPO_NAME: 'cc-admin'
```

### 3. 手动运行监控

#### 使用 GitHub Actions

1. 进入 GitHub 仓库的 Actions 页面
2. 选择 "🛡️ cc-admin 框架保护监控" 工作流
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

## ✅ 验证步骤

### 1. Token 验证 ✅

```bash
# 测试 GitHub Token 有效性
pnpm token:test
```

**预期结果：**

```
🔑 GitHub Token 测试工具
========================================
🔍 测试 GitHub Token 有效性...
✅ Token 格式正确
🔍 测试 Token 权限...
✅ Token 有效，用户: ichichuang
🔍 测试仓库访问权限...
✅ 可以访问仓库: cc-admin
🔍 测试搜索API权限...
✅ 搜索API权限正常
🔍 检查Token权限范围...
✅ Token 权限范围: read:org, read:user, repo, user:email
✅ 仓库访问权限正常
✅ 用户信息读取权限正常
========================================
✅ GitHub Token 测试完成
```

### 2. 监控系统验证 ✅

```bash
# 运行完整监控
pnpm monitor
```

**预期结果：**

```
🛡️ cc-admin 框架代码监控系统
========================================
监控时间: 2025-07-28 11:33:02
框架名称: cc-admin
GitHub用户: ichichuang
仓库名称: cc-admin
========================================
✅ 环境检查通过

🔍 1. 检测版权侵犯...
  🔍 搜索: @copyright Copyright (c) 2025 chichuang
    ✅ 未发现侵权
  🔍 搜索: cc-admin 企业级后台管理框架
    ✅ 未发现侵权
  ...
🏗️ 2. 检测文件结构抄袭...
  🔍 搜索结构: src/stores/modules index.ts
    ✅ 结构独特
  ...
⚡ 3. 检测技术栈相似度...
  🔍 搜索技术栈: Vue 3.5 TypeScript 5 UnoCSS Vite
    ✅ 技术栈独特
  ...
📊 4. 分析项目数据...
  ⭐ Stars: 1
  🍴 Forks: 0
📝 5. 生成监控报告...

========================================
📊 监控结果摘要
========================================
🚨 版权侵犯: 80 项
📁 结构相似: 0 项
🔧 技术栈相似: 0 项
⭐ 项目Stars: 1
🍴 项目Forks: 0

📝 详细报告已保存到: monitor_reports/20250728_113302/cc_admin_monitor_report.md
✅ cc-admin 框架监控完成
```

### 3. 报告文件验证 ✅

```bash
# 检查监控报告目录
ls -la monitor_reports/

# 查看最新报告
ls -la monitor_reports/$(ls -t monitor_reports/ | head -1)/
```

**预期结果：**

```
monitor_reports/
├── 20250728_112800/
│   ├── cc_admin_monitor_report.md
│   ├── copyright_violations.txt
│   ├── structure_similarities.txt
│   └── techstack_matches.txt
├── 20250728_113302/
│   ├── cc_admin_monitor_report.md
│   ├── copyright_violations.txt
│   ├── structure_similarities.txt
│   └── techstack_matches.txt
└── ...
```

## 📊 监控功能详解

### 1. 版权侵犯检测

系统会搜索以下版权标识符：

- `@copyright Copyright (c) 2025 chichuang`
- `cc-admin 企业级后台管理框架`
- `本文件为 chichuang 原创`
- `禁止擅自删除署名或用于商业用途`

### 2. 文件结构抄袭检测

检测独特的目录结构：

- `src/stores/modules/` + `index.ts`
- `src/api/modules/` + `index.ts`
- `src/router/modules/` + `index.ts`
- `src/hooks/modules/` + `index.ts`
- `src/common/modules/` + `index.ts`
- `src/locales/modules/` + `index.ts`
- `src/mock/modules/` + `index.ts`

### 3. 技术栈相似度检测

检测技术栈组合：

- `Vue 3.5+` + `TypeScript 5+`
- `UnoCSS` + `Vite`
- `Pinia` + `Alova`
- `pnpm` + `ESLint` + `Prettier`

### 4. 项目数据分析

- 统计项目的 Stars 和 Forks 数量
- 分析项目的活跃度
- 检测是否有可疑的分支或贡献

## 🔧 高级配置

### 自定义搜索关键词

在 `scripts/cc-admin-monitor.sh` 中修改搜索关键词：

```bash
# 版权关键词
COPYRIGHT_KEYWORDS=(
  "@copyright Copyright (c) 2025 chichuang"
  "cc-admin 企业级后台管理框架"
  "本文件为 chichuang 原创"
)

# 结构关键词
STRUCTURE_KEYWORDS=(
  "src/stores/modules index.ts"
  "src/api/modules index.ts"
  "src/router/modules index.ts"
)

# 技术栈关键词
TECHSTACK_KEYWORDS=(
  "Vue 3.5 TypeScript 5 UnoCSS Vite"
  "Pinia Alova pnpm"
)
```

### 自定义通知

配置多种通知方式：

```bash
# 邮件通知
if [ -n "$EMAIL_USERNAME" ] && [ -n "$EMAIL_PASSWORD" ]; then
  send_email_notification
fi

# 企业微信通知
if [ -n "$WECHAT_WEBHOOK_URL" ]; then
  send_wechat_notification
fi

# 钉钉通知
if [ -n "$DINGTALK_WEBHOOK_URL" ]; then
  send_dingtalk_notification
fi
```

## 📈 监控报告分析

### 报告结构

每个监控报告包含以下文件：

1. **cc_admin_monitor_report.md** - 详细监控报告
2. **copyright_violations.txt** - 版权侵犯记录
3. **structure_similarities.txt** - 结构相似记录
4. **techstack_matches.txt** - 技术栈匹配记录

### 报告内容

#### 详细监控报告

```markdown
# cc-admin 框架监控报告

## 监控时间

2025-07-28 11:33:02

## 监控结果

- 版权侵犯: 80 项
- 结构相似: 0 项
- 技术栈相似: 0 项

## 详细分析

### 版权侵犯检测

- 搜索关键词: @copyright Copyright (c) 2025 chichuang
- 发现结果: 80 个匹配项
- 风险评估: 低风险

### 文件结构检测

- 搜索结构: src/stores/modules index.ts
- 发现结果: 0 个相似结构
- 风险评估: 无风险

### 技术栈检测

- 搜索技术栈: Vue 3.5 TypeScript 5 UnoCSS Vite
- 发现结果: 0 个相似项目
- 风险评估: 无风险
```

## 🚨 风险处理

### 低风险情况

- 发现少量版权关键词匹配
- 可能是正常的代码分享或学习使用
- 建议：继续监控，无需立即行动

### 中风险情况

- 发现多个文件结构相似
- 可能是部分代码被复制使用
- 建议：联系相关方，要求删除或添加版权声明

### 高风险情况

- 发现大量代码被复制
- 项目结构高度相似
- 建议：立即采取法律行动，联系律师

## 🔄 自动化监控

### GitHub Actions 配置

```yaml
name: cc-admin 框架保护监控

on:
  schedule:
    - cron: '0 2 * * *' # 每天凌晨2点运行
  workflow_dispatch: # 支持手动触发

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: 运行监控脚本
        run: |
          chmod +x scripts/cc-admin-monitor.sh
          ./scripts/cc-admin-monitor.sh
      - name: 上传监控报告
        uses: actions/upload-artifact@v4
        with:
          name: monitor-report-${{ github.run_number }}
          path: monitor_reports/
```

### 本地定时任务

```bash
# 添加到 crontab
0 2 * * * cd /path/to/cc-admin && ./scripts/cc-admin-monitor.sh
```

## 📝 最佳实践

### 1. 定期监控

- 建议每天运行一次监控
- 重要更新后立即运行监控
- 定期检查监控报告

### 2. 及时响应

- 发现风险时及时处理
- 保留所有监控证据
- 必要时寻求法律帮助

### 3. 持续改进

- 根据监控结果调整关键词
- 优化监控策略
- 更新监控工具

## ❓ 常见问题

### Q: 监控系统误报怎么办？

A: 可以调整搜索关键词，减少误报。建议从严格的关键词开始，逐步放宽。

### Q: 如何提高监控准确性？

A: 使用更具体的搜索关键词，结合多个维度进行检测，定期更新监控策略。

### Q: 监控频率应该如何设置？

A: 建议每天运行一次，重要更新后立即运行，避免过于频繁影响性能。

### Q: 如何处理发现的侵权行为？

A: 首先联系相关方要求删除，必要时寻求法律帮助，保留所有证据。

## 🎯 总结

cc-admin 框架的代码监控系统提供了全面的知识产权保护：

1. **多维度检测**：版权、结构、技术栈全方位监控
2. **自动化运行**：支持定时和手动触发
3. **详细报告**：提供完整的监控分析报告
4. **风险分级**：根据风险等级提供处理建议

通过这套监控系统，可以有效保护项目的知识产权，及时发现和处理侵权行为。
