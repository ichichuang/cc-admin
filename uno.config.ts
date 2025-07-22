/* eslint-disable @typescript-eslint/naming-convention */
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import fs from 'fs'
import path from 'node:path'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

// 类型定义
interface IconCollection {
  [key: string]: string[]
}

interface ThemeConfig {
  breakpoints: Record<string, string>
  colors: Record<string, any>
  sizes: Record<string, string>
}

/**
 * 获取自定义图标集合
 * 优化：使用缓存和错误处理
 */
function getCustomIcons(): IconCollection {
  const icons: IconCollection = {}
  const iconFiles = getSvgFiles('src/assets/icons')

  iconFiles.forEach(filePath => {
    try {
      const fileName = path.basename(filePath)
      const fileNameWithoutExt = path.parse(fileName).name
      const folderName = path.basename(path.dirname(filePath))

      if (!icons[folderName]) {
        icons[folderName] = []
      }
      icons[folderName].push(`i-${folderName}:${fileNameWithoutExt}`)
    } catch (error) {
      console.warn(`Failed to process icon file: ${filePath}`, error)
    }
  })

  return icons
}

/**
 * 递归获取SVG文件
 * 优化：添加性能优化和错误处理
 */
function getSvgFiles(dir: string): string[] {
  const files: string[] = []

  if (!fs.existsSync(dir)) {
    return files
  }

  function traverse(currentPath: string) {
    try {
      const items = fs.readdirSync(currentPath, { withFileTypes: true })

      items.forEach(item => {
        const fullPath = path.join(currentPath, item.name)

        if (item.isDirectory()) {
          traverse(fullPath)
        } else if (item.isFile() && item.name.endsWith('.svg')) {
          files.push(fullPath)
        }
      })
    } catch (error) {
      console.warn(`Failed to read directory: ${currentPath}`, error)
    }
  }

  traverse(dir)
  return files
}

/**
 * 获取TypeScript文件中的图标引用
 * 优化：使用更高效的正则表达式和缓存
 */
function getRouteMetaIcons(): string[] {
  const icons = new Set<string>()
  const files = getTsFiles('src/router/routes')

  // 优化的正则表达式
  const iconPatterns = [
    /meta\s*:\s*\{[^}]*icon\s*:\s*['"]([^'"]+)['"]/g,
    /meta\.icon\s*=\s*['"]([^'"]+)['"]/g,
    /icon\s*:\s*['"]([^'"]+)['"]/g,
  ]

  files.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')

      iconPatterns.forEach(pattern => {
        let match
        while ((match = pattern.exec(content))) {
          icons.add(match[1])
        }
      })
    } catch (error) {
      console.warn(`Failed to read file: ${filePath}`, error)
    }
  })

  return Array.from(icons)
}

/**
 * 获取TypeScript文件列表
 */
function getTsFiles(dir: string): string[] {
  const files: string[] = []

  if (!fs.existsSync(dir)) {
    return files
  }

  function traverse(currentPath: string) {
    try {
      const items = fs.readdirSync(currentPath, { withFileTypes: true })

      items.forEach(item => {
        const fullPath = path.join(currentPath, item.name)

        if (item.isDirectory()) {
          traverse(fullPath)
        } else if (item.isFile() && item.name.endsWith('.ts')) {
          files.push(fullPath)
        }
      })
    } catch (error) {
      console.warn(`Failed to read directory: ${currentPath}`, error)
    }
  }

  traverse(dir)
  return files
}

/**
 * 创建通用的像素值规则生成器
 * 优化：减少代码重复，提高性能
 *
 * 注意：这些规则生成的像素值会被 postcss-pxtorem 处理
 * 除非在 selectorBlackList 中被排除
 */
function createPixelRules() {
  const properties = [
    // 尺寸相关 - 会被转换为 rem（适合内容相关尺寸）
    ['w', 'width'],
    ['h', 'height'],
    ['min-w', 'min-width'],
    ['min-h', 'min-height'],
    ['max-w', 'max-width'],
    ['max-h', 'max-height'],

    // 字体相关 - 会被转换为 rem（适合响应式文本）
    ['fs', 'font-size'],
    ['lh', 'line-height'],

    // 内边距 - 会被转换为 rem（适合响应式间距）
    ['p', 'padding'],
    ['pt', 'padding-top'],
    ['pr', 'padding-right'],
    ['pb', 'padding-bottom'],
    ['pl', 'padding-left'],

    // 外边距 - 会被转换为 rem（适合响应式间距）
    ['m', 'margin'],
    ['mt', 'margin-top'],
    ['mr', 'margin-right'],
    ['mb', 'margin-bottom'],
    ['ml', 'margin-left'],

    // 位置 - 保持像素值（通过黑名单排除转换）
    ['t', 'top'],
    ['r', 'right'],
    ['b', 'bottom'],
    ['l', 'left'],

    // 间距 - 会被转换为 rem（适合响应式布局）
    ['gap', 'gap'],

    // 边框 - 通过 propList 排除，保持像素值
    ['borderw', 'border-width'],
    ['rounded', 'border-radius'],
  ] as const

  const combinedProperties = [
    ['px', ['padding-left', 'padding-right']],
    ['py', ['padding-top', 'padding-bottom']],
    ['mx', ['margin-left', 'margin-right']],
    ['my', ['margin-top', 'margin-bottom']],
    ['gapx', ['gap-x']],
    ['gapy', ['gap-y']],
  ] as const

  const rules: any[] = []

  // 基础属性规则
  properties.forEach(([prefix, property]) => {
    rules.push([new RegExp(`^${prefix}-(\\d+)$`), ([, d]: string[]) => ({ [property]: `${d}px` })])
  })

  // 组合属性规则
  combinedProperties.forEach(([prefix, properties]) => {
    rules.push([
      new RegExp(`^${prefix}-(\\d+)$`),
      ([, d]: string[]) => Object.fromEntries(properties.map(prop => [prop, `${d}px`])),
    ])
  })

  return rules
}

/**
 * 创建主题变量映射规则
 * 优化：支持动态主题变量
 *
 * 注意：CSS 变量不会被 postcss-pxtorem 处理，
 * 这些规则与 rem 适配系统完美兼容
 */
function createThemeVariableRules() {
  const properties = [
    ['w', 'width'],
    ['h', 'height'],
    ['p', 'padding'],
    ['pt', 'padding-top'],
    ['pr', 'padding-right'],
    ['pb', 'padding-bottom'],
    ['pl', 'padding-left'],
    ['px', ['padding-left', 'padding-right']],
    ['py', ['padding-top', 'padding-bottom']],
    ['m', 'margin'],
    ['mt', 'margin-top'],
    ['mr', 'margin-right'],
    ['mb', 'margin-bottom'],
    ['ml', 'margin-left'],
    ['mx', ['margin-left', 'margin-right']],
    ['my', ['margin-top', 'margin-bottom']],
    ['t', 'top'],
    ['r', 'right'],
    ['b', 'bottom'],
    ['l', 'left'],
    ['gap', 'gap'],
    ['gapx', 'gap-x'],
    ['gapy', 'gap-y'],
    ['borderw', 'border-width'],
    ['rounded', 'border-radius'],
  ] as const

  return properties.map(([prefix, cssProperty]) => [
    new RegExp(`^${prefix}-(\\w+)$`),
    ([, name]: string[], { theme }: { theme: any }) => {
      if (theme.sizes && theme.sizes[name]) {
        if (Array.isArray(cssProperty)) {
          return Object.fromEntries(cssProperty.map(prop => [prop as string, theme.sizes[name]]))
        }
        return { [cssProperty as string]: theme.sizes[name] }
      }
    },
  ])
}

// 获取图标和主题配置
const customIcons = getCustomIcons()
const routeMetaIcons = getRouteMetaIcons()

// 生成自定义图标加载器
const customCollections = Object.fromEntries(
  Object.keys(customIcons).map(folderName => [
    folderName,
    FileSystemIconLoader(`src/assets/icons/${folderName}`),
  ])
)

// 主题配置
const themeConfig: ThemeConfig = {
  breakpoints: {
    xs: '375px',
    sm: '768px',
    md: '1024px',
    lg: '1400px',
    xl: '1660px',
    xls: '1920px',
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

export default defineConfig({
  // 内容扫描配置 - 优化性能
  content: {
    pipeline: {
      include: [
        /\.(vue|js|ts|jsx|tsx|md|mdx|html)($|\?)/,
        // 包含样式文件以支持 @apply 指令
        /\.(css|scss|sass|less|styl|stylus)($|\?)/,
      ],
      exclude: ['node_modules', 'dist', '.git', '.nuxt', '.next', '.vercel', '.netlify'],
    },
  },

  // 预设配置
  presets: [
    presetUno({
      // 启用深色模式支持
      dark: 'class',
      // 启用所有变体
      variablePrefix: '--un-',
    }),
    presetIcons({
      // 开发时警告未找到的图标
      warn: process.env.NODE_ENV === 'development',
      // 图标属性
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
        'flex-shrink': '0',
      },
      // 自定义图标集合
      collections: {
        ...customCollections,
      },
    }),
    presetAttributify({
      // 属性化前缀
      prefix: 'un-',
      prefixedOnly: false,
    }),
    presetTypography({
      // 排版样式配置
      cssExtend: {
        code: {
          color: 'var(--theme-color)',
        },
        blockquote: {
          'border-left-color': 'var(--theme-color)',
        },
      },
    }),
  ],

  // 安全列表 - 优化性能，只包含必要的类
  safelist: [
    // 功能色相关
    'text-primary',
    'text-success',
    'text-warning',
    'text-error',
    'text-info',
    'bg-primary',
    'bg-success',
    'bg-warning',
    'bg-error',
    'bg-info',
    'border-primary',
    'border-success',
    'border-warning',
    'border-error',
    'border-info',

    // 主题相关
    'text-theme',
    'bg-theme',
    'border-theme',
    'text-themeTextColor',
    'bg-themeTextColor',

    // 文字和背景
    'text-textColor',
    'text-textMutedColor',
    'bg-backgroundColor',
    'bg-backgroundHighlightColor',

    // 动态图标类
    ...Object.values(customIcons).flat(),
    ...routeMetaIcons,
  ],

  // 变换器
  transformers: [
    // 支持 @apply、@screen 和 theme() 指令
    transformerDirectives({
      // 强制转换未知的CSS指令
      enforce: 'pre',
    }),
    // 支持变体组语法，如 hover:(bg-red-400 text-white)
    transformerVariantGroup(),
  ],

  // 自定义变体
  variants: [
    // 深色模式变体
    matcher => {
      if (!matcher.startsWith('dark:')) {
        return matcher
      }
      return {
        matcher: matcher.slice(5),
        selector: s => `.dark ${s}`,
      }
    },

    // 悬停变体
    matcher => {
      if (!matcher.startsWith('hover:')) {
        return matcher
      }
      return {
        matcher: matcher.slice(6),
        selector: s => `${s}:hover`,
      }
    },

    // 焦点变体
    matcher => {
      if (!matcher.startsWith('focus:')) {
        return matcher
      }
      return {
        matcher: matcher.slice(6),
        selector: s => `${s}:focus`,
      }
    },

    // 激活变体
    matcher => {
      if (!matcher.startsWith('active:')) {
        return matcher
      }
      return {
        matcher: matcher.slice(7),
        selector: s => `${s}:active`,
      }
    },

    // 组悬停变体
    matcher => {
      if (!matcher.startsWith('group-hover:')) {
        return matcher
      }
      return {
        matcher: matcher.slice(12),
        selector: s => `.group:hover ${s}`,
      }
    },

    // 同级变体
    matcher => {
      if (!matcher.startsWith('peer-focus:')) {
        return matcher
      }
      return {
        matcher: matcher.slice(11),
        selector: s => `.peer:focus ~ ${s}`,
      }
    },
  ],

  // 快捷方式配置
  shortcuts: [
    {
      // 基础边框
      border: 'border-1 border-solid border-bg300',
      'border-primary': 'border-1 border-solid border-primaryColor',
      'border-success': 'border-1 border-solid border-successColor',
      'border-warning': 'border-1 border-solid border-warningColor',
      'border-error': 'border-1 border-solid border-errorColor',
      'border-info': 'border-1 border-solid border-infoColor',

      // 圆角
      rounded: 'rounded-rounded',
    },

    // 布局快捷方式
    {
      // 基础布局
      full: 'w-full h-full',
      container: 'w-full h-full bg-bg100 color-text100',
      screen: 'min-h-screen',

      // Flex 布局
      center: 'flex items-center justify-center',
      between: 'flex items-center justify-between',
      around: 'flex items-center justify-around',
      start: 'flex items-center justify-start',
      end: 'flex items-center justify-end',
      'center-col': 'flex flex-col items-center justify-center',
      'between-col': 'flex flex-col justify-between',
      'evenly-col': 'flex flex-col justify-evenly',
      'around-col': 'flex flex-col justify-around',
      'start-col': 'flex flex-col justify-start',
      'end-col': 'flex flex-col justify-end',

      // Grid 布局
      'grid-center': 'grid place-items-center',
    },

    // 文本快捷方式
    {
      // 文本省略
      'text-ellipsis': 'truncate overflow-hidden whitespace-nowrap',
      'text-ellipsis-2': 'line-clamp-2',
      'text-ellipsis-3': 'line-clamp-3',
      // 多行文本省略
      'text-clamp-1': 'line-clamp-1',
      'text-clamp-2': 'line-clamp-2',
      'text-clamp-3': 'line-clamp-3',
      'text-clamp-4': 'line-clamp-4',
      'text-clamp-5': 'line-clamp-5',
      'text-clamp-6': 'line-clamp-6',

      // 文本样式 - 使用新的文本色系统
      'text-title': 'text-xl font-bold text-text100',
      'text-subtitle': 'text-lg font-medium text-text100',
      'text-body': 'text-base text-text100',
      'text-caption': 'text-sm text-text200',
      'text-muted': 'text-sm text-text200',
    },

    // 按钮快捷方式 - 使用完整的功能色系统
    {
      // 基础按钮样式
      btn: 'inline-flex center px-gap py-gaps mx-gaps rounded transition-slow focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer',

      // 默认按钮
      'btn-default':
        'btn bg-bg200 text-text100 border border-bg300 hover:bg-bg300 focus:ring-primary100',

      // 功能色按钮 - 主要
      'btn-primary':
        'btn bg-primaryColor color-primaryLightColor hover:bg-primaryHoverColor focus:ring-primaryColor active:bg-primaryActiveColor disabled:bg-primaryDisabledColor',
      'btn-success':
        'btn bg-successColor color-successLightColor hover:bg-successHoverColor focus:ring-successColor active:bg-successActiveColor disabled:bg-successDisabledColor',
      'btn-warning':
        'btn bg-warningColor color-warningLightColor hover:bg-warningHoverColor focus:ring-warningColor active:bg-warningActiveColor disabled:bg-warningDisabledColor',
      'btn-error':
        'btn bg-errorColor color-errorLightColor hover:bg-errorHoverColor focus:ring-errorColor active:bg-errorActiveColor disabled:bg-errorDisabledColor',
      'btn-info':
        'btn bg-infoColor color-infoLightColor hover:bg-infoHoverColor focus:ring-infoColor active:bg-infoActiveColor disabled:bg-infoDisabledColor',

      // 轮廓按钮
      'btn-outline-primary':
        'btn border border-primaryColor text-primaryColor bg-transparent hover:bg-primaryLightColor focus:ring-primaryColor',
      'btn-outline-success':
        'btn border border-successColor text-successColor bg-transparent hover:bg-successLightColor focus:ring-successColor',
      'btn-outline-warning':
        'btn border border-warningColor text-warningColor bg-transparent hover:bg-warningLightColor focus:ring-warningColor',
      'btn-outline-error':
        'btn border border-errorColor text-errorColor bg-transparent hover:bg-errorLightColor focus:ring-errorColor',
      'btn-outline-info':
        'btn border border-infoColor text-infoColor bg-transparent hover:bg-infoLightColor focus:ring-infoColor',
    },

    // 卡片快捷方式
    {
      // 基础卡片
      card: 'bg-bg200 border border-bg300 rounded p-gap hover:border-primary300 transition-slow',
      'card-hover': 'card hover:shadow-xl hover:border-bg200',
      'card-active': 'card border-primary200 shadow-lg shadow-primary300/30',

      // 特殊卡片
      'card-primary': 'bg-primary300 border border-primary200 rounded p-gap text-text100',
      'card-accent': 'bg-accent100/10 border border-accent100/30 rounded p-gap text-text100',
    },

    // 输入框快捷方式
    {
      // 基础输入框
      'input-base':
        'w-full px-gap py-gaps border border-bg300 rounded bg-bg100 text-text100 placeholder:text-text200 focus:outline-none focus:ring-2 focus:ring-primary200 focus:border-primary100 transition-slow',
    },

    // 过渡快捷方式
    {
      // 过渡效果
      'transition-fast': 'transition-all duration-200 ease-in-out',
      'transition-slow': 'transition-all duration-300 ease-in-out',
      'transition-slower': 'transition-all duration-500 ease-in-out',
      'transition-slowest': 'transition-all duration-1000 ease-in-out',
    },

    // 状态快捷方式
    {
      // 禁用状态
      disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
      // 加载状态
      loading: 'opacity-75 cursor-wait',
      // 活跃状态
      active: 'ring-2 ring-primaryColor ring-offset-2',
    },
  ],

  // 自定义规则
  rules: [
    // 多行文本省略规则
    [
      /^line-clamp-(\d+)$/,
      ([, num]) => ({
        overflow: 'hidden',
        display: '-webkit-box',
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': num,
        'line-clamp': num,
      }),
    ],

    // 安全区域规则 - 适配移动端
    ['safe-top', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['safe-bottom', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
    ['safe-left', { 'padding-left': 'env(safe-area-inset-left)' }],
    ['safe-right', { 'padding-right': 'env(safe-area-inset-right)' }],
    [
      'safe-x',
      {
        'padding-left': 'env(safe-area-inset-left)',
        'padding-right': 'env(safe-area-inset-right)',
      },
    ],
    [
      'safe-y',
      {
        'padding-top': 'env(safe-area-inset-top)',
        'padding-bottom': 'env(safe-area-inset-bottom)',
      },
    ],

    // 像素值规则
    ...createPixelRules(),

    // 主题变量规则
    ...createThemeVariableRules(),

    // 自定义透明度规则
    [
      /^bg-theme-(\d+)$/,
      ([, opacity]) => ({
        'background-color': `rgba(var(--theme-color-rgb), ${Number(opacity) / 100})`,
      }),
    ],

    // 渐变规则
    [
      /^bg-gradient-theme$/,
      () => ({
        'background-image': 'linear-gradient(135deg, var(--theme-color), var(--primary-color))',
      }),
    ],
  ],

  // 主题配置
  theme: themeConfig,

  // 生产环境优化
  ...(process.env.NODE_ENV === 'production' && {
    // 压缩生成的CSS
    minify: true,
    // 移除未使用的CSS
    inspector: false,
  }),

  // 开发环境配置
  ...(process.env.NODE_ENV === 'development' && {
    // 开启检查器
    inspector: true,
    // 开启HMR
    hmr: true,
  }),
})
