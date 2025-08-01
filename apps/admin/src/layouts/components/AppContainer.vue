<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description cc-admin 企业级后台管理框架 - 布局组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
// 临时创建routeUtils（未使用）
const _routeUtils = {
  breadcrumbMap: new Map(),
  menuTree: [],
  flatRoutes: [],
  getBreadcrumbByRoute: () => [],
}
import { computed } from 'vue'

const keepAliveNames = computed(() => [])
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
