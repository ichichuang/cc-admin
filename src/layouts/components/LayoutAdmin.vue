<script setup lang="ts">
import { routeUtils } from '@/router'
import { useLayoutStore } from '@/stores'
import { computed } from 'vue'
import AppBreadcrumb from './AppBreadcrumb.vue'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'

const layoutStore = useLayoutStore()
const showHeader = computed(() => layoutStore.getShowHeader)
const showMenu = computed(() => layoutStore.getShowMenu)
const showSidebar = computed(() => layoutStore.getShowSidebar)
const showBreadcrumb = computed(() => layoutStore.getShowBreadcrumb)
const showFooter = computed(() => layoutStore.getShowFooter)
const showTabs = computed(() => layoutStore.getShowTabs)
const keepAliveNames = computed(() =>
  routeUtils.flatRoutes.filter(r => r.meta?.keepAlive && r.name).map(r => r.name as string)
)

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
    <!-- 侧边栏 -->
    <template v-if="showSidebar">
      <div
        class="w-sidebarWidth h-100% bg-themeColor"
        :class="sidebarClass"
      >
        <AppSidebar />
      </div>
    </template>

    <!-- 主内容区域 -->
    <div class="w100% h100% bg-themeColors">
      <!-- 头部 -->
      <template v-if="showHeader">
        <header class="w-full">
          <div class=""></div>
          <AppHeader :show-menu="showMenu" />
        </header>
      </template>

      <!-- 面包屑 -->
      <template v-if="showBreadcrumb">
        <AppBreadcrumb />
      </template>

      <!-- 内容区域 -->
      <main class="content-wrapper">
        <template v-if="showTabs">
          <div>标签页</div>
        </template>
        <div class="content-container">
          <RouterView v-slot="{ Component }">
            <KeepAlive :include="keepAliveNames">
              <component :is="Component" />
            </KeepAlive>
          </RouterView>
        </div>
      </main>

      <!-- 底部 -->
      <template v-if="showFooter">
        <AppFooter />
      </template>
    </div>
  </div>
</template>
