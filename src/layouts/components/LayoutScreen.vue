<script setup lang="ts">
import { useLayoutStore } from '@/stores/modules/layout'
import { computed } from 'vue'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import AppTopMenu from './AppTopMenu.vue'

const layoutStore = useLayoutStore()

// 响应式配置
const config = computed(() => layoutStore.screenConfig)
</script>

<template>
  <div class="screen-layout">
    <!-- 头部 -->
    <AppHeader v-if="config.showHeader" />

    <!-- 顶部预设菜单 -->
    <AppTopMenu v-if="config.showTopMenu" />

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

<style scoped>
.screen-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8f9fa;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-container {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background: #fff;
  margin: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-container {
    margin: 0.5rem;
    padding: 1rem;
    border-radius: 0.5rem;
  }
}
</style>
