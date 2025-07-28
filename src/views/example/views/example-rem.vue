<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - 页面组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
import { useLayoutStore } from '@/stores/modules/layout'
import { usePostcssStore } from '@/stores/modules/postcss'
import type { RemAdapterConfig } from '@/utils/remAdapter'
import { parseRemConfigFromEnv } from '@/utils/remAdapter'
import { computed, getCurrentInstance, onMounted, reactive } from 'vue'

// 获取 stores
const layoutStore = useLayoutStore()
const postcssStore = usePostcssStore()

// 当前断点
const currentBreakpoint = computed(() => {
  const deviceInfo = layoutStore.deviceInfo
  return postcssStore.getCurrentBreakpoint(deviceInfo)
})
const currentRemBase = computed(() => postcssStore.getCurrentRemBase || 16)

// 临时配置
const tempConfig = reactive<RemAdapterConfig>({
  ...postcssStore.getRemConfig,
})

// 设计稿映射示例数据
interface RemExample {
  name: string
  className: string
  description: string
}

const remExamples: RemExample[] = [
  {
    name: 'w-200',
    className: 'w-200 h-60 bg-primaryColor text-white rounded flex items-center justify-center',
    description: '设计稿 200px 宽度',
  },
  {
    name: 'h-100',
    className: 'w-150 h-100 bg-successColor text-white rounded flex items-center justify-center',
    description: '设计稿 100px 高度',
  },
  {
    name: 'text-16',
    className: 'text-16 text-primaryColor font-bold',
    description: '设计稿 16px 字体',
  },
  {
    name: 'text-24',
    className: 'text-24 text-warningColor font-bold',
    description: '设计稿 24px 字体',
  },
  {
    name: 'p-20',
    className: 'p-20 bg-infoLightColor border-2 border-infoColor rounded',
    description: '设计稿 20px 内边距',
  },
  {
    name: 'm-16',
    className: 'm-16 w-120 h-60 bg-errorColor text-white rounded flex items-center justify-center',
    description: '设计稿 16px 外边距',
  },
]

// 断点选项
const breakpointOptions = computed(() => [
  { key: 'xs', label: 'XS', value: '≤375px' },
  { key: 'sm', label: 'SM', value: '≤768px' },
  { key: 'md', label: 'MD', value: '≤1024px' },
  { key: 'lg', label: 'LG', value: '≤1400px' },
  { key: 'xl', label: 'XL', value: '≤1660px' },
  { key: 'xls', label: 'XLS', value: '≤1920px' },
  { key: 'xxl', label: 'XXL', value: '>1920px' },
])

// 计算实际像素值
const getActualPixels = (originalPx: number): string => {
  const ratio = currentRemBase.value / 16
  return (originalPx * ratio).toFixed(1)
}

// 更新配置
const updateConfig = () => {
  postcssStore.updateRemConfig(tempConfig)
}

// 重置配置
const resetConfig = () => {
  // 使用环境变量配置重置
  const defaultConfig = parseRemConfigFromEnv()
  Object.assign(tempConfig, defaultConfig)
  updateConfig()

  // 重新初始化以触发设备检测
  setTimeout(() => {
    postcssStore.initRemAdapter()
  }, 100)
}

// 手动刷新适配器
const forceRefresh = async () => {
  await postcssStore.forceRefreshAdapter()
}

// 获取适配器状态
const adapterStatus = computed(() => postcssStore.getAdapterStatus())

onMounted(async () => {
  await postcssStore.initRemAdapter()

  // 监听手动刷新事件
  const handleAdapterRefresh = (_event: CustomEvent) => {}

  window.addEventListener('remAdapterRefreshed', handleAdapterRefresh as EventListener)

  // 清理事件监听器
  const cleanup = () => {
    window.removeEventListener('remAdapterRefreshed', handleAdapterRefresh as EventListener)
  }

  // 保存清理函数到组件实例
  const instance = getCurrentInstance()
  if (instance) {
    ;(instance as any)._cleanup = cleanup
  }
})
</script>

<template>
  <div class="example-rem">
    <!-- 配置面板 -->
    <div
      class="bg-bg200 color-primary100 border p-gap mb-gap sticky top-0 left-0 right-0 between-col gap-gap"
    >
      <!-- rem 适配信息 -->
      <div class="between">
        <div>rem 适配状态: {{ currentBreakpoint }} | 根字体: {{ currentRemBase.toFixed(2) }}px</div>
        <div class="between gap-gap">
          <div class="text-sm">
            设备: {{ layoutStore.getIsPC ? 'PC' : 'Mobile' }} | 尺寸: {{ layoutStore.getWidth }}×{{
              layoutStore.getHeight
            }}px | 模式: {{ tempConfig.mobileFirst ? '移动端优先' : '桌面端优先' }}
            <span
              v-if="layoutStore.getIsPC !== tempConfig.mobileFirst"
              class="color-successColor"
            >
              (自动切换)
            </span>
          </div>
        </div>
      </div>

      <!-- 断点指示器 -->
      <div class="between">
        <div>当前断点: {{ currentBreakpoint }}</div>
        <div class="between gap-2">
          <div
            v-for="item in breakpointOptions"
            :key="item.key"
            class="p-gap py-gaps"
            :class="currentBreakpoint === item.key ? 'btn-success' : 'btn-info'"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- 设计稿映射示例 -->
    <div class="p-gap">
      <div class="card mb-gap">
        <h3 class="text-lg font-bold color-text100 mb-gap">🎯 设计稿映射示例</h3>
        <div class="text-sm color-text200 mb-gap">
          展示 1:1 设计稿映射 + 响应式缩放方案 (设计稿基准: 1920px)
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gap">
          <div
            v-for="example in remExamples"
            :key="example.name"
            class="bg-bg100 border border-bg300 rounded p-gap"
          >
            <!-- 示例标题 -->
            <div class="between mb-2">
              <span class="font-bold color-primaryColor">{{ example.name }}</span>
              <span class="text-xs color-text200">{{ example.description }}</span>
            </div>

            <!-- 示例内容 -->
            <div class="center-col gap-2 mb-2">
              <div :class="example.className">
                <div
                  v-if="example.name.startsWith('p-')"
                  class="bg-primaryColor text-white rounded text-center py-1"
                >
                  内容区域
                </div>
                <div v-else>
                  {{ example.name }}
                </div>
              </div>
            </div>

            <!-- 实际计算值 -->
            <div class="text-xs color-text200 bg-bg300 rounded px-2 py-1">
              <div v-if="example.name.startsWith('w-')">
                实际宽度: {{ getActualPixels(parseInt(example.name.split('-')[1])) }}px
              </div>
              <div v-else-if="example.name.startsWith('h-')">
                实际高度: {{ getActualPixels(parseInt(example.name.split('-')[1])) }}px
              </div>
              <div v-else-if="example.name.startsWith('text-')">
                实际字体: {{ getActualPixels(parseInt(example.name.split('-')[1])) }}px
              </div>
              <div v-else-if="example.name.startsWith('p-')">
                实际内边距: {{ getActualPixels(parseInt(example.name.split('-')[1])) }}px
              </div>
              <div v-else-if="example.name.startsWith('m-')">
                实际外边距: {{ getActualPixels(parseInt(example.name.split('-')[1])) }}px
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 响应式对比 -->
      <div class="card mb-gap">
        <h3 class="text-lg font-bold color-text100 mb-gap">📐 响应式对比</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-gap">
          <!-- 设计稿映射方案 -->
          <div class="bg-bg100 border border-bg300 rounded p-gap">
            <h4 class="font-bold color-successColor mb-2">✅ 设计稿映射方案 (推荐)</h4>
            <div class="center-col gap-2 mb-2">
              <div
                class="w-150 h-80 p-16 bg-primaryColor text-white rounded flex items-center justify-center text-14"
              >
                w-150 h-80<br />p-16 text-14
              </div>
            </div>
            <div class="text-xs color-text200">自动按屏幕比例缩放，保持设计稿比例</div>
          </div>

          <!-- 固定像素方案 -->
          <div class="bg-bg100 border border-bg300 rounded p-gap">
            <h4 class="font-bold color-errorColor mb-2">❌ 固定像素方案 (对比)</h4>
            <div class="center-col gap-2 mb-2">
              <div
                class="bg-errorColor text-white rounded flex items-center justify-center"
                style="width: 150px; height: 80px; padding: 16px; font-size: 14px"
              >
                150×80px<br />固定尺寸
              </div>
            </div>
            <div class="text-xs color-text200">固定像素，不响应屏幕变化</div>
          </div>
        </div>
      </div>

      <!-- 配置调试 -->
      <div class="card">
        <h3 class="text-lg font-bold color-text100 mb-gap">⚙️ rem 适配配置</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-gap mb-gap">
          <div>
            <label class="text-sm color-text200">设计稿宽度</label>
            <input
              v-model.number="tempConfig.designWidth"
              type="number"
              class="input-base w-full"
              @change="updateConfig"
            />
          </div>
          <div>
            <label class="text-sm color-text200">基准字体</label>
            <input
              v-model.number="tempConfig.baseFontSize"
              type="number"
              class="input-base w-full"
              @change="updateConfig"
            />
          </div>
          <div>
            <label class="text-sm color-text200">最小字体</label>
            <input
              v-model.number="tempConfig.minFontSize"
              type="number"
              class="input-base w-full"
              @change="updateConfig"
            />
          </div>
          <div>
            <label class="text-sm color-text200">最大字体</label>
            <input
              v-model.number="tempConfig.maxFontSize"
              type="number"
              class="input-base w-full"
              @change="updateConfig"
            />
          </div>
        </div>

        <div class="between">
          <div class="flex items-center gap-2">
            <input
              v-model="tempConfig.mobileFirst"
              type="checkbox"
              @change="updateConfig"
              :disabled="true"
            />
            <label class="text-sm color-text200">
              移动端优先
              <span class="text-xs color-primaryColor">(根据设备类型自动切换)</span>
            </label>
          </div>
          <div class="between gap-2">
            <button
              @click="resetConfig"
              class="btn-primary"
            >
              重置配置
            </button>
            <button
              @click="forceRefresh"
              class="btn-primary"
            >
              🔄 刷新适配
            </button>
          </div>
        </div>

        <!-- 适配器状态显示 -->
        <div class="mt-gap p-2 bg-bg100 rounded text-xs">
          <div class="font-bold color-text100 mb-1">适配器状态:</div>
          <div class="color-text200">
            初始化: {{ adapterStatus.isInitialized ? '✅' : '❌' }} | 当前基准:
            {{ adapterStatus.currentRemBase.toFixed(2) }}px | 设备:
            {{ layoutStore.getIsPC ? 'PC' : 'Mobile' }} | 模式:
            {{ adapterStatus.config.mobileFirst ? '移动端优先' : '桌面端优先' }}
            <span class="color-successColor">(自动)</span> | 更新时间:
            {{ new Date(adapterStatus.timestamp).toLocaleTimeString() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
