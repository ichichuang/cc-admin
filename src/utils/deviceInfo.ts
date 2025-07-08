export const getDeviceInfo = (): DeviceInfo => {
  const ua = navigator.userAgent
  const screenWidth = window.screen.width
  const screenHeight = window.screen.height
  const pageWidth = window.innerWidth
  const pageHeight = window.innerHeight

  // 判断是否使用页面尺寸（如在浏览器中/存在滚动条/非全屏）
  const isSmartPageSize = () => {
    const delta = Math.abs(screenHeight - pageHeight)
    return delta > 100 // 工具栏/地址栏影响超过100px则启用 pageSize
  }

  const usePageSize = isSmartPageSize()

  const width = usePageSize ? pageWidth : screenWidth
  const height = usePageSize ? pageHeight : screenHeight
  const orientation = width >= height ? 'horizontal' : 'vertical'

  let type: 'PC' | 'Mobile' = 'PC'
  let system = 'Unknown'

  if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    type = 'Mobile'
  }

  if (/Windows/i.test(ua)) {
    system = 'Windows'
  } else if (/Mac OS/i.test(ua)) {
    system = 'MacOS'
  } else if (/Android/i.test(ua)) {
    system = 'Android'
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    system = 'iOS'
  } else if (/Linux/i.test(ua)) {
    system = 'Linux'
  }

  let navHeight = 0
  let tabHeight = 0

  if (type === 'Mobile') {
    if (/iPhone|iPad|iPod/i.test(ua)) {
      navHeight = 44
      tabHeight = 34
    } else if (/Android/i.test(ua)) {
      navHeight = 48
      tabHeight = 48
    }
  }

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
