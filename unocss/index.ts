/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - index
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/* eslint-disable @typescript-eslint/naming-convention */
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { devOptions, prodOptions } from './env'
import { createPixelRules } from './rules/pixelRules'
import { createThemeVariableRules } from './rules/themeRules'
import { shortcuts } from './shortcuts'
import { themeConfig } from './theme'
import { getCustomCollections, getDynamicSafelist } from './utils/icons'

export default defineConfig({
  // 内容扫描配置 - 优化性能
  content: {
    pipeline: {
      include: [
        /\.(vue|js|ts|jsx|tsx|md|mdx|html)($|\?)/,
        // 包含样式文件以支持 @apply 指令
        /\.(css|scss|sass|less|styl|stylus)($|\?)/,
      ],
      exclude: ['node_modules', 'dist', '.git', '.nuxt', '.next', '.vercel', '.netlify'],
    },
  },

  // 预设配置
  presets: [
    presetUno({
      // 启用深色模式支持
      dark: 'class',
      // 启用所有变体
      variablePrefix: '--un-',
    }),
    // 注意：不使用 presetRemToPx，因为它与 rem 适配系统冲突
    // presetRemToPx 会生成固定 px 值，无法实现响应式缩放
    presetIcons({
      prefix: 'icon-',
      // 开发时警告未找到的图标
      warn: process.env.NODE_ENV === 'development',
      // 图标属性
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
        'flex-shrink': '0',
      },
      // 自定义图标集合
      collections: {
        ...getCustomCollections(),
      },
    }),
    presetAttributify({
      // 属性化前缀
      prefix: 'un-',
      prefixedOnly: false,
    }),
    presetTypography({
      // 排版样式配置
      cssExtend: {
        code: {
          color: 'var(--theme-color)',
        },
        blockquote: {
          'border-left-color': 'var(--theme-color)',
        },
      },
    }),
  ],

  // 安全列表 - 优化性能，只包含必要的类
  safelist: getDynamicSafelist(),

  // 变换器
  transformers: [
    // 支持 @apply、@screen 和 theme() 指令
    transformerDirectives({
      // 强制转换未知的CSS指令
      enforce: 'pre',
    }),
    // 支持变体组语法，如 hover:(bg-red-400 text-white)
    transformerVariantGroup(),
  ],

  // 自定义变体 - 简化变体，只保留必要的
  variants: [
    // 深色模式变体
    matcher => {
      if (!matcher.startsWith('dark:')) {
        return matcher
      }
      return {
        matcher: matcher.slice(5),
        selector: s => `.dark ${s}`,
      }
    },

    // 悬停变体
    matcher => {
      if (!matcher.startsWith('hover:')) {
        return matcher
      }
      return {
        matcher: matcher.slice(6),
        selector: s => `${s}:hover`,
      }
    },

    // 焦点变体
    matcher => {
      if (!matcher.startsWith('focus:')) {
        return matcher
      }
      return {
        matcher: matcher.slice(6),
        selector: s => `${s}:focus`,
      }
    },

    // 激活变体
    matcher => {
      if (!matcher.startsWith('active:')) {
        return matcher
      }
      return {
        matcher: matcher.slice(7),
        selector: s => `${s}:active`,
      }
    },
  ],

  // 快捷方式配置
  shortcuts: shortcuts as any,

  // 自定义规则
  rules: [
    // 多行文本省略规则
    [
      /^line-clamp-(\d+)$/,
      ([, num]) => ({
        overflow: 'hidden',
        display: '-webkit-box',
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': num,
        'line-clamp': num,
      }),
    ],

    // 🎯 设计稿映射规则 - 实现精确的设计稿到像素映射 + 响应式缩放
    // 这些规则生成的 px 值会被 postcss-pxtorem 转换为 rem，从而实现响应式
    [/^w-(\d+)$/, ([, d]) => ({ width: `${d}px` }), { layer: 'design-mapping' }],
    [/^h-(\d+)$/, ([, d]) => ({ height: `${d}px` }), { layer: 'design-mapping' }],
    [/^text-(\d+)$/, ([, d]) => ({ 'font-size': `${d}px` }), { layer: 'design-mapping' }],
    [/^p-(\d+)$/, ([, d]) => ({ padding: `${d}px` }), { layer: 'design-mapping' }],
    [/^m-(\d+)$/, ([, d]) => ({ margin: `${d}px` }), { layer: 'design-mapping' }],
    [/^pt-(\d+)$/, ([, d]) => ({ 'padding-top': `${d}px` }), { layer: 'design-mapping' }],
    [/^pb-(\d+)$/, ([, d]) => ({ 'padding-bottom': `${d}px` }), { layer: 'design-mapping' }],
    [/^pl-(\d+)$/, ([, d]) => ({ 'padding-left': `${d}px` }), { layer: 'design-mapping' }],
    [/^pr-(\d+)$/, ([, d]) => ({ 'padding-right': `${d}px` }), { layer: 'design-mapping' }],
    [
      /^px-(\d+)$/,
      ([, d]) => ({ 'padding-left': `${d}px`, 'padding-right': `${d}px` }),
      { layer: 'design-mapping' },
    ],
    [
      /^py-(\d+)$/,
      ([, d]) => ({ 'padding-top': `${d}px`, 'padding-bottom': `${d}px` }),
      { layer: 'design-mapping' },
    ],
    [/^mt-(\d+)$/, ([, d]) => ({ 'margin-top': `${d}px` }), { layer: 'design-mapping' }],
    [/^mb-(\d+)$/, ([, d]) => ({ 'margin-bottom': `${d}px` }), { layer: 'design-mapping' }],
    [/^ml-(\d+)$/, ([, d]) => ({ 'margin-left': `${d}px` }), { layer: 'design-mapping' }],
    [/^mr-(\d+)$/, ([, d]) => ({ 'margin-right': `${d}px` }), { layer: 'design-mapping' }],
    [
      /^my-(\d+)$/,
      ([, d]) => ({ 'margin-top': `${d}px`, 'margin-bottom': `${d}px` }),
      { layer: 'design-mapping' },
    ],
    [
      /^mx-(\d+)$/,
      ([, d]) => ({ 'margin-left': `${d}px`, 'margin-right': `${d}px` }),
      { layer: 'design-mapping' },
    ],
    [/^gap-(\d+)$/, ([, d]) => ({ gap: `${d}px` }), { layer: 'design-mapping' }],
    [/^gapx-(\d+)$/, ([, d]) => ({ 'gap-x': `${d}px` }), { layer: 'design-mapping' }],
    [/^gapy-(\d+)$/, ([, d]) => ({ 'gap-y': `${d}px` }), { layer: 'design-mapping' }],
    [/^lh-(\d+)$/, ([, d]) => ({ 'line-height': `${d}px` }), { layer: 'design-mapping' }],

    // 安全区域规则 - 适配移动端
    ['safe-top', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['safe-bottom', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
    ['safe-left', { 'padding-left': 'env(safe-area-inset-left)' }],
    ['safe-right', { 'padding-right': 'env(safe-area-inset-right)' }],
    [
      'safe-x',
      {
        'padding-left': 'env(safe-area-inset-left)',
        'padding-right': 'env(safe-area-inset-right)',
      },
    ],
    [
      'safe-y',
      {
        'padding-top': 'env(safe-area-inset-top)',
        'padding-bottom': 'env(safe-area-inset-bottom)',
      },
    ],

    // 像素值规则（保留原有功能）
    ...createPixelRules(),

    // 主题变量规则
    ...createThemeVariableRules(),

    // 自定义透明度规则
    [
      /^bg-theme-(\d+)$/,
      ([, opacity]) => ({
        'background-color': `rgba(var(--theme-color-rgb), ${Number(opacity) / 100})`,
      }),
    ],

    // 渐变规则
    [
      /^bg-gradient-theme$/,
      () => ({
        'background-image': 'linear-gradient(135deg, var(--theme-color), var(--primary-color))',
      }),
    ],
  ],

  // 主题配置
  theme: themeConfig,

  // 环境配置
  ...devOptions,
  ...prodOptions,
})
