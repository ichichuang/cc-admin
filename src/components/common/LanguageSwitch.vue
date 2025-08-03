<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description cc-admin 企业级后台管理框架 - 组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<template>
  <div class="language-switch">
    <div class="current-language">
      <span class="label">{{ $t('common.system.language') || '语言' }}</span>
      <button
        class="current-btn"
        @click="toggleDropdown"
      >
        <span class="flag">{{ currentLocale?.flag || '🌍' }}</span>
        <span class="name">{{ currentLocale?.name || 'Language' }}</span>
        <span
          class="arrow"
          :class="{ open: isDropdownOpen }"
          >▼</span
        >
      </button>
    </div>

    <div
      v-if="isDropdownOpen"
      class="dropdown"
      @click.stop
    >
      <div
        v-for="locale in supportedLocales"
        :key="locale.key"
        class="locale-option"
        :class="{ active: currentLocaleKey === locale.key }"
        @click="handleLanguageSwitch(locale.key)"
      >
        <span class="flag">{{ locale.flag }}</span>
        <span class="name">{{ locale.name }}</span>
        <span
          v-if="currentLocaleKey === locale.key"
          class="check"
          >✓</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocale } from '@/hooks/modules/useLocale'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const { currentLocale, supportedLocales, switchLocale, locale } = useLocale()

const isDropdownOpen = ref(false)

// 使用计算属性获取当前语言键
const currentLocaleKey = computed(() => locale.value)

// 切换下拉菜单
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

// 关闭下拉菜单
const closeDropdown = () => {
  isDropdownOpen.value = false
}

// 处理语言切换
const handleLanguageSwitch = async (localeKey: string) => {
  try {
    await switchLocale(localeKey as any)
    closeDropdown()

    // 显示切换成功的消息（使用全局 $t）
    console.log('🌐 语言切换为:', localeKey)
  } catch (error) {
    console.error('Failed to switch language:', error)
  }
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.language-switch')) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.language-switch {
  position: relative;
  display: inline-block;
}

.current-language {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.current-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  min-width: 120px;
}

.current-btn:hover {
  background: #e9ecef;
  border-color: #dee2e6;
}

.flag {
  font-size: 16px;
}

.name {
  flex: 1;
  text-align: left;
}

.arrow {
  font-size: 10px;
  transition: transform 0.2s;
  color: #6c757d;
}

.arrow.open {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 4px;
  overflow: hidden;
}

.locale-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
}

.locale-option:hover {
  background: #f8f9fa;
}

.locale-option.active {
  background: #e7f3ff;
  color: #0066cc;
}

.locale-option .flag {
  font-size: 16px;
}

.locale-option .name {
  flex: 1;
}

.check {
  color: #28a745;
  font-weight: bold;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .current-btn {
    min-width: 100px;
    padding: 6px 10px;
  }

  .dropdown {
    left: auto;
    right: 0;
    min-width: 150px;
  }
}
</style>
