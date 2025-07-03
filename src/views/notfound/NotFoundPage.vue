<template>
  <div class="min-h-screen bg-active-bg flex-center p-active-xl">
    <div class="max-w-xl text-center text-active-text">
      <!-- 404 图标和数字 -->
      <div class="flex-center gap-active-lg mb-active-xl flex-wrap">
        <div class="text-8rem font-900 text-active-error leading-none"
          style="text-shadow: 2px 2px 4px var(--theme-active-error-light)">404</div>
        <div class="text-4rem animate-shake">🚫</div>
      </div>

      <!-- 错误信息 -->
      <div class="mb-active-xl">
        <h1 class="text-2.5rem font-700 mb-active-md text-active-primary m-0">页面未找到</h1>
        <p class="text-1.2rem text-active-text-muted mb-active-md leading-1.6 m-0">
          抱歉，您访问的页面不存在或已被移动。
        </p>
        <p
          class="bg-active-bg-highlight border border-active-text-muted rounded-active-md p-active-sm px-active-md text-0.9rem text-active-text break-all mb-active-lg m-0">
          <strong class="text-active-warning">请求的路径:</strong> {{ $route.fullPath }}
        </p>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-active-md justify-center flex-wrap mb-active-xl">
        <button class="btn-primary min-w-30" @click="goHome">
          🏠 返回首页
        </button>
        <button class="btn-success min-w-30" @click="goBack">
          ← 返回上页
        </button>
        <button
          class="btn bg-active-bg-highlight text-active-text border-2 border-active-info hover:bg-active-info hover:text-active-bg hover:transform hover:translate-y--2px min-w-30"
          @click="refresh">
          🔄 刷新页面
        </button>
      </div>

      <!-- 帮助信息 -->
      <div class="mb-active-lg text-left">
        <details class="bg-active-bg-highlight border border-active-primary rounded-active-md p-active-md">
          <summary class="cursor-pointer font-600 text-active-primary mb-active-sm hover:text-active-primary-hover">🤔
            为什么会出现这个页面？</summary>
          <div>
            <ul class="mt-active-sm pl-active-lg text-active-text-muted m-0">
              <li class="mb-active-xs leading-1.5">您输入的网址可能有误</li>
              <li class="mb-active-xs leading-1.5">您点击的链接已过期</li>
              <li class="mb-active-xs leading-1.5">页面可能已被删除或移动</li>
              <li class="mb-active-xs leading-1.5">您没有访问该页面的权限</li>
            </ul>
          </div>
        </details>
      </div>

      <!-- 搜索建议 -->
      <div class="text-center">
        <p class="text-active-text-muted mb-active-sm">您可以尝试：</p>
        <div class="flex gap-active-sm justify-center flex-wrap">
          <span
            class="inline-block p-active-xs px-active-sm bg-active-info-light text-active-info rounded-active-sm cursor-pointer transition-all duration-300 hover:bg-active-info hover:text-active-bg hover:transform hover:translate-y--1px text-0.9rem"
            @click="goHome">访问首页</span>
          <span
            class="inline-block p-active-xs px-active-sm bg-active-info-light text-active-info rounded-active-sm cursor-pointer transition-all duration-300 hover:bg-active-info hover:text-active-bg hover:transform hover:translate-y--1px text-0.9rem"
            @click="goBack">返回上一页</span>
          <span
            class="inline-block p-active-xs px-active-sm bg-active-info-light text-active-info rounded-active-sm cursor-pointer transition-all duration-300 hover:bg-active-info hover:text-active-bg hover:transform hover:translate-y--1px text-0.9rem"
            @click="checkUrl">检查网址拼写</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回首页
const goHome = () => {
  router.push('/')
}

// 返回上一页
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    // 如果没有历史记录，则跳转到首页
    goHome()
  }
}

// 刷新页面
const refresh = () => {
  window.location.reload()
}

// 检查网址（演示功能）
const checkUrl = () => {
  console.log('请检查网址拼写是否正确')
  // 可以实现复制当前URL到剪贴板等功能
}
</script>

<style scoped>
/* 自定义动画 - UnoCSS暂不支持复杂关键帧动画 */
@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-10px);
  }

  75% {
    transform: translateX(10px);
  }
}

.animate-shake {
  animation: shake 2s infinite;
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
