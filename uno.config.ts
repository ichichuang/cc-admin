import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  // 预设配置
  presets: [
    presetUno(),
    presetAttributify({
      prefix: 'uno-',
      prefixedOnly: false,
    }),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        verticalAlign: 'middle',
      },
      warn: true,
    }),
    presetTypography(),
  ],

  // 转换器
  transformers: [transformerDirectives(), transformerVariantGroup()],

  // 快捷方式 - 预定义的常用样式组合，提高开发效率
  shortcuts: [
    // === 布局相关快捷类 ===
    // 水平居中对齐：适用于 logo、标题、按钮等元素的居中显示
    ['flex-center', 'flex items-center justify-center'],

    // 两端对齐：适用于导航栏、工具栏等需要左右分布的布局
    ['flex-between', 'flex items-center justify-between'],

    // 均匀分布：适用于标签页、菜单项等需要平均分布的场景
    ['flex-around', 'flex items-center justify-around'],

    // 左对齐：适用于列表项、表单标签等左对齐布局
    ['flex-start', 'flex items-center justify-start'],

    // 右对齐：适用于操作按钮、价格显示等右对齐布局
    ['flex-end', 'flex items-center justify-end'],

    // 垂直居中：适用于模态框、欢迎页面等垂直居中布局
    ['flex-col-center', 'flex flex-col items-center justify-center'],

    // 垂直两端对齐：适用于侧边栏、移动端页面等垂直分布布局
    ['flex-col-between', 'flex flex-col justify-between'],

    // === 文本相关快捷类 ===
    // 单行文本省略：适用于标题、用户名等需要单行显示的文本
    ['text-ellipsis', 'truncate overflow-hidden whitespace-nowrap'],

    // === 按钮相关快捷类 ===
    // 基础按钮样式：定义按钮的基本外观（内边距、圆角、边框、字体、过渡效果）
    [
      'btn',
      'px-4 py-2 rounded border border-transparent font-medium text-sm transition-colors duration-200',
    ],

    // 主要按钮：用于主要操作，如提交、确认等关键行为
    ['btn-primary', 'btn bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'],

    // 次要按钮：用于次要操作，如取消、重置等辅助行为
    ['btn-secondary', 'btn bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700'],

    // 成功按钮：用于成功状态，如保存成功、操作完成等
    ['btn-success', 'btn bg-green-500 text-white hover:bg-green-600 active:bg-green-700'],

    // 危险按钮：用于危险操作，如删除、清空等需要谨慎的行为
    ['btn-danger', 'btn bg-red-500 text-white hover:bg-red-600 active:bg-red-700'],

    // 警告按钮：用于警告状态，如待处理、需要注意的操作
    ['btn-warning', 'btn bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700'],

    // 边框按钮：用于低优先级操作，如编辑、查看详情等
    ['btn-outline', 'btn border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100'],

    // === 卡片相关快捷类 ===
    // 基础卡片：适用于内容块、信息面板等容器组件
    ['card', 'bg-white rounded-lg shadow-md border border-gray-200'],

    // 悬停卡片：适用于可交互的卡片，如产品卡片、文章卡片等
    ['card-hover', 'card hover:shadow-lg transition-shadow duration-200'],

    // 卡片主体：适用于卡片内容区域，提供标准的内边距
    ['card-body', 'p-6'],

    // 卡片头部：适用于卡片标题区域，带有底部分隔线
    ['card-header', 'px-6 py-4 border-b border-gray-200'],

    // 卡片底部：适用于卡片操作区域，带有顶部分隔线
    ['card-footer', 'px-6 py-4 border-t border-gray-200'],

    // === 输入框相关快捷类 ===
    // 基础输入框：标准的表单输入框样式，包含焦点状态和过渡效果
    [
      'input',
      'px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    ],

    // 错误状态输入框：用于表单验证失败时显示错误状态
    ['input-error', 'input border-red-500 focus:ring-red-500'],

    // 成功状态输入框：用于表单验证成功时显示成功状态
    ['input-success', 'input border-green-500 focus:ring-green-500'],
  ],

  // 自定义规则
  rules: [
    [/^bg-hex-([a-fA-F0-9]{6})$/, ([, hex]) => ({ backgroundColor: `#${hex}` })],
    [/^text-hex-([a-fA-F0-9]{6})$/, ([, hex]) => ({ color: `#${hex}` })],
  ],

  // 主题配置
  theme: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
      },
      warning: {
        50: '#fefce8',
        100: '#fef9c3',
        200: '#fef08a',
        300: '#fde64b',
        400: '#facc15',
        500: '#eab308',
        600: '#ca8a04',
        700: '#a16207',
        800: '#854d0e',
        900: '#713f12',
      },
      danger: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
      },
      info: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
      },
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
    },
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'ui-monospace', 'monospace'],
    },
  },

  // 内容检测
  content: {
    filesystem: ['src/**/*.{vue,js,ts,jsx,tsx}', 'index.html'],
  },
})
