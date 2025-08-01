#!/bin/bash
# test-github-token.sh - 测试 GitHub Token 有效性

# 加载环境变量
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔑 GitHub Token 测试工具${NC}"
echo "========================================"

# 检查环境变量
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}❌ 错误: 未设置 GITHUB_TOKEN 环境变量${NC}"
    echo ""
    echo "请按以下步骤设置:"
    echo "1. 在 GitHub 中创建 Personal Access Token"
    echo "2. 设置环境变量:"
    echo "   export GITHUB_TOKEN='your_token_here'"
    echo ""
    echo "或者创建 .env 文件:"
    echo "echo 'GITHUB_TOKEN=your_token_here' > .env"
    echo ""
    echo "或者直接在命令行中运行:"
    echo "GITHUB_TOKEN='your_token_here' ./scripts/test-github-token.sh"
    echo ""
    echo "详细说明请查看: docs/github-token-guide.md"
    exit 1
fi

echo -e "${YELLOW}🔍 测试 GitHub Token 有效性...${NC}"

# 测试1: 验证Token格式
if [[ ! "$GITHUB_TOKEN" =~ ^ghp_[A-Za-z0-9]{36}$ ]] && [[ ! "$GITHUB_TOKEN" =~ ^github_pat_[A-Za-z0-9_]{82}$ ]]; then
    echo -e "${RED}❌ Token 格式不正确${NC}"
    echo "Token 应该以 'ghp_' 或 'github_pat_' 开头"
    exit 1
fi

echo -e "${GREEN}✅ Token 格式正确${NC}"

# 测试2: 验证Token权限
echo -e "${YELLOW}🔍 测试 Token 权限...${NC}"

# 测试用户信息访问
USER_RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/user")

if echo "$USER_RESPONSE" | jq -e '.login' > /dev/null 2>&1; then
    USERNAME=$(echo "$USER_RESPONSE" | jq -r '.login')
    echo -e "${GREEN}✅ Token 有效，用户: $USERNAME${NC}"
else
    echo -e "${RED}❌ Token 无效或权限不足${NC}"
    echo "响应: $USER_RESPONSE"
    exit 1
fi

# 测试3: 验证仓库访问权限
echo -e "${YELLOW}🔍 测试仓库访问权限...${NC}"

REPO_RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/$USERNAME/cc-admin")

if echo "$REPO_RESPONSE" | jq -e '.name' > /dev/null 2>&1; then
    REPO_NAME=$(echo "$REPO_RESPONSE" | jq -r '.name')
    echo -e "${GREEN}✅ 可以访问仓库: $REPO_NAME${NC}"
else
    echo -e "${YELLOW}⚠️ 无法访问 cc-admin 仓库，可能仓库不存在或权限不足${NC}"
    echo "响应: $REPO_RESPONSE"
fi

# 测试4: 验证搜索API权限
echo -e "${YELLOW}🔍 测试搜索API权限...${NC}"

SEARCH_RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/search/code?q=test&per_page=1")

if echo "$SEARCH_RESPONSE" | jq -e '.total_count' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 搜索API权限正常${NC}"
else
    echo -e "${RED}❌ 搜索API权限不足${NC}"
    echo "响应: $SEARCH_RESPONSE"
fi

# 测试5: 检查Token权限范围
echo -e "${YELLOW}🔍 检查Token权限范围...${NC}"

SCOPES=$(curl -s -I -H "Authorization: token $GITHUB_TOKEN" \
    "https://api.github.com/user" | grep -i "x-oauth-scopes" | cut -d' ' -f2-)

if [ ! -z "$SCOPES" ]; then
    echo -e "${GREEN}✅ Token 权限范围: $SCOPES${NC}"

    # 检查必要权限
    if [[ "$SCOPES" == *"repo"* ]] || [[ "$SCOPES" == *"public_repo"* ]]; then
        echo -e "${GREEN}✅ 仓库访问权限正常${NC}"
    else
        echo -e "${YELLOW}⚠️ 建议添加 repo 权限以获得完整功能${NC}"
    fi

    if [[ "$SCOPES" == *"read:user"* ]]; then
        echo -e "${GREEN}✅ 用户信息读取权限正常${NC}"
    else
        echo -e "${YELLOW}⚠️ 建议添加 read:user 权限${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ 无法获取权限范围信息${NC}"
fi

echo ""
echo "========================================"
echo -e "${GREEN}✅ GitHub Token 测试完成${NC}"
echo ""
echo "如果所有测试都通过，你的Token可以正常使用代码监控功能！"
echo ""
echo "使用方法:"
echo "export GITHUB_TOKEN='your_token_here'"
echo "pnpm monitor"
