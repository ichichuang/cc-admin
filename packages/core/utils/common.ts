/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 公共工具函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间
 * @param immediate 是否立即执行
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return function (this: any, ...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) {
        func.apply(this, args)
      }
    }
    const callNow = immediate && !timeout
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
    if (callNow) {
      func.apply(this, args)
    }
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param wait 等待时间
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  let previous = 0
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    const remaining = wait - (now - previous)
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(this, args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now()
        timeout = null
        func.apply(this, args)
      }, remaining)
    }
  }
}

/**
 * 深拷贝函数
 * @param obj 要拷贝的对象
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
 * 格式化日期
 * @param date 日期
 * @param format 格式
 */
export function formatDate(date: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 检查是否为有效URL
 * @param url URL字符串
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 检查是否为有效邮箱
 * @param email 邮箱字符串
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 检查是否为有效手机号
 * @param phone 手机号字符串
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 数组去重
 * @param array 数组
 */
export function uniqueArray<T>(array: T[]): T[] {
  return [...new Set(array)]
}

/**
 * 对象转查询字符串
 * @param obj 对象
 */
export function objectToQueryString(obj: Record<string, any>): string {
  return Object.keys(obj)
    .filter(key => obj[key] !== undefined && obj[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
}

/**
 * 查询字符串转对象
 * @param queryString 查询字符串
 */
export function queryStringToObject(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString)
  const obj: Record<string, string> = {}
  for (const [key, value] of params) {
    obj[key] = value
  }
  return obj
}

/**
 * 获取文件扩展名
 * @param filename 文件名
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0 B'
  }
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 睡眠函数
 * @param ms 毫秒数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 重试函数
 * @param fn 要重试的函数
 * @param maxRetries 最大重试次数
 * @param delay 延迟时间
 */
export async function retry<T>(fn: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
  let lastError: Error
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < maxRetries) {
        await sleep(delay * Math.pow(2, i))
      }
    }
  }
  throw lastError!
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
