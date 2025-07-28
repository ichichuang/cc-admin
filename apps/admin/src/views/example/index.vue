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
 * @description cc-admin 企业级后台管理框架 - 示例页面
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */
</script>
<template>
  <div class="example">
    <div class="example-header">
      <h1>🎯 示例页面</h1>
      <p>展示 cc-admin Monorepo 架构的各种功能</p>
    </div>

    <div class="example-content">
      <div class="demo-section">
        <h2>🔧 功能演示</h2>

        <div class="demo-grid">
          <div class="demo-card">
            <h3>📦 包管理</h3>
            <p>展示 monorepo 中的包结构和依赖关系</p>
            <div class="demo-code">
              <pre><code>packages/
├── core/     # 核心框架包
├── ui/       # UI组件库包
└── types/    # 类型定义包</code></pre>
            </div>
          </div>

          <div class="demo-card">
            <h3>🚀 应用分离</h3>
            <p>展示独立应用的构建和部署</p>
            <div class="demo-code">
              <pre><code>apps/
└── admin/    # 管理后台应用</code></pre>
            </div>
          </div>

          <div class="demo-card">
            <h3>🔄 代码共享</h3>
            <p>展示跨包模块复用和类型共享</p>
            <div class="demo-code">
              <pre><code>import { store, router } from '@cc-admin/core'
import { Loading } from '@cc-admin/ui'</code></pre>
            </div>
          </div>

          <div class="demo-card">
            <h3>🛡️ 类型安全</h3>
            <p>展示完整的 TypeScript 类型支持</p>
            <div class="demo-code">
              <pre><code>import type { UserInfo } from '@cc-admin/types'</code></pre>
            </div>
          </div>
        </div>
      </div>

      <div class="tech-section">
        <h2>⚡ 技术栈</h2>
        <div class="tech-list">
          <div class="tech-item">
            <span class="tech-icon">⚛️</span>
            <span>Vue 3.5+</span>
          </div>
          <div class="tech-item">
            <span class="tech-icon">🔷</span>
            <span>TypeScript 5+</span>
          </div>
          <div class="tech-item">
            <span class="tech-icon">⚡</span>
            <span>Vite 7+</span>
          </div>
          <div class="tech-item">
            <span class="tech-icon">🎨</span>
            <span>UnoCSS</span>
          </div>
          <div class="tech-item">
            <span class="tech-icon">📦</span>
            <span>pnpm Workspace</span>
          </div>
          <div class="tech-item">
            <span class="tech-icon">🗃️</span>
            <span>Pinia</span>
          </div>
        </div>
      </div>

      <div class="commands-section">
        <h2>🖥️ 开发命令</h2>
        <div class="commands-list">
          <div class="command-item">
            <span class="command-label">开发模式:</span>
            <code class="command-code">pnpm dev</code>
          </div>
          <div class="command-item">
            <span class="command-label">构建应用:</span>
            <code class="command-code">pnpm build</code>
          </div>
          <div class="command-item">
            <span class="command-label">类型检查:</span>
            <code class="command-code">pnpm type-check</code>
          </div>
          <div class="command-item">
            <span class="command-label">代码检查:</span>
            <code class="command-code">pnpm lint</code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.example {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.example-header {
  text-align: center;
  margin-bottom: 3rem;
}

.example-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #ffd700;
}

.example-header p {
  font-size: 1.2rem;
  opacity: 0.8;
}

.demo-section,
.tech-section,
.commands-section {
  margin-bottom: 3rem;
}

.demo-section h2,
.tech-section h2,
.commands-section h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #ffd700;
  text-align: center;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.demo-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.demo-card h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #ffd700;
}

.demo-card p {
  margin-bottom: 1rem;
  opacity: 0.9;
}

.demo-code {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.demo-code pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.85rem;
  line-height: 1.4;
}

.demo-code code {
  color: #10b981;
}

.tech-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  backdrop-filter: blur(10px);
}

.tech-icon {
  font-size: 1.5rem;
}

.commands-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.command-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  backdrop-filter: blur(10px);
}

.command-label {
  font-weight: 500;
}

.command-code {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  color: #10b981;
}

@media (max-width: 768px) {
  .example {
    padding: 1rem;
  }

  .example-header h1 {
    font-size: 2rem;
  }

  .demo-grid {
    grid-template-columns: 1fr;
  }

  .tech-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .commands-list {
    grid-template-columns: 1fr;
  }

  .command-item {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
