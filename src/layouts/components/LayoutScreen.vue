<script setup lang="ts">
import { routeUtils } from '@/router'
import { useLayoutStore } from '@/stores'
import { computed } from 'vue'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
const layoutStore = useLayoutStore()

const showHeader = computed(() => layoutStore.getShowHeader)
const showFooter = computed(() => layoutStore.getShowFooter)
const keepAliveNames = computed(() =>
  routeUtils.flatRoutes.filter(r => r.meta?.keepAlive && r.name).map(r => r.name as string)
)
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
      <RouterView v-slot="{ Component }">
        <KeepAlive :include="keepAliveNames">
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </main>

    <!-- 底部 -->
    <template v-if="showFooter">
      <footer class="h-footerHeight">
        <AppFooter />
      </footer>
    </template>
  </div>
</template>
