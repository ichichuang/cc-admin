<template>
  <div class="pinia-persisted-example">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Pinia 持久化存储演示</h2>

    <!-- App Store 演示 -->
    <div class="card mb-8">
      <h3 class="text-xl font-semibold mb-4 text-blue-600">App Store（应用状态）</h3>
      <div class="space-y-4">
        <div class="flex flex-wrap gap-4">
          <div class="info-item">
            <span class="label">主题模式：</span>
            <span class="value">{{ appStore.theme }}</span>
          </div>
          <div class="info-item">
            <span class="label">语言设置：</span>
            <span class="value">{{ appStore.locale }}</span>
          </div>
          <div class="info-item">
            <span class="label">侧边栏状态：</span>
            <span class="value">{{ appStore.sidebarCollapsed ? '折叠' : '展开' }}</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            class="btn btn-primary"
            @click="appStore.toggleTheme()"
          >
            切换主题 ({{ appStore.theme === 'light' ? '暗色' : '亮色' }})
          </button>
          <button
            class="btn btn-secondary"
            @click="appStore.toggleSidebar()"
          >
            {{ appStore.sidebarCollapsed ? '展开' : '折叠' }}侧边栏
          </button>
          <select
            v-model="appStore.locale"
            class="px-3 py-2 border rounded"
            @change="appStore.setLocale(appStore.locale)"
          >
            <option value="zh-CN">简体中文</option>
            <option value="en-US">英语</option>
            <option value="ja-JP">日语</option>
          </select>
        </div>
      </div>
    </div>

    <!-- User Store 演示 -->
    <div class="card mb-8">
      <h3 class="text-xl font-semibold mb-4 text-green-600">User Store（用户状态）</h3>

      <!-- 登录状态 -->
      <div class="mb-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="info-item">
            <span class="label">登录状态：</span>
            <span
              class="value"
              :class="userStore.isLoggedIn ? 'text-green-600' : 'text-red-600'"
            >
              {{ userStore.isLoggedIn ? '已登录' : '未登录' }}
            </span>
          </div>
          <div
            v-if="userStore.isLoggedIn"
            class="info-item"
          >
            <span class="label">用户名：</span>
            <span class="value">{{ userStore.displayName }}</span>
          </div>
          <div
            v-if="userStore.isLoggedIn"
            class="info-item"
          >
            <span class="label">管理员：</span>
            <span class="value">{{ userStore.isAdmin ? '是' : '否' }}</span>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            v-if="!userStore.isLoggedIn"
            class="btn btn-success"
            @click="simulateLogin"
          >
            模拟登录
          </button>
          <button
            v-if="userStore.isLoggedIn"
            class="btn btn-warning"
            @click="userStore.logout()"
          >
            登出
          </button>
          <button
            v-if="userStore.isLoggedIn"
            class="btn btn-info"
            @click="userStore.updateActivity()"
          >
            更新活动时间
          </button>
        </div>
      </div>

      <!-- 用户偏好设置 -->
      <div v-if="userStore.isLoggedIn">
        <h4 class="text-lg font-medium mb-3">用户偏好设置</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="preference-item">
            <label class="label">字体大小：</label>
            <select
              v-model="userStore.preferences.fontSize"
              class="form-select"
            >
              <option value="small">小</option>
              <option value="medium">中</option>
              <option value="large">大</option>
            </select>
          </div>

          <div class="preference-item">
            <label class="label">布局模式：</label>
            <select
              v-model="userStore.preferences.layout"
              class="form-select"
            >
              <option value="sidebar">侧边栏</option>
              <option value="topbar">顶部栏</option>
            </select>
          </div>

          <div class="preference-item">
            <label class="flex items-center gap-2">
              <input
                v-model="userStore.preferences.autoSave"
                type="checkbox"
                class="form-checkbox"
              />
              <span>自动保存</span>
            </label>
          </div>

          <div class="preference-item">
            <label class="flex items-center gap-2">
              <input
                v-model="userStore.preferences.notifications"
                type="checkbox"
                class="form-checkbox"
              />
              <span>接收通知</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 非持久化数据 -->
      <div
        v-if="userStore.lastActivityTime"
        class="mt-4 p-3 bg-yellow-50 rounded"
      >
        <p class="text-sm text-yellow-700">
          <strong>最后活动时间：</strong>{{ formatTime(userStore.lastActivityTime) }}
          <br />
          <em>注意：此字段不会被持久化，刷新页面后会重置</em>
        </p>
      </div>
    </div>

    <!-- 存储查看器 -->
    <div class="card mb-8">
      <h3 class="text-xl font-semibold mb-4 text-purple-600">本地存储查看器</h3>
      <div class="space-y-4">
        <div>
          <h4 class="font-medium mb-2">localStorage (App Store + User Auth):</h4>
          <pre class="storage-viewer">{{ localStorageData }}</pre>
        </div>
        <div>
          <h4 class="font-medium mb-2">sessionStorage (User Preferences):</h4>
          <pre class="storage-viewer">{{ sessionStorageData }}</pre>
        </div>
        <button
          class="btn btn-danger"
          @click="clearAllStorage"
        >
          清空所有存储
        </button>
      </div>
    </div>

    <!-- 使用说明 -->
    <div class="card">
      <h3 class="text-xl font-semibold mb-4 text-indigo-600">使用说明</h3>
      <ul class="list-disc list-inside space-y-2 text-sm text-gray-700">
        <li>App Store 的 theme、locale、sidebarCollapsed 会保存到 localStorage</li>
        <li>User Store 的用户信息和登录状态保存到 localStorage</li>
        <li>User Store 的偏好设置保存到 sessionStorage（关闭浏览器后重置）</li>
        <li>lastActivityTime 不会被持久化</li>
        <li>刷新页面后，持久化的数据会自动恢复</li>
        <li>可以打开开发者工具查看 Application > Storage 中的实际数据</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore, useUserStore } from '@/stores'
import { onMounted, onUnmounted, ref } from 'vue'

// 使用 stores
const appStore = useAppStore()
const userStore = useUserStore()

// 存储数据查看
const localStorageData = ref('')
const sessionStorageData = ref('')

// 更新存储数据显示
const updateStorageData = () => {
  const localData = {
    ['cc-admin-app']: localStorage.getItem('cc-admin-app'),
    ['cc-admin-user-auth']: localStorage.getItem('cc-admin-user-auth'),
  }
  const sessionData = {
    ['cc-admin-user-preferences']: sessionStorage.getItem('cc-admin-user-preferences'),
  }

  localStorageData.value = JSON.stringify(localData, null, 2)
  sessionStorageData.value = JSON.stringify(sessionData, null, 2)
}

// 模拟登录
const simulateLogin = () => {
  const mockUsers = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      avatar: '👨‍💼',
      roles: ['admin', 'user'],
    },
    {
      id: 2,
      username: 'user',
      email: 'user@example.com',
      avatar: '👤',
      roles: ['user'],
    },
  ]

  const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
  userStore.login(randomUser)
}

// 格式化时间
const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}

// 清空所有存储
const clearAllStorage = () => {
  localStorage.removeItem('cc-admin-app')
  localStorage.removeItem('cc-admin-user-auth')
  sessionStorage.removeItem('cc-admin-user-preferences')
  updateStorageData()
  alert('所有存储已清空，请刷新页面查看效果')
}

// 定时更新存储数据显示
let interval: NodeJS.Timeout

onMounted(() => {
  updateStorageData()
  interval = setInterval(updateStorageData, 1000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>

<style scoped>
.pinia-persisted-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  font-weight: 500;
  color: #374151;
}

.value {
  font-weight: 600;
  color: #111827;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn-warning {
  background: #f59e0b;
  color: white;
}

.btn-warning:hover {
  background: #d97706;
}

.btn-info {
  background: #06b6d4;
  color: white;
}

.btn-info:hover {
  background: #0891b2;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.preference-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
}

.form-checkbox {
  width: 16px;
  height: 16px;
}

.storage-viewer {
  background: #f3f4f6;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
