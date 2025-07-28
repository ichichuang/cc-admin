/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - helpers
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 从 core utils 导入公共工具函数
import { debounce, deepClone, formatDate, formatFileSize, throttle } from '@cc-admin/core/utils'

// 重新导出公共工具函数以保持向后兼容
export { debounce, deepClone, formatDate, formatFileSize, throttle }

/**
 * 生成随机字符串
 * @param length 字符串长度
 * @returns 随机字符串
 */
export function randomString(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 默认导出所有工具函数
export default {
  formatDate,
  debounce,
  throttle,
  deepClone,
  randomString,
  formatFileSize,
}
