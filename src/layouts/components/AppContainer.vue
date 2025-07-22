<script setup lang="ts">
import { routeUtils } from '@/router'
import { computed } from 'vue'

const keepAliveNames = computed(() =>
  routeUtils.flatRoutes.filter(r => r.meta?.keepAlive && r.name).map(r => r.name as string)
)
</script>
<template>
  <div class="full">
    <RouterView v-slot="{ Component }">
      <KeepAlive :include="keepAliveNames">
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </div>
</template>
<style lang="scss" scope></style>
