<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description cc-admin 企业级后台管理框架 - 根组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
import LayoutManager from '@/layouts'
import {
  useColorStore,
  useLayoutStore,
  usePostcssStore,
  useSizeStore,
} from '@cc/early-bird-core/stores'
import type { RemAdapterConfig } from '@cc/early-bird-core/utils'
import { computed, onBeforeUnmount, onMounted, reactive } from 'vue'

const colorStore = useColorStore()
const sizeStore = useSizeStore()
const layoutStore = useLayoutStore()
const postcssStore = usePostcssStore()

colorStore.init()
sizeStore.init()

const cleanup = layoutStore.init()

// 当前断点
const currentBreakpoint = computed(() => {
  const deviceInfo = layoutStore.deviceInfo
  return postcssStore.getCurrentBreakpoint(deviceInfo)
})
const currentRemBase = computed(() => postcssStore.getCurrentRemBase || 16)

// 临时配置
const tempConfig = reactive<RemAdapterConfig>({
  ...postcssStore.getRemConfig,
})

console.log('=======================应用初始化 start =======================')
console.log('📱 当前断点:', currentBreakpoint.value)
console.log('📏 当前 rem 基准值:', currentRemBase.value)
console.log('🎨 设计稿宽度:', tempConfig.designWidth)
console.log('📐 基准字体大小:', tempConfig.baseFontSize)
console.log('📏 最小字体大小:', tempConfig.minFontSize)
console.log('📏 最大字体大小:', tempConfig.maxFontSize)
console.log('📱 是否启用移动端优先策略:', tempConfig.mobileFirst)
console.log('⚙️ 自定义断点配置:', tempConfig.breakpoints)
console.log('=======================应用初始化 end =======================')

onMounted(async () => {
  await postcssStore.initRemAdapter()
})
onBeforeUnmount(() => {
  cleanup() // 页面销毁时移除监听
})
</script>

<template>
  <div
    id="app"
    class="fixed left-0 top-0 bottom-0 right-0 z-0 container fs-16 md:fs-18 lg:fs-16 xls:fs-18"
  >
    <LayoutManager />
  </div>
</template>
