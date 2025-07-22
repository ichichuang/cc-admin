<script setup lang="ts">
import { useLayoutStore } from '@/stores'
import { computed } from 'vue'
import AppContainer from './AppContainer.vue'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
const layoutStore = useLayoutStore()

const showHeader = computed(() => layoutStore.getShowHeader)
const showFooter = computed(() => layoutStore.getShowFooter)
</script>

<template>
  <div class="container">
    <!-- 头部 -->
    <template v-if="showHeader">
      <header class="h-headerHeight">
        <AppHeader />
      </header>
    </template>

    <!-- 内容区域 -->
    <main class="h-contentsHeight">
      <AppContainer />
    </main>

    <!-- 底部 -->
    <template v-if="showFooter">
      <footer class="h-footerHeight">
        <AppFooter />
      </footer>
    </template>
  </div>
</template>
