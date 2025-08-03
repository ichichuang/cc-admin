#!/bin/bash
# cc-admin-monitor.sh - cc-admin 框架本地监控脚本

# 加载环境变量
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 检查依赖和Token
check_dependencies() {
    local missing_tools=()

    if ! command -v curl &> /dev/null; then
        missing_tools+=("curl")
    fi

    if ! command -v jq &> /dev/null; then
        missing_tools+=("jq")
    fi

    if ! command -v python3 &> /dev/null; then
        missing_tools+=("python3")
    fi

    if [ ${#missing_tools[@]} -ne 0 ]; then
        echo -e "${RED}❌ 缺少必要工具: ${missing_tools[*]}${NC}"
        echo "请安装缺少的工具后重试"
        exit 1
    fi
}

# 检查GitHub Token
check_github_token() {
    if [ -z "$GITHUB_TOKEN" ]; then
        echo -e "${RED}❌ 错误: 未设置 GITHUB_TOKEN 环境变量${NC}"
        echo ""
        echo "请设置 GitHub Token:"
        echo "export GITHUB_TOKEN='your_token_here'"
        echo ""
        echo "或者创建 .env 文件:"
        echo "echo 'GITHUB_TOKEN=your_token_here' > .env"
        echo ""
        echo "详细说明请查看: docs/github-token-guide.md"
        exit 1
    fi

    # 验证Token格式
    if [[ ! "$GITHUB_TOKEN" =~ ^ghp_[A-Za-z0-9]{36}$ ]] && [[ ! "$GITHUB_TOKEN" =~ ^github_pat_[A-Za-z0-9_]{82}$ ]]; then
        echo -e "${RED}❌ Token 格式不正确${NC}"
        echo "Token 应该以 'ghp_' 或 'github_pat_' 开头"
        exit 1
    fi
}

# 配置
GITHUB_USERNAME="ichichuang"
REPO_NAME="cc-admin"
FRAMEWORK_NAME="cc-admin"

# 输出文件
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
OUTPUT_DIR="monitor_reports/$TIMESTAMP"
COPYRIGHT_VIOLATIONS_FILE="$OUTPUT_DIR/copyright_violations.txt"
STRUCTURE_FILE="$OUTPUT_DIR/structure_similarities.txt"
TECHSTACK_FILE="$OUTPUT_DIR/techstack_matches.txt"
REPORT_FILE="$OUTPUT_DIR/cc_admin_monitor_report.md"

# 创建输出目录
mkdir -p "$OUTPUT_DIR"

echo -e "${BLUE}🛡️ cc-admin 框架代码监控系统${NC}"
echo "========================================"
echo -e "${CYAN}监控时间: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
echo -e "${CYAN}框架名称: $FRAMEWORK_NAME${NC}"
echo -e "${CYAN}GitHub用户: $GITHUB_USERNAME${NC}"
echo -e "${CYAN}仓库名称: $REPO_NAME${NC}"
echo "========================================"

# 检查依赖和Token
check_dependencies
check_github_token

echo -e "${GREEN}✅ 环境检查通过${NC}"
echo ""

# 初始化计数器
violation_count=0
structure_count=0
techstack_count=0

# cc-admin 特有的版权标识 - 更精确的搜索关键词
declare -a COPYRIGHT_SIGNATURES=(
    "@copyright Copyright (c) 2025 chichuang"
    "cc-admin 企业级后台管理框架"
    "本文件为 chichuang 原创"
    "禁止擅自删除署名或用于商业用途"
    "chichuang cc-admin"
    "cc-admin-FRAMEWORK-CHICHUANG-2025"
    "chichuang 原创"
    # 移除容易误报的关键词
    # "cc-admin v1.0" - 这个关键词太通用，容易误报
)

# 检测函数 - 更精确的版权侵犯检测
detect_copyright_violations() {
    echo -e "${YELLOW}🔍 1. 检测版权侵犯...${NC}"
    > "$COPYRIGHT_VIOLATIONS_FILE"

    local violation_count=0

    for signature in "${COPYRIGHT_SIGNATURES[@]}"; do
        echo "  🔍 搜索: $signature"

        # URL编码
        encoded_query=$(echo "$signature -user:$GITHUB_USERNAME -repo:$REPO_NAME" | \
            python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read().strip()))")

        response=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            "https://api.github.com/search/code?q=$encoded_query&per_page=20")

        total_count=$(echo "$response" | jq -r '.total_count // 0')

        if [ "$total_count" -gt 0 ]; then
            echo -e "    ${RED}⚠️ 发现 $total_count 个潜在侵权项${NC}"

            # 更精确的过滤逻辑
            filtered_count=0
            echo "$response" | jq -r '.items[]? | "\(.repository.full_name) - \(.name) - \(.html_url)"' | while read -r line; do
                if [ ! -z "$line" ]; then
                    # 排除规则：排除明显不相关的项目
                    if [[ "$line" != *"zhy6599/cc-admin"* ]] && \
                       [[ "$line" != *"courtcanva/cc-admin"* ]] && \
                       [[ "$line" != *"Buntyu/Codeigniter"* ]] && \
                       [[ "$line" != *"hmcts/ccd-admin"* ]] && \
                       [[ "$line" != *"shiwi123/Hncc-admin"* ]] && \
                       [[ "$line" != *"codeconsortium/CCDN"* ]] && \
                       [[ "$line" != *"tianyepeng/ccAdmin"* ]] && \
                       [[ "$line" != *"dcm93/ccAdmin"* ]] && \
                       [[ "$line" != *"cennac/CcAdmin"* ]]; then

                        echo "🚨 版权侵犯: $line" >> "$COPYRIGHT_VIOLATIONS_FILE"
                        filtered_count=$((filtered_count + 1))
                    fi
                fi
            done

            violation_count=$((violation_count + filtered_count))
            echo -e "    ${GREEN}✅ 过滤后剩余 $filtered_count 个相关项${NC}"
        else
            echo -e "    ${GREEN}✅ 未发现侵权${NC}"
        fi

        sleep 2
    done

    # 更新全局变量
    violation_count=$violation_count
}

# cc-admin 独特的文件结构模式 - 更精确的组合
declare -a STRUCTURE_PATTERNS=(
    "src/stores/modules index.ts chichuang"
    "src/api/modules index.ts chichuang"
    "src/router/modules index.ts chichuang"
    "unocss/rules unocss/shortcuts chichuang"
    "scripts/ chichuang cc-admin"
    "src/hooks/modules chichuang"
    "src/common/modules chichuang"
    "src/locales/modules chichuang"
    "src/mock/modules chichuang"
    # 添加更独特的组合
    "cc-admin 企业级后台管理框架 chichuang"
    "Vue 3.5+ TypeScript 5+ Vite 7+ chichuang"
    "UnoCSS 0.66 企业级后台 chichuang"
)

# 检测函数 - 更精确的文件结构检测
detect_structure_similarities() {
    echo -e "${YELLOW}🏗️ 2. 检测文件结构抄袭...${NC}"
    > "$STRUCTURE_FILE"

    local structure_count=0

    for pattern in "${STRUCTURE_PATTERNS[@]}"; do
        echo "  🔍 搜索结构: $pattern"

        encoded_query=$(echo "$pattern -user:$GITHUB_USERNAME" | \
            python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read().strip()))")

        response=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
            "https://api.github.com/search/code?q=$encoded_query&per_page=10")

        total_count=$(echo "$response" | jq -r '.total_count // 0')

        if [ "$total_count" -gt 0 ]; then
            echo -e "    ${YELLOW}📁 发现 $total_count 个相似结构${NC}"

            # 更精确的过滤逻辑
            filtered_count=0
            echo "$response" | jq -r '.items[]? | "📁 结构相似: \(.repository.full_name) - \(.html_url)"' | while read -r line; do
                if [ ! -z "$line" ]; then
                    # 排除规则：排除明显不相关的项目
                    if [[ "$line" != *"zhy6599/cc-admin"* ]] && \
                       [[ "$line" != *"courtcanva/cc-admin"* ]] && \
                       [[ "$line" != *"Buntyu/Codeigniter"* ]] && \
                       [[ "$line" != *"hmcts/ccd-admin"* ]] && \
                       [[ "$line" != *"shiwi123/Hncc-admin"* ]] && \
                       [[ "$line" != *"codeconsortium/CCDN"* ]] && \
                       [[ "$line" != *"tianyepeng/ccAdmin"* ]] && \
                       [[ "$line" != *"dcm93/ccAdmin"* ]] && \
                       [[ "$line" != *"cennac/CcAdmin"* ]]; then

                        echo "$line" >> "$STRUCTURE_FILE"
                        filtered_count=$((filtered_count + 1))
                    fi
                fi
            done

            structure_count=$((structure_count + filtered_count))
            echo -e "    ${GREEN}✅ 过滤后剩余 $filtered_count 个相关项${NC}"
        else
            echo -e "    ${GREEN}✅ 结构独特${NC}"
        fi

        sleep 2
    done

    # 更新全局变量
    structure_count=$structure_count
}

# cc-admin 特有的技术栈组合 - 更精确的查询
declare -a TECHSTACK_QUERIES=(
    "Vue 3.5 TypeScript 5 UnoCSS Vite chichuang"
    "Pinia 3 Alova 3 Vue I18n 10 chichuang"
    "pnpm 10.12.4 Vue3 admin chichuang"
    "UnoCSS 0.66 企业级后台 chichuang"
    "Vue 3.5+ TypeScript 5+ Vite 7+ chichuang"
    "cc-admin 企业级后台管理框架 chichuang"
    # 添加更独特的组合
    "chichuang cc-admin 企业级后台管理框架"
    "chichuang Vue 3.5 TypeScript 5 UnoCSS"
    "chichuang Pinia 3 Alova 3 Vue I18n 10"
)

# 检测函数 - 更精确的技术栈检测
detect_techstack_similarities() {
    echo -e "${YELLOW}⚡ 3. 检测技术栈相似度...${NC}"
    > "$TECHSTACK_FILE"

    local techstack_count=0

    for query in "${TECHSTACK_QUERIES[@]}"; do
        echo "  🔍 搜索技术栈: $query"

        encoded_query=$(echo "$query -user:$GITHUB_USERNAME" | \
            python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read().strip()))")

        response=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
            "https://api.github.com/search/repositories?q=$encoded_query&per_page=10")

        total_count=$(echo "$response" | jq -r '.total_count // 0')

        if [ "$total_count" -gt 0 ]; then
            echo -e "    ${BLUE}📊 发现 $total_count 个相似项目${NC}"

            # 更精确的过滤逻辑
            filtered_count=0
            echo "$response" | jq -r '.items[]? | "🔧 技术栈相似: \(.full_name) - Stars: \(.stargazers_count) - \(.html_url)"' | while read -r line; do
                if [ ! -z "$line" ]; then
                    # 排除规则：排除明显不相关的项目
                    if [[ "$line" != *"zhy6599/cc-admin"* ]] && \
                       [[ "$line" != *"courtcanva/cc-admin"* ]] && \
                       [[ "$line" != *"Buntyu/Codeigniter"* ]] && \
                       [[ "$line" != *"hmcts/ccd-admin"* ]] && \
                       [[ "$line" != *"shiwi123/Hncc-admin"* ]] && \
                       [[ "$line" != *"codeconsortium/CCDN"* ]] && \
                       [[ "$line" != *"tianyepeng/ccAdmin"* ]] && \
                       [[ "$line" != *"dcm93/ccAdmin"* ]] && \
                       [[ "$line" != *"cennac/CcAdmin"* ]]; then

                        echo "$line" >> "$TECHSTACK_FILE"
                        filtered_count=$((filtered_count + 1))
                    fi
                fi
            done

            techstack_count=$((techstack_count + filtered_count))
            echo -e "    ${GREEN}✅ 过滤后剩余 $filtered_count 个相关项${NC}"
        else
            echo -e "    ${GREEN}✅ 技术栈独特${NC}"
        fi

        sleep 2
    done

    # 更新全局变量
    techstack_count=$techstack_count
}

# 执行检测
detect_copyright_violations
detect_structure_similarities
detect_techstack_similarities

# 4. Fork 和 Star 分析
echo -e "${YELLOW}📊 4. 分析项目数据...${NC}"

repo_info=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    "https://api.github.com/repos/$GITHUB_USERNAME/$REPO_NAME")

star_count=$(echo "$repo_info" | jq -r '.stargazers_count // 0')
fork_count=$(echo "$repo_info" | jq -r '.forks_count // 0')

echo -e "  ${GREEN}⭐ Stars: $star_count${NC}"
echo -e "  ${GREEN}🍴 Forks: $fork_count${NC}"

# 获取最近forks
FORKS_FILE="$RESULT_DIR/recent_forks.txt"
forks_response=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    "https://api.github.com/repos/$GITHUB_USERNAME/$REPO_NAME/forks?sort=created&direction=desc&per_page=10")

echo "$forks_response" | jq -r '.[]? | "🍴 Fork: \(.full_name) - 创建: \(.created_at) - \(.html_url)"' > "$FORKS_FILE"

# 5. 生成报告
echo -e "${YELLOW}📝 5. 生成监控报告...${NC}"

cat > "$REPORT_FILE" << EOF
# 🛡️ cc-admin 框架保护监控报告

**监控时间**: $(date '+%Y-%m-%d %H:%M:%S')
**框架**: cc-admin 企业级后台管理框架
**作者**: chichuang
**仓库**: $GITHUB_USERNAME/$REPO_NAME

## 📈 项目统计
- ⭐ **Stars**: $star_count
- 🍴 **Forks**: $fork_count

## 🚨 版权侵犯检测 ($violation_count 项)
$(if [ -s "$COPYRIGHT_VIOLATIONS_FILE" ]; then
    echo "**⚠️ 发现版权侵犯:**"
    cat "$COPYRIGHT_VIOLATIONS_FILE"
else
    echo "✅ 未发现版权侵犯"
fi)

## 🏗️ 文件结构相似度 ($structure_count 项)
$(if [ -s "$STRUCTURE_FILE" ]; then
    echo "**📁 相似结构项目:**"
    cat "$STRUCTURE_FILE"
else
    echo "✅ 文件结构独特"
fi)

## ⚡ 技术栈相似度 ($techstack_count 项)
$(if [ -s "$TECHSTACK_FILE" ]; then
    echo "**🔧 相似技术栈项目:**"
    cat "$TECHSTACK_FILE"
else
    echo "✅ 技术栈组合独特"
fi)

## 🍴 最近 Fork
$(cat "$FORKS_FILE")

## 🛡️ 保护建议
$(if [ "$violation_count" -gt 0 ]; then
    echo "### 🚨 紧急处理"
    echo "- 📧 联系侵权方"
    echo "- 📝 发送 DMCA 通知"
    echo "- 🔒 增强版权保护"
    echo ""
fi)

### 📋 常规维护
- 🔍 持续监控
- 📄 完善协议
- 🏷️ 增加标识
- 📊 定期分析

---
*cc-admin 保护系统 - $(date)*
EOF

# 6. 显示结果摘要
echo ""
echo "========================================"
echo -e "${BLUE}📊 监控结果摘要${NC}"
echo "========================================"
echo -e "🚨 版权侵犯: ${RED}$violation_count${NC} 项"
echo -e "📁 结构相似: ${YELLOW}$structure_count${NC} 项"
echo -e "🔧 技术栈相似: ${BLUE}$techstack_count${NC} 项"
echo -e "⭐ 项目Stars: ${GREEN}$star_count${NC}"
echo -e "🍴 项目Forks: ${GREEN}$fork_count${NC}"

echo ""
echo -e "${GREEN}📝 详细报告已保存到: $REPORT_FILE${NC}"

# 7. 严重问题警告
if [ "$violation_count" -gt 0 ]; then
    echo ""
    echo -e "${RED}🚨 警告: 发现 $violation_count 个潜在版权侵犯问题!${NC}"
    echo -e "${RED}建议立即查看详细报告并采取行动${NC}"
fi

echo -e "${GREEN}✅ cc-admin 框架监控完成${NC}"
