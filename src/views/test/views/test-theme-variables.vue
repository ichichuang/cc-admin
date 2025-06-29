<template>
  <div class="theme-test-page">
    <div class="page-header">
      <h1>🎨 动态主题变量演示</h1>
      <p>基于CSS变量的动态主题系统，支持实时切换和自定义配置</p>
    </div>

    <div class="demo-grid">
      <!-- 主题切换演示 -->
      <div class="demo-card">
        <h3>🌓 主题模式切换</h3>
        <div class="theme-controls">
          <button
            @click="themeStore.setThemeMode('light')"
            :class="{ active: themeStore.mode === 'light' }"
            class="theme-button light"
          >
            🌞 浅色主题
          </button>
          <button
            @click="themeStore.setThemeMode('dark')"
            :class="{ active: themeStore.mode === 'dark' }"
            class="theme-button dark"
          >
            🌙 深色主题
          </button>
          <button
            @click="themeStore.toggleTheme()"
            class="theme-button toggle"
          >
            🔄 切换主题
          </button>
        </div>
      </div>

      <!-- 颜色变量演示 -->
      <div class="demo-card">
        <h3>🎨 颜色变量演示</h3>
        <div class="color-variables">
          <!-- 功能色 -->
          <div class="color-section">
            <h4>Primary 主色调</h4>
            <div class="color-grid">
              <div
                class="color-item"
                :style="{ backgroundColor: 'var(--theme-primary-color)' }"
              >
                <span>主色调</span>
                <code>--theme-primary-color</code>
              </div>
              <div
                class="color-item"
                :style="{ backgroundColor: 'var(--theme-primary-hover)' }"
              >
                <span>悬停色</span>
                <code>--theme-primary-hover</code>
              </div>
              <div
                class="color-item"
                :style="{ backgroundColor: 'var(--theme-primary-active)' }"
              >
                <span>激活色</span>
                <code>--theme-primary-active</code>
              </div>
              <div
                class="color-item"
                :style="{ backgroundColor: 'var(--theme-primary-disabled)' }"
              >
                <span>禁用色</span>
                <code>--theme-primary-disabled</code>
              </div>
              <div
                class="color-item"
                :style="{ backgroundColor: 'var(--theme-primary-light)' }"
              >
                <span>浅色</span>
                <code>--theme-primary-light</code>
              </div>
            </div>
          </div>

          <div class="color-section">
            <h4>Success 成功色</h4>
            <div class="color-grid">
              <div
                class="color-item"
                :style="{ backgroundColor: 'var(--theme-success-color)' }"
              >
                <span>成功色</span>
                <code>--theme-success-color</code>
              </div>
              <div
                class="color-item"
                :style="{ backgroundColor: 'var(--theme-success-hover)' }"
              >
                <span>悬停色</span>
                <code>--theme-success-hover</code>
              </div>
              <div
                class="color-item"
                :style="{ backgroundColor: 'var(--theme-success-active)' }"
              >
                <span>激活色</span>
                <code>--theme-success-active</code>
              </div>
              <div
                class="color-item"
                :style="{ backgroundColor: 'var(--theme-success-light)' }"
              >
                <span>浅色</span>
                <code>--theme-success-light</code>
              </div>
            </div>
          </div>

          <div class="color-section">
            <h4>Warning 警告色</h4>
            <div class="color-grid">
              <div
                class="color-item"
                :style="{ backgroundColor: 'var(--theme-warning-color)' }"
              >
                <span>警告色</span>
                <code>--theme-warning-color</code>
              </div>
              <div
                class="color-item"
                :style="{ backgroundColor: 'var(--theme-warning-hover)' }"
              >
                <span>悬停色</span>
                <code>--theme-warning-hover</code>
              </div>
              <div
                class="color-item"
                :style="{ backgroundColor: 'var(--theme-warning-light)' }"
              >
                <span>浅色</span>
                <code>--theme-warning-light</code>
              </div>
            </div>
          </div>

          <div class="color-section">
            <h4>Error 错误色</h4>
            <div class="color-grid">
              <div
                class="color-item"
                :style="{ backgroundColor: 'var(--theme-error-color)' }"
              >
                <span>错误色</span>
                <code>--theme-error-color</code>
              </div>
              <div
                class="color-item"
                :style="{ backgroundColor: 'var(--theme-error-hover)' }"
              >
                <span>悬停色</span>
                <code>--theme-error-hover</code>
              </div>
              <div
                class="color-item"
                :style="{ backgroundColor: 'var(--theme-error-light)' }"
              >
                <span>浅色</span>
                <code>--theme-error-light</code>
              </div>
            </div>
          </div>

          <div class="color-section">
            <h4>主题相关颜色</h4>
            <div class="color-grid">
              <div
                class="color-item"
                :style="{ backgroundColor: 'var(--theme-color)', color: 'var(--theme-text-color)' }"
              >
                <span>主题色</span>
                <code>--theme-color</code>
              </div>
              <div
                class="color-item"
                :style="{ backgroundColor: 'var(--theme-color)', color: 'var(--theme-text-color)' }"
              >
                <span>主题文字色</span>
                <code>--theme-text-color</code>
              </div>
            </div>
          </div>

          <div class="color-section">
            <h4>基础颜色</h4>
            <div class="color-grid">
              <div
                class="color-item"
                :style="{
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-color)',
                  border: '1px solid #ddd',
                }"
              >
                <span>背景色</span>
                <code>--background-color</code>
              </div>
              <div
                class="color-item"
                :style="{
                  backgroundColor: 'var(--background-highlight-color)',
                  color: 'var(--text-color)',
                  border: '1px solid #ddd',
                }"
              >
                <span>背景高亮色</span>
                <code>--background-highlight-color</code>
              </div>
              <div
                class="text-item"
                :style="{ color: 'var(--text-color)' }"
              >
                默认文字色 <code>--text-color</code>
              </div>
              <div
                class="text-item"
                :style="{ color: 'var(--text-muted-color)' }"
              >
                置灰文字色 <code>--text-muted-color</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 尺寸变量展示 -->
      <div class="variable-group">
        <h3>尺寸变量 (SizeVariables)</h3>

        <!-- 当前尺寸选项 -->
        <div class="current-size-info">
          <h4>当前尺寸选项</h4>
          <div class="size-option-display">
            <span class="current-option">{{ themeStore.currentSizeOption }}</span>
            <span class="current-option-label">{{ themeStore.currentSizePreset.label }}</span>
          </div>

          <div class="size-option-controls">
            <button
              v-for="preset in sizePresets"
              :key="preset.name"
              @click="themeStore.setSizeOption(preset.name)"
              :class="['size-option-btn', { active: themeStore.currentSizeOption === preset.name }]"
            >
              {{ preset.label }}
            </button>
          </div>
        </div>

        <!-- 布局相关尺寸 -->
        <div class="variable-category">
          <h4>布局相关尺寸</h4>
          <div class="variables-grid">
            <div class="variable-item">
              <span class="variable-name">--sidebar-width</span>
              <span class="variable-value">{{ themeStore.sizes.sidebarWidth }}</span>
              <div
                class="variable-demo layout-demo"
                :style="{ width: themeStore.sizes.sidebarWidth, height: '40px' }"
              >
                侧边栏宽度
              </div>
            </div>
            <div class="variable-item">
              <span class="variable-name">--sidebar-collapsed-width</span>
              <span class="variable-value">{{ themeStore.sizes.sidebarCollapsedWidth }}</span>
              <div
                class="variable-demo layout-demo"
                :style="{ width: themeStore.sizes.sidebarCollapsedWidth, height: '40px' }"
              >
                收起
              </div>
            </div>
            <div class="variable-item">
              <span class="variable-name">--header-height</span>
              <span class="variable-value">{{ themeStore.sizes.headerHeight }}</span>
              <div
                class="variable-demo layout-demo"
                :style="{ width: '200px', height: themeStore.sizes.headerHeight }"
              >
                头部高度
              </div>
            </div>
            <div class="variable-item">
              <span class="variable-name">--breadcrumb-height</span>
              <span class="variable-value">{{ themeStore.sizes.breadcrumbHeight }}</span>
              <div
                class="variable-demo layout-demo"
                :style="{ width: '200px', height: themeStore.sizes.breadcrumbHeight }"
              >
                面包屑
              </div>
            </div>
            <div class="variable-item">
              <span class="variable-name">--footer-height</span>
              <span class="variable-value">{{ themeStore.sizes.footerHeight }}</span>
              <div
                class="variable-demo layout-demo"
                :style="{ width: '200px', height: themeStore.sizes.footerHeight }"
              >
                底部高度
              </div>
            </div>
            <div class="variable-item">
              <span class="variable-name">--tabs-height</span>
              <span class="variable-value">{{ themeStore.sizes.tabsHeight }}</span>
              <div
                class="variable-demo layout-demo"
                :style="{ width: '200px', height: themeStore.sizes.tabsHeight }"
              >
                标签页高度
              </div>
            </div>
          </div>
        </div>

        <!-- 设计系统 - 间距 -->
        <div class="variable-category">
          <h4>设计系统 - 间距</h4>
          <div class="variables-grid">
            <div class="variable-item">
              <span class="variable-name">--gap-xs</span>
              <span class="variable-value">{{ themeStore.sizes.gapXs }}</span>
              <div class="variable-demo spacing-demo">
                <div
                  class="spacing-item"
                  :style="{ width: themeStore.sizes.gapXs }"
                ></div>
              </div>
            </div>
            <div class="variable-item">
              <span class="variable-name">--gap-sm</span>
              <span class="variable-value">{{ themeStore.sizes.gapSm }}</span>
              <div class="variable-demo spacing-demo">
                <div
                  class="spacing-item"
                  :style="{ width: themeStore.sizes.gapSm }"
                ></div>
              </div>
            </div>
            <div class="variable-item">
              <span class="variable-name">--gap-md</span>
              <span class="variable-value">{{ themeStore.sizes.gapMd }}</span>
              <div class="variable-demo spacing-demo">
                <div
                  class="spacing-item"
                  :style="{ width: themeStore.sizes.gapMd }"
                ></div>
              </div>
            </div>
            <div class="variable-item">
              <span class="variable-name">--gap-lg</span>
              <span class="variable-value">{{ themeStore.sizes.gapLg }}</span>
              <div class="variable-demo spacing-demo">
                <div
                  class="spacing-item"
                  :style="{ width: themeStore.sizes.gapLg }"
                ></div>
              </div>
            </div>
            <div class="variable-item">
              <span class="variable-name">--gap-xl</span>
              <span class="variable-value">{{ themeStore.sizes.gapXl }}</span>
              <div class="variable-demo spacing-demo">
                <div
                  class="spacing-item"
                  :style="{ width: themeStore.sizes.gapXl }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 设计系统 - 圆角 -->
        <div class="variable-category">
          <h4>设计系统 - 圆角</h4>
          <div class="variables-grid">
            <div class="variable-item">
              <span class="variable-name">--radius-xs</span>
              <span class="variable-value">{{ themeStore.sizes.radiusXs }}</span>
              <div
                class="variable-demo radius-demo"
                :style="{ borderRadius: themeStore.sizes.radiusXs }"
              >
                圆角XS
              </div>
            </div>
            <div class="variable-item">
              <span class="variable-name">--radius-sm</span>
              <span class="variable-value">{{ themeStore.sizes.radiusSm }}</span>
              <div
                class="variable-demo radius-demo"
                :style="{ borderRadius: themeStore.sizes.radiusSm }"
              >
                圆角SM
              </div>
            </div>
            <div class="variable-item">
              <span class="variable-name">--radius-md</span>
              <span class="variable-value">{{ themeStore.sizes.radiusMd }}</span>
              <div
                class="variable-demo radius-demo"
                :style="{ borderRadius: themeStore.sizes.radiusMd }"
              >
                圆角MD
              </div>
            </div>
            <div class="variable-item">
              <span class="variable-name">--radius-lg</span>
              <span class="variable-value">{{ themeStore.sizes.radiusLg }}</span>
              <div
                class="variable-demo radius-demo"
                :style="{ borderRadius: themeStore.sizes.radiusLg }"
              >
                圆角LG
              </div>
            </div>
            <div class="variable-item">
              <span class="variable-name">--radius-xl</span>
              <span class="variable-value">{{ themeStore.sizes.radiusXl }}</span>
              <div
                class="variable-demo radius-demo"
                :style="{ borderRadius: themeStore.sizes.radiusXl }"
              >
                圆角XL
              </div>
            </div>
            <div class="variable-item">
              <span class="variable-name">--radius-round</span>
              <span class="variable-value">{{ themeStore.sizes.radiusRound }}</span>
              <div
                class="variable-demo radius-demo"
                :style="{
                  borderRadius: themeStore.sizes.radiusRound,
                  width: '50px',
                  height: '50px',
                }"
              >
                圆
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 动态修改演示 -->
      <div class="demo-card">
        <h3>⚡ 动态修改演示</h3>
        <div class="dynamic-controls">
          <div class="control-group">
            <label>主题色:</label>
            <input
              type="color"
              :value="themeStore.colors.primary.color"
              @input="updatePrimaryColor"
            />
            <span class="color-value">{{ themeStore.colors.primary.color }}</span>
            <button
              @click="updatePrimaryHover"
              class="update-btn"
            >
              更新悬停色
            </button>
          </div>

          <div class="control-group">
            <label>成功色:</label>
            <input
              type="color"
              :value="themeStore.colors.success.color"
              @input="updateSuccessColor"
            />
            <span class="color-value">{{ themeStore.colors.success.color }}</span>
          </div>

          <div class="control-group">
            <label>基础间距:</label>
            <input
              type="range"
              min="8"
              max="32"
              step="2"
              :value="parseInt(themeStore.sizes.gapMd)"
              @input="updateSpacing"
            />
            <span class="size-value">{{ themeStore.sizes.gapMd }}</span>
          </div>

          <div class="control-group">
            <label>基础圆角:</label>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              :value="parseInt(themeStore.sizes.radiusMd)"
              @input="updateRadius"
            />
            <span class="size-value">{{ themeStore.sizes.radiusMd }}</span>
          </div>

          <button
            @click="themeStore.resetToDefault()"
            class="reset-button"
          >
            🔄 重置为默认
          </button>
        </div>
      </div>

      <!-- 组件演示 -->
      <div class="demo-card">
        <h3>🧩 组件应用演示</h3>
        <div class="component-demo">
          <button class="demo-button primary">主要按钮</button>
          <button class="demo-button success">成功按钮</button>
          <button class="demo-button warning">警告按钮</button>
          <button class="demo-button error">错误按钮</button>

          <div class="demo-input-group">
            <input
              type="text"
              placeholder="输入框演示"
              class="demo-input"
            />
            <button class="demo-button primary">提交</button>
          </div>

          <div class="demo-card-small">
            <h4>卡片标题</h4>
            <p>这是一个使用主题变量的卡片示例，会根据主题模式自动调整颜色。</p>
          </div>
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="demo-card">
        <h3>📖 使用说明</h3>
        <div class="usage-guide">
          <div class="code-example">
            <h4>JavaScript 中动态设置:</h4>
            <pre><code>// 设置单个变量
themeStore.setCSSVariable('theme-primary-color', '#ff6b6b')

// 批量设置变量
themeStore.setCSSVariables({
  'theme-primary-color': '#ff6b6b',
  'theme-success-color': '#51cf66'
})

// 更新功能色
themeStore.updateFunctionalColor('primary', {
  color: '#ff6b6b',
  hover: '#ff5252'
})

// 更新主题颜色
themeStore.updateColors({
  themeColor: '#ff6b6b',
  textColor: '#333333'
})

// 切换主题模式
themeStore.toggleTheme()</code></pre>
          </div>

          <div class="code-example">
            <h4>CSS 中使用变量:</h4>
            <pre><code>.my-component {
  color: var(--text-color);
  background-color: var(--background-color);
  border: 1px solid var(--theme-primary-color);
  border-radius: var(--radius-base);
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
}

.my-button {
  background-color: var(--theme-primary-color);
  color: var(--theme-text-color);
}

.my-button:hover {
  background-color: var(--theme-primary-hover);
}</code></pre>
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <p>
        <router-link to="/test">返回测试页面</router-link> |
        <router-link to="/dashboard">返回仪表盘</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sizePresets, useThemeStore } from '@/stores/modules/theme'

const themeStore = useThemeStore()

// 动态修改颜色
const updatePrimaryColor = (event: Event) => {
  const target = event.target as HTMLInputElement
  themeStore.updateFunctionalColor('primary', { color: target.value })
}

const updatePrimaryHover = () => {
  const hoverColor = '#40a9ff' // 示例悬停色
  themeStore.updateFunctionalColor('primary', { hover: hoverColor })
}

const updateSuccessColor = (event: Event) => {
  const target = event.target as HTMLInputElement
  themeStore.updateFunctionalColor('success', { color: target.value })
}

// 动态修改尺寸
const updateSpacing = (event: Event) => {
  const target = event.target as HTMLInputElement
  themeStore.updateSizes({ gapMd: `${target.value}px` })
}

const updateRadius = (event: Event) => {
  const target = event.target as HTMLInputElement
  themeStore.updateSizes({ radiusMd: `${target.value}px` })
}
</script>

<style scoped>
.theme-test-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg, 24px);
  background: var(--background-color, #ffffff);
  color: var(--text-color, #000000d9);
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xxl, 48px);
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md, 16px);
  color: var(--theme-color, #1890ff);
}

.page-header p {
  font-size: 1.1rem;
  color: var(--text-muted-color, #00000073);
}

.demo-grid {
  display: grid;
  gap: var(--spacing-lg, 24px);
  margin-bottom: var(--spacing-xl, 32px);
}

.demo-card {
  background: var(--background-highlight-color, #fafafa);
  border: 1px solid #e6e6e6;
  border-radius: var(--radius-lg, 8px);
  padding: var(--spacing-lg, 24px);
  transition: all 0.3s ease;
}

.demo-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.demo-card h3 {
  margin: 0 0 var(--spacing-md, 16px) 0;
  color: var(--text-color, #000000d9);
  font-size: 1.2rem;
}

.demo-card h4 {
  margin: var(--spacing-md, 16px) 0 var(--spacing-sm, 8px) 0;
  color: var(--text-muted-color, #00000073);
  font-size: 1rem;
}

/* 主题控制按钮 */
.theme-controls {
  display: flex;
  gap: var(--spacing-sm, 8px);
  flex-wrap: wrap;
}

.theme-button {
  padding: var(--spacing-sm, 8px) var(--spacing-md, 16px);
  border: 1px solid #d9d9d9;
  border-radius: var(--radius-base, 6px);
  background: var(--background-color, #ffffff);
  color: var(--text-color, #000000d9);
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-button:hover {
  background: var(--background-highlight-color, #f5f5f5);
}

.theme-button.active {
  background: var(--theme-primary-color, #1890ff);
  color: var(--theme-text-color, white);
  border-color: var(--theme-primary-color, #1890ff);
}

.theme-button.toggle {
  background: var(--theme-success-color, #52c41a);
  color: var(--theme-text-color, white);
  border-color: var(--theme-success-color, #52c41a);
}

/* 颜色演示 */
.color-variables {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg, 24px);
}

.color-section {
  margin-bottom: var(--spacing-md, 16px);
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-sm, 8px);
}

.color-item {
  padding: var(--spacing-md, 16px);
  border-radius: var(--radius-base, 6px);
  color: white;
  text-align: center;
  font-size: var(--font-size-sm, 12px);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs, 4px);
}

.color-item span {
  font-weight: 500;
}

.color-item code {
  font-size: 10px;
  opacity: 0.8;
}

.text-colors {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm, 8px);
}

.text-item {
  padding: var(--spacing-sm, 8px);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm, 8px);
}

.text-item code {
  font-size: var(--font-size-xs, 10px);
  color: var(--text-muted-color, #00000073);
}

/* 尺寸演示 */
.variable-group {
  display: flex;
  flex-direction: column;
  gap: var(--gap-lg, 24px);
}

.variable-category {
  margin-bottom: var(--gap-md, 16px);
}

.variables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--gap-sm, 8px);
}

.variable-item {
  padding: var(--gap-md, 16px);
  border-radius: var(--radius-md, 6px);
  color: white;
  text-align: center;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs, 4px);
}

.variable-item span {
  font-weight: 500;
}

.variable-item code {
  font-size: 10px;
  opacity: 0.8;
}

.variable-demo {
  background: var(--theme-primary-light, #e6f7ff);
  border: 1px solid var(--theme-primary, #1890ff);
  border-radius: var(--radius-sm, 4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs, 4px);
  min-width: 80px;
}

.layout-demo {
  background: var(--theme-success-light, #f6ffed);
  border: 1px solid var(--theme-success, #52c41a);
}

.spacing-demo {
  display: flex;
  gap: var(--gap-sm, 8px);
  flex-wrap: wrap;
}

.spacing-item {
  background: var(--theme-primary-light, #e6f7ff);
  border: 1px solid var(--theme-primary, #1890ff);
  border-radius: var(--radius-sm, 4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-xs, 4px);
  min-width: 80px;
}

.radius-demo {
  display: flex;
  gap: var(--spacing-sm, 8px);
  flex-wrap: wrap;
}

.radius-item {
  padding: var(--spacing-md, 16px);
  background: var(--theme-success-light, #f6ffed);
  border: 1px solid var(--theme-success, #52c41a);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs, 4px);
  min-width: 80px;
}

.radius-item span {
  font-weight: 500;
  color: var(--theme-success, #52c41a);
}

.radius-item code {
  font-size: 10px;
  color: var(--theme-text-secondary, #00000073);
}

/* 动态控制 */
.dynamic-controls {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 16px);
}

.control-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm, 8px);
}

.control-group label {
  min-width: 80px;
  font-weight: 500;
  color: var(--theme-text-primary, #000000d9);
}

.control-group input[type='color'] {
  width: 50px;
  height: 30px;
  border: none;
  border-radius: var(--radius-sm, 4px);
  cursor: pointer;
}

.control-group input[type='range'] {
  flex: 1;
  max-width: 200px;
}

.color-value,
.size-value {
  font-family: monospace;
  font-size: var(--font-size-sm, 12px);
  color: var(--theme-text-secondary, #00000073);
  min-width: 80px;
}

.reset-button {
  padding: var(--spacing-sm, 8px) var(--spacing-md, 16px);
  background: var(--theme-warning, #faad14);
  color: white;
  border: none;
  border-radius: var(--radius-base, 6px);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.reset-button:hover {
  background: var(--theme-warning-hover, #ffc53d);
}

/* 组件演示 */
.component-demo {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 16px);
}

.demo-button {
  padding: var(--spacing-sm, 8px) var(--spacing-md, 16px);
  border: none;
  border-radius: var(--radius-base, 6px);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-right: var(--spacing-sm, 8px);
  margin-bottom: var(--spacing-sm, 8px);
}

.demo-button.primary {
  background: var(--theme-primary, #1890ff);
  color: white;
}

.demo-button.primary:hover {
  background: var(--theme-primary-hover, #40a9ff);
}

.demo-button.success {
  background: var(--theme-success, #52c41a);
  color: white;
}

.demo-button.success:hover {
  background: var(--theme-success-hover, #73d13d);
}

.demo-button.warning {
  background: var(--theme-warning, #faad14);
  color: white;
}

.demo-button.warning:hover {
  background: var(--theme-warning-hover, #ffc53d);
}

.demo-button.error {
  background: var(--theme-error, #f5222d);
  color: white;
}

.demo-button.error:hover {
  background: var(--theme-error-hover, #ff4d4f);
}

.demo-input-group {
  display: flex;
  gap: var(--spacing-sm, 8px);
  align-items: center;
}

.demo-input {
  padding: var(--spacing-sm, 8px) var(--spacing-md, 16px);
  border: 1px solid var(--theme-border-base, #d9d9d9);
  border-radius: var(--radius-base, 6px);
  background: var(--theme-bg-base, #ffffff);
  color: var(--theme-text-primary, #000000d9);
  font-size: var(--font-size-base, 14px);
  flex: 1;
  max-width: 200px;
}

.demo-input:focus {
  outline: none;
  border-color: var(--theme-primary, #1890ff);
}

.demo-card-small {
  padding: var(--spacing-md, 16px);
  background: var(--theme-bg-base, #ffffff);
  border: 1px solid var(--theme-border-base, #d9d9d9);
  border-radius: var(--radius-base, 6px);
  margin-top: var(--spacing-md, 16px);
}

.demo-card-small h4 {
  margin: 0 0 var(--spacing-sm, 8px) 0;
  color: var(--theme-text-primary, #000000d9);
}

.demo-card-small p {
  margin: 0;
  color: var(--theme-text-secondary, #00000073);
  line-height: var(--line-height-base, 1.5);
}

/* 使用说明 */
.usage-guide {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg, 24px);
}

.code-example {
  background: var(--theme-bg-base, #ffffff);
  border: 1px solid var(--theme-border-split, #f0f0f0);
  border-radius: var(--radius-base, 6px);
  padding: var(--spacing-md, 16px);
}

.code-example h4 {
  margin: 0 0 var(--spacing-sm, 8px) 0;
  color: var(--theme-text-primary, #000000d9);
}

.code-example pre {
  margin: 0;
  padding: var(--spacing-sm, 8px);
  background: var(--theme-bg-light, #fafafa);
  border-radius: var(--radius-sm, 4px);
  overflow-x: auto;
}

.code-example code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: var(--font-size-sm, 12px);
  color: var(--theme-text-primary, #000000d9);
  line-height: var(--line-height-base, 1.5);
}

.page-footer {
  text-align: center;
  padding-top: var(--spacing-lg, 24px);
  border-top: 1px solid var(--theme-border-split, #f0f0f0);
  color: var(--theme-text-secondary, #00000073);
}

.page-footer a {
  color: var(--theme-primary, #1890ff);
  text-decoration: none;
}

.page-footer a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .theme-test-page {
    padding: var(--spacing-md, 16px);
  }

  .demo-grid {
    gap: var(--spacing-md, 16px);
  }

  .color-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .control-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .control-group label {
    min-width: auto;
  }

  .demo-input-group {
    flex-direction: column;
  }

  .demo-input {
    max-width: none;
  }
}

/* 尺寸选项控制 */
.current-size-info {
  background: var(--background-highlight-color, #f5f5f5);
  padding: var(--gap-lg, 24px);
  border-radius: var(--radius-lg, 8px);
  margin-bottom: var(--gap-lg, 24px);
}

.size-option-display {
  display: flex;
  align-items: center;
  gap: var(--gap-md, 16px);
  margin-bottom: var(--gap-md, 16px);
}

.current-option {
  font-family: 'Courier New', monospace;
  background: var(--theme-primary-light, #e6f7ff);
  color: var(--theme-primary-color, #1890ff);
  padding: var(--gap-xs, 4px) var(--gap-sm, 8px);
  border-radius: var(--radius-sm, 4px);
  font-weight: bold;
}

.current-option-label {
  background: var(--theme-success-light, #f6ffed);
  color: var(--theme-success-color, #52c41a);
  padding: var(--gap-xs, 4px) var(--gap-sm, 8px);
  border-radius: var(--radius-sm, 4px);
  font-size: 0.9em;
}

.size-option-controls {
  display: flex;
  gap: var(--gap-sm, 8px);
  flex-wrap: wrap;
}

.size-option-btn {
  padding: var(--gap-sm, 8px) var(--gap-md, 16px);
  border: 1px solid var(--theme-primary-color, #1890ff);
  border-radius: var(--radius-md, 6px);
  background: var(--background-color, #ffffff);
  color: var(--theme-primary-color, #1890ff);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
}

.size-option-btn:hover {
  background: var(--theme-primary-light, #e6f7ff);
}

.size-option-btn.active {
  background: var(--theme-primary-color, #1890ff);
  color: var(--theme-text-color, #ffffff);
}

/* 动态控制 */
</style>
