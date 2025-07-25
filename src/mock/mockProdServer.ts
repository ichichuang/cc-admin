/**
 * 生产环境 Mock 服务器设置
 * 用于在生产环境中提供 Mock 数据服务
 * 注意：vite-plugin-mock 在生产环境中的支持有限
 * 建议在生产环境中使用真实的后端 API
 */
export function setupProdMockServer() {
  console.warn('⚠️ 生产环境 Mock 服务：vite-plugin-mock 在生产环境中的支持有限')
  console.warn('💡 建议在生产环境中使用真实的后端 API 或配置代理服务器')

  // 这里可以添加自定义的 Mock 实现
  // 例如使用 Service Worker 或其他方式
}
