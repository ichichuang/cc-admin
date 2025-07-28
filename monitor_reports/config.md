<!--
  @copyright Copyright (c) 2025 chichuang
  @license 自定义商业限制许可证
  @description CC-Admin 企业级后台管理框架 - 监控配置说明
  本文件受版权保护，商业使用需要授权。
-->

# ⚙️ CC-Admin 监控系统配置

本文档说明如何配置和使用 CC-Admin 框架的代码监控系统。

## 🔧 环境配置

### 必需环境变量

```bash
# GitHub Token（必需）
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# 项目配置（可选，有默认值）
export GITHUB_USERNAME="ichichuang"
export REPO_NAME="CC-Admin"
export FRAMEWORK_NAME="CC-Admin"
```

### 环境变量说明

| 变量名            | 必需 | 默认值       | 说明             |
| ----------------- | ---- | ------------ | ---------------- |
| `GITHUB_TOKEN`    | ✅   | 无           | GitHub API Token |
| `GITHUB_USERNAME` | ❌   | `ichichuang` | GitHub 用户名    |
| `REPO_NAME`       | ❌   | `CC-Admin`   | 仓库名称         |
| `FRAMEWORK_NAME`  | ❌   | `CC-Admin`   | 框架名称         |

## 🚀 使用方法

### 1. 完整监控

```bash
# 执行完整监控（推荐）
pnpm monitor

# 输出示例：
# 🛡️ CC-Admin 框架代码监控系统 (跨平台版)
# =======================================
# 监控时间: 2024-12-XX XX:XX:XX
# 框架名称: CC-Admin
# GitHub用户: ichichuang
# 仓库名称: CC-Admin
# =======================================
# ✅ 环境检查通过
# 🚀 开始监控...
```

### 2. 快速搜索

```bash
# 快速搜索模式
pnpm monitor:quick

# 仅测试 Token
pnpm token:test
```

### 3. 高级搜索

```bash
# 使用高级搜索脚本
./scripts/advanced-search.sh
```

## 📊 监控内容

### 版权侵犯检测

**检测目标**：

- 独特的版权标识符
- 框架特有的代码签名
- 未授权的商业使用

**搜索关键词**：

```bash
"@copyright Copyright (c) 2025 chichuang"
"CC-Admin 企业级后台管理框架"
"本文件为 chichuang 原创"
"禁止擅自删除署名或用于商业用途"
```

### 文件结构分析

**检测目标**：

- 项目目录结构相似性
- 模块组织方式
- 配置文件结构

**关键结构**：

```bash
"src/stores/modules"
"src/api/modules"
"src/router/modules"
"src/hooks/modules"
"src/common/modules"
"src/locales/modules"
"src/mock/modules"
```

### 技术栈监控

**检测目标**：

- Vue 3.5+ + TypeScript 5+ 组合
- Vite 7+ + UnoCSS 0.66+ 组合
- pnpm 10.12.4 包管理器

**技术栈特征**：

```bash
"Vue 3.5+"
"TypeScript 5+"
"Vite 7+"
"UnoCSS 0.66+"
"pnpm 10.12.4"
"Pinia 3+"
"Alova 3+"
```

## 📈 报告生成

### 报告文件结构

```
monitor_reports/
├── README.md                    # 目录说明
├── template.md                  # 报告模板
├── config.md                    # 配置说明
├── latest/                      # 最新报告（软链接）
└── YYYYMMDD_HHMMSS/            # 时间戳报告目录
    ├── cc_admin_monitor_report.md    # 主报告
    ├── copyright_violations.txt      # 版权侵犯详情
    ├── structure_similarities.txt    # 结构相似性详情
    └── techstack_matches.txt        # 技术栈匹配详情
```

### 报告内容说明

| 文件                         | 内容           | 格式     |
| ---------------------------- | -------------- | -------- |
| `cc_admin_monitor_report.md` | 综合监控报告   | Markdown |
| `copyright_violations.txt`   | 版权侵犯列表   | 纯文本   |
| `structure_similarities.txt` | 结构相似项目   | 纯文本   |
| `techstack_matches.txt`      | 技术栈匹配项目 | 纯文本   |

## 🔄 自动化配置

### GitHub Actions 配置

```yaml
# .github/workflows/cc-admin-monitor.yml
name: CC-Admin 代码监控

on:
  schedule:
    - cron: '0 2 * * 1' # 每周一凌晨2点
  workflow_dispatch: # 支持手动触发

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: 执行监控
        run: pnpm monitor
      - name: 上传报告
        uses: actions/upload-artifact@v4
        with:
          name: cc-admin-monitor-report
          path: monitor_reports/
```

### 本地定时任务

```bash
# 添加到 crontab
# 每周一凌晨2点执行监控
0 2 * * 1 cd /path/to/cc-admin && pnpm monitor

# 每天检查一次（快速模式）
0 8 * * * cd /path/to/cc-admin && pnpm monitor:quick
```

## 🛠️ 故障排除

### 常见问题

1. **Token 无效**

   ```bash
   # 检查 Token 格式
   echo $GITHUB_TOKEN | grep -E '^ghp_[A-Za-z0-9]{36}$'

   # 测试 Token
   pnpm token:test
   ```

2. **API 限制**

   ```bash
   # 检查 API 限制
   curl -H "Authorization: token $GITHUB_TOKEN" \
        https://api.github.com/rate_limit
   ```

3. **依赖缺失**

   ```bash
   # 安装依赖
   pnpm install

   # 检查环境
   pnpm env-check
   ```

### 调试模式

```bash
# 启用详细日志
DEBUG=* pnpm monitor

# 仅测试环境
pnpm env-check
```

## 📞 技术支持

### 获取帮助

- **文档**: 查看 `docs/protection/code-monitoring-guide.md`
- **Issues**: https://github.com/ichichuang/CC-Admin/issues
- **讨论**: GitHub Discussions

### 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

---

_最后更新时间：2024年12月_
