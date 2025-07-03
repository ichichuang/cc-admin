import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import presetRemToPx from '@unocss/preset-rem-to-px'
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
    presetRemToPx({
      baseFontSize: 4,
    }),
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
  shortcuts: {
    container: 'inset-0 bg-themeBgColor w100% h100%',
    center: 'flex items-center justify-center',
    bet: 'flex items-center justify-between',
    'p-main': 'p$gap',
    'm-main': 'm$gap',
    border: 'border-1 border-solid border-themeColor',
    borders: 'border-1 border-solid border-themeColors',
    round: 'rounded-$round overflow-hidden',
    rounds: 'rounded-4px overflow-hidden',
    gap: 'gap-$gap',
    gapx: 'gap-x-$gap',
    gapy: 'gap-y-$gap',
    fs: 'font-size-$fontSize',
    is: 'font-size-$iconSize',
    cp: 'cursor-pointer',
    cn: 'cursor-not-allowed',
  },
  rules: [
    [/^fs-(\d+)$/, ([, num]) => ({ 'font-size': `${num}px` })],
    [/^lh-(\d+)$/, ([, num]) => ({ 'line-height': `${num}px` })],
    [/^tr-(\d+)$/, ([, num]) => ({ transition: `${Number(num) * 100}ms` })],
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
    },
  },
})
