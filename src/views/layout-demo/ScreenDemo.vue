<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('大屏布局演示页面已加载')
})
</script>

<template>
  <div class="screen-demo">
    <div class="content">
      <h1>大屏布局演示</h1>
      <p>这是一个使用 screen 布局模式的页面</p>
      <p>特点：只有头部和底部，没有侧边栏和面包屑</p>

      <div class="features">
        <div class="feature">
          <h3>✅ 头部导航</h3>
          <p>保留系统标题和基本操作</p>
        </div>

        <div class="feature">
          <h3>✅ 底部信息</h3>
          <p>显示版权和版本信息</p>
        </div>

        <div class="feature">
          <h3>❌ 无侧边栏</h3>
          <p>适合专注展示内容</p>
        </div>

        <div class="feature">
          <h3>❌ 无面包屑</h3>
          <p>简化导航界面</p>
        </div>
      </div>

      <div class="actions">
        <button @click="$router.push('/dashboard')">返回仪表盘</button>
        <button @click="$router.push('/layout-demo/fullscreen')">查看全屏模式</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.screen-demo {
  padding: 2rem;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  max-width: 800px;
  text-align: center;
}

.content h1 {
  color: #1f2937;
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

.content p {
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: 1.125rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;
}

.feature {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.feature h3 {
  color: #374151;
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
}

.feature p {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.actions button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.actions button:hover {
  background: #2563eb;
}
</style>
