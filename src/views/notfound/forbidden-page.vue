<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - 页面组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
const env = import.meta.env
const title = env.VITE_APP_TITLE
</script>
<template>
  <div>
    <h1>403</h1>
    <p>Forbidden</p>
    <p>{{ title }}</p>
  </div>
</template>
<style lang="scss" scope></style>
