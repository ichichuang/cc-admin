<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description cc-admin 企业级后台管理框架 - 根组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
import LayoutManager from '@/layouts/index.vue'
import { useColorStore, useLayoutStore, usePostcssStore, useSizeStore } from '@/stores'
import { onBeforeUnmount, onMounted } from 'vue'

const colorStore = useColorStore()
const sizeStore = useSizeStore()
const layoutStore = useLayoutStore()
const postcssStore = usePostcssStore()

colorStore.init()
sizeStore.init()

const cleanup = layoutStore.init()

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
