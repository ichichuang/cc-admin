<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description cc-admin 企业级后台管理框架 - 页面组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 仪表板页面
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */
</script>
<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>📊 仪表板</h1>
      <p>欢迎使用 cc-admin 企业级后台管理框架</p>
    </div>

    <div class="dashboard-content">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <h3>包数量</h3>
            <p class="stat-number">4</p>
            <p class="stat-desc">核心包、UI包、类型包、应用包</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🚀</div>
          <div class="stat-info">
            <h3>应用数量</h3>
            <p class="stat-number">1</p>
            <p class="stat-desc">管理后台应用</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🔄</div>
          <div class="stat-info">
            <h3>代码共享</h3>
            <p class="stat-number">100%</p>
            <p class="stat-desc">跨包模块复用</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🛡️</div>
          <div class="stat-info">
            <h3>类型安全</h3>
            <p class="stat-number">100%</p>
            <p class="stat-desc">TypeScript 覆盖</p>
          </div>
        </div>
      </div>

      <div class="features-section">
        <h2>✨ Monorepo 特性</h2>
        <div class="features-list">
          <div class="feature-item">
            <span class="feature-icon">✅</span>
            <span>基于 pnpm Workspace 的现代化架构</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">✅</span>
            <span>多包管理和独立构建</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">✅</span>
            <span>代码共享和类型定义共享</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">✅</span>
            <span>完整的开发工具链</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">✅</span>
            <span>热更新和类型检查</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">✅</span>
            <span>UnoCSS 原子化 CSS</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #ffd700;
}

.dashboard-header p {
  font-size: 1.2rem;
  opacity: 0.8;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.stat-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #ffd700;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 0.25rem 0;
}

.stat-desc {
  font-size: 0.9rem;
  opacity: 0.7;
  margin: 0;
}

.features-section {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.features-section h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #ffd700;
  text-align: center;
}

.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
}

.feature-icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .dashboard-header h1 {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .features-list {
    grid-template-columns: 1fr;
  }
}
</style>
