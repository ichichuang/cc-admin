<script setup lang="ts">
import { routeUtils } from '@/router'
import { useLayoutStore } from '@/stores'
import { computed } from 'vue'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import AppTopMenu from './AppTopMenu.vue'

const layoutStore = useLayoutStore()

const showHeader = computed(() => layoutStore.getShowHeader)
const showMenu = computed(() => layoutStore.getShowMenu)
const showFooter = computed(() => layoutStore.getShowFooter)
const keepAliveNames = computed(() =>
  routeUtils.flatRoutes.filter(r => r.meta?.keepAlive && r.name).map(r => r.name as string)
)
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
      <RouterView v-slot="{ Component }">
        <KeepAlive :include="keepAliveNames">
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </main>

    <!-- 底部 -->
    <template v-if="showFooter">
      <AppFooter />
    </template>
  </div>
</template>
