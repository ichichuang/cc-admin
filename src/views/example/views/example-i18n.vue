<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - 页面组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
import { useLocale } from '@/hooks/modules/useLocale'
import type { SupportedLocale } from '@/locales/types'
import { useLocaleStore } from '@/stores/modules/locale'
import { computed } from 'vue'

interface I18nExample {
  title: string
  examples: {
    name: string
    key: string
    value: string
    params?: Record<string, any>
  }[]
}

const i18nExamples: I18nExample[] = [
  {
    title: '基础翻译',
    examples: [
      {
        name: '系统标题',
        key: 'common.system.title',
        value: 'common.system.title',
      },
      {
        name: '确认操作',
        key: 'common.actions.confirm',
        value: 'common.actions.confirm',
      },
      {
        name: '加载状态',
        key: 'common.status.loading',
        value: 'common.status.loading',
      },
    ],
  },
  {
    title: '用户模块',
    examples: [
      {
        name: '用户资料标题',
        key: 'user.profile.title',
        value: 'user.profile.title',
      },
      {
        name: '用户名',
        key: 'user.profile.username',
        value: 'user.profile.username',
      },
      {
        name: '邮箱',
        key: 'user.profile.email',
        value: 'user.profile.email',
      },
      {
        name: '用户状态',
        key: 'user.status.active',
        value: 'user.status.active',
      },
    ],
  },
  {
    title: '认证模块',
    examples: [
      {
        name: '登录标题',
        key: 'auth.login.title',
        value: 'auth.login.title',
      },
      {
        name: '用户名输入',
        key: 'auth.login.username',
        value: 'auth.login.username',
      },
      {
        name: '密码输入',
        key: 'auth.login.password',
        value: 'auth.login.password',
      },
      {
        name: '登录按钮',
        key: 'auth.login.loginButton',
        value: 'auth.login.loginButton',
      },
    ],
  },
  {
    title: '路由模块',
    examples: [
      {
        name: '仪表盘',
        key: 'router.dashboard.dashboard',
        value: 'router.dashboard.dashboard',
      },
      {
        name: '登录页面',
        key: 'router.core.login',
        value: 'router.core.login',
      },
      {
        name: '示例页面',
        key: 'router.example.example',
        value: 'router.example.example',
      },
      {
        name: '国际化示例',
        key: 'router.example.i18n',
        value: 'router.example.i18n',
      },
    ],
  },
  {
    title: '参数化翻译',
    examples: [
      {
        name: '表格总数',
        key: 'common.table.total',
        value: 'common.table.total',
        params: { total: 100 },
      },
      {
        name: '当前页码',
        key: 'common.table.page',
        value: 'common.table.page',
        params: { page: 1 },
      },
    ],
  },
  {
    title: '格式化示例',
    examples: [
      {
        name: '当前日期',
        key: 'common.format.date',
        value: 'common.format.date',
      },
      {
        name: '数字格式化',
        key: 'common.format.number',
        value: 'common.format.number',
      },
    ],
  },
]

const localeStore = useLocaleStore()
const { $t } = useLocale()

const currentLocale = computed(() => localeStore.currentLocale)
const currentLocaleInfo = computed(() => localeStore.currentLocaleInfo)
const availableLocales = computed(() => localeStore.availableLocales)
const isChineseLang = computed(() => localeStore.isChineseLang)
const isRTL = computed(() => localeStore.isRTL)

const switchLocale = (locale: SupportedLocale) => {
  localeStore.switchLocale(locale)
}

// 格式化示例数据
const currentDate = new Date()
const formattedDate = computed(() => {
  return currentDate.toLocaleString(currentLocale.value)
})
const formattedNumber = computed(() => {
  return (1234.56).toLocaleString(currentLocale.value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

// 检查翻译键是否存在
const checkKey = (key: string) => {
  try {
    const result = $t(key)
    return result !== key
  } catch {
    return false
  }
}
</script>

<template>
  <!-- 语言配置 -->
  <div
    class="bg-bg200 color-primary100 border p-gap mb-gap sticky top-0 left-0 right-0 between-col gap-gap"
  >
    <div class="between">
      <div>
        当前语言: {{ currentLocaleInfo?.flag }} {{ currentLocaleInfo?.name }} {{ currentLocale }}
      </div>
      <div class="between">
        <template
          v-for="locale in availableLocales"
          :key="locale.key"
        >
          <div
            class="btn-primary"
            :class="currentLocale === locale.key ? 'btn-success' : ''"
            @click="switchLocale(locale.key)"
          >
            {{ locale.flag }} {{ locale.name }}
          </div>
        </template>
      </div>
    </div>
    <div class="between">
      <div>语言信息: 中文: {{ isChineseLang }} | RTL: {{ isRTL }}</div>
      <div class="between">
        <div class="bg-bg100 p-gap rounded">格式化日期: {{ formattedDate }}</div>
        <div class="bg-bg100 p-gap rounded">格式化数字: {{ formattedNumber }}</div>
      </div>
    </div>
  </div>

  <!-- 国际化示例展示 -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gap p-gap">
    <template
      v-for="example in i18nExamples"
      :key="example.title"
    >
      <div class="card">
        <div class="center">{{ example.title }}</div>
        <div
          v-for="item in example.examples"
          :key="item.name"
          class="m-gap between gap-gap"
        >
          <div class="w50% hfull">
            <div class="min-h40px between p-gap">
              {{ item.name }}
            </div>
            <input
              class="input-base"
              type="text"
              :value="item.key"
            />
          </div>
          <div class="w50% hfull">
            <div class="h40px center bg-bg100 color-text100">
              {{ item.params ? $t(item.key, item.params) : $t(item.key) }}
            </div>
            <input
              class="input-base"
              type="text"
              :value="item.params ? `${item.key} (${JSON.stringify(item.params)})` : item.key"
            />
          </div>
        </div>
      </div>
    </template>
  </div>

  <!-- 特殊示例 -->
  <div class="p-gap">
    <div class="card">
      <div class="center">特殊示例</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-gap p-gap">
        <div class="bg-bg200 border border-bg300 p-gap rounded">
          <div class="center mb-gap">键存在性检查</div>
          <div class="between gap-gap">
            <div class="bg-bg100 p-gap rounded">
              <div>common.actions.confirm</div>
              <div
                :class="
                  checkKey('common.actions.confirm') ? 'color-successColor' : 'color-errorColor'
                "
              >
                {{ checkKey('common.actions.confirm') ? '✓ 存在' : '✗ 不存在' }}
              </div>
            </div>
            <div class="bg-bg100 p-gap rounded">
              <div>user.management.userCount</div>
              <div
                :class="
                  checkKey('user.management.userCount') ? 'color-successColor' : 'color-errorColor'
                "
              >
                {{ checkKey('user.management.userCount') ? '✓ 存在' : '✗ 不存在' }}
              </div>
            </div>
          </div>
        </div>
        <div class="bg-bg200 border border-bg300 p-gap rounded">
          <div class="center mb-gap">格式化示例</div>
          <div class="between-col gap-gap">
            <div class="bg-bg100 p-gap rounded">
              <div>当前日期时间</div>
              <div class="color-primaryColor">{{ formattedDate }}</div>
            </div>
            <div class="bg-bg100 p-gap rounded">
              <div>数字格式化</div>
              <div class="color-primaryColor">{{ formattedNumber }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scope></style>
