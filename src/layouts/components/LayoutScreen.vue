<script setup lang="ts">
import { useLayoutStore } from '@/stores'
import { computed } from 'vue'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import AppTopMenu from './AppTopMenu.vue'

const layoutStore = useLayoutStore()

const showHeader = computed(() => layoutStore.getShowHeader)
const showMenu = computed(() => layoutStore.getShowMenu)
const showFooter = computed(() => layoutStore.getShowFooter)
</script>

<template>
  <div class="container">
    <!-- 头部 -->
    <template v-if="showHeader">
      <AppHeader />
    </template>

    <!-- 顶部预设菜单 -->
    <template v-if="showMenu">
      <AppTopMenu />
    </template>

    <!-- 内容区域 -->
    <main class="content-wrapper">
      <RouterView />
    </main>

    <!-- 底部 -->
    <template v-if="showFooter">
      <AppFooter />
    </template>
  </div>
</template>
