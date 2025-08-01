<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description cc-admin 企业级后台管理框架 - 布局组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
import { useLayoutStore } from '@cc/early-bird-core/stores'
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
