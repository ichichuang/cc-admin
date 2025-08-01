/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 公共工具函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 将驼峰命名转换为中划线命名
 * @param str 字符串
 * @param start 拼接前缀
 * @param end 拼接后缀
 * @returns 驼峰命名的字符串
 */
export function toKebabCase(str: string, start: string = '', end: string = ''): string {
  return start + `${str.replace(/([A-Z])/g, '-$1').toLowerCase()}` + end
}

/* 获取当前系统的颜色模式
 * @returns 当前系统的颜色模式
 */
export const getSystemColorMode = (): 'light' | 'dark' => {
  // 检查是否在浏览器环境中（SSR兼容）
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light' // 默认返回浅色主题
  }

  // 使用CSS媒体查询检测系统主题偏好
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  return mediaQuery.matches ? 'dark' : 'light'
}

/* 将颜色转换为 rgba 格式
 * @param color 颜色
 * @param opacity 透明度
 * @returns 转换后的颜色
 */
export function applyOpacityToColor(color: string, opacity: number): string {
  // 限定透明度为 0~100
  const alpha = Math.max(0, Math.min(100, opacity)) / 100

  // 移除空格并转小写
  color = color.trim().toLowerCase()

  // 1. rgba(...) 格式：直接替换 alpha
  const rgbaMatch = color.match(/^rgba?\(([^)]+)\)$/)
  if (rgbaMatch) {
    const parts = rgbaMatch[1].split(',').map(p => p.trim())
    const [r, g, b] = parts.map(Number)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // 2. HEX #rrggbb or #rgb
  if (color.startsWith('#')) {
    let r = 0,
      g = 0,
      b = 0
    if (color.length === 4) {
      // #rgb
      r = parseInt(color[1] + color[1], 16)
      g = parseInt(color[2] + color[2], 16)
      b = parseInt(color[3] + color[3], 16)
    } else if (color.length === 7) {
      // #rrggbb
      r = parseInt(color.slice(1, 3), 16)
      g = parseInt(color.slice(3, 5), 16)
      b = parseInt(color.slice(5, 7), 16)
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // 3. hsl(...) 格式
  const hslMatch = color.match(/^hsl\(([^)]+)\)$/)
  if (hslMatch) {
    return color.replace(/^hsl\(([^)]+)\)$/, `hsla($1, ${alpha})`)
  }

  // 4. hsla(...) 格式
  const hslaMatch = color.match(/^hsla\(([^,]+),([^,]+),([^,]+),[^)]+\)$/)
  if (hslaMatch) {
    const [h, s, l] = [hslaMatch[1], hslaMatch[2], hslaMatch[3]]
    return `hsla(${h}, ${s}, ${l}, ${alpha})`
  }

  // 5. 不支持的格式，返回默认黑色透明度
  console.warn(`Unsupported color format: "${color}"`)
  return `rgba(0, 0, 0, ${alpha})`
}

/**
 * 安全的数值解析
 */
export const safeParseFloat = (value: string | number, fallback: number): number => {
  if (typeof value === 'number') {
    return isNaN(value) ? fallback : value
  }
  const parsed = parseFloat(value)
  return isNaN(parsed) ? fallback : parsed
}

/**
 * 获取当前 rem 基准值（优化版）
 */
export const getRemBase = (): number => {
  if (typeof document === 'undefined') {
    return 16
  }
  // 优先从 CSS 变量获取
  const rootElement = document.documentElement
  const cssVariable = rootElement.style.getPropertyValue('--rem-base')
  if (cssVariable) {
    const parsed = safeParseFloat(cssVariable, 16)
    if (parsed > 0) {
      return parsed
    }
  }
  // 降级到计算样式
  const computedStyle = window.getComputedStyle(rootElement)
  return safeParseFloat(computedStyle.fontSize, 16)
}

/**
 * 计算相对于当前基准的 rem 值
 */
export const toRem = (px: number): string => {
  const base = getRemBase()
  return `${(px / base).toFixed(4)}rem`
}

/**
 * 计算 rem 对应的 px 值
 */
export const toPx = (rem: number): number => {
  return rem * getRemBase()
}

/**
 * 获取当前断点（优化版）
 */
export const getCurrentBreakpoint = (
  width: number,
  breakpoints: Record<string, number>
): string => {
  // 使用 Object.entries 并 reverse 来从大到小匹配
  const sortedBreakpoints = Object.entries(breakpoints).sort(([, a], [, b]) => b - a)
  for (const [name, value] of sortedBreakpoints) {
    if (width >= value) {
      return name
    }
  }
  return 'xs'
}

/**
 * 性能监控器
 */
export class PerformanceMonitor {
  private updateTimes: number[] = []
  private readonly maxSamples = 10

  recordUpdate(duration: number): void {
    this.updateTimes.push(duration)
    if (this.updateTimes.length > this.maxSamples) {
      this.updateTimes.shift()
    }
  }

  getAverageUpdateTime(): number {
    if (this.updateTimes.length === 0) {
      return 0
    }
    return this.updateTimes.reduce((sum, time) => sum + time, 0) / this.updateTimes.length
  }

  reset(): void {
    this.updateTimes.length = 0
  }
}
