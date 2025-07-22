<script setup lang="ts">
import { useLayoutStore } from '@/stores'
import { computed } from 'vue'
import AppBreadcrumb from './AppBreadcrumb.vue'
import AppContainer from './AppContainer.vue'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppTabs from './AppTabs.vue'

const layoutStore = useLayoutStore()
const showHeader = computed(() => layoutStore.getShowHeader)
const showSidebar = computed(() => layoutStore.getShowSidebar)
const showBreadcrumb = computed(() => layoutStore.getShowBreadcrumb)
const showFooter = computed(() => layoutStore.getShowFooter)
const showTabs = computed(() => layoutStore.getShowTabs)

// 侧边栏折叠
const sidebarCollapsed = computed(() => layoutStore.sidebarCollapsed)
// 移动端侧边栏可见
const mobileSidebarVisible = computed(() => layoutStore.mobileSidebarVisible)

// 主容器类名
const sidebarClass = computed(() => [
  {
    sidebarCollapsed: sidebarCollapsed.value,
    mobileSidebarVisible: mobileSidebarVisible.value,
  },
])
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
    <main class="h-contentsHeight between">
      <!-- 侧边栏 -->
      <template v-if="showSidebar">
        <div
          class="w-sidebarWidth h100%"
          :class="sidebarClass"
        >
          <AppSidebar />
        </div>
      </template>
      <div class="wfull hfull">
        <!-- 面包屑 -->
        <template v-if="showBreadcrumb">
          <section class="wfull h-breadcrumbHeight">
            <AppBreadcrumb />
          </section>
        </template>

        <!-- 标签页 -->
        <template v-if="showTabs">
          <section class="h-tabsHeight">
            <AppTabs />
          </section>
        </template>

        <div class="wfull h-contentHeight">
          <AppContainer />
        </div>
      </div>
    </main>

    <!-- 底部 -->
    <template v-if="showFooter">
      <footer class="h-footerHeight">
        <AppFooter />
      </footer>
    </template>
  </div>
</template>
