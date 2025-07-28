<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - 页面组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
import { useColorStore, type Mode, type ThemeColor } from '@/stores/modules/color'
import { computed } from 'vue'

interface ColorItem {
  name: string
  value: string
  class?: string
}
interface Color {
  title: string
  colors: ColorItem[]
}

const colors: Color[] = [
  {
    title: '普通色',
    colors: [
      {
        name: '透明色',
        value: 'color-text',
        class: 'bg-tm color-tm',
      },
      {
        name: '继承色',
        value: 'color-inherit',
        class: 'bg-inherit color-inherit',
      },
    ],
  },
  {
    title: '功能色系',
    colors: [
      {
        name: 'primary',
        value: 'color-primaryColor',
        class:
          'bg-primaryColor color-primaryLightColor hover:bg-primaryHoverColor active:bg-primaryActiveColor disabled:bg-primaryDisabledColor',
      },
      {
        name: 'success',
        value: 'color-successColor',
        class:
          'bg-successColor color-successLightColor hover:bg-successHoverColor active:bg-successActiveColor disabled:bg-successDisabledColor',
      },
      {
        name: 'warning',
        value: 'color-warningColor',
        class:
          'bg-warningColor color-warningLightColor hover:bg-warningHoverColor active:bg-warningActiveColor disabled:bg-warningDisabledColor',
      },
      {
        name: 'info',
        value: 'color-infoColor',
        class:
          'bg-infoColor color-infoLightColor hover:bg-infoHoverColor active:bg-infoActiveColor disabled:bg-infoDisabledColor',
      },
      {
        name: 'error',
        value: 'color-errorColor',
        class:
          'bg-errorColor color-errorLightColor hover:bg-errorHoverColor active:bg-errorActiveColor disabled:bg-errorDisabledColor',
      },
    ],
  },
  {
    title: '主题色系',
    colors: [
      {
        name: '主色深色调 - 用于主要按钮、导航栏、重要操作元素',
        value: 'color-primary100',
        class: 'bg-primary100 color-primary300',
      },
      {
        name: '主色中色调 - 用于悬停状态、次要强调、链接颜色',
        value: 'color-primary200',
        class: 'bg-primary200 color-primary300',
      },
      {
        name: '主色浅色调 - 用于背景渐变、轻微强调、选中状态背景',
        value: 'color-primary300',
        class: 'bg-primary300 color-primary100',
      },
    ],
  },
  {
    title: '强调色系',
    colors: [
      {
        name: '强调色主色调 - 用于重要信息提示、数据突出显示',
        value: 'color-accent100',
        class: 'bg-accent100 color-accent200',
      },
      {
        name: '强调色深色调 - 用于强调元素的深色变体、阴影效果',
        value: 'color-accent200',
        class: 'bg-accent200 color-accent100',
      },
    ],
  },
  {
    title: '文本色系',
    colors: [
      {
        name: '主文本色 - 用于标题、重要文字、主要内容文本',
        value: 'color-text100',
        class: 'bg-text100 color-text200',
      },
      {
        name: '次文本色 - 用于描述文字、辅助信息、次要内容',
        value: 'color-text200',
        class: 'bg-text200 color-text100',
      },
    ],
  },
  {
    title: '背景色系',
    colors: [
      {
        name: '主背景色 - 用于页面主背景、卡片背景、模态框背景',
        value: 'color-bg100',
        class: 'bg-bg100 color-bg200',
      },
      {
        name: '次背景色 - 用于区域分割、输入框背景、次要面板',
        value: 'color-bg200',
        class: 'bg-bg200 color-bg300',
      },
      {
        name: '边界背景色 - 用于分割线、禁用状态、边框颜色',
        value: 'color-bg300',
        class: 'bg-bg300 color-bg100',
      },
    ],
  },
]

const colorStore = useColorStore()

const modeLabel = computed(() => colorStore.getModeLabel)
const modeOptions = computed(() => colorStore.getModeOptions)
const mode = computed(() => colorStore.getMode)

const themeLabel = computed(() => colorStore.getThemeLabel)
const themeOptions = computed(() => colorStore.getThemeOptions)
const themeValue = computed(() => colorStore.getThemeValue)

const setMode = (value: Mode) => {
  colorStore.setMode(value)
}

const setTheme = (value: ThemeColor['value']) => {
  colorStore.setTheme(value)
}
</script>
<template>
  <!-- 颜色配置 -->
  <div
    class="bg-bg200 color-primary100 border p-gap mb-gap sticky top-0 left-0 right-0 between-col gap-gap"
  >
    <div class="between">
      <div>切换颜色模式: {{ modeLabel }} {{ mode }}</div>
      <div class="between">
        <template
          v-for="item in modeOptions"
          :key="item.value"
        >
          <div
            class="btn-primary"
            :class="mode === item.value ? 'btn-success' : ''"
            @click="setMode(item.value)"
          >
            {{ item.label }}
          </div>
        </template>
      </div>
    </div>
    <div class="between">
      <div>切换主题色: {{ themeLabel }} {{ themeValue }}</div>
      <div class="between">
        <template
          v-for="item in themeOptions"
          :key="item.value"
        >
          <div
            class="btn-primary"
            :class="themeValue === item.value ? 'btn-success' : ''"
            @click="setTheme(item.value)"
          >
            {{ item.label }}
          </div>
        </template>
      </div>
    </div>
  </div>
  <!-- 颜色展示 -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gap p-gap">
    <template
      v-for="color in colors"
      :key="color.title"
    >
      <div class="card">
        <div class="center">{{ color.title }}</div>
        <div
          v-for="item in color.colors"
          :key="item.name"
          class="m-gap between gap-gap"
        >
          <div :class="`w50% hfull ${item.value}`">
            <div class="min-h40px between p-gap">
              {{ item.name }}
            </div>
            <input
              class="input-base"
              type="text"
              :value="item.value"
            />
          </div>
          <div class="w50% hfull">
            <div :class="`h40px center ${item?.class || ''}`">使用示例</div>
            <input
              class="input-base"
              type="text"
              :value="item.class"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<style lang="scss" scope></style>
