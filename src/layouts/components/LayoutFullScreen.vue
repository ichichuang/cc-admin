<script setup lang="ts">
import { useLayoutStore } from '@/stores'
import { computed } from 'vue'
import AppTopMenu from './AppTopMenu.vue'

const layoutStore = useLayoutStore()

const showMenu = computed(() => layoutStore.getShowMenu)
</script>

<template>
  <div class="container">
    <!-- 顶部预设菜单（可配置） -->
    <template v-if="showMenu">
      <AppTopMenu />
    </template>

    <!-- 内容区域 -->
    <RouterView />
  </div>
</template>
