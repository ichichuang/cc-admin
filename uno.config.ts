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

function getIcons() {
  const icons: Record<string, string[]> = {}
  const files = getSvgFiles('src/assets/icons')
  files.forEach(filePath => {
    const fileName = path.basename(filePath) // 获取文件名，包括后缀
    const fileNameWithoutExt = path.parse(fileName).name // 获取去除后缀的文件名
    const folderName = path.basename(path.dirname(filePath)) // 获取文件夹名
    if (!icons[folderName]) {
      icons[folderName] = []
    }
    icons[folderName].push(`i-${folderName}:${fileNameWithoutExt}`)
  })
  return icons
}

function getSvgFiles(dir: string): string[] {
  const files: string[] = []
  if (!fs.existsSync(dir)) {
    return files
  }

  function traverse(currentPath: string) {
    const items = fs.readdirSync(currentPath, { withFileTypes: true })
    items.forEach(item => {
      const fullPath = path.join(currentPath, item.name)
      if (item.isDirectory()) {
        traverse(fullPath)
      } else if (item.isFile() && item.name.endsWith('.svg')) {
        files.push(fullPath)
      }
    })
  }

  traverse(dir)
  return files
}

function getTsFiles(dir: string): string[] {
  const files: string[] = []
  if (!fs.existsSync(dir)) {
    return files
  }

  function traverse(currentPath: string) {
    const items = fs.readdirSync(currentPath, { withFileTypes: true })
    items.forEach(item => {
      const fullPath = path.join(currentPath, item.name)
      if (item.isDirectory()) {
        traverse(fullPath)
      } else if (item.isFile() && item.name.endsWith('.ts')) {
        files.push(fullPath)
      }
    })
  }

  traverse(dir)
  return files
}
const icons = getIcons()
const customCollections = Object.fromEntries(
  Object.keys(icons).map(item => [item, FileSystemIconLoader(`src/assets/icons/${item}`)])
)

function getRouteMetaIcons() {
  const icons: string[] = []
  const files = getTsFiles('src/router/routes')

  // 匹配 meta: { icon: 'xxx' } 或 meta: { icon: "xxx" }
  const reg1 = /meta\s*:\s*\{[^}]*icon\s*:\s*['"]([^'"]+)['"]/g
  // 匹配 meta.icon = 'xxx' 或 meta.icon = "xxx"
  const reg2 = /meta\.icon\s*=\s*['"]([^'"]+)['"]/g

  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8')
    let match
    while ((match = reg1.exec(content))) {
      icons.push(match[1])
    }
    while ((match = reg2.exec(content))) {
      icons.push(match[1])
    }
  })

  // 去重
  return Array.from(new Set(icons))
}

const routeMetaIcons = getRouteMetaIcons()
// console.log('icons: ', icons)
// console.log('routeMetaIcons: ', routeMetaIcons)
export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      warn: true,
      prefix: ['i-'],
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
      collections: {
        ...customCollections,
      },
    }),
    presetAttributify(),
    presetTypography(),
  ],
  safelist: [...(Object.values(icons).flat() as string[]), ...routeMetaIcons],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  variants: [
    matcher => {
      if (!matcher.startsWith('hover:')) {
        return matcher
      }
      return {
        matcher: matcher.slice(6),
        selector: s => `${s}:hover`,
      }
    },
  ],
  shortcuts: [
    // 边框快捷方式
    {
      border: 'borderw-1 border-solid border-textColor',
      // 实线边框
      solid: 'borderw-1 border-solid border-themeColor',
      // 虚线边框
      dashed: 'borderw-1 border-dashed border-themeColor',
      // 点线边框
      dotted: 'borderw-1 border-dotted border-themeColor',
      // 双线边框
      double: 'borderw-1 border-double border-themeColor',

      // 圆角
      rounded: 'rounded-rounded',
    },
    // 布局快捷方式
    {
      full: 'w-full h-full',
      container: 'w-full h-full bg-backgroundColor',
      center: 'flex items-center justify-center',
      between: 'flex items-center justify-between',
      around: 'flex items-center justify-around',
      start: 'flex items-center justify-start',
      end: 'flex items-center justify-end',
      'col-center': 'flex flex-col items-center justify-center',
      'col-between': 'flex flex-col justify-between',
      'col-around': 'flex flex-col justify-around',
      'col-start': 'flex flex-col justify-start',
      'col-end': 'flex flex-col justify-end',
    },

    // 文本快捷方式
    {
      // 单行文本省略
      'text-ellipsis': 'truncate overflow-hidden whitespace-nowrap',
      // 多行
      'text-clamp-1': 'line-clamp-1',
      'text-clamp-2': 'line-clamp-2',
      'text-clamp-3': 'line-clamp-3',
      'text-clamp-4': 'line-clamp-4',
      'text-clamp-5': 'line-clamp-5',
      'text-clamp-6': 'line-clamp-6',
      'text-clamp-7': 'line-clamp-7',
      'text-clamp-8': 'line-clamp-8',
      'text-clamp-9': 'line-clamp-9',
    },
  ],
  rules: [
    /* 转换 rem 为 px */
    [/^w-(\d+)$/, ([, d]) => ({ width: `${d}px` })],
    [/^h-(\d+)$/, ([, d]) => ({ height: `${d}px` })],
    [/^fs-(\d+)$/, ([, d]) => ({ 'font-size': `${d}px` })],
    [/^lh-(\d+)$/, ([, d]) => ({ 'line-height': `${d}px` })],

    [/^p-(\d+)$/, ([, d]) => ({ padding: `${d}px` })],
    [/^pt-(\d+)$/, ([, d]) => ({ 'padding-top': `${d}px` })],
    [/^pr-(\d+)$/, ([, d]) => ({ 'padding-right': `${d}px` })],
    [/^pb-(\d+)$/, ([, d]) => ({ 'padding-bottom': `${d}px` })],
    [/^pl-(\d+)$/, ([, d]) => ({ 'padding-left': `${d}px` })],
    [/^px-(\d+)$/, ([, d]) => ({ 'padding-left': `${d}px`, 'padding-right': `${d}px` })],
    [/^py-(\d+)$/, ([, d]) => ({ 'padding-top': `${d}px`, 'padding-bottom': `${d}px` })],

    [/^m-(\d+)$/, ([, d]) => ({ margin: `${d}px` })],
    [/^mt-(\d+)$/, ([, d]) => ({ 'margin-top': `${d}px` })],
    [/^mr-(\d+)$/, ([, d]) => ({ 'margin-right': `${d}px` })],
    [/^mb-(\d+)$/, ([, d]) => ({ 'margin-bottom': `${d}px` })],
    [/^ml-(\d+)$/, ([, d]) => ({ 'margin-left': `${d}px` })],
    [/^mx-(\d+)$/, ([, d]) => ({ 'margin-left': `${d}px`, 'margin-right': `${d}px` })],
    [/^my-(\d+)$/, ([, d]) => ({ 'margin-top': `${d}px`, 'margin-bottom': `${d}px` })],

    [/^t-(\d+)$/, ([, d]) => ({ top: `${d}px` })],
    [/^r-(\d+)$/, ([, d]) => ({ right: `${d}px` })],
    [/^b-(\d+)$/, ([, d]) => ({ bottom: `${d}px` })],
    [/^l-(\d+)$/, ([, d]) => ({ left: `${d}px` })],

    [/^gap-(\d+)$/, ([, d]) => ({ gap: `${d}px` })],
    [/^gapx-(\d+)$/, ([, d]) => ({ 'gap-x': `${d}px` })],
    [/^gapy-(\d+)$/, ([, d]) => ({ 'gap-y': `${d}px` })],

    // border
    [/^borderw-(\d+)$/, ([, d]) => ({ 'border-width': `${d}px` })],
    [/^rounded-(\d+)$/, ([, d]) => ({ 'border-radius': `${d}px` })],

    /* 映射 size 变量 */
    // width height
    [
      /^w-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { width: theme.sizes[name] }
        }
      },
    ],
    [
      /^h-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { height: theme.sizes[name] }
        }
      },
    ],
    // padding padding-top padding-right padding-bottom padding-left px py
    [
      /^p-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { padding: theme.sizes[name] }
        }
      },
    ],
    [
      /^pt-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { 'padding-top': theme.sizes[name] }
        }
      },
    ],
    [
      /^pr-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { 'padding-right': theme.sizes[name] }
        }
      },
    ],
    [
      /^pb-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { 'padding-bottom': theme.sizes[name] }
        }
      },
    ],
    [
      /^pl-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { 'padding-left': theme.sizes[name] }
        }
      },
    ],
    [
      /^px-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { 'padding-left': theme.sizes[name], 'padding-right': theme.sizes[name] }
        }
      },
    ],
    [
      /^py-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { 'padding-top': theme.sizes[name], 'padding-bottom': theme.sizes[name] }
        }
      },
    ],
    // margin margin-top margin-right margin-bottom margin-left mx my
    [
      /^m-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { margin: theme.sizes[name] }
        }
      },
    ],
    [
      /^mt-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { 'margin-top': theme.sizes[name] }
        }
      },
    ],
    [
      /^mr-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { 'margin-right': theme.sizes[name] }
        }
      },
    ],
    [
      /^mb-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { 'margin-bottom': theme.sizes[name] }
        }
      },
    ],
    [
      /^ml-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { 'margin-left': theme.sizes[name] }
        }
      },
    ],
    [
      /^mx-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { 'margin-left': theme.sizes[name], 'margin-right': theme.sizes[name] }
        }
      },
    ],
    [
      /^my-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { 'margin-top': theme.sizes[name], 'margin-bottom': theme.sizes[name] }
        }
      },
    ],
    // 位置 top right bottom left
    [
      /^t-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { top: theme.sizes[name] }
        }
      },
    ],
    [
      /^r-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { right: theme.sizes[name] }
        }
      },
    ],
    [
      /^b-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { bottom: theme.sizes[name] }
        }
      },
    ],
    [
      /^l-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { left: theme.sizes[name] }
        }
      },
    ],
    // 间距 gap gap-x gap-y
    [
      /^gap-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { gap: theme.sizes[name] }
        }
      },
    ],
    [
      /^gapx-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { 'gap-x': theme.sizes[name] }
        }
      },
    ],
    [
      /^gapy-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { 'gap-y': theme.sizes[name] }
        }
      },
    ],
    // 边框宽度 border-width
    [
      /^borderw-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { 'border-width': theme.sizes[name] }
        }
      },
    ],
    // 圆角 border-radius
    [
      /^rounded-(\w+)$/,
      ([, name], { theme }: { theme: any }) => {
        if (theme.sizes && theme.sizes[name]) {
          return { 'border-radius': theme.sizes[name] }
        }
      },
    ],
  ],
  theme: {
    breakpoints: {
      xs: '375px',
      sm: '768px',
      md: '1024px',
      lg: '1400px',
      xl: '1660px',
    },
    colors: {
      tm: 'transparent',

      /* color */
      primary: {
        color: 'var(--primary-color)',
        hover: 'var(--primary-hover-color)',
        active: 'var(--primary-active-color)',
        disabled: 'var(--primary-disabled-color)',
        light: 'var(--primary-light-color)',
      },
      success: {
        color: 'var(--success-color)',
        hover: 'var(--success-hover-color)',
        active: 'var(--success-active-color)',
        disabled: 'var(--success-disabled-color)',
        light: 'var(--success-light-color)',
      },
      info: {
        color: 'var(--info-color)',
        hover: 'var(--info-hover-color)',
        active: 'var(--info-active-color)',
        disabled: 'var(--info-disabled-color)',
        light: 'var(--info-light-color)',
      },
      warning: {
        color: 'var(--warning-color)',
        hover: 'var(--warning-hover-color)',
        active: 'var(--warning-active-color)',
        disabled: 'var(--warning-disabled-color)',
        light: 'var(--warning-light-color)',
      },
      error: {
        color: 'var(--error-color)',
        hover: 'var(--error-hover-color)',
        active: 'var(--error-active-color)',
        disabled: 'var(--error-disabled-color)',
        light: 'var(--error-light-color)',
      },

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

    /* size */
    sizes: {
      sidebarWidth: 'var(--sidebar-width)',
      sidebarCollapsedWidth: 'var(--sidebar-collapsed-width)',
      headerHeight: 'var(--header-height)',
      breadcrumbHeight: 'var(--breadcrumb-height)',
      footerHeight: 'var(--footer-height)',
      tabsHeight: 'var(--tabs-height)',

      gap: 'var(--gap)',
      gaps: 'var(--gaps)',

      rounded: 'var(--rounded)',
    },
  },
})
