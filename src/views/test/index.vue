<script setup lang="ts">
import { useLayoutStore } from '@/stores/modules/layout'
import { onMounted } from 'vue'

const layoutStore = useLayoutStore()

onMounted(() => {
  console.log('Test 页面已加载')
  console.log('当前布局模式:', layoutStore.currentLayout)
})

// 测试布局配置
const toggleBreadcrumb = () => {
  layoutStore.updateAdminConfig({
    showBreadcrumb: !layoutStore.adminConfig.showBreadcrumb,
  })
}

const toggleFooter = () => {
  layoutStore.updateAdminConfig({
    showFooter: !layoutStore.adminConfig.showFooter,
  })
}

const toggleTopMenu = () => {
  layoutStore.updateAdminConfig({
    showTopMenu: !layoutStore.adminConfig.showTopMenu,
  })
}

// 测试Screen布局配置
const toggleScreenHeader = () => {
  layoutStore.updateScreenConfig({
    showHeader: !layoutStore.screenConfig.showHeader,
  })
}

const toggleScreenTopMenu = () => {
  layoutStore.updateScreenConfig({
    showTopMenu: !layoutStore.screenConfig.showTopMenu,
  })
}

// 测试Fullscreen布局配置
const toggleFullscreenTopMenu = () => {
  layoutStore.updateFullscreenConfig({
    showTopMenu: !layoutStore.fullscreenConfig.showTopMenu,
  })
}
</script>

<template>
  <div class="test-page">
    <h1>测试页面</h1>
    <p>这里可以测试各种功能</p>

    <div class="test-sections">
      <div class="section">
        <h3>Layout 系统测试</h3>
        <p>
          当前布局模式: <strong>{{ layoutStore.currentLayout }}</strong>
        </p>

        <div class="controls">
          <button @click="toggleBreadcrumb">
            {{ layoutStore.adminConfig.showBreadcrumb ? '隐藏' : '显示' }} 面包屑
          </button>

          <button @click="toggleFooter">
            {{ layoutStore.adminConfig.showFooter ? '隐藏' : '显示' }} 底部
          </button>

          <button @click="toggleTopMenu">
            {{ layoutStore.adminConfig.showTopMenu ? '隐藏' : '显示' }} 顶部菜单
          </button>

          <button @click="layoutStore.toggleSidebarCollapse">
            {{ layoutStore.sidebarCollapsed ? '展开' : '折叠' }} 侧边栏
          </button>
        </div>
      </div>

      <div class="section">
        <h3>Screen 布局测试</h3>
        <div class="controls">
          <button @click="toggleScreenHeader">
            Screen布局 {{ layoutStore.screenConfig.showHeader ? '隐藏' : '显示' }} 头部
          </button>

          <button @click="toggleScreenTopMenu">
            Screen布局 {{ layoutStore.screenConfig.showTopMenu ? '隐藏' : '显示' }} 顶部菜单
          </button>
        </div>
      </div>

      <div class="section">
        <h3>Fullscreen 布局测试</h3>
        <div class="controls">
          <button @click="toggleFullscreenTopMenu">
            Fullscreen布局 {{ layoutStore.fullscreenConfig.showTopMenu ? '隐藏' : '显示' }} 预设菜单
          </button>
        </div>
        <p class="note">注：Fullscreen 模式为纯大屏模式，无头部和底部框架</p>
      </div>

      <div class="section">
        <h3>所有配置信息</h3>
        <div class="config-display">
          <h4>Admin 配置</h4>
          <pre>{{ JSON.stringify(layoutStore.adminConfig, null, 2) }}</pre>

          <h4>Screen 配置</h4>
          <pre>{{ JSON.stringify(layoutStore.screenConfig, null, 2) }}</pre>

          <h4>Fullscreen 配置</h4>
          <pre>{{ JSON.stringify(layoutStore.fullscreenConfig, null, 2) }}</pre>
        </div>
      </div>

      <div class="section">
        <h3>快速导航</h3>
        <p>
          <router-link to="/dashboard">返回仪表盘</router-link> |
          <router-link to="/layout-demo/screen">大屏布局演示</router-link> |
          <router-link to="/layout-demo/fullscreen">全屏布局演示</router-link>
        </p>
      </div>

      <div class="section">
        <h3>功能演示</h3>
        <div class="demo-links">
          <router-link
            to="/test/theme-variables"
            class="demo-link"
          >
            🎨 动态主题变量演示
            <span>展示基于CSS变量的动态主题系统</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test-page {
  padding: 2rem;
}

.test-page h1 {
  color: #1f2937;
  margin-bottom: 1rem;
}

.test-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;
}

.section {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section h3 {
  color: #374151;
  margin: 0 0 1rem 0;
}

.controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.controls button {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.controls button:hover {
  background: #2563eb;
}

.config-display {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.config-display h4 {
  color: #374151;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
}

pre {
  background: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  font-size: 0.875rem;
  margin: 0;
}

a {
  color: #3b82f6;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.note {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 0.375rem;
  color: #92400e;
  font-size: 0.875rem;
  font-style: italic;
}

.demo-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.demo-link {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    text-decoration: none;
    color: white;
  }

  span {
    font-size: 0.875rem;
    opacity: 0.9;
    margin-top: 0.5rem;
  }
}
</style>
