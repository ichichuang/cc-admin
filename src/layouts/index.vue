<script setup lang="ts">
import type { LayoutMode } from '@/router/types'
import { useLayoutStore } from '@/stores/modules/layout'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from './components/LayoutAdmin.vue'
import FullScreenLayout from './components/LayoutFullScreen.vue'
import ScreenLayout from './components/LayoutScreen.vue'

const route = useRoute()
const layoutStore = useLayoutStore()

// 根据路由meta获取布局模式，默认为admin
const currentLayoutMode = computed<LayoutMode>(() => {
  const routeLayout = route.meta?.parent as LayoutMode
  return routeLayout || 'admin'
})

// 同步更新store中的布局模式
layoutStore.setLayoutMode(currentLayoutMode.value)
</script>

<template>
  <component
    :is="AdminLayout"
    v-if="currentLayoutMode === 'admin'"
  />
  <component
    :is="ScreenLayout"
    v-else-if="currentLayoutMode === 'screen'"
  />
  <component
    :is="FullScreenLayout"
    v-else-if="currentLayoutMode === 'fullscreen'"
  />
  <component
    :is="AdminLayout"
    v-else
  />
</template>
