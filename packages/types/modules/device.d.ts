/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 设备信息类型定义
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

declare interface DeviceInfo {
  // 设备类型 PC 端 Mobile 端
  type: 'PC' | 'Mobile'
  screen: {
    // 设备方向 horizontal 水平方向 vertical 垂直方向
    orientation: 'horizontal' | 'vertical'

    // 设备宽度 屏幕高度
    deviceWidth: number
    deviceHeight: number

    // 页面宽度
    width: number
    // 页面高度
    height: number

    // 页面绝对大小(水平方向为页面高度，垂直方向为页面宽度)
    definitely: number

    // 系统导航栏高度 系统标签栏高度
    navHeight: number
    tabHeight: number
  }
  // 系统
  system: string
}

// rem 适配配置
declare interface RemAdapterConfig {
  // 设计稿基准宽度
  designWidth: number
  // 基准字体大小（设计稿上的基准值）
  baseFontSize: number
  // 最小字体大小
  minFontSize: number
  // 最大字体大小
  maxFontSize: number
  // 是否启用移动端优先策略
  mobileFirst: boolean
  // 自定义断点配置 (与 UnoCSS 保持一致)
  breakpoints: {
    xs: number // 超小屏 (375px+)
    sm: number // 小屏 (768px+)
    md: number // 中屏 (1024px+)
    lg: number // 大屏 (1400px+)
    xl: number // 超大屏 (1660px+)
    xls: number // 特大屏 (1920px+)
  }
}
