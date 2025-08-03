/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - theme
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 类型定义
interface ThemeConfig {
  breakpoints: Record<string, string>
  colors: Record<string, any>
  sizes: Record<string, string>
}

/**
 * 主题配置
 * 与 color.ts 和 size.ts 保持完全一致
 */
export const themeConfig: ThemeConfig = {
  breakpoints: {
    xs: '375px',
    sm: '768px',
    md: '1024px',
    lg: '1400px',
    xl: '1660px',
    xls: '1920px',
    // 🎯 添加缺失的断点，与 REM 适配系统完全同步
    xxl: '2560px', // 超宽屏 (2560px+)
    xxxl: '3840px', // 4K屏 (3840px+)
  },

  colors: {
    // 透明色
    tm: 'transparent',
    // 继承色
    inherit: 'inherit',

    // 功能色系统 - 与 color.ts 保持完全一致
    primaryColor: 'var(--primary-color)',
    successColor: 'var(--success-color)',
    warningColor: 'var(--warning-color)',
    errorColor: 'var(--error-color)',
    infoColor: 'var(--info-color)',

    // 功能色 - 悬停状态
    primaryHoverColor: 'var(--primary-hover-color)',
    successHoverColor: 'var(--success-hover-color)',
    warningHoverColor: 'var(--warning-hover-color)',
    errorHoverColor: 'var(--error-hover-color)',
    infoHoverColor: 'var(--info-hover-color)',

    // 功能色 - 激活状态
    primaryActiveColor: 'var(--primary-active-color)',
    successActiveColor: 'var(--success-active-color)',
    warningActiveColor: 'var(--warning-active-color)',
    errorActiveColor: 'var(--error-active-color)',
    infoActiveColor: 'var(--info-active-color)',

    // 功能色 - 禁用状态
    primaryDisabledColor: 'var(--primary-disabled-color)',
    successDisabledColor: 'var(--success-disabled-color)',
    warningDisabledColor: 'var(--warning-disabled-color)',
    errorDisabledColor: 'var(--error-disabled-color)',
    infoDisabledColor: 'var(--info-disabled-color)',

    // 功能色 - 浅色背景
    primaryLightColor: 'var(--primary-light-color)',
    successLightColor: 'var(--success-light-color)',
    warningLightColor: 'var(--warning-light-color)',
    errorLightColor: 'var(--error-light-color)',
    infoLightColor: 'var(--info-light-color)',

    // 主题色系统
    primary100: 'var(--primary100)',
    primary200: 'var(--primary200)',
    primary300: 'var(--primary300)',

    // 强调色系统
    accent100: 'var(--accent100)',
    accent200: 'var(--accent200)',

    // 文本色系统
    text100: 'var(--text100)',
    text200: 'var(--text200)',

    // 背景色系统
    bg100: 'var(--bg100)',
    bg200: 'var(--bg200)',
    bg300: 'var(--bg300)',
  },

  sizes: {
    // 布局尺寸 - 与 size.ts 保持完全一致
    sidebarWidth: 'var(--sidebar-width)',
    sidebarCollapsedWidth: 'var(--sidebar-collapsed-width)',
    headerHeight: 'var(--header-height)',
    breadcrumbHeight: 'var(--breadcrumb-height)',
    footerHeight: 'var(--footer-height)',
    tabsHeight: 'var(--tabs-height)',
    contentHeight: 'var(--content-height)',
    contentsHeight: 'var(--contents-height)',

    // 间距系统
    gap: 'var(--gap)',
    gaps: 'var(--gaps)', // gap的一半，用于更精细的间距控制

    // 圆角系统
    rounded: 'var(--rounded)',
  },
}
