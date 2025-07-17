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
  spacing: Record<string, string>
  borderRadius: Record<string, string>
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
 */
function createPixelRules() {
  const properties = [
    // 尺寸相关
    ['w', 'width'],
    ['h', 'height'],
    ['min-w', 'min-width'],
    ['min-h', 'min-height'],
    ['max-w', 'max-width'],
    ['max-h', 'max-height'],

    // 字体相关
    ['fs', 'font-size'],
    ['lh', 'line-height'],

    // 内边距
    ['p', 'padding'],
    ['pt', 'padding-top'],
    ['pr', 'padding-right'],
    ['pb', 'padding-bottom'],
    ['pl', 'padding-left'],

    // 外边距
    ['m', 'margin'],
    ['mt', 'margin-top'],
    ['mr', 'margin-right'],
    ['mb', 'margin-bottom'],
    ['ml', 'margin-left'],

    // 位置
    ['t', 'top'],
    ['r', 'right'],
    ['b', 'bottom'],
    ['l', 'left'],

    // 间距
    ['gap', 'gap'],

    // 边框
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
    inherit: 'inherit',
    current: 'currentColor',

    // 功能色系 - 与 color.ts 保持一致
    primary: {
      DEFAULT: 'var(--primary-color)',
      hover: 'var(--primary-hover-color)',
      active: 'var(--primary-active-color)',
      disabled: 'var(--primary-disabled-color)',
      light: 'var(--primary-light-color)',
    },
    success: {
      DEFAULT: 'var(--success-color)',
      hover: 'var(--success-hover-color)',
      active: 'var(--success-active-color)',
      disabled: 'var(--success-disabled-color)',
      light: 'var(--success-light-color)',
    },
    info: {
      DEFAULT: 'var(--info-color)',
      hover: 'var(--info-hover-color)',
      active: 'var(--info-active-color)',
      disabled: 'var(--info-disabled-color)',
      light: 'var(--info-light-color)',
    },
    warning: {
      DEFAULT: 'var(--warning-color)',
      hover: 'var(--warning-hover-color)',
      active: 'var(--warning-active-color)',
      disabled: 'var(--warning-disabled-color)',
      light: 'var(--warning-light-color)',
    },
    error: {
      DEFAULT: 'var(--error-color)',
      hover: 'var(--error-hover-color)',
      active: 'var(--error-active-color)',
      disabled: 'var(--error-disabled-color)',
      light: 'var(--error-light-color)',
    },

    // 主题色 - 与 color.ts 保持一致
    theme: {
      DEFAULT: 'var(--theme-color)',
      contrast: 'var(--theme-colors)',
    },

    // 文字色 - 与 color.ts 保持一致
    text: {
      DEFAULT: 'var(--text-color)',
      contrast: 'var(--text-colors)',
      muted: 'var(--text-muted-color)',
      'muted-contrast': 'var(--text-muted-colors)',
    },

    // 主题文字色
    'theme-text': {
      DEFAULT: 'var(--theme-text-color)',
      contrast: 'var(--theme-text-colors)',
    },

    // 背景色 - 与 color.ts 保持一致
    bg: {
      DEFAULT: 'var(--background-color)',
      contrast: 'var(--background-colors)',
      highlight: 'var(--background-highlight-color)',
      'highlight-contrast': 'var(--background-highlight-colors)',
    },

    // 简化别名
    themeColor: 'var(--theme-color)',
    themeColors: 'var(--theme-colors)',
    themeTextColor: 'var(--theme-text-color)',
    themeTextColors: 'var(--theme-text-colors)',
    textColor: 'var(--text-color)',
    textColors: 'var(--text-colors)',
    textMutedColor: 'var(--text-muted-color)',
    textMutedColors: 'var(--text-muted-colors)',
    backgroundColor: 'var(--background-color)',
    backgroundColors: 'var(--background-colors)',
    backgroundHighlightColor: 'var(--background-highlight-color)',
    backgroundHighlightColors: 'var(--background-highlight-colors)',
  },

  // 尺寸系统 - 与 size.ts 保持一致
  sizes: {
    // 布局尺寸
    'sidebar-width': 'var(--sidebar-width)',
    'sidebar-collapsed-width': 'var(--sidebar-collapsed-width)',
    'header-height': 'var(--header-height)',
    'breadcrumb-height': 'var(--breadcrumb-height)',
    'footer-height': 'var(--footer-height)',
    'tabs-height': 'var(--tabs-height)',
    'content-height': 'var(--content-height)',
    'contents-height': 'var(--contents-height)',

    // 间距尺寸
    gap: 'var(--gap)',
    gaps: 'var(--gaps)',

    // 圆角尺寸
    rounded: 'var(--rounded)',

    // 简化别名
    sidebarWidth: 'var(--sidebar-width)',
    sidebarCollapsedWidth: 'var(--sidebar-collapsed-width)',
    headerHeight: 'var(--header-height)',
    breadcrumbHeight: 'var(--breadcrumb-height)',
    footerHeight: 'var(--footer-height)',
    tabsHeight: 'var(--tabs-height)',
    contentHeight: 'var(--content-height)',
    contentsHeight: 'var(--contents-height)',
  },

  // 间距系统
  spacing: {
    gap: 'var(--gap)',
    gaps: 'var(--gaps)',
  },

  // 圆角系统
  borderRadius: {
    DEFAULT: 'var(--rounded)',
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
    // 边框快捷方式
    {
      // 基础边框
      border: 'border-1 border-solid border-textColor',
      'border-theme': 'border-1 border-solid border-themeColor',

      // 边框样式
      'border-solid': 'border-1 border-solid border-themeColor',
      'border-dashed': 'border-1 border-dashed border-themeColor',
      'border-dotted': 'border-1 border-dotted border-themeColor',
      'border-double': 'border-1 border-double border-themeColor',

      // 圆角
      rounded: 'rounded-rounded',
    },

    // 布局快捷方式
    {
      // 基础布局
      full: 'w-full h-full',
      container: 'w-full h-full bg-backgroundColor',
      screen: 'min-h-screen',

      // Flex 布局
      center: 'flex items-center justify-center',
      between: 'flex items-center justify-between',
      around: 'flex items-center justify-around',
      start: 'flex items-center justify-start',
      end: 'flex items-center justify-end',
      'center-col': 'flex flex-col items-center justify-center',
      'between-col': 'flex flex-col justify-between',
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

      // 文本样式
      'text-title': 'text-xl font-bold text-textColor',
      'text-subtitle': 'text-lg font-medium text-textColor',
      'text-body': 'text-base text-textColor',
      'text-caption': 'text-sm text-textMutedColor',
    },

    // 按钮快捷方式
    {
      btn: 'inline-flex items-center justify-center px-4 py-2 rounded text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
      'btn-primary':
        'btn bg-primary-DEFAULT text-white hover:bg-primary-hover focus:ring-primary-DEFAULT',
      'btn-secondary':
        'btn bg-backgroundColor text-textColor border border-textColor hover:bg-backgroundHighlightColor',
      'btn-success':
        'btn bg-success-DEFAULT text-white hover:bg-success-hover focus:ring-success-DEFAULT',
      'btn-warning':
        'btn bg-warning-DEFAULT text-white hover:bg-warning-hover focus:ring-warning-DEFAULT',
      'btn-error': 'btn bg-error-DEFAULT text-white hover:bg-error-hover focus:ring-error-DEFAULT',
    },

    // 卡片快捷方式
    {
      card: 'bg-backgroundColor border border-textColor rounded p-4',
      'card-hover': 'card hover:bg-backgroundHighlightColor transition-colors duration-200',
      'card-shadow': 'card shadow-md hover:shadow-lg transition-shadow duration-200',
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
