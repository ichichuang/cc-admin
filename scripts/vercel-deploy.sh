#!/bin/bash

# Vercel 部署脚本
# 用于 monorepo 架构的 Vercel 部署

echo "🚀 开始 Vercel 部署..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
pnpm install --no-frozen-lockfile

# 构建项目
echo "🔨 构建项目..."
pnpm build

# 检查构建输出
if [ ! -d "apps/admin/dist" ]; then
    echo "❌ 错误: 构建输出目录不存在: apps/admin/dist"
    exit 1
fi

echo "✅ 构建完成，输出目录: apps/admin/dist"
echo "📁 构建产物内容:"
ls -la apps/admin/dist/

echo "🎉 部署准备完成！"
