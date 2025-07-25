/**
 * 创建主题变量映射规则
 * 优化：支持动态主题变量
 *
 * 注意：CSS 变量不会被 postcss-pxtorem 处理，
 * 这些规则与 rem 适配系统完美兼容
 */
export function createThemeVariableRules() {
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
