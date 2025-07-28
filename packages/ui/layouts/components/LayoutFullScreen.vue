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
import AppTopMenu from './AppTopMenu.vue'

const layoutStore = useLayoutStore()
const showMenu = computed(() => layoutStore.getShowMenu)
</script>

<template>
  <div class="container">
    <!-- 顶部预设菜单（可配置） -->
    <template v-if="showMenu">
      <section class="absolute t-gap r-gap">
        <AppTopMenu />
      </section>
    </template>

    <!-- 内容区域 -->
    <AppContainer />
  </div>
</template>
