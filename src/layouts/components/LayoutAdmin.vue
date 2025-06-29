<script setup lang="ts">
import { useLayoutStore } from '@/stores/modules/layout'
import { computed } from 'vue'
import AppBreadcrumb from './AppBreadcrumb.vue'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'

const layoutStore = useLayoutStore()

// 响应式配置
const config = computed(() => layoutStore.adminConfig)
// 侧边栏折叠
const sidebarCollapsed = computed(() => layoutStore.sidebarCollapsed)
// 移动端侧边栏可见
const mobileSidebarVisible = computed(() => layoutStore.mobileSidebarVisible)

// 主容器类名
const containerClass = computed(() => [
  'admin-layout',
  {
    sidebarCollapsed: sidebarCollapsed.value,
    mobileSidebarVisible: mobileSidebarVisible.value,
  },
])
</script>

<template>
  <!-- 侧边栏 -->
  <div :class="containerClass">
    <AppSidebar v-if="config.showSidebar" />
  </div>

  <!-- 主内容区域 -->
  <div class="main-container">
    <!-- 头部 -->
    <AppHeader v-if="config.showHeader" />

    <!-- 面包屑 -->
    <AppBreadcrumb v-if="config.showBreadcrumb" />

    <!-- 内容区域 -->
    <main class="content-wrapper">
      <div class="content-container">
        <RouterView />
      </div>
    </main>

    <!-- 底部 -->
    <AppFooter v-if="config.showFooter" />
  </div>
</template>
