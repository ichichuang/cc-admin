<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description cc-admin 企业级后台管理框架 - 布局组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

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
