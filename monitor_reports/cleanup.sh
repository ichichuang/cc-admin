#!/bin/bash
# cleanup.sh - CC-Admin 监控报告清理脚本

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
REPORTS_DIR="monitor_reports"
KEEP_DAYS=90  # 保留天数
KEEP_LATEST=true  # 是否保留最新报告

echo -e "${BLUE}🧹 CC-Admin 监控报告清理脚本${NC}"
echo "========================================"
echo -e "${CYAN}清理时间: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
echo -e "${CYAN}保留天数: $KEEP_DAYS 天${NC}"
echo -e "${CYAN}保留最新: $KEEP_LATEST${NC}"
echo "========================================"

# 检查目录是否存在
if [ ! -d "$REPORTS_DIR" ]; then
    echo -e "${RED}❌ 错误: $REPORTS_DIR 目录不存在${NC}"
    exit 1
fi

# 统计清理前的文件数量
before_count=$(find "$REPORTS_DIR" -maxdepth 1 -type d -name "20*" | wc -l)
echo -e "${YELLOW}📊 清理前报告数量: $before_count${NC}"

# 查找需要清理的目录
echo -e "${YELLOW}🔍 查找需要清理的报告...${NC}"

# 获取最新报告目录
latest_dir=$(find "$REPORTS_DIR" -maxdepth 1 -type d -name "20*" | sort | tail -1)

# 清理超过保留天数的报告
cleaned_count=0
for dir in $(find "$REPORTS_DIR" -maxdepth 1 -type d -name "20*" | sort); do
    # 跳过最新报告（如果启用保留）
    if [ "$KEEP_LATEST" = true ] && [ "$dir" = "$latest_dir" ]; then
        echo -e "${GREEN}✅ 保留最新报告: $(basename "$dir")${NC}"
        continue
    fi

    # 检查文件年龄
    if [ $(find "$dir" -maxdepth 0 -mtime +$KEEP_DAYS) ]; then
        echo -e "${YELLOW}🗑️  清理旧报告: $(basename "$dir")${NC}"
        rm -rf "$dir"
        ((cleaned_count++))
    else
        echo -e "${GREEN}✅ 保留报告: $(basename "$dir") (未超过 $KEEP_DAYS 天)${NC}"
    fi
done

# 更新软链接
if [ -n "$latest_dir" ] && [ -d "$latest_dir" ]; then
    echo -e "${YELLOW}🔗 更新最新报告软链接...${NC}"
    ln -sf "$(basename "$latest_dir")" "$REPORTS_DIR/latest"
    echo -e "${GREEN}✅ 软链接已更新: latest -> $(basename "$latest_dir")${NC}"
fi

# 统计清理后的文件数量
after_count=$(find "$REPORTS_DIR" -maxdepth 1 -type d -name "20*" | wc -l)

echo ""
echo "========================================"
echo -e "${BLUE}📊 清理结果摘要${NC}"
echo "========================================"
echo -e "🗑️  清理报告: ${RED}$cleaned_count${NC} 个"
echo -e "📊 清理前: ${YELLOW}$before_count${NC} 个"
echo -e "📊 清理后: ${GREEN}$after_count${NC} 个"
echo -e "💾 节省空间: 已清理 $cleaned_count 个报告目录"

# 显示剩余报告
if [ $after_count -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}📁 剩余报告:${NC}"
    find "$REPORTS_DIR" -maxdepth 1 -type d -name "20*" | sort | while read dir; do
        size=$(du -sh "$dir" 2>/dev/null | cut -f1)
        date=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M" "$dir" 2>/dev/null || stat -c "%y" "$dir" | cut -d' ' -f1)
        echo -e "  📄 $(basename "$dir") - $date - $size"
    done
fi

echo ""
echo -e "${GREEN}✅ 清理完成！${NC}"

# 可选：显示磁盘使用情况
if command -v df >/dev/null 2>&1; then
    echo ""
    echo -e "${YELLOW}💾 磁盘使用情况:${NC}"
    df -h "$REPORTS_DIR" | tail -1
fi
