<script setup lang="ts">
import { routeUtils } from '@/router'
import { useLayoutStore } from '@/stores'
import { computed } from 'vue'
import AppTopMenu from './AppTopMenu.vue'

const layoutStore = useLayoutStore()
const showMenu = computed(() => layoutStore.getShowMenu)
const keepAliveNames = computed(() =>
  routeUtils.flatRoutes.filter(r => r.meta?.keepAlive && r.name).map(r => r.name as string)
)
</script>

<template>
  <div class="container">
    <!-- 顶部预设菜单（可配置） -->
    <template v-if="showMenu">
      <AppTopMenu />
    </template>

    <!-- 内容区域 -->
    <RouterView v-slot="{ Component }">
      <KeepAlive :include="keepAliveNames">
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </div>
</template>
