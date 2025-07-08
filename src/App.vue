<script setup lang="ts">
import LayoutManager from '@/layouts/index.vue'
import { useColorStoreWithOut, useSizeStoreWithOut } from '@/stores'

const colorStore = useColorStoreWithOut()
const sizeStore = useSizeStoreWithOut()
colorStore.init()
sizeStore.init()
</script>

<template>
  <div
    id="app"
    class="fixed left-0 top-0 bottom-0 right-0 z-0"
  >
    <LayoutManager />
  </div>
</template>
