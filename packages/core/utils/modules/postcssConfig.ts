/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - PostCSS 配置
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * PostCSS 配置接口
 */
export interface PostcssConfig {
  /** 基准字体大小 */
  rootValue?: number
  /** 需要转换的CSS属性 */
  propList?: string[]
  /** 过滤不需要转换的选择器 */
  selectorBlackList?: (string | RegExp)[]
  /** 替换规则 */
  replace?: boolean
  /** 允许在媒体查询中转换px */
  mediaQuery?: boolean
  /** 设置要转换的最小像素值 */
  minPixelValue?: number
  /** 保留单位精度 */
  unitPrecision?: number
  /** 排除文件或文件夹 */
  exclude?: RegExp
}

/**
 * 默认 PostCSS 配置
 */
export const defaultPostcssConfig: Required<PostcssConfig> = {
  rootValue: 16,
  propList: [
    '*',
    // 不转换边框相关，避免出现 0.5px 等问题
    '!border',
    '!border-width',
    '!border-top-width',
    '!border-right-width',
    '!border-bottom-width',
    '!border-left-width',
  ],
  selectorBlackList: [
    // ✅ 排除传统 UnoCSS 工具类（非数字值）
    /^\.w-(full|auto|screen|min|max|fit)/, // w-full, w-auto 等
    /^\.h-(full|auto|screen|min|max|fit)/, // h-full, h-auto 等
    /^\.text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/, // text-sm, text-lg 等
    /^\.p-(auto|px|py)/, // p-auto, px-4 等
    /^\.m-(auto|px|py)/, // m-auto, mx-4 等

    // ✅ 排除其他 UnoCSS 工具类
    /^\.bg-/, // 背景颜色类
    /^\.border-(?![\d])/, // 边框类（排除 border-2 等数字）
    /^\.rounded-(?![\d])/, // 圆角类（排除 rounded-8 等数字）
    /^\.flex/, // 布局类
    /^\.grid/, // 网格类
    /^\.absolute|\.relative|\.fixed|\.sticky/, // 定位类
    /^\.justify-|\.items-|\.content-/, // 对齐类
    /^\.overflow-|\.cursor-|\.select-/, // 其他工具类

    // ✅ 排除响应式前缀
    /^\.([0-9]+|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl):/,

    // ✅ 排除系统类
    /^html$/, // HTML 根元素
    /^:root$/, // CSS 根变量

    // ✅ 排除第三方组件
    /^\.el-/, // Element Plus
    /^\.ant-/, // Ant Design
    /^\.van-/, // Vant

    // ✅ 排除明确标记的类
    /no-rem/, // 明确不转换的类

    // ✅ 排除媒体查询
    /^@media.*\.(xs|sm|md|lg|xl|2xl):/,
  ],
  replace: true,
  mediaQuery: true,
  minPixelValue: 1,
  unitPrecision: 4,
  exclude: /node_modules/i,
}

/**
 * 创建 PostCSS 插件配置
 * @param config 自定义配置
 * @returns PostCSS 插件配置
 */
export function createPostcssConfig(config?: Partial<PostcssConfig>) {
  const _finalConfig = { ...defaultPostcssConfig, ...config }

  return {
    postcssPlugin: 'internal:charset-removal',
    AtRule: {
      charset: (atRule: any) => {
        if (atRule.name === 'charset') {
          atRule.remove()
        }
      },
    },
  }
}

/**
 * 创建 postcss-pxtorem 配置
 * @param config 自定义配置
 * @returns postcss-pxtorem 插件配置
 */
export function createPxtoremConfig(config?: Partial<PostcssConfig>) {
  const finalConfig = { ...defaultPostcssConfig, ...config }

  // 动态导入 postcss-pxtorem
  return async () => {
    try {
      const postcssPxToRem = await import('postcss-pxtorem')
      return postcssPxToRem.default(finalConfig)
    } catch (_error) {
      console.warn('postcss-pxtorem 未安装，跳过 px 转 rem 转换')
      return null
    }
  }
}

/**
 * 获取完整的 PostCSS 配置
 * @param config 自定义配置
 * @returns 完整的 PostCSS 配置
 */
export function getPostcssConfig(config?: Partial<PostcssConfig>) {
  return {
    plugins: [createPostcssConfig(), createPxtoremConfig(config)].filter(Boolean),
  }
}

/**
 * 从环境变量创建 PostCSS 配置
 * @param env 环境变量对象
 * @returns PostCSS 配置
 */
export function createPostcssConfigFromEnv(env: Record<string, any>) {
  const rootValue = Number(env.VITE_POSTCSS_ROOT_VALUE) || 16

  return getPostcssConfig({
    rootValue,
  })
}
