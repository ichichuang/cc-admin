<script setup lang="ts">
const env = import.meta.env
const title = env.VITE_APP_TITLE
</script>
<template>
  <div>
    <h1>500</h1>
    <p>Server Error</p>
    <p>{{ title }}</p>
  </div>
</template>
<style lang="scss" scope></style>
