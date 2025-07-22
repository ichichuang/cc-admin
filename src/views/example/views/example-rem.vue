<template>
  <div class="example-rem">
    <div class="header">
      <h2 class="title">rem 响应式适配示例</h2>
      <p class="description">展示基于 rem + postcss-pxtorem + UnoCSS 的响应式适配方案</p>
    </div>

    <!-- 适配信息面板 -->
    <div class="info-panel">
      <div class="info-card">
        <h3>当前设备信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">设备类型:</span>
            <span class="value">{{ layoutStore.getIsPC ? 'PC' : 'Mobile' }}</span>
          </div>
          <div class="info-item">
            <span class="label">屏幕宽度:</span>
            <span class="value">{{ layoutStore.getWidth }}px</span>
          </div>
          <div class="info-item">
            <span class="label">屏幕高度:</span>
            <span class="value">{{ layoutStore.getHeight }}px</span>
          </div>
          <div class="info-item">
            <span class="label">设备方向:</span>
            <span class="value">{{ layoutStore.getDeviceOrientation }}</span>
          </div>
        </div>
      </div>

      <div class="info-card">
        <h3>rem 适配信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">当前断点:</span>
            <span class="value">{{ currentBreakpointText }}</span>
          </div>
          <div class="info-item">
            <span class="label">根字体大小:</span>
            <span class="value">{{ (postcssStore.getCurrentRemBase || 16).toFixed(2) }}px</span>
          </div>
          <div class="info-item">
            <span class="label">1rem 等于:</span>
            <span class="value">{{ (postcssStore.getCurrentRemBase || 16).toFixed(2) }}px</span>
          </div>
          <div class="info-item">
            <span class="label">CSS 变量:</span>
            <span class="value">var(--root-font-size)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 实时状态监控 -->
    <div class="status-panel">
      <h3>🔄 实时状态监控</h3>
      <div class="status-grid">
        <div class="status-item">
          <span class="label">适配器状态:</span>
          <span
            class="value"
            :class="{
              'status-ok': postcssStore.getRemAdapterAvailable,
              'status-error': !postcssStore.getRemAdapterAvailable,
            }"
          >
            {{ postcssStore.getRemAdapterAvailable ? '已激活' : '未激活' }}
          </span>
        </div>
        <div class="status-item">
          <span class="label">当前时间戳:</span>
          <span class="value">{{ Date.now() }}</span>
        </div>
        <div class="status-item">
          <span class="label">窗口尺寸:</span>
          <span class="value">{{ layoutStore.getWidth }} × {{ layoutStore.getHeight }}</span>
        </div>
        <div class="status-item">
          <span class="label">设备像素比:</span>
          <span class="value">{{ devicePixelRatio }}</span>
        </div>
      </div>
      <div class="status-log">
        <h4>📋 更新日志:</h4>
        <div
          class="log-content"
          ref="logRef"
        >
          <div class="log-item">系统已就绪，等待窗口变化...</div>
        </div>
      </div>
    </div>

    <!-- 响应式测试组件 -->
    <div class="test-section">
      <h3>响应式测试</h3>
      <div class="test-grid">
        <!-- 基于像素的组件（会被 postcss-pxtorem 转换） -->
        <div class="test-card pixel-based">
          <h4>像素 → rem 自动转换</h4>
          <p>使用原始像素值，由 postcss-pxtorem 自动转换为 rem</p>
          <div class="pixel-elements">
            <div class="element-16">16px → rem</div>
            <div class="element-24">24px → rem</div>
            <div class="element-32">32px → rem</div>
          </div>
        </div>

        <!-- 基于 UnoCSS 的组件 -->
        <div class="test-card">
          <h4>UnoCSS 响应式工具类</h4>
          <p>使用 UnoCSS 提供的响应式工具类</p>
          <div class="uno-elements">
            <div class="w-16 h-16 bg-primaryColor rounded mb-4">w-16 h-16</div>
            <div class="p-gap bg-bg200 rounded">使用主题变量 p-gap</div>
            <div class="text-lg font-bold text-primaryColor mt-4">text-lg</div>
          </div>
        </div>

        <!-- 手动计算的 rem 值 -->
        <div class="test-card">
          <h4>手动 rem 计算</h4>
          <p>使用 pxToRem 方法手动转换</p>
          <div class="manual-elements">
            <div :style="{ fontSize: pxToRemValue(20) }">20px = {{ pxToRemValue(20) }}</div>
            <div :style="{ padding: pxToRemValue(16) }">padding: {{ pxToRemValue(16) }}</div>
            <div :style="{ margin: pxToRemValue(12) + ' 0' }">margin: {{ pxToRemValue(12) }} 0</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 断点测试 -->
    <div class="breakpoint-section">
      <h3>断点响应测试</h3>
      <div class="breakpoint-indicator">
        <div
          class="indicator xs"
          :class="{ active: currentBreakpointText === 'xs' }"
        >
          XS (≤375px)
        </div>
        <div
          class="indicator sm"
          :class="{ active: currentBreakpointText === 'sm' }"
        >
          SM (≤768px)
        </div>
        <div
          class="indicator md"
          :class="{ active: currentBreakpointText === 'md' }"
        >
          MD (≤1024px)
        </div>
        <div
          class="indicator lg"
          :class="{ active: currentBreakpointText === 'lg' }"
        >
          LG (≤1400px)
        </div>
        <div
          class="indicator xl"
          :class="{ active: currentBreakpointText === 'xl' }"
        >
          XL (≤1660px)
        </div>
        <div
          class="indicator xls"
          :class="{ active: currentBreakpointText === 'xls' }"
        >
          XLS (≤1920px)
        </div>
        <div
          class="indicator xxl"
          :class="{ active: currentBreakpointText === 'xxl' }"
        >
          XXL (>1920px)
        </div>
      </div>
    </div>

    <!-- 配置调试面板 -->
    <div class="debug-section">
      <h3>配置调试</h3>
      <div class="config-panel">
        <div class="config-item">
          <label>设计稿宽度:</label>
          <input
            v-model.number="tempConfig.designWidth"
            type="number"
            min="320"
            max="3840"
            @change="updateConfig"
          />
        </div>
        <div class="config-item">
          <label>基准字体大小:</label>
          <input
            v-model.number="tempConfig.baseFontSize"
            type="number"
            min="10"
            max="30"
            @change="updateConfig"
          />
        </div>
        <div class="config-item">
          <label>最小字体:</label>
          <input
            v-model.number="tempConfig.minFontSize"
            type="number"
            min="8"
            max="20"
            @change="updateConfig"
          />
        </div>
        <div class="config-item">
          <label>最大字体:</label>
          <input
            v-model.number="tempConfig.maxFontSize"
            type="number"
            min="16"
            max="40"
            @change="updateConfig"
          />
        </div>
        <div class="config-item">
          <label>移动端优先:</label>
          <input
            v-model="tempConfig.mobileFirst"
            type="checkbox"
            @change="updateConfig"
          />
        </div>
        <button
          @click="resetConfig"
          class="btn-primary"
        >
          重置配置
        </button>
        <button
          @click="testDynamicUpdate"
          class="btn btn-outline-primary"
        >
          测试动态更新
        </button>
      </div>
    </div>

    <!-- 实时预览工具 -->
    <div class="preview-section">
      <h3>实时预览</h3>
      <div class="preview-box">
        <div
          class="preview-content"
          ref="previewRef"
        >
          <div class="preview-title">这是一个响应式容器</div>
          <div class="preview-text">
            当你调整浏览器窗口大小时，这个容器的字体大小和间距会自动调整
          </div>
          <div class="preview-buttons">
            <button class="btn-outline-primary">按钮 1</button>
            <button class="btn-outline-success">按钮 2</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/stores/modules/layout'
import { usePostcssStore } from '@/stores/modules/postcss'
import type { RemAdapterConfig } from '@/utils/remAdapter'
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'

// 获取 stores
const layoutStore = useLayoutStore()
const postcssStore = usePostcssStore()

// 当前断点
const currentBreakpointText = ref<string>('md')

// 异步获取当前断点
const updateCurrentBreakpoint = async () => {
  try {
    currentBreakpointText.value = await postcssStore.getCurrentBreakpointAsync()
  } catch (error) {
    console.warn('Failed to get current breakpoint:', error)
    currentBreakpointText.value = 'md' // 默认值
  }
}

// 临时配置
const tempConfig = reactive<RemAdapterConfig>({
  ...postcssStore.getRemConfig,
})

// 预览容器引用
const previewRef = ref<HTMLElement>()

// 日志引用
const logRef = ref<HTMLElement>()

// 设备像素比
const devicePixelRatio = ref<number>(
  typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
)

// 更新日志
const addLog = (message: string) => {
  const timestamp = new Date().toLocaleTimeString()
  const logMessage = `[${timestamp}] ${message}`
  console.log(logMessage)

  if (logRef.value) {
    const logItem = document.createElement('div')
    logItem.className = 'log-item'
    logItem.textContent = logMessage
    logRef.value.appendChild(logItem)
    // 保持最新的日志在底部
    logRef.value.scrollTop = logRef.value.scrollHeight

    // 限制日志条数，避免过多占用内存
    const logItems = logRef.value.querySelectorAll('.log-item')
    if (logItems.length > 10) {
      logItems[0].remove()
    }
  }
}

// px 转 rem 辅助方法
const pxToRemValue = (px: number): string => {
  try {
    return postcssStore.pxToRem(px)
  } catch (error) {
    console.warn('pxToRem error:', error)
    return `${px / 16}rem` // 降级处理
  }
}

// 更新配置
const updateConfig = () => {
  postcssStore.updateRemConfig(tempConfig)
}

// 重置配置
const resetConfig = () => {
  const defaultConfig: RemAdapterConfig = {
    designWidth: 1920,
    baseFontSize: 16,
    minFontSize: 12,
    maxFontSize: 24,
    mobileFirst: false,
    breakpoints: {
      xs: 375,
      sm: 768,
      md: 1024,
      lg: 1400,
      xl: 1660,
      xls: 1920,
    },
  }

  Object.assign(tempConfig, defaultConfig)
  updateConfig()
}

// 测试动态更新
const testDynamicUpdate = () => {
  // 随机改变基准字体大小来测试动态更新
  const newBaseFontSize = Math.floor(Math.random() * (20 - 12 + 1)) + 12 // 12-20之间的随机值
  tempConfig.baseFontSize = newBaseFontSize
  updateConfig()
  console.log(`🧪 测试动态更新: 基准字体大小改为 ${newBaseFontSize}px`)

  // 强制更新断点信息
  nextTick(() => {
    setTimeout(updateCurrentBreakpoint, 200)
  })
}

// 监听字体大小变化事件
const handleFontSizeChange = (event: CustomEvent) => {
  console.log('字体大小已更改:', event.detail)
  addLog(`字体大小已更改: ${event.detail?.fontSize || 'unknown'}px`)
  // 立即更新断点信息
  nextTick(() => {
    updateCurrentBreakpoint()
  })
}

// 监听窗口大小变化，更新断点显示
const handleResize = () => {
  addLog(`窗口尺寸变化: ${layoutStore.getWidth} × ${layoutStore.getHeight}`)
  updateCurrentBreakpoint()
}

// 监听 postcss store 中 currentRemBase 的变化
watch(
  () => postcssStore.getCurrentRemBase,
  newValue => {
    console.log('rem 基准值已更新:', newValue)
    addLog(`rem 基准值已更新: ${newValue?.toFixed(2) || 16}px`)
  },
  { immediate: true }
)

// 监听 layout store 中设备信息的变化
watch(
  () => [layoutStore.getWidth, layoutStore.getHeight, layoutStore.getDeviceOrientation],
  () => {
    console.log('设备信息已更新')
    addLog(
      `设备信息已更新: ${layoutStore.getWidth} × ${layoutStore.getHeight} (${layoutStore.getDeviceOrientation})`
    )
    // 延迟更新断点，确保 rem 适配器先完成更新
    nextTick(() => {
      setTimeout(updateCurrentBreakpoint, 100)
    })
  },
  { immediate: false }
)

onMounted(async () => {
  try {
    // 初始化 rem 适配器
    await postcssStore.initRemAdapter()
    // 等待一小段时间确保适配器完全初始化
    await new Promise(resolve => setTimeout(resolve, 100))
    // 初始化当前断点
    await updateCurrentBreakpoint()
  } catch (error) {
    console.warn('Failed to initialize rem adapter:', error)
  }

  window.addEventListener('fontSizeChanged', handleFontSizeChange as EventListener)
  // 监听窗口变化更新断点 - 使用防抖
  let resizeTimer: number
  const debouncedResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(handleResize, 200)
  }
  window.addEventListener('resize', debouncedResize)
  window.addEventListener('orientationchange', debouncedResize)

  // 保存清理函数的引用
  ;(window as any).__remCleanupFns = [
    () => window.removeEventListener('fontSizeChanged', handleFontSizeChange as EventListener),
    () => window.removeEventListener('resize', debouncedResize),
    () => window.removeEventListener('orientationchange', debouncedResize),
    () => clearTimeout(resizeTimer),
  ]
})

onUnmounted(() => {
  // 清理所有事件监听器
  if ((window as any).__remCleanupFns) {
    ;(window as any).__remCleanupFns.forEach((fn: () => void) => fn())
    delete (window as any).__remCleanupFns
  }
})
</script>

<style scoped lang="scss">
.example-rem {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 32px;

  .title {
    font-size: 32px;
    font-weight: bold;
    color: var(--text100);
    margin-bottom: 8px;
  }

  .description {
    font-size: 16px;
    color: var(--text200);
  }
}

.info-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.status-panel {
  background: linear-gradient(135deg, var(--bg100) 0%, var(--bg200) 50%, var(--bg100) 100%);
  border: 2px solid var(--primaryColor);
  border-radius: var(--rounded);
  padding: 24px;
  margin-bottom: 32px;

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: var(--primaryColor);
    margin-bottom: 16px;
  }
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.status-item {
  display: flex;
  flex-direction: column;
  background: var(--bg300);
  padding: 8px 12px;
  border-radius: 4px;

  .label {
    font-size: 12px;
    color: var(--text200);
    margin-bottom: 4px;
  }

  .value {
    font-size: 14px;
    font-weight: 500;
    color: var(--text100);

    &.status-ok {
      color: var(--successColor);
    }

    &.status-error {
      color: var(--errorColor);
    }
  }
}

.status-log {
  h4 {
    font-size: 16px;
    color: var(--text100);
    margin-bottom: 8px;
  }
}

.log-content {
  background: var(--bg300);
  border-radius: 4px;
  padding: 12px;
  height: 120px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 12px;

  .log-item {
    color: var(--text200);
    margin-bottom: 4px;
    line-height: 1.4;

    &:last-child {
      margin-bottom: 0;
      color: var(--primaryColor);
      font-weight: 500;
    }
  }
}

.info-card {
  background: var(--bg200);
  border: 1px solid var(--bg300);
  border-radius: var(--rounded);
  padding: 24px;

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: var(--text100);
    margin-bottom: 16px;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;

  .label {
    font-size: 12px;
    color: var(--text200);
    margin-bottom: 4px;
  }

  .value {
    font-size: 14px;
    font-weight: 500;
    color: var(--primaryColor);
  }
}

.test-section {
  margin-bottom: 32px;

  h3 {
    font-size: 24px;
    font-weight: 600;
    color: var(--text100);
    margin-bottom: 24px;
  }
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.test-card {
  background: var(--bg200);
  border: 1px solid var(--bg300);
  border-radius: var(--rounded);
  padding: 24px;

  h4 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text100);
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: var(--text200);
    margin-bottom: 16px;
  }
}

/* 像素基础测试元素 */
.pixel-elements {
  .element-16 {
    font-size: 16px;
    padding: 8px 16px;
    background: #f0f0f0;
    border-radius: 4px;
    margin: 8px 0;
  }

  .element-24 {
    font-size: 24px;
    padding: 12px 24px;
    background: #e0e0e0;
    border-radius: 8px;
    margin: 12px 0;
  }

  .element-32 {
    font-size: 32px;
    padding: 16px 32px;
    background: #d0d0d0;
    border-radius: 12px;
    margin: 16px 0;
  }
}

.uno-elements {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.manual-elements {
  > div {
    margin: 8px 0;
    padding: 8px;
    background: var(--bg300);
    border-radius: 4px;
  }
}

.breakpoint-section {
  margin-bottom: 32px;

  h3 {
    font-size: 24px;
    font-weight: 600;
    color: var(--text100);
    margin-bottom: 16px;
  }
}

.breakpoint-indicator {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .indicator {
    padding: 8px 16px;
    background: var(--bg300);
    border-radius: var(--rounded);
    font-size: 14px;
    color: var(--text200);
    transition: all 0.3s ease;

    &.active {
      background: var(--primaryColor);
      color: white;
      transform: scale(1.05);
    }
  }
}

.debug-section {
  margin-bottom: 32px;

  h3 {
    font-size: 24px;
    font-weight: 600;
    color: var(--text100);
    margin-bottom: 16px;
  }
}

.config-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: end;

  .config-item {
    display: flex;
    flex-direction: column;

    label {
      font-size: 14px;
      color: var(--text100);
      margin-bottom: 4px;
    }

    input {
      padding: 8px 12px;
      border: 1px solid var(--bg300);
      border-radius: 4px;
      background: var(--bg100);
      color: var(--text100);

      &:focus {
        outline: none;
        border-color: var(--primaryColor);
      }
    }

    input[type='checkbox'] {
      width: auto;
      margin-left: 0;
    }
  }
}

.preview-section {
  h3 {
    font-size: 24px;
    font-weight: 600;
    color: var(--text100);
    margin-bottom: 16px;
  }
}

.preview-box {
  border: 2px dashed var(--bg300);
  border-radius: var(--rounded);
  padding: 32px;
  text-align: center;
  background: linear-gradient(135deg, var(--bg100) 0%, var(--bg200) 100%);

  .preview-content {
    .preview-title {
      font-size: 28px;
      font-weight: bold;
      color: var(--primaryColor);
      margin-bottom: 16px;
    }

    .preview-text {
      font-size: 16px;
      color: var(--text100);
      margin-bottom: 24px;
      line-height: 1.6;
    }

    .preview-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
  }
}

/* 响应式样式 */
@media (max-width: 768px) {
  .example-rem {
    padding: 16px;
  }

  .info-panel {
    grid-template-columns: 1fr;
  }

  .test-grid {
    grid-template-columns: 1fr;
  }

  .config-panel {
    grid-template-columns: 1fr;
  }

  .breakpoint-indicator {
    .indicator {
      font-size: 12px;
      padding: 6px 12px;
    }
  }
}
</style>
