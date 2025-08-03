/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - function
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

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

/* 将驼峰命名转换为中划线命名
 * @param str 字符串
 * @param start 拼接前缀
 * @param end 拼接后缀
 * @returns 驼峰命名的字符串
 */
export function toKebabCase(str: string, start: string = '', end: string = ''): string {
  return start + `${str.replace(/([A-Z])/g, '-$1').toLowerCase()}` + end
}
