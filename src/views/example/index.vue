<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description cc-admin 企业级后台管理框架 - 页面组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
import { goName, isCurrentRoute } from '@/common'
import AppContainer from '@/layouts/components/AppContainer.vue'
</script>
<template>
  <div class="full">
    <div class="wfull h-headerHeight center">
      <div
        class="btn-info"
        :class="{ 'btn-success active': isCurrentRoute('ExampleColor') }"
        @click="goName('ExampleColor')"
      >
        color
      </div>
      <div
        class="btn-info"
        :class="{ 'btn-success active': isCurrentRoute('ExampleSize') }"
        @click="goName('ExampleSize')"
      >
        size
      </div>
      <div
        class="btn-info"
        :class="{ 'btn-success active': isCurrentRoute('ExampleRem') }"
        @click="goName('ExampleRem')"
      >
        rem
      </div>
      <div
        class="btn-info"
        :class="{ 'btn-success active': isCurrentRoute('ExampleI18n') }"
        @click="goName('ExampleI18n')"
      >
        i18n
      </div>
      <div
        class="btn-info"
        :class="{ 'btn-success active': isCurrentRoute('ExampleDate') }"
        @click="goName('ExampleDate')"
      >
        date
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
