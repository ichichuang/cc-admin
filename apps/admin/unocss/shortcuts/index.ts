/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - index
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/* eslint-disable @typescript-eslint/naming-convention */
import { buttonShortcuts } from './button'
import { layoutShortcuts } from './layout'
import { textShortcuts } from './text'

/**
 * 合并所有快捷方式
 */
export const shortcuts = [
  // 基础边框和圆角
  {
    border: 'border-1 border-solid border-bg300',
    'border-primary': 'border-1 border-solid border-primaryColor',
    'border-success': 'border-1 border-solid border-successColor',
    'border-warning': 'border-1 border-solid border-warningColor',
    'border-error': 'border-1 border-solid border-errorColor',
    'border-info': 'border-1 border-solid border-infoColor',
    rounded: 'rounded-rounded',
  },

  // 布局快捷方式
  layoutShortcuts,

  // 文本快捷方式
  textShortcuts,

  // 按钮快捷方式
  buttonShortcuts,

  // 卡片快捷方式
  {
    // 基础卡片
    card: 'bg-bg200 border border-bg300 rounded p-gap hover:border-primary300 transition-slow',
    'card-hover': 'card hover:shadow-xl hover:border-bg200',
    'card-active': 'card border-primary200 shadow-lg shadow-primary300/30',

    // 特殊卡片
    'card-primary': 'bg-primary300 border border-primary200 rounded p-gap text-text100',
    'card-accent': 'bg-accent100/10 border border-accent100/30 rounded p-gap text-text100',
  },

  // 输入框快捷方式
  {
    // 基础输入框
    'input-base':
      'w-full px-gap py-gaps border border-bg300 rounded bg-bg100 text-text100 placeholder:text-text200 focus:outline-none focus:ring-2 focus:ring-primary200 focus:border-primary100 transition-slow',
  },

  // 过渡快捷方式
  {
    // 过渡效果
    'transition-fast': 'transition-all duration-200 ease-in-out',
    'transition-slow': 'transition-all duration-300 ease-in-out',
    'transition-slower': 'transition-all duration-500 ease-in-out',
    'transition-slowest': 'transition-all duration-1000 ease-in-out',
  },

  // 状态快捷方式
  {
    // 禁用状态
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    // 加载状态
    loading: 'opacity-75 cursor-wait',
    // 活跃状态
    active: 'ring-2 ring-primaryColor ring-offset-2',
  },
]
