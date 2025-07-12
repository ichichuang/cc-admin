<script setup lang="ts">
import LayoutManager from '@/layouts/index.vue'
import { useColorStore, useLayoutStore, useSizeStore } from '@/stores'
import { onBeforeUnmount } from 'vue'

const colorStore = useColorStore()
const sizeStore = useSizeStore()
const layoutStore = useLayoutStore()

colorStore.init()
sizeStore.init()

const cleanup = layoutStore.init()

onBeforeUnmount(() => {
  cleanup() // 页面销毁时移除监听
})
</script>

<template>
  <div
    id="app"
    class="fixed left-0 top-0 bottom-0 right-0 z-0"
  >
    <LayoutManager />
  </div>
</template>
