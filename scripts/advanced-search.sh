#!/bin/bash
# advanced-search.sh - cc-admin 框架高级代码搜索脚本

# cc-admin 框架独特标识符
UNIQUE_SIGNATURES=(
    "@copyright Copyright (c) 2025 chichuang"
    "cc-admin 企业级后台管理框架"
    "本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途"
    "packageManager\": \"pnpm@10.12.4\""
    "Vue 3.5+ 和 TypeScript 5+ 的现代化企业级后台管理框架"
    "基于 Vue 3.5+ 和 TypeScript 5+ 的现代化企业级后台管理框架"
    "autoImportModulesSync"
    "VUE3_TS_FRAMEWORK_CHUANGGE_2025"
    "// Created by 池闯 Vue3 Framework"
    "defineConfig Vue3 TypeScript 池闯"
)

# cc-admin 关键文件结构搜索
FILE_STRUCTURES=(
    "src/stores/modules"
    "src/api/modules"
    "src/router/modules"
    "src/hooks/modules"
    "src/common/modules"
    "src/locales/modules"
    "src/mock/modules"
    "unocss/rules"
    "unocss/shortcuts"
    "scripts/check"
    "scripts/dev"
    "scripts/utils"
    "src/components/common"
    "src/utils/index.ts"
    "src/types/global.d.ts"
)

# cc-admin 技术栈特征搜索
TECH_STACK=(
    "Vue 3.5+"
    "TypeScript 5+"
    "Vite 7+"
    "UnoCSS 0.66+"
    "pnpm 10.12.4"
    "Pinia 3+"
    "Alova 3+"
    "Vue I18n 10+"
    "createApp Vue 3"
    "composition-api setup"
    "vite vue typescript"
    "pinia store"
)

# 检查环境变量
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ 错误: 请设置 GITHUB_TOKEN 环境变量"
    echo "export GITHUB_TOKEN=your_github_token"
    exit 1
fi

if [ -z "$YOUR_USERNAME" ]; then
    echo "❌ 错误: 请设置 YOUR_USERNAME 环境变量"
    echo "export YOUR_USERNAME=your_github_username"
    exit 1
fi

# 执行搜索
echo "🔍 开始 cc-admin 框架高级搜索..."
echo "框架名称: cc-admin 企业级后台管理框架"
echo "作者: chichuang"
echo "搜索时间: $(date)"
echo ""

# 创建结果文件
REPORT_FILE="cc-admin-monitoring-report-$(date +%Y%m%d-%H%M%S).md"
cat > "$REPORT_FILE" << EOF
# cc-admin 框架代码监控报告

**扫描时间**: $(date)
**框架名称**: cc-admin 企业级后台管理框架
**作者**: chichuang

## 📊 扫描结果

EOF

FOUND_COPIES=false

# 搜索独特标识符
echo "🔍 搜索独特标识符..."
for signature in "${UNIQUE_SIGNATURES[@]}"; do
    echo "搜索签名: $signature"

    # GitHub API搜索
    SEARCH_RESULTS=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
         -H "Accept: application/vnd.github.v3+json" \
         "https://api.github.com/search/code?q=$(echo "$signature" | sed 's/ /%20/g')+-user:$YOUR_USERNAME&per_page=10" \
         | jq -r '.items[]? | "发现匹配: \(.repository.full_name)/\(.name) - \(.html_url)"')

    if [ ! -z "$SEARCH_RESULTS" ]; then
        FOUND_COPIES=true
        echo "## 发现匹配标识符: $signature" >> "$REPORT_FILE"
        echo "$SEARCH_RESULTS" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        echo "✅ 发现匹配: $signature"
    else
        echo "❌ 未发现匹配: $signature"
    fi

    sleep 2  # 避免API限制
done

# 搜索文件结构
echo ""
echo "🔍 搜索文件结构..."
for structure in "${FILE_STRUCTURES[@]}"; do
    echo "搜索结构: $structure"

    SEARCH_RESULTS=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
         -H "Accept: application/vnd.github.v3+json" \
         "https://api.github.com/search/code?q=filename:$structure+-user:$YOUR_USERNAME&per_page=10" \
         | jq -r '.items[]? | "发现匹配结构: \(.repository.full_name)/\(.name) - \(.html_url)"')

    if [ ! -z "$SEARCH_RESULTS" ]; then
        FOUND_COPIES=true
        echo "## 发现匹配文件结构: $structure" >> "$REPORT_FILE"
        echo "$SEARCH_RESULTS" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        echo "✅ 发现匹配结构: $structure"
    else
        echo "❌ 未发现匹配结构: $structure"
    fi

    sleep 2
done

# 搜索技术栈组合
echo ""
echo "🔍 搜索技术栈组合..."
TECH_QUERY=""
for tech in "${TECH_STACK[@]}"; do
    TECH_QUERY+="$tech "
done

echo "搜索技术栈: $TECH_QUERY"
SEARCH_RESULTS=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     "https://api.github.com/search/code?q=$(echo "$TECH_QUERY" | sed 's/ /%20/g')+-user:$YOUR_USERNAME&per_page=10" \
     | jq -r '.items[]? | "发现技术栈匹配: \(.repository.full_name)/\(.name) - \(.html_url)"')

if [ ! -z "$SEARCH_RESULTS" ]; then
    FOUND_COPIES=true
    echo "## 发现技术栈匹配" >> "$REPORT_FILE"
    echo "$SEARCH_RESULTS" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "✅ 发现技术栈匹配"
else
    echo "❌ 未发现技术栈匹配"
fi

# 生成报告总结
cat >> "$REPORT_FILE" << EOF

## 📊 扫描总结

**扫描时间**: $(date)
**扫描标识符数量**: ${#UNIQUE_SIGNATURES[@]}
**扫描文件结构数量**: ${#FILE_STRUCTURES[@]}
**扫描技术栈数量**: ${#TECH_STACK[@]}

## ⚠️ 注意事项

1. 这些结果可能包含误报，请人工审核
2. 某些相似可能是巧合或学习用途
3. 建议联系相关仓库作者进行确认

## 📞 联系方式

如需商业使用授权，请联系：
- 作者: chichuang
- 项目: cc-admin 企业级后台管理框架
- GitHub: https://github.com/$YOUR_USERNAME

---
*此报告由 cc-admin 框架自动生成*
EOF

# 输出结果
echo ""
echo "📊 搜索完成！"
if [ "$FOUND_COPIES" = true ]; then
    echo "🚨 发现潜在的代码抄袭行为！"
    echo "📄 详细报告已保存到: $REPORT_FILE"
else
    echo "✅ 未发现明显的代码抄袭行为"
    echo "📄 报告已保存到: $REPORT_FILE"
fi

echo ""
echo "🔍 扫描详情:"
echo "- 独特标识符: ${#UNIQUE_SIGNATURES[@]} 个"
echo "- 文件结构: ${#FILE_STRUCTURES[@]} 个"
echo "- 技术栈特征: ${#TECH_STACK[@]} 个"
echo "- 报告文件: $REPORT_FILE"
