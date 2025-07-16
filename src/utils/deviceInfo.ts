/**
 * 获取当前设备与屏幕信息（运行时计算版）
 *
 * 1. **自动判断** 是否为移动端（通过 UA）。
 * 2. **自动决定** 使用 window.innerSize 还是 screen.size 作为页面尺寸：
 *    - 若窗口高度与物理屏幕高度相差超过 100px（常见于移动端地址栏/滚动条占位）
 *      则认为应使用页面尺寸（innerWidth / innerHeight）；
 *    - 否则使用物理屏幕尺寸（screen.width / screen.height）。
 * 3. 返回统一的设备信息结构，包含：
 *    - `type`   —— PC / Mobile
 *    - `system` —— Windows / MacOS / Android / iOS / Linux / Unknown
 *    - `screen` —— 页面宽高、设备宽高、方向、导航栏/标签栏高度等
 *
 * @returns {DeviceInfo} 设备与屏幕信息
 *
 * @example
 * ```ts
 * const device = getDeviceInfo()
 * if (device.type === 'Mobile' && device.screen.orientation === 'vertical') {
 *   // do something...
 * }
 * ```
 */
export const getDeviceInfo = (): DeviceInfo => {
  /* ------------- 基础信息 ------------- */
  const ua = navigator.userAgent
  const screenWidth = window.screen.width
  const screenHeight = window.screen.height
  const pageWidth = window.innerWidth
  const pageHeight = window.innerHeight

  /**
   * 判断在移动端/浏览器 UI 侵占空间时，是否应使用 innerWidth/innerHeight
   * ➜ 当物理屏幕高度与页面可用高度差值超过阈值 100px 时使用页面尺寸
   */
  const shouldUsePageSize = (): boolean => {
    return Math.abs(screenHeight - pageHeight) > 100
  }

  const usePageSize = shouldUsePageSize()

  /* ------------- 尺寸与方向 ------------- */
  const width = usePageSize ? pageWidth : screenWidth
  const height = usePageSize ? pageHeight : screenHeight
  const orientation: 'horizontal' | 'vertical' = width >= height ? 'horizontal' : 'vertical'

  /* ------------- 设备与系统类型 ------------- */
  const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  const type: 'PC' | 'Mobile' = isMobile ? 'Mobile' : 'PC'

  const system = (() => {
    if (/Windows/i.test(ua)) {
      return 'Windows'
    }
    if (/Mac OS/i.test(ua)) {
      return 'MacOS'
    }
    if (/Android/i.test(ua)) {
      return 'Android'
    }
    if (/iPhone|iPad|iPod/i.test(ua)) {
      return 'iOS'
    }
    if (/Linux/i.test(ua)) {
      return 'Linux'
    }
    return 'Unknown'
  })()

  /* ------------- 移动端导航/标签栏高度预估 ------------- */
  const { navHeight, tabHeight } = (() => {
    if (type === 'Mobile') {
      if (/iPhone|iPad|iPod/i.test(ua)) {
        return { navHeight: 44, tabHeight: 34 }
      }
      if (/Android/i.test(ua)) {
        return { navHeight: 48, tabHeight: 48 }
      }
    }
    return { navHeight: 0, tabHeight: 0 }
  })()

  /* ------------- 返回统一结构 ------------- */
  return {
    type,
    system,
    screen: {
      /** 页面可用宽度（受缩放 / 滚动条影响） */
      width: pageWidth,
      /** 页面可用高度 */
      height: pageHeight,
      /** 当前屏幕方向 horizontal | vertical */
      orientation,
      /** 设备物理宽度（screen.width） */
      deviceWidth: screenWidth,
      /** 设备物理高度（screen.height） */
      deviceHeight: screenHeight,
      /** 较短边：vertical 时取 pageWidth，horizontal 时取 pageHeight，可做断点判断 */
      definitely: orientation === 'horizontal' ? pageHeight : pageWidth,
      /** 预估导航栏高度（仅移动端） */
      navHeight,
      /** 预估底部标签栏高度（仅移动端） */
      tabHeight,
    },
  }
}
