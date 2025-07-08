<script setup lang="ts"></script>
<template>
  <div>
    <p>权限管理</p>
    <router-view v-slot="{ Component, route }">
      <component
        :key="route.fullPath"
        :is="Component"
      />
    </router-view>
  </div>
</template>
<style lang="scss" scope></style>
