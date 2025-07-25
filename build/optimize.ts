/**
 * 依赖预构建配置
 * Vite 启动时会将下面 include 里的模块编译成 ESM 格式并缓存到 node_modules/.vite 文件夹
 * 页面加载对应模块时如果浏览器有缓存就读取浏览器缓存，否则读取本地缓存并按需加载
 */
export const include = [
  'vue',
  'vue-router',
  'pinia',
  'alova',
  'dayjs',
  'crypto-js',
  'lodash-es',
  'mockjs',
]

/**
 * 在预构建中强制排除的依赖项
 * 这些依赖项应该在运行时按需加载
 */
export const exclude = ['@iconify/json', 'vite-plugin-compression', 'rollup-plugin-visualizer']
