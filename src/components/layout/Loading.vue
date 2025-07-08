<script setup lang="ts">
import { toCamelCase } from '@/common'

const props = withDefaults(
  defineProps<{
    size?: number
  }>(),
  {
    size: 80,
  }
)

// 动态计算
const spinnerStyle = {
  width: `${props.size}px`,
  height: `${props.size}px`,
  [toCamelCase('circleSize', '--')]: `${props.size * 0.24}px`,
  [toCamelCase('borderSize', '--')]: `${props.size / 25}px`,
}
</script>

<template>
  <div
    class="overflow-hidden atom-spinner"
    :style="spinnerStyle"
  >
    <div class="spinner-inner">
      <div class="spinner-line"></div>
      <div class="spinner-line"></div>
      <div class="spinner-line"></div>
      <div class="spinner-circle">&#9679;</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.atom-spinner .spinner-inner {
  position: relative;
  display: block;
  height: 100%;
  width: 100%;
}

.atom-spinner .spinner-circle {
  display: block;
  position: absolute;
  color: var(--theme-color);
  font-size: var(--circle-size);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.atom-spinner .spinner-line {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border-left: var(--border-size) solid var(--theme-color);
  border-top: var(--border-size) solid transparent;
}

.atom-spinner .spinner-line:nth-child(1) {
  animation: atom-spinner-animation-1 1s linear infinite;
  transform: rotateZ(120deg) rotateX(66deg) rotateZ(0deg);
}

.atom-spinner .spinner-line:nth-child(2) {
  animation: atom-spinner-animation-2 1s linear infinite;
  transform: rotateZ(240deg) rotateX(66deg) rotateZ(0deg);
}

.atom-spinner .spinner-line:nth-child(3) {
  animation: atom-spinner-animation-3 1s linear infinite;
  transform: rotateZ(360deg) rotateX(66deg) rotateZ(0deg);
}

@keyframes atom-spinner-animation-1 {
  100% {
    transform: rotateZ(120deg) rotateX(66deg) rotateZ(360deg);
  }
}

@keyframes atom-spinner-animation-2 {
  100% {
    transform: rotateZ(240deg) rotateX(66deg) rotateZ(360deg);
  }
}

@keyframes atom-spinner-animation-3 {
  100% {
    transform: rotateZ(360deg) rotateX(66deg) rotateZ(360deg);
  }
}
</style>
