<template>
  <div class="min-h-screen bg-active-bg flex-center p-active-xl">
    <div class="max-w-xl text-center text-active-text">
      <!-- 500 图标和数字 -->
      <div class="flex-center gap-active-lg mb-active-xl flex-wrap">
        <div class="text-8rem font-900 text-active-error leading-none"
          style="text-shadow: 2px 2px 4px var(--theme-active-error-light)">500</div>
        <div class="text-4rem animate-blink">⚠️</div>
      </div>

      <!-- 错误信息 -->
      <div class="mb-active-xl">
        <h1 class="text-2.5rem font-700 mb-active-md text-active-primary m-0">服务器错误</h1>
        <p class="text-1.2rem text-active-text-muted mb-active-md leading-1.6 m-0">
          抱歉，服务器遇到了一个错误，无法完成您的请求。
        </p>
        <p
          class="bg-active-bg-highlight border border-active-text-muted rounded-active-md p-active-sm px-active-md text-0.9rem text-active-text break-all mb-active-lg m-0">
          <strong class="text-active-error">请求的路径:</strong> {{ $route.fullPath }}
        </p>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-active-md justify-center flex-wrap mb-active-xl">
        <button class="btn-primary min-w-30" @click="goHome">
          🏠 返回首页
        </button>
        <button class="btn-info min-w-30" @click="refresh">
          🔄 重试
        </button>
        <button class="btn-danger min-w-30" @click="report">
          📧 报告问题
        </button>
      </div>

      <!-- 帮助信息 -->
      <div class="mb-active-lg text-left">
        <details class="bg-active-bg-highlight border border-active-error rounded-active-md p-active-md">
          <summary class="cursor-pointer font-600 text-active-error mb-active-sm hover:text-active-error-hover">⚙️ 可能的原因
          </summary>
          <div>
            <ul class="mt-active-sm pl-active-lg text-active-text-muted m-0">
              <li class="mb-active-xs leading-1.5">服务器正在维护或升级</li>
              <li class="mb-active-xs leading-1.5">请求超时或网络连接问题</li>
              <li class="mb-active-xs leading-1.5">服务器资源不足</li>
              <li class="mb-active-xs leading-1.5">应用程序内部错误</li>
              <li class="mb-active-xs leading-1.5">数据库连接问题</li>
            </ul>
          </div>
        </details>
      </div>

      <!-- 建议操作 -->
      <div class="text-center mb-active-lg">
        <p class="text-active-text-muted mb-active-sm">您可以尝试：</p>
        <div class="flex gap-active-sm justify-center flex-wrap">
          <span
            class="inline-block p-active-xs px-active-sm bg-active-error-light text-active-error rounded-active-sm cursor-pointer transition-all duration-300 hover:bg-active-error hover:text-active-bg hover:transform hover:translate-y--1px text-0.9rem"
            @click="refresh">稍后重试</span>
          <span
            class="inline-block p-active-xs px-active-sm bg-active-error-light text-active-error rounded-active-sm cursor-pointer transition-all duration-300 hover:bg-active-error hover:text-active-bg hover:transform hover:translate-y--1px text-0.9rem"
            @click="goHome">返回首页</span>
          <span
            class="inline-block p-active-xs px-active-sm bg-active-error-light text-active-error rounded-active-sm cursor-pointer transition-all duration-300 hover:bg-active-error hover:text-active-bg hover:transform hover:translate-y--1px text-0.9rem"
            @click="report">联系技术支持</span>
        </div>
      </div>

      <!-- 错误ID显示（可选） -->
      <div
        class="bg-active-bg-highlight border border-active-error rounded-active-md p-active-sm px-active-md text-0.8rem text-active-text-muted"
        v-if="errorId">
        <p class="m-0">
          <strong>错误ID:</strong>
          <code class="bg-active-bg p-1 rounded-active-xs font-mono text-active-error">{{ errorId }}</code>
          <button
            class="border-none bg-transparent cursor-pointer text-0.9rem ml-active-xs opacity-70 hover:opacity-100 transition-opacity duration-300"
            @click="copyErrorId" title="复制错误ID">📋</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 生成一个模拟的错误ID
const errorId = ref(`ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)

// 返回首页
const goHome = () => {
  router.push('/')
}

// 刷新页面
const refresh = () => {
  window.location.reload()
}

// 报告问题
const report = () => {
  console.log('报告技术问题')
  // 可以实现发送错误报告、跳转到反馈页面等
}

// 复制错误ID
const copyErrorId = async () => {
  try {
    await navigator.clipboard.writeText(errorId.value)
    console.log('错误ID已复制到剪贴板')
    // 可以显示toast提示
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style scoped>
/* 自定义动画 - UnoCSS暂不支持复杂关键帧动画 */
@keyframes blink {

  0%,
  50% {
    opacity: 1;
  }

  51%,
  100% {
    opacity: 0.3;
  }
}

.animate-blink {
  animation: blink 2s infinite;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .text-8rem {
    font-size: 5rem;
  }

  .text-4rem {
    font-size: 3rem;
  }

  .text-2.5rem {
    font-size: 2rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .min-w-30 {
    width: 100%;
    max-width: 250px;
  }

  .suggestion-list {
    flex-direction: column;
    align-items: center;
  }

  .suggestion-item {
    width: fit-content;
  }
}
</style>
