<script setup lang="ts">
import { useLayoutStore } from '@/stores/modules/layout'
import { computed } from 'vue'
import AppTopMenu from './AppTopMenu.vue'

const layoutStore = useLayoutStore()

// 响应式配置
const config = computed(() => layoutStore.fullscreenConfig)
</script>

<template>
  <div class="fullscreen-layout">
    <!-- 顶部预设菜单（可配置） -->
    <AppTopMenu v-if="config.showTopMenu" />

    <!-- 内容区域 -->
    <div class="fullscreen-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.fullscreen-layout {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #000;
  display: flex;
  flex-direction: column;
}

.fullscreen-content {
  flex: 1;
  overflow: hidden;
}
</style>
