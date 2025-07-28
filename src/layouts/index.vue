<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - 布局组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
import Loading from '@/components/layout/Loading.vue'
import { useLayoutStore } from '@/stores'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from './components/LayoutAdmin.vue'
import FullScreenLayout from './components/LayoutFullScreen.vue'
import ScreenLayout from './components/LayoutScreen.vue'

const route = useRoute()
const layoutStore = useLayoutStore()

const isLoading = computed(() => layoutStore.getIsLoading)

// 根据路由meta获取布局模式，默认为admin
const currentLayoutMode = computed<LayoutMode>(() => {
  const routeLayout = route.meta?.parent as LayoutMode
  return routeLayout || 'admin'
})

// 同步更新store中的布局模式
layoutStore.setCurrentLayout(currentLayoutMode.value)
</script>

<template>
  <template v-if="isLoading">
    <div class="container center">
      <Loading />
    </div>
  </template>
  <template v-else>
    <component
      :is="AdminLayout"
      v-if="currentLayoutMode === 'admin'"
    />
    <component
      :is="ScreenLayout"
      v-else-if="currentLayoutMode === 'screen'"
    />
    <component
      :is="FullScreenLayout"
      v-else-if="currentLayoutMode === 'fullscreen'"
    />
    <component
      :is="AdminLayout"
      v-else
    />
  </template>
</template>
