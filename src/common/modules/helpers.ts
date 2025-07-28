/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - helpers
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 工具函数集合

/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @param format 格式字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | number | string, format = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) {
    return ''
  }

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let isThrottled = false
  return (...args: Parameters<T>) => {
    if (!isThrottled) {
      func(...args)
      isThrottled = true
      setTimeout(() => {
        isThrottled = false
      }, delay)
    }
  }
}

/**
 * 深度克隆对象
 * @param obj 要克隆的对象
 * @returns 克隆后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }

  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }

  return obj
}

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

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0 Bytes'
  }

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
