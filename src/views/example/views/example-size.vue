<script setup lang="ts">
import {
  useLayoutStore,
  useSizeStore,
  type GapOptions,
  type RoundedOptions,
  type SizeOptions,
} from '@/stores'
import { computed } from 'vue'

const sizeStore = useSizeStore()
const layoutStore = useLayoutStore()

const sizeOptions = computed(() => sizeStore.getSizeOptions)
const size = computed(() => sizeStore.getSize)
const sizeLabel = computed(() => sizeStore.getSizeLabel)

/* 尺寸变量配置相关 layout */
const sidebarWidth = computed(() => sizeStore.getSidebarWidth)
const sidebarCollapsedWidth = computed(() => sizeStore.getSidebarCollapsedWidth)
const headerHeight = computed(() => sizeStore.getHeaderHeight)
const breadcrumbHeight = computed(() => sizeStore.getBreadcrumbHeight)
const footerHeight = computed(() => sizeStore.getFooterHeight)
const tabsHeight = computed(() => sizeStore.getTabsHeight)
const contentHeight = computed(() => sizeStore.getContentHeight)
const contentsHeight = computed(() => sizeStore.getContentsHeight)

/* 尺寸变量配置相关 gap */
const gapOptions = computed(() => sizeStore.getGapOptions)
const gap = computed(() => sizeStore.getGap)
const gapValue = computed(() => sizeStore.getGapValue)
const gapLabel = computed(() => sizeStore.getGapLabel)

/* 尺寸变量配置相关 rounded */
const roundedOptions = computed(() => sizeStore.getRoundedOptions)
const rounded = computed(() => sizeStore.getRounded)
const roundedValue = computed(() => sizeStore.getRoundedValue)
const roundedLabel = computed(() => sizeStore.getRoundedLabel)

const setSize = (value: SizeOptions['value']) => {
  sizeStore.setSize(value)
}

const setGap = (value: GapOptions['key']) => {
  sizeStore.setGap(value)
}

const setRounded = (value: RoundedOptions['key']) => {
  sizeStore.setRounded(value)
}

const isSidebarCollapsed = computed(() => layoutStore.getSidebarCollapsed)
const toggleSidebar = () => {
  layoutStore.setSidebarCollapsed(!layoutStore.getSidebarCollapsed)
}
</script>
<template>
  <!-- 尺寸配置 -->
  <div
    class="bg-bg200 color-primary100 border p-gap sticky top-0 left-0 right-0 between-col gap-gap"
  >
    <div class="between">
      <div>切换尺寸模式: {{ sizeLabel }} {{ size }}</div>
      <div class="between">
        <template
          v-for="item in sizeOptions"
          :key="item.value"
        >
          <div
            class="btn-primary"
            :class="size === item.value ? 'btn-success' : ''"
            @click="setSize(item.value)"
          >
            {{ item.label }}
          </div>
        </template>
      </div>
    </div>
    <div class="between">
      <div>切换间距: {{ gapLabel }} {{ gap }} {{ gapValue }}</div>
      <div class="between">
        <template
          v-for="item in gapOptions"
          :key="item.value"
        >
          <div
            class="btn-primary"
            :class="gap === item.key ? 'btn-success' : ''"
            @click="setGap(item.key)"
          >
            {{ item.label }}
          </div>
        </template>
      </div>
    </div>
    <div class="between">
      <div>切换圆角: {{ roundedLabel }} {{ rounded }} {{ roundedValue }}</div>
      <div class="between">
        <template
          v-for="item in roundedOptions"
          :key="item.value"
        >
          <div
            class="btn-primary"
            :class="rounded === item.key ? 'btn-success' : ''"
            @click="setRounded(item.key)"
          >
            {{ item.label }}
          </div>
        </template>
      </div>
    </div>
  </div>
  <!-- 尺寸展示 -->
  <div class="p-gap">
    <div class="h-headerHeight bg-bg300 center">header {{ headerHeight }}</div>
    <div class="h-contentHeight bg-bg100 between">
      <div
        class="h100% bg-bg200 center-col"
        :class="isSidebarCollapsed ? 'w-sidebarCollapsedWidth' : 'w-sidebarWidth'"
      >
        <div>sidebar</div>
        <div>{{ isSidebarCollapsed ? sidebarCollapsedWidth : sidebarWidth }}</div>
        <div>
          <div
            class="btn-primary"
            :class="isSidebarCollapsed ? 'btn-success' : ''"
            @click="toggleSidebar"
          >
            {{ isSidebarCollapsed ? '展开' : '折叠' }}
          </div>
        </div>
      </div>
      <div class="wfull h100% bg-bg100 between-col">
        <div class="h-breadcrumbHeight bg-bg100 center">breadcrumb {{ breadcrumbHeight }}</div>
        <div class="h-tabsHeight bg-bg200 center">tabs {{ tabsHeight }}</div>
        <div class="h-contentHeight center-col">
          <div class="bg-bg200 border border-bg300 p-gap rounded">
            <div>content {{ contentHeight }}</div>
            <div>不包含面包屑、标签页、内容区域</div>
            <div>bg-bg200 border border-bg300 p-gap rounded</div>
          </div>
          <div class="bg-bg200 border border-bg300 p-gap rounded mt-gaps">
            <div>content {{ contentHeight }}</div>
            <div>不包含面包屑、标签页、内容区域</div>
            <div>bg-bg200 border border-bg300 p-gap rounded mt-gaps</div>
          </div>
        </div>
      </div>
    </div>
    <div class="h-footerHeight bg-bg300 center">footer {{ footerHeight }}</div>
    <div class="p-gap"></div>
    <div class="h-contentsHeight bg-bg100 center-col border">
      <div>contents {{ contentsHeight }}</div>
      <div>包含面包屑、标签页、内容区域</div>
    </div>
  </div>
</template>
<style lang="scss" scope></style>
