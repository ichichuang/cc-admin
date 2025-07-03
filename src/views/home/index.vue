<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const startBuilding = () => {
  console.log('🛠️ 开始构建你的应用...')
  // 这里可以跳转到第一个功能页面
}

const viewDocs = () => {
  console.log('📚 查看项目文档...')
  // 这里可以打开文档页面
}

// 🆕 错误页面测试方法
const testNotFound = () => {
  router.push('/404')
}

const testForbidden = () => {
  router.push('/403')
}

const testServerError = () => {
  router.push('/500')
}

const testInvalidRoute = () => {
  // 跳转到一个不存在的路由，应该被重定向到404页面
  router.push('/this-route-does-not-exist')
}
</script>

<template>
  <div class="home-page">
    <div class="welcome-container">
      <h1>🎉 欢迎使用 CC-Admin</h1>
      <p>企业级后台管理框架</p>
      <div class="features">
        <div class="feature-card">
          <h3>🚀 现代技术栈</h3>
          <p>Vue3.5+ • TypeScript5+ • Vite7+ • UnoCSS</p>
        </div>
        <div class="feature-card">
          <h3>🎨 动态主题</h3>
          <p>支持深色/浅色模式，动态主题颜色变量</p>
        </div>
        <div class="feature-card">
          <h3>📐 智能布局</h3>
          <p>响应式设计，多种布局模式支持</p>
        </div>
        <div class="feature-card">
          <h3>⚡ 极致性能</h3>
          <p>自动化模块导入，构建性能优化</p>
        </div>
      </div>
      <div class="quick-actions">
        <button class="action-btn primary" @click="startBuilding">
          🛠️ 开始构建
        </button>
        <button class="action-btn secondary" @click="viewDocs">
          📚 查看文档
        </button>
      </div>

      <!-- 🆕 错误页面测试区域 -->
      <div class="error-test-section">
        <h3>🧪 错误页面测试</h3>
        <p>点击下面的按钮测试不同的错误页面</p>
        <div class="error-test-buttons">
          <button class="error-test-btn not-found" @click="testNotFound">
            🚫 测试 404 页面
          </button>
          <button class="error-test-btn forbidden" @click="testForbidden">
            🔒 测试 403 页面
          </button>
          <button class="error-test-btn server-error" @click="testServerError">
            ⚠️ 测试 500 页面
          </button>
          <button class="error-test-btn invalid-route" @click="testInvalidRoute">
            ❓ 测试不存在路由
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--theme-active-background-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--gap-xl);
}

.welcome-container {
  max-width: 800px;
  text-align: center;
  color: var(--theme-active-text-color);
}

.welcome-container h1 {
  font-size: 3rem;
  margin: 0 0 var(--gap-md) 0;
  color: var(--theme-active-primary-color);
  font-weight: 700;
}

.welcome-container>p {
  font-size: 1.2rem;
  color: var(--theme-active-text-muted-color);
  margin: 0 0 var(--gap-xl) 0;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--gap-lg);
  margin-bottom: var(--gap-xl);
}

.feature-card {
  background: var(--theme-active-background-highlight-color);
  border: 2px solid var(--theme-active-primary-color);
  border-radius: var(--radius-lg);
  padding: var(--gap-lg);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px var(--theme-active-primary-color);
  border-color: var(--theme-active-primary-hover);
}

.feature-card h3 {
  font-size: 1.1rem;
  margin: 0 0 var(--gap-sm) 0;
  color: var(--theme-active-primary-color);
}

.feature-card p {
  font-size: 0.9rem;
  color: var(--theme-active-text-muted-color);
  margin: 0;
  line-height: 1.5;
}

.quick-actions {
  display: flex;
  gap: var(--gap-md);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--gap-xl);
}

.action-btn {
  padding: var(--gap-md) var(--gap-lg);
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

.action-btn.primary {
  background: var(--theme-active-primary-color);
  color: var(--theme-active-background-color);
}

.action-btn.primary:hover {
  background: var(--theme-active-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px var(--theme-active-primary-color);
}

.action-btn.secondary {
  background: var(--theme-active-background-highlight-color);
  color: var(--theme-active-text-color);
  border: 2px solid var(--theme-active-primary-color);
}

.action-btn.secondary:hover {
  background: var(--theme-active-primary-color);
  color: var(--theme-active-background-color);
  transform: translateY(-2px);
}

/* 🆕 错误页面测试区域样式 */
.error-test-section {
  background: var(--theme-active-background-highlight-color);
  border: 2px solid var(--theme-active-info-color);
  border-radius: var(--radius-lg);
  padding: var(--gap-lg);
  margin-top: var(--gap-xl);
}

.error-test-section h3 {
  margin: 0 0 var(--gap-sm) 0;
  color: var(--theme-active-info-color);
  font-size: 1.3rem;
}

.error-test-section p {
  margin: 0 0 var(--gap-lg) 0;
  color: var(--theme-active-text-muted-color);
}

.error-test-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--gap-md);
}

.error-test-btn {
  padding: var(--gap-sm) var(--gap-md);
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.error-test-btn.not-found {
  background: var(--theme-active-error-color);
}

.error-test-btn.not-found:hover {
  background: var(--theme-active-error-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--theme-active-error-color);
}

.error-test-btn.forbidden {
  background: var(--theme-active-warning-color);
}

.error-test-btn.forbidden:hover {
  background: var(--theme-active-warning-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--theme-active-warning-color);
}

.error-test-btn.server-error {
  background: var(--theme-active-error-color);
}

.error-test-btn.server-error:hover {
  background: var(--theme-active-error-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--theme-active-error-color);
}

.error-test-btn.invalid-route {
  background: var(--theme-active-info-color);
}

.error-test-btn.invalid-route:hover {
  background: var(--theme-active-info-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--theme-active-info-color);
}

@media (max-width: 768px) {
  .welcome-container h1 {
    font-size: 2rem;
  }

  .features {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    flex-direction: column;
    align-items: center;
  }

  .error-test-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
