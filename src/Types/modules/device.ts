/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 设备类型声明
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 声明全局类型
declare global {
  /** 设备信息接口 */
  interface DeviceInfo {
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
}

// 导出空对象使其成为外部模块
export {}
