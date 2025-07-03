<template>
  <div class="min-h-screen bg-active-bg flex-center p-active-xl">
    <div class="max-w-xl text-center text-active-text">
      <!-- 403 图标和数字 -->
      <div class="flex-center gap-active-lg mb-active-xl flex-wrap">
        <div class="text-8rem font-900 text-active-warning leading-none"
          style="text-shadow: 2px 2px 4px var(--theme-active-warning-light)">403</div>
        <div class="text-4rem animate-pulse">🔒</div>
      </div>

      <!-- 错误信息 -->
      <div class="mb-active-xl">
        <h1 class="text-2.5rem font-700 mb-active-md text-active-primary m-0">访问被拒绝</h1>
        <p class="text-1.2rem text-active-text-muted mb-active-md leading-1.6 m-0">
          抱歉，您没有权限访问此页面。
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
        <button class="btn-warning min-w-30" @click="contact">
          📞 联系管理员
        </button>
      </div>

      <!-- 帮助信息 -->
      <div class="mb-active-lg text-left">
        <details class="bg-active-bg-highlight border border-active-warning rounded-active-md p-active-md">
          <summary class="cursor-pointer font-600 text-active-warning mb-active-sm hover:text-active-warning-hover">🔐
            为什么会提示权限不足？</summary>
          <div>
            <ul class="mt-active-sm pl-active-lg text-active-text-muted m-0">
              <li class="mb-active-xs leading-1.5">您的账号可能没有访问该页面的权限</li>
              <li class="mb-active-xs leading-1.5">您的会话可能已过期，请重新登录</li>
              <li class="mb-active-xs leading-1.5">该功能可能需要更高级别的权限</li>
              <li class="mb-active-xs leading-1.5">系统可能正在维护中</li>
            </ul>
          </div>
        </details>
      </div>

      <!-- 建议操作 -->
      <div class="text-center">
        <p class="text-active-text-muted mb-active-sm">您可以尝试：</p>
        <div class="flex gap-active-sm justify-center flex-wrap">
          <span
            class="inline-block p-active-xs px-active-sm bg-active-warning-light text-active-warning rounded-active-sm cursor-pointer transition-all duration-300 hover:bg-active-warning hover:text-active-bg hover:transform hover:translate-y--1px text-0.9rem"
            @click="goHome">返回首页</span>
          <span
            class="inline-block p-active-xs px-active-sm bg-active-warning-light text-active-warning rounded-active-sm cursor-pointer transition-all duration-300 hover:bg-active-warning hover:text-active-bg hover:transform hover:translate-y--1px text-0.9rem"
            @click="login">重新登录</span>
          <span
            class="inline-block p-active-xs px-active-sm bg-active-warning-light text-active-warning rounded-active-sm cursor-pointer transition-all duration-300 hover:bg-active-warning hover:text-active-bg hover:transform hover:translate-y--1px text-0.9rem"
            @click="contact">申请权限</span>
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
    goHome()
  }
}

// 联系管理员
const contact = () => {
  console.log('联系管理员申请权限')
  // 可以实现发送邮件或跳转到联系页面
}

// 重新登录
const login = () => {
  console.log('跳转到登录页面')
  // router.push('/login')
}
</script>

<style scoped>
/* 自定义动画 - UnoCSS暂不支持复杂关键帧动画 */
@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

.animate-pulse {
  animation: pulse 2s infinite;
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
