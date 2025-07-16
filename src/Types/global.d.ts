declare interface Window {
  $message: any
}

declare type Nullable<T> = T | null

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

declare type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>

declare type ComponentRef<T> = InstanceType<T>

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
