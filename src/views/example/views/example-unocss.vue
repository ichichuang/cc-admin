<script setup lang="ts">
import { ref } from 'vue'

// 响应式数据
const isDark = ref(false)
const showAdvanced = ref(false)

// 切换深色模式
const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

// 功能色系数据
const functionalColors = [
  { name: 'Primary', value: 'primary', desc: '主要色彩' },
  { name: 'Success', value: 'success', desc: '成功色彩' },
  { name: 'Info', value: 'info', desc: '信息色彩' },
  { name: 'Warning', value: 'warning', desc: '警告色彩' },
  { name: 'Error', value: 'error', desc: '错误色彩' },
]

// 布局快捷方式数据
const layoutShortcuts = [
  { class: 'center', desc: 'flex items-center justify-center' },
  { class: 'between', desc: 'flex items-center justify-between' },
  { class: 'around', desc: 'flex items-center justify-around' },
  { class: 'start', desc: 'flex items-center justify-start' },
  { class: 'end', desc: 'flex items-center justify-end' },
  { class: 'center-col', desc: 'flex flex-col items-center justify-center' },
  { class: 'grid-center', desc: 'grid place-items-center' },
]

// 文本快捷方式数据
const textShortcuts = [
  { class: 'text-title', desc: '标题文本样式' },
  { class: 'text-subtitle', desc: '副标题文本样式' },
  { class: 'text-body', desc: '正文文本样式' },
  { class: 'text-caption', desc: '说明文本样式' },
  { class: 'text-ellipsis', desc: '单行文本省略' },
  { class: 'text-clamp-2', desc: '两行文本省略' },
  { class: 'text-clamp-3', desc: '三行文本省略' },
]

// 示例文本
const longText =
  '这是一段很长的文本，用于演示文本省略的效果。UnoCSS 提供了非常便捷的文本省略功能，可以轻松实现单行和多行文本的省略显示。'
</script>

<template>
  <div class="container p-6 space-y-8">
    <!-- 页面标题 -->
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-bold text-textColor">UnoCSS 配置展示</h1>
      <p class="text-caption">展示项目中 UnoCSS 的配置和使用方法</p>
    </div>

    <!-- 控制面板 -->
    <div class="card-shadow p-4 space-y-4">
      <h2 class="text-subtitle">控制面板</h2>
      <div class="flex flex-wrap gap-4">
        <button
          class="btn-primary"
          @click="toggleDark"
        >
          {{ isDark ? '切换到亮色模式' : '切换到深色模式' }}
        </button>
        <button
          class="btn-secondary"
          @click="showAdvanced = !showAdvanced"
        >
          {{ showAdvanced ? '隐藏高级功能' : '显示高级功能' }}
        </button>
      </div>
    </div>

    <!-- 主题色彩系统 -->
    <div class="card-shadow p-6 space-y-6">
      <h2 class="text-subtitle">主题色彩系统</h2>

      <!-- 功能色系 -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-textColor">功能色系</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div
            v-for="color in functionalColors"
            :key="color.value"
            class="space-y-2"
          >
            <div class="text-sm font-medium text-textColor">
              {{ color.name }}
            </div>
            <div class="space-y-1">
              <div
                :class="`w-full h-10 rounded bg-${color.value}-DEFAULT`"
                class="border border-textColor"
              />
              <div class="text-xs text-textMutedColor">
                {{ color.desc }}
              </div>
            </div>
            <!-- 色彩变体 -->
            <div class="flex gap-1">
              <div
                :class="`w-4 h-4 rounded-sm bg-${color.value}-light`"
                class="border border-textColor"
                :title="`${color.name} Light`"
              />
              <div
                :class="`w-4 h-4 rounded-sm bg-${color.value}-DEFAULT`"
                class="border border-textColor"
                :title="`${color.name} Default`"
              />
              <div
                :class="`w-4 h-4 rounded-sm bg-${color.value}-hover`"
                class="border border-textColor"
                :title="`${color.name} Hover`"
              />
              <div
                :class="`w-4 h-4 rounded-sm bg-${color.value}-active`"
                class="border border-textColor"
                :title="`${color.name} Active`"
              />
              <div
                :class="`w-4 h-4 rounded-sm bg-${color.value}-disabled`"
                class="border border-textColor"
                :title="`${color.name} Disabled`"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 主题色和文本色 -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-textColor">主题色和文本色</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <div class="text-sm font-medium text-textColor">主题色</div>
            <div class="flex gap-2">
              <div class="w-16 h-10 rounded bg-themeColor border border-textColor" />
              <div class="w-16 h-10 rounded bg-themeColors border border-textColor" />
            </div>
            <div class="text-xs text-textMutedColor">var(--theme-color) / var(--theme-colors)</div>
          </div>
          <div class="space-y-2">
            <div class="text-sm font-medium text-textColor">文本色</div>
            <div class="flex gap-2">
              <div class="w-16 h-10 rounded bg-textColor border border-textColor" />
              <div class="w-16 h-10 rounded bg-textMutedColor border border-textColor" />
            </div>
            <div class="text-xs text-textMutedColor">
              var(--text-color) / var(--text-muted-color)
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 布局系统 -->
    <div class="card-shadow p-6 space-y-6">
      <h2 class="text-subtitle">布局系统</h2>

      <!-- 布局快捷方式 -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-textColor">布局快捷方式</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="layout in layoutShortcuts"
            :key="layout.class"
            class="space-y-2"
          >
            <div class="text-sm font-medium text-textColor">.{{ layout.class }}</div>
            <div
              :class="layout.class"
              class="w-full h-16 bg-backgroundHighlightColor border border-textColor rounded"
            >
              <div class="w-6 h-6 bg-primary-DEFAULT rounded" />
            </div>
            <div class="text-xs text-textMutedColor">
              {{ layout.desc }}
            </div>
          </div>
        </div>
      </div>

      <!-- 尺寸系统 -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-textColor">尺寸系统（CSS 变量）</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="space-y-2">
            <div class="text-sm font-medium text-textColor">侧边栏宽度</div>
            <div class="w-sidebarWidth h-8 bg-primary-DEFAULT rounded" />
            <div class="text-xs text-textMutedColor">var(--sidebar-width)</div>
          </div>
          <div class="space-y-2">
            <div class="text-sm font-medium text-textColor">头部高度</div>
            <div class="w-32 h-headerHeight bg-success-DEFAULT rounded" />
            <div class="text-xs text-textMutedColor">var(--header-height)</div>
          </div>
          <div class="space-y-2">
            <div class="text-sm font-medium text-textColor">间距尺寸</div>
            <div class="w-16 h-8 bg-info-DEFAULT rounded" />
            <div class="text-xs text-textMutedColor">var(--gap)</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 按钮系统 -->
    <div class="card-shadow p-6 space-y-6">
      <h2 class="text-subtitle">按钮系统</h2>

      <div class="space-y-4">
        <h3 class="text-lg font-medium text-textColor">按钮快捷方式</h3>
        <div class="flex flex-wrap gap-4">
          <button class="btn-primary">Primary Button</button>
          <button class="btn-secondary">Secondary Button</button>
          <button class="btn-success">Success Button</button>
          <button class="btn-warning">Warning Button</button>
          <button class="btn-error">Error Button</button>
        </div>
        <div class="text-xs text-textMutedColor">使用 .btn-primary、.btn-secondary 等快捷方式</div>
      </div>
    </div>

    <!-- 文本系统 -->
    <div class="card-shadow p-6 space-y-6">
      <h2 class="text-subtitle">文本系统</h2>

      <!-- 文本样式 -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-textColor">文本样式快捷方式</h3>
        <div class="space-y-3">
          <div
            v-for="text in textShortcuts"
            :key="text.class"
            class="flex items-center gap-4"
          >
            <div class="w-32 text-sm font-medium text-textColor">.{{ text.class }}</div>
            <div :class="text.class">
              {{ text.desc }}
            </div>
          </div>
        </div>
      </div>

      <!-- 文本省略演示 -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-textColor">文本省略演示</h3>
        <div class="space-y-3">
          <div class="space-y-2">
            <div class="text-sm font-medium text-textColor">单行省略 (.text-ellipsis)</div>
            <div class="w-64 text-ellipsis bg-backgroundHighlightColor p-2 rounded">
              {{ longText }}
            </div>
          </div>
          <div class="space-y-2">
            <div class="text-sm font-medium text-textColor">两行省略 (.text-clamp-2)</div>
            <div class="w-64 text-clamp-2 bg-backgroundHighlightColor p-2 rounded">
              {{ longText }}
            </div>
          </div>
          <div class="space-y-2">
            <div class="text-sm font-medium text-textColor">三行省略 (.text-clamp-3)</div>
            <div class="w-64 text-clamp-3 bg-backgroundHighlightColor p-2 rounded">
              {{ longText }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 卡片系统 -->
    <div class="card-shadow p-6 space-y-6">
      <h2 class="text-subtitle">卡片系统</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card">
          <div class="text-sm font-medium text-textColor mb-2">基础卡片 (.card)</div>
          <div class="text-xs text-textMutedColor">基本的卡片样式</div>
        </div>
        <div class="card-hover">
          <div class="text-sm font-medium text-textColor mb-2">悬停卡片 (.card-hover)</div>
          <div class="text-xs text-textMutedColor">悬停时背景色变化</div>
        </div>
        <div class="card-shadow">
          <div class="text-sm font-medium text-textColor mb-2">阴影卡片 (.card-shadow)</div>
          <div class="text-xs text-textMutedColor">带阴影效果和悬停动画</div>
        </div>
      </div>
    </div>

    <!-- 高级功能 -->
    <div
      v-if="showAdvanced"
      class="card-shadow p-6 space-y-6"
    >
      <h2 class="text-subtitle">高级功能</h2>

      <!-- 像素值规则 -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-textColor">像素值规则</h3>
        <div class="space-y-3">
          <div class="text-sm text-textMutedColor">支持直接使用像素值，如 w-100、h-50、p-20 等</div>
          <div class="flex gap-4">
            <div class="w-100 h-50 bg-primary-DEFAULT rounded" />
            <div class="w-80 h-60 bg-success-DEFAULT rounded" />
            <div class="w-120 h-40 bg-info-DEFAULT rounded" />
          </div>
          <div class="text-xs text-textMutedColor">.w-100 .h-50 | .w-80 .h-60 | .w-120 .h-40</div>
        </div>
      </div>

      <!-- 自定义变体 -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-textColor">自定义变体</h3>
        <div class="space-y-3">
          <div class="text-sm text-textMutedColor">支持 hover:、focus:、active:、dark: 等变体</div>
          <div class="flex gap-4">
            <button class="btn bg-primary-DEFAULT text-white hover:bg-primary-hover">
              悬停变色
            </button>
            <button class="btn bg-success-DEFAULT text-white focus:bg-success-active">
              焦点变色
            </button>
            <button class="btn bg-info-DEFAULT text-white active:bg-info-active">激活变色</button>
          </div>
        </div>
      </div>

      <!-- 渐变效果 -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-textColor">渐变效果</h3>
        <div class="space-y-3">
          <div class="text-sm text-textMutedColor">主题渐变背景</div>
          <div class="w-full h-16 bg-gradient-theme rounded center text-white font-medium">
            主题渐变背景 (.bg-gradient-theme)
          </div>
        </div>
      </div>

      <!-- 安全区域 -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-textColor">安全区域适配</h3>
        <div class="space-y-3">
          <div class="text-sm text-textMutedColor">
            移动端安全区域适配：safe-top、safe-bottom、safe-left、safe-right
          </div>
          <div class="bg-backgroundHighlightColor rounded p-4">
            <div class="safe-top safe-bottom safe-x bg-primary-DEFAULT text-white p-4 rounded">
              安全区域内容
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用说明 -->
    <div class="card-shadow p-6 space-y-6">
      <h2 class="text-subtitle">使用说明</h2>

      <div class="space-y-4">
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-textColor">快捷方式</h3>
          <div class="text-sm text-textMutedColor space-y-1">
            <div>• 使用 .center、.between 等快捷方式进行布局</div>
            <div>• 使用 .btn-primary、.btn-secondary 等快捷方式创建按钮</div>
            <div>• 使用 .text-title、.text-subtitle 等快捷方式设置文本样式</div>
            <div>• 使用 .card、.card-hover 等快捷方式创建卡片</div>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-lg font-medium text-textColor">主题变量</h3>
          <div class="text-sm text-textMutedColor space-y-1">
            <div>• 使用 var(--theme-color) 获取主题色</div>
            <div>• 使用 var(--text-color) 获取文本色</div>
            <div>• 使用 var(--sidebar-width) 获取侧边栏宽度</div>
            <div>• 使用 var(--gap) 获取间距尺寸</div>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-lg font-medium text-textColor">像素值规则</h3>
          <div class="text-sm text-textMutedColor space-y-1">
            <div>• 支持 w-100、h-50 等像素值</div>
            <div>• 支持 p-20、m-10 等间距像素值</div>
            <div>• 支持 rounded-8、border-2 等边框像素值</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 演示样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 自定义动画 */
.card-shadow {
  transition: all 0.3s ease;
}

.card-shadow:hover {
  transform: translateY(-2px);
}

/* 代码展示样式 */
.code-block {
  background: var(--background-highlight-color);
  border: 1px solid var(--text-color);
  border-radius: var(--rounded);
  padding: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  overflow-x: auto;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
