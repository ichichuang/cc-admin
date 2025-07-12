export const getDeviceInfo = (): DeviceInfo => {
  const ua = navigator.userAgent
  const screenWidth = window.screen.width
  const screenHeight = window.screen.height
  const pageWidth = window.innerWidth
  const pageHeight = window.innerHeight

  // 判断是否使用页面尺寸（如存在地址栏、滚动条等影响）
  const shouldUsePageSize = (): boolean => {
    return Math.abs(screenHeight - pageHeight) > 100
  }

  const usePageSize = shouldUsePageSize()

  const width = usePageSize ? pageWidth : screenWidth
  const height = usePageSize ? pageHeight : screenHeight
  const orientation: 'horizontal' | 'vertical' = width >= height ? 'horizontal' : 'vertical'

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

  // 不同系统下的导航栏和标签栏高度（移动端）
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

  return {
    type,
    system,
    screen: {
      width: pageWidth,
      height: pageHeight,
      orientation,
      deviceWidth: screenWidth,
      deviceHeight: screenHeight,
      definitely: orientation === 'horizontal' ? pageHeight : pageWidth,
      navHeight,
      tabHeight,
    },
  }
}
