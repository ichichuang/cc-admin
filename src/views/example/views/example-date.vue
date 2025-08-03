<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description cc-admin 企业级后台管理框架 - 页面组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
import { DateUtils } from '@/common/modules/date'
import { useLocaleStore } from '@/stores/modules/locale'
import { computed, ref, watch } from 'vue'

const localeStore = useLocaleStore()
const currentLocale = computed(() => localeStore.currentLocale)

// 测试数据
const testDate = ref(DateUtils.format(new Date(), 'YYYY-MM-DDTHH:mm'))
const customFormat = ref('YYYY-MM-DD HH:mm:ss')
const amount = ref(1)
const unit = ref<'day' | 'week' | 'month' | 'year'>('day')

// 格式化示例
const formattedDate = computed(() => {
  return DateUtils.format(testDate.value, customFormat.value)
})

// 相对时间示例
const relativeTime = computed(() => {
  return DateUtils.fromNowZh(testDate.value)
})

// 日期计算示例
const calculatedDate = computed(() => {
  return DateUtils.add(testDate.value, amount.value, unit.value)
})

// 日期比较示例
const isPast = computed(() => {
  return DateUtils.isBefore(testDate.value, new Date())
})

const isFuture = computed(() => {
  return DateUtils.isAfter(testDate.value, new Date())
})

// 日期范围示例
const dateRange = computed(() => {
  const start = DateUtils.startOf(testDate.value, 'month')
  const end = DateUtils.endOf(testDate.value, 'month')
  return DateUtils.range(start, end)
})

// 持续时间示例
const duration = computed(() => {
  const start = DateUtils.subtract(testDate.value, 2, 'hour')
  const diff = DateUtils.diff(testDate.value, start)
  return DateUtils.formatDuration(diff)
})

// 日期信息示例
const dateInfo = computed(() => {
  return DateUtils.getDateInfo(testDate.value)
})

// 工作日示例
const isWeekday = computed(() => {
  return DateUtils.isWeekday(testDate.value)
})

const isWeekend = computed(() => {
  return DateUtils.isWeekend(testDate.value)
})

const nextWeekday = computed(() => {
  return DateUtils.nextWeekday(testDate.value)
})

const prevWeekday = computed(() => {
  return DateUtils.prevWeekday(testDate.value)
})

// 时间检查示例
const isToday = computed(() => {
  return DateUtils.isToday(testDate.value)
})

const isYesterday = computed(() => {
  return DateUtils.isYesterday(testDate.value)
})

const isTomorrow = computed(() => {
  return DateUtils.isTomorrow(testDate.value)
})

// 友好时间显示
const friendlyTime = computed(() => {
  return DateUtils.getFriendlyTime(testDate.value)
})

// 月份和星期名称
const monthName = computed(() => {
  return DateUtils.getMonthName(testDate.value)
})

const weekdayName = computed(() => {
  return DateUtils.getWeekdayName(testDate.value)
})

// 时区信息
const timezone = computed(() => {
  return DateUtils.getTimezone()
})

// 年龄计算
const birthDate = ref('1990-01-01')
const age = computed(() => {
  return DateUtils.getAge(birthDate.value)
})

// 工作日计算
const workStartDate = ref(DateUtils.format(new Date(), 'YYYY-MM-DD'))
const workEndDate = ref(DateUtils.format(DateUtils.add(new Date(), 30, 'day'), 'YYYY-MM-DD'))
const workdaysCount = computed(() => {
  return DateUtils.getWorkdaysBetween(workStartDate.value, workEndDate.value)
})

// Day.js 语言环境映射函数
const getDayjsLocale = (locale: string): string => {
  switch (locale) {
    case 'zh-CN':
      return 'zh-cn'
    case 'en-US':
      return 'en'
    case 'zh-TW':
      return 'zh-tw'
    default:
      return 'en'
  }
}

// 监听语言变化，更新 Day.js 语言环境
watch(
  currentLocale,
  async newLocale => {
    const dayjsLocale = getDayjsLocale(newLocale)
    if (dayjsLocale) {
      await DateUtils.setLocale(dayjsLocale as any)
    }
  },
  { immediate: true }
)

// 语言映射
const localeMap = {
  zhCN: 'zh-CN',
  enUS: 'en-US',
  zhTW: 'zh-TW',
} as const

// 切换语言
const switchLocale = (locale: string) => {
  localeStore.switchLocale(localeMap[locale as keyof typeof localeMap])
}
</script>

<template>
  <div class="p-gap">
    <!-- 语言配置 -->
    <div
      class="bg-bg200 color-primary100 border p-gap mb-gap sticky top-0 left-0 right-0 between-col gap-gap"
    >
      <div class="between">
        <div>当前语言: {{ currentLocale }}</div>
        <div class="between">
          <template
            v-for="locale in ['zhCN', 'enUS', 'zhTW']"
            :key="locale"
          >
            <div
              class="btn-primary"
              :class="
                currentLocale === localeMap[locale as keyof typeof localeMap] ? 'btn-success' : ''
              "
              @click="switchLocale(locale)"
            >
              {{ locale }}
            </div>
          </template>
        </div>
      </div>
      <div class="between">
        <div class="bg-bg100 p-gap rounded">当前时区: {{ timezone }}</div>
        <div class="bg-bg100 p-gap rounded">友好时间: {{ friendlyTime }}</div>
      </div>
    </div>

    <!-- 基础功能展示 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gap p-gap">
      <!-- 基础格式化 -->
      <div class="card">
        <div class="center">基础格式化</div>
        <div class="space-y-gap">
          <div>
            <label class="block mb-gap">格式:</label>
            <input
              v-model="customFormat"
              class="input-base w-full"
            />
          </div>
          <div>
            <label class="block mb-gap">日期:</label>
            <input
              v-model="testDate"
              type="datetime-local"
              class="input-base w-full"
            />
          </div>
          <div class="bg-bg100 p-gap rounded">
            <div class="text-sm color-text200">格式化结果:</div>
            <div class="color-primaryColor">{{ formattedDate }}</div>
          </div>
        </div>
      </div>

      <!-- 相对时间 -->
      <div class="card">
        <div class="center">相对时间</div>
        <div class="space-y-gap">
          <div class="bg-bg100 p-gap rounded">
            <div class="text-sm color-text200">相对时间:</div>
            <div class="color-primaryColor">{{ relativeTime }}</div>
          </div>
          <div class="bg-bg100 p-gap rounded">
            <div class="text-sm color-text200">Day.js 相对时间:</div>
            <div class="color-primaryColor">{{ DateUtils.fromNow(testDate) }}</div>
          </div>
        </div>
      </div>

      <!-- 日期计算 -->
      <div class="card">
        <div class="center">日期计算</div>
        <div class="space-y-gap">
          <div class="between gap-gap">
            <div>
              <label class="block mb-gap">数量:</label>
              <input
                v-model.number="amount"
                type="number"
                class="input-base"
              />
            </div>
            <div>
              <label class="block mb-gap">单位:</label>
              <select
                v-model="unit"
                class="input-base"
              >
                <option value="day">天</option>
                <option value="week">周</option>
                <option value="month">月</option>
                <option value="year">年</option>
              </select>
            </div>
          </div>
          <div class="bg-bg100 p-gap rounded">
            <div class="text-sm color-text200">计算结果:</div>
            <div class="color-primaryColor">{{ DateUtils.format(calculatedDate) }}</div>
          </div>
        </div>
      </div>

      <!-- 日期比较 -->
      <div class="card">
        <div class="center">日期比较</div>
        <div class="space-y-gap">
          <div class="bg-bg100 p-gap rounded">
            <div class="text-sm color-text200">是否为过去:</div>
            <div :class="isPast ? 'color-errorColor' : 'color-successColor'">
              {{ isPast ? '是' : '否' }}
            </div>
          </div>
          <div class="bg-bg100 p-gap rounded">
            <div class="text-sm color-text200">是否为未来:</div>
            <div :class="isFuture ? 'color-successColor' : 'color-errorColor'">
              {{ isFuture ? '是' : '否' }}
            </div>
          </div>
        </div>
      </div>

      <!-- 持续时间 -->
      <div class="card">
        <div class="center">持续时间</div>
        <div class="bg-bg100 p-gap rounded">
          <div class="text-sm color-text200">2小时前到现在:</div>
          <div class="color-primaryColor">{{ duration }}</div>
        </div>
      </div>

      <!-- 时间戳 -->
      <div class="card">
        <div class="center">时间戳</div>
        <div class="bg-bg100 p-gap rounded">
          <div class="text-sm color-text200">当前时间戳:</div>
          <div class="color-primaryColor">{{ DateUtils.timestamp() }}</div>
        </div>
      </div>
    </div>

    <!-- 高级功能展示 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gap p-gap">
      <!-- 日期信息 -->
      <div class="card">
        <div class="center">日期信息</div>
        <div class="space-y-gap">
          <div class="bg-bg100 p-gap rounded">
            <div class="text-sm color-text200">年份: {{ dateInfo.year }}</div>
            <div class="text-sm color-text200">月份: {{ dateInfo.month }}</div>
            <div class="text-sm color-text200">日期: {{ dateInfo.date }}</div>
            <div class="text-sm color-text200">小时: {{ dateInfo.hour }}</div>
            <div class="text-sm color-text200">分钟: {{ dateInfo.minute }}</div>
            <div class="text-sm color-text200">秒数: {{ dateInfo.second }}</div>
          </div>
        </div>
      </div>

      <!-- 工作日相关 -->
      <div class="card">
        <div class="center">工作日相关</div>
        <div class="space-y-gap">
          <div class="bg-bg100 p-gap rounded">
            <div class="text-sm color-text200">是否为工作日:</div>
            <div :class="isWeekday ? 'color-successColor' : 'color-errorColor'">
              {{ isWeekday ? '是' : '否' }}
            </div>
          </div>
          <div class="bg-bg100 p-gap rounded">
            <div class="text-sm color-text200">是否为周末:</div>
            <div :class="isWeekend ? 'color-errorColor' : 'color-successColor'">
              {{ isWeekend ? '是' : '否' }}
            </div>
          </div>
          <div class="bg-bg100 p-gap rounded">
            <div class="text-sm color-text200">下一个工作日:</div>
            <div class="color-primaryColor">{{ DateUtils.format(nextWeekday) }}</div>
          </div>
          <div class="bg-bg100 p-gap rounded">
            <div class="text-sm color-text200">上一个工作日:</div>
            <div class="color-primaryColor">{{ DateUtils.format(prevWeekday) }}</div>
          </div>
        </div>
      </div>

      <!-- 时间检查 -->
      <div class="card">
        <div class="center">时间检查</div>
        <div class="space-y-gap">
          <div class="bg-bg100 p-gap rounded">
            <div class="text-sm color-text200">是否为今天:</div>
            <div :class="isToday ? 'color-successColor' : 'color-errorColor'">
              {{ isToday ? '是' : '否' }}
            </div>
          </div>
          <div class="bg-bg100 p-gap rounded">
            <div class="text-sm color-text200">是否为昨天:</div>
            <div :class="isYesterday ? 'color-successColor' : 'color-errorColor'">
              {{ isYesterday ? '是' : '否' }}
            </div>
          </div>
          <div class="bg-bg100 p-gap rounded">
            <div class="text-sm color-text200">是否为明天:</div>
            <div :class="isTomorrow ? 'color-successColor' : 'color-errorColor'">
              {{ isTomorrow ? '是' : '否' }}
            </div>
          </div>
        </div>
      </div>

      <!-- 月份和星期名称 -->
      <div class="card">
        <div class="center">月份和星期名称</div>
        <div class="space-y-gap">
          <div class="bg-bg100 p-gap rounded">
            <div class="text-sm color-text200">月份名称:</div>
            <div class="color-primaryColor">{{ monthName }}</div>
          </div>
          <div class="bg-bg100 p-gap rounded">
            <div class="text-sm color-text200">星期名称:</div>
            <div class="color-primaryColor">{{ weekdayName }}</div>
          </div>
        </div>
      </div>

      <!-- 年龄计算 -->
      <div class="card">
        <div class="center">年龄计算</div>
        <div class="space-y-gap">
          <div>
            <label class="block mb-gap">出生日期:</label>
            <input
              v-model="birthDate"
              type="date"
              class="input-base w-full"
            />
          </div>
          <div class="bg-bg100 p-gap rounded">
            <div class="text-sm color-text200">年龄:</div>
            <div class="color-primaryColor">{{ age }} 岁</div>
          </div>
        </div>
      </div>

      <!-- 工作日计算 -->
      <div class="card">
        <div class="center">工作日计算</div>
        <div class="space-y-gap">
          <div>
            <label class="block mb-gap">开始日期:</label>
            <input
              v-model="workStartDate"
              type="date"
              class="input-base w-full"
            />
          </div>
          <div>
            <label class="block mb-gap">结束日期:</label>
            <input
              v-model="workEndDate"
              type="date"
              class="input-base w-full"
            />
          </div>
          <div class="bg-bg100 p-gap rounded">
            <div class="text-sm color-text200">工作日数量:</div>
            <div class="color-primaryColor">{{ workdaysCount }} 天</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 日期范围展示 -->
    <div class="p-gap">
      <div class="card">
        <div class="center">本月日期范围</div>
        <div class="bg-bg100 p-gap rounded">
          <div class="text-sm color-text200">日期列表 (前10个):</div>
          <div class="color-primaryColor">
            {{
              dateRange
                .slice(0, 10)
                .map(d => DateUtils.format(d, 'MM-DD'))
                .join(', ')
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scope></style>
