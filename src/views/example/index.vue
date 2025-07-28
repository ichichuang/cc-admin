<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - 页面组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
import { goName } from '@/common'
import AppContainer from '@/layouts/components/AppContainer.vue'
</script>
<template>
  <div class="full">
    <div class="wfull h-headerHeight center">
      <div
        class="btn-info"
        @click="goName('ExampleColor')"
      >
        color
      </div>
      <div
        class="btn-info"
        @click="goName('ExampleSize')"
      >
        size
      </div>
      <div
        class="btn-info"
        @click="goName('ExampleRem')"
      >
        rem
      </div>
      <div
        class="btn-info"
        @click="goName('ExampleI18n')"
      >
        i18n
      </div>
      <div
        class="btn-info"
        @click="goName('ExampleMock')"
      >
        mock
      </div>
    </div>
    <div class="wfull h-[calc(var(--contents-height)+var(--footer-height))] overflow-auto">
      <div>
        <AppContainer />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scope></style>
