<script setup lang="ts">
import { useLayoutStore } from '@/stores'
import { computed } from 'vue'
import AppContainer from './AppContainer.vue'
import AppTopMenu from './AppTopMenu.vue'

const layoutStore = useLayoutStore()
const showMenu = computed(() => layoutStore.getShowMenu)
</script>

<template>
  <div class="container">
    <!-- 顶部预设菜单（可配置） -->
    <template v-if="showMenu">
      <section class="absolute t-gap r-gap">
        <AppTopMenu />
      </section>
    </template>

    <!-- 内容区域 -->
    <AppContainer />
  </div>
</template>
