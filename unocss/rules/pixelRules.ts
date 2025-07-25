/**
 * 创建通用的像素值规则生成器
 * 优化：减少代码重复，提高性能
 *
 * 注意：这些规则生成的像素值会被 postcss-pxtorem 处理
 * 除非在 selectorBlackList 中被排除
 */
export function createPixelRules() {
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
