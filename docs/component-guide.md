# 组件开发指南

## 概述

CC-Admin 采用 Vue 3.5+ 的组合式 API 和 `<script setup>` 语法，遵循现代化的组件开发模式。本指南涵盖组件设计原则、开发规范、最佳实践和复用策略。

## 🏗️ 组件架构

### 目录结构

```
src/components/
├── common/               # 🌐 通用组件
│   ├── LanguageSwitch.vue    # 语言切换组件
│   ├── ThemeToggle.vue       # 主题切换组件
│   └── LoadingSpinner.vue    # 加载动画组件
├── layout/               # 📐 布局组件
│   ├── Loading.vue           # 页面加载组件
│   ├── Sidebar.vue           # 侧边栏组件
│   ├── Header.vue            # 头部组件
│   └── Footer.vue            # 底部组件
├── form/                 # 📝 表单组件
│   ├── FormInput.vue         # 输入框组件
│   ├── FormSelect.vue        # 选择框组件
│   ├── FormCheckbox.vue      # 复选框组件
│   └── FormRadio.vue         # 单选框组件
├── ui/                   # 🎨 UI 组件
│   ├── Button.vue            # 按钮组件
│   ├── Modal.vue             # 模态框组件
│   ├── Table.vue             # 表格组件
│   └── Card.vue              # 卡片组件
└── business/             # 💼 业务组件
    ├── UserCard.vue          # 用户卡片
    ├── DataChart.vue         # 数据图表
    └── SearchPanel.vue       # 搜索面板
```

### 组件分类规范

| 分类         | 说明         | 示例                 | 复用性 |
| ------------ | ------------ | -------------------- | ------ |
| **common**   | 项目通用组件 | 语言切换、主题切换   | 高     |
| **layout**   | 布局相关组件 | 头部、侧边栏、底部   | 中     |
| **form**     | 表单控件组件 | 输入框、选择框、按钮 | 高     |
| **ui**       | 基础UI组件   | 模态框、表格、卡片   | 高     |
| **business** | 业务逻辑组件 | 用户卡片、数据图表   | 低     |

## 🎯 组件设计原则

### 1. 单一职责原则

```vue
<!-- ✅ 好的例子：单一职责的按钮组件 -->
<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    :type="type"
    @click="handleClick"
  >
    <i
      v-if="icon"
      :class="icon"
      class="mr-2"
    ></i>
    <slot />
    <span
      v-if="loading"
      class="ml-2"
    >
      <i class="i-mdi:loading animate-spin"></i>
    </span>
  </button>
</template>

<script setup lang="ts">
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: string
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => [
  'btn-base',
  `btn-${props.variant}`,
  `btn-${props.size}`,
  {
    'btn-loading': props.loading,
    'btn-disabled': props.disabled,
  },
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
```

### 2. 开闭原则

```vue
<!-- ✅ 可扩展的卡片组件 -->
<template>
  <div :class="cardClasses">
    <!-- 头部插槽 -->
    <header
      v-if="$slots.header || title"
      class="card-header"
    >
      <slot name="header">
        <h3 class="card-title">{{ title }}</h3>
      </slot>
    </header>

    <!-- 主内容插槽 -->
    <div class="card-content">
      <slot />
    </div>

    <!-- 底部插槽 -->
    <footer
      v-if="$slots.footer"
      class="card-footer"
    >
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup lang="ts">
interface CardProps {
  variant?: 'default' | 'bordered' | 'shadow' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  title?: string
  hover?: boolean
}

const props = withDefaults(defineProps<CardProps>(), {
  variant: 'default',
  size: 'md',
})

const cardClasses = computed(() => [
  'card',
  `card-${props.variant}`,
  `card-${props.size}`,
  {
    'card-hover': props.hover,
  },
])
</script>

<style scoped>
.card {
  @apply bg-bg-100 rounded-lg;
}

.card-bordered {
  @apply border border-border-200;
}

.card-shadow {
  @apply shadow-lg;
}

.card-glass {
  @apply glass shadow-glass;
}

.card-hover {
  @apply hover:shadow-xl transition-shadow duration-300;
}

.card-header {
  @apply p-4 border-b border-border-200;
}

.card-content {
  @apply p-4;
}

.card-footer {
  @apply p-4 border-t border-border-200;
}

.card-title {
  @apply text-title;
}
</style>
```

### 3. 组合优于继承

```vue
<!-- ✅ 使用组合式函数 -->
<template>
  <div class="user-profile">
    <div class="profile-avatar">
      <img
        :src="userInfo.avatar"
        :alt="userInfo.name"
      />
      <button
        v-if="canEdit"
        class="btn-primary btn-sm"
        @click="handleUploadAvatar"
      >
        更换头像
      </button>
    </div>

    <div class="profile-info">
      <h2>{{ userInfo.name }}</h2>
      <p>{{ userInfo.email }}</p>
      <span
        class="status-badge"
        :class="statusClass"
      >
        {{ statusText }}
      </span>
    </div>

    <div
      v-if="loading"
      class="loading-overlay"
    >
      <LoadingSpinner />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserProfile } from '@/composables/useUserProfile'
import { usePermissions } from '@/composables/usePermissions'
import { useUpload } from '@/composables/useUpload'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

interface UserProfileProps {
  userId: string
}

const props = defineProps<UserProfileProps>()

// 组合多个功能
const { userInfo, loading, updateProfile } = useUserProfile(props.userId)
const { canEdit } = usePermissions(['user:edit'])
const { uploadFile } = useUpload()

const statusClass = computed(() => {
  const status = userInfo.value?.status
  return {
    'status-active': status === 'active',
    'status-inactive': status === 'inactive',
    'status-banned': status === 'banned',
  }
})

const statusText = computed(() => {
  const statusMap = {
    active: '活跃',
    inactive: '不活跃',
    banned: '已禁用',
  }
  return statusMap[userInfo.value?.status] || '未知'
})

const handleUploadAvatar = async () => {
  try {
    const file = await selectFile({ accept: 'image/*' })
    const uploadedUrl = await uploadFile(file)
    await updateProfile({ avatar: uploadedUrl })
  } catch (error) {
    console.error('上传头像失败:', error)
  }
}
</script>
```

## 📚 组件开发模板

### 1. 基础组件模板

```vue
<!-- src/components/ui/ComponentName.vue -->
<template>
  <div
    :class="componentClasses"
    v-bind="$attrs"
  >
    <!-- 组件内容 -->
    <slot />
  </div>
</template>

<script setup lang="ts">
// 📋 类型定义
interface ComponentNameProps {
  /** 组件变体 */
  variant?: 'primary' | 'secondary'
  /** 组件尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 是否禁用 */
  disabled?: boolean
}

// 🎯 Props 定义
const props = withDefaults(defineProps<ComponentNameProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})

// 📤 事件定义
const emit = defineEmits<{
  /** 点击事件 */
  click: [event: MouseEvent]
  /** 变更事件 */
  change: [value: any]
}>()

// 🎨 样式计算
const componentClasses = computed(() => [
  'component-base',
  `component-${props.variant}`,
  `component-${props.size}`,
  {
    'component-disabled': props.disabled,
  },
])

// 🔧 方法定义
const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}

// 📊 暴露给父组件的方法
defineExpose({
  focus: () => {
    // 聚焦逻辑
  },
  blur: () => {
    // 失焦逻辑
  },
})
</script>

<style scoped>
.component-base {
  @apply /* 基础样式 */;
}

.component-primary {
  @apply /* 主要变体样式 */;
}

.component-disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>
```

### 2. 表单组件模板

```vue
<!-- src/components/form/FormInput.vue -->
<template>
  <div class="form-field">
    <!-- 标签 -->
    <label
      v-if="label"
      :for="inputId"
      class="form-label"
    >
      {{ label }}
      <span
        v-if="required"
        class="form-required"
        >*</span
      >
    </label>

    <!-- 输入框 -->
    <div class="form-input-wrapper">
      <div
        v-if="$slots.prefix"
        class="form-prefix"
      >
        <slot name="prefix" />
      </div>

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="inputClasses"
        v-bind="$attrs"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <div
        v-if="$slots.suffix"
        class="form-suffix"
      >
        <slot name="suffix" />
      </div>
    </div>

    <!-- 错误信息 -->
    <div
      v-if="error"
      class="form-error"
    >
      {{ error }}
    </div>

    <!-- 帮助信息 -->
    <div
      v-if="help && !error"
      class="form-help"
    >
      {{ help }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useId } from '@/composables/useId'

interface FormInputProps {
  /** 输入值 */
  modelValue?: string | number
  /** 输入类型 */
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url'
  /** 标签文本 */
  label?: string
  /** 占位符 */
  placeholder?: string
  /** 是否必填 */
  required?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 错误信息 */
  error?: string
  /** 帮助信息 */
  help?: string
  /** 输入框尺寸 */
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<FormInputProps>(), {
  type: 'text',
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

// 生成唯一ID
const inputId = useId('form-input')

// 样式计算
const inputClasses = computed(() => [
  'form-input',
  `form-input-${props.size}`,
  {
    'form-input-error': props.error,
    'form-input-disabled': props.disabled,
  },
])

// 事件处理
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('change', value)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>

<style scoped>
.form-field {
  @apply space-y-2;
}

.form-label {
  @apply block text-14 font-medium text-text-200;
}

.form-required {
  @apply text-error ml-1;
}

.form-input-wrapper {
  @apply relative flex items-center;
}

.form-input {
  @apply input-base flex-1;
}

.form-input-error {
  @apply input-error;
}

.form-prefix,
.form-suffix {
  @apply flex items-center px-3 text-text-400;
}

.form-error {
  @apply text-12 text-error;
}

.form-help {
  @apply text-12 text-text-400;
}
</style>
```

### 3. 业务组件模板

```vue
<!-- src/components/business/UserCard.vue -->
<template>
  <Card
    :hover="true"
    class="user-card"
  >
    <template #header>
      <div class="user-card-header">
        <img
          :src="user.avatar || defaultAvatar"
          :alt="user.name"
          class="user-avatar"
        />
        <div class="user-info">
          <h3 class="user-name">{{ user.name }}</h3>
          <p class="user-email">{{ user.email }}</p>
        </div>
        <div class="user-status">
          <span :class="statusBadgeClass">
            {{ statusText }}
          </span>
        </div>
      </div>
    </template>

    <div class="user-card-content">
      <div class="user-stats">
        <div class="stat-item">
          <span class="stat-label">部门</span>
          <span class="stat-value">{{ user.department || '-' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">职位</span>
          <span class="stat-value">{{ user.position || '-' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">加入时间</span>
          <span class="stat-value">{{ formatDate(user.createdAt) }}</span>
        </div>
      </div>

      <div class="user-roles">
        <span class="roles-label">角色：</span>
        <div class="roles-list">
          <span
            v-for="role in user.roles"
            :key="role"
            class="role-tag"
          >
            {{ role }}
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="user-card-actions">
        <Button
          variant="primary"
          size="sm"
          @click="handleEdit"
        >
          编辑
        </Button>
        <Button
          variant="outline"
          size="sm"
          @click="handleViewProfile"
        >
          查看详情
        </Button>
        <Button
          variant="ghost"
          size="sm"
          :disabled="user.status === 'banned'"
          @click="handleToggleStatus"
        >
          {{ user.status === 'active' ? '禁用' : '启用' }}
        </Button>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { formatDate } from '@/utils/date'
import { usePermissions } from '@/composables/usePermissions'
import type { User } from '@/types/user'

interface UserCardProps {
  /** 用户信息 */
  user: User
  /** 默认头像 */
  defaultAvatar?: string
}

const props = withDefaults(defineProps<UserCardProps>(), {
  defaultAvatar: '/default-avatar.png',
})

const emit = defineEmits<{
  edit: [user: User]
  viewProfile: [user: User]
  toggleStatus: [user: User]
}>()

// 权限检查
const { hasPermission } = usePermissions()
const canEdit = computed(() => hasPermission('user:edit'))
const canToggleStatus = computed(() => hasPermission('user:status'))

// 状态样式
const statusBadgeClass = computed(() => {
  const baseClass = 'status-badge'
  const statusClasses = {
    active: 'status-success',
    inactive: 'status-warning',
    banned: 'status-error',
  }
  return [baseClass, statusClasses[props.user.status]]
})

// 状态文本
const statusText = computed(() => {
  const statusMap = {
    active: '活跃',
    inactive: '不活跃',
    banned: '已禁用',
  }
  return statusMap[props.user.status] || '未知'
})

// 事件处理
const handleEdit = () => {
  if (canEdit.value) {
    emit('edit', props.user)
  }
}

const handleViewProfile = () => {
  emit('viewProfile', props.user)
}

const handleToggleStatus = () => {
  if (canToggleStatus.value) {
    emit('toggleStatus', props.user)
  }
}
</script>

<style scoped>
.user-card {
  @apply max-w-sm;
}

.user-card-header {
  @apply flex items-start gap-4;
}

.user-avatar {
  @apply w-16 h-16 rounded-full bg-bg-300;
}

.user-info {
  @apply flex-1;
}

.user-name {
  @apply text-title mb-1;
}

.user-email {
  @apply text-body text-text-400;
}

.user-status {
  @apply flex-shrink-0;
}

.status-badge {
  @apply px-2 py-1 rounded text-12 font-medium;
}

.user-card-content {
  @apply space-y-4;
}

.user-stats {
  @apply grid grid-cols-1 gap-2;
}

.stat-item {
  @apply flex justify-between;
}

.stat-label {
  @apply text-12 text-text-400;
}

.stat-value {
  @apply text-12 text-text-200 font-medium;
}

.user-roles {
  @apply flex items-center gap-2;
}

.roles-label {
  @apply text-12 text-text-400;
}

.roles-list {
  @apply flex flex-wrap gap-1;
}

.role-tag {
  @apply status-info;
}

.user-card-actions {
  @apply flex gap-2;
}
</style>
```

## 🔧 组合式函数集成

### 1. 状态管理集成

```typescript
// src/composables/useUserProfile.ts
import { ref, computed } from 'vue'
import { userAPI } from '@/api/modules/user'
import type { User } from '@/types/user'

export function useUserProfile(userId: string) {
  const userInfo = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await userAPI.getUserDetail(userId)
      userInfo.value = response.data
    } catch (err: any) {
      error.value = err.message || '获取用户信息失败'
    } finally {
      loading.value = false
    }
  }

  // 更新用户信息
  const updateProfile = async (data: Partial<User>) => {
    try {
      loading.value = true
      const response = await userAPI.updateUser(userId, data)
      userInfo.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || '更新用户信息失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 计算属性
  const isActive = computed(() => userInfo.value?.status === 'active')
  const displayName = computed(() => {
    return userInfo.value?.nickname || userInfo.value?.username || '未知用户'
  })

  return {
    userInfo: readonly(userInfo),
    loading: readonly(loading),
    error: readonly(error),
    isActive,
    displayName,
    fetchUserInfo,
    updateProfile,
  }
}
```

### 2. 表单验证集成

```typescript
// src/composables/useFormValidation.ts
import { ref, reactive, computed } from 'vue'

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  validator?: (value: any) => string | null
}

interface ValidationRules {
  [key: string]: ValidationRule[]
}

export function useFormValidation<T extends Record<string, any>>(
  initialData: T,
  rules: ValidationRules
) {
  const formData = reactive<T>({ ...initialData })
  const errors = ref<Partial<Record<keyof T, string>>>({})
  const touched = ref<Partial<Record<keyof T, boolean>>>({})

  // 验证单个字段
  const validateField = (field: keyof T): string | null => {
    const value = formData[field]
    const fieldRules = rules[field as string] || []

    for (const rule of fieldRules) {
      // 必填验证
      if (rule.required && (value === null || value === undefined || value === '')) {
        return '此字段为必填项'
      }

      // 最小长度验证
      if (rule.minLength && String(value).length < rule.minLength) {
        return `最少需要${rule.minLength}个字符`
      }

      // 最大长度验证
      if (rule.maxLength && String(value).length > rule.maxLength) {
        return `最多允许${rule.maxLength}个字符`
      }

      // 正则验证
      if (rule.pattern && !rule.pattern.test(String(value))) {
        return '格式不正确'
      }

      // 自定义验证
      if (rule.validator) {
        const error = rule.validator(value)
        if (error) return error
      }
    }

    return null
  }

  // 验证所有字段
  const validateAll = () => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    for (const field in rules) {
      const error = validateField(field as keyof T)
      if (error) {
        newErrors[field as keyof T] = error
        isValid = false
      }
    }

    errors.value = newErrors
    return isValid
  }

  // 清除验证错误
  const clearError = (field: keyof T) => {
    delete errors.value[field]
  }

  // 重置表单
  const resetForm = () => {
    Object.assign(formData, initialData)
    errors.value = {}
    touched.value = {}
  }

  // 设置字段值
  const setFieldValue = (field: keyof T, value: any) => {
    formData[field] = value
    touched.value[field] = true

    // 实时验证
    const error = validateField(field)
    if (error) {
      errors.value[field] = error
    } else {
      clearError(field)
    }
  }

  // 表单是否有效
  const isValid = computed(() => Object.keys(errors.value).length === 0)

  // 表单是否已修改
  const isDirty = computed(() => {
    return Object.keys(touched.value).length > 0
  })

  return {
    formData,
    errors: readonly(errors),
    touched: readonly(touched),
    isValid,
    isDirty,
    validateField,
    validateAll,
    clearError,
    resetForm,
    setFieldValue,
  }
}
```

### 3. 在组件中使用

```vue
<!-- src/components/business/UserForm.vue -->
<template>
  <form
    @submit.prevent="handleSubmit"
    class="user-form"
  >
    <FormInput
      v-model="formData.username"
      label="用户名"
      placeholder="请输入用户名"
      :error="errors.username"
      :required="true"
      @blur="validateField('username')"
    />

    <FormInput
      v-model="formData.email"
      type="email"
      label="邮箱"
      placeholder="请输入邮箱地址"
      :error="errors.email"
      :required="true"
      @blur="validateField('email')"
    />

    <FormInput
      v-model="formData.phone"
      type="tel"
      label="手机号"
      placeholder="请输入手机号"
      :error="errors.phone"
      @blur="validateField('phone')"
    />

    <div class="form-actions">
      <Button
        type="submit"
        variant="primary"
        :loading="loading"
        :disabled="!isValid || !isDirty"
      >
        保存
      </Button>
      <Button
        type="button"
        variant="outline"
        @click="resetForm"
      >
        重置
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import FormInput from '@/components/form/FormInput.vue'
import Button from '@/components/ui/Button.vue'
import { useFormValidation } from '@/composables/useFormValidation'
import { useUserProfile } from '@/composables/useUserProfile'
import type { User } from '@/types/user'

interface UserFormProps {
  userId?: string
  initialData?: Partial<User>
}

const props = defineProps<UserFormProps>()

const emit = defineEmits<{
  submit: [data: Partial<User>]
  cancel: []
}>()

// 表单初始数据
const initialFormData = {
  username: props.initialData?.username || '',
  email: props.initialData?.email || '',
  phone: props.initialData?.phone || '',
}

// 验证规则
const validationRules = {
  username: [
    { required: true },
    { minLength: 3 },
    { maxLength: 20 },
    { pattern: /^[a-zA-Z0-9_-]+$/ },
  ],
  email: [{ required: true }, { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }],
  phone: [{ pattern: /^1[3-9]\d{9}$/ }],
}

// 使用表单验证
const { formData, errors, isValid, isDirty, validateField, validateAll, resetForm } =
  useFormValidation(initialFormData, validationRules)

// 使用用户信息管理
const { loading, updateProfile } = useUserProfile(props.userId || '')

// 提交表单
const handleSubmit = async () => {
  if (!validateAll()) {
    return
  }

  try {
    if (props.userId) {
      await updateProfile(formData)
    }
    emit('submit', formData)
  } catch (error) {
    console.error('保存用户信息失败:', error)
  }
}

// 组件挂载时如果有用户ID则加载数据
onMounted(() => {
  if (props.userId && !props.initialData) {
    // 加载用户数据
  }
})
</script>

<style scoped>
.user-form {
  @apply space-y-6 max-w-md;
}

.form-actions {
  @apply flex gap-3 pt-4;
}
</style>
```

## 🎨 样式和主题

### 1. CSS 变量集成

```vue
<template>
  <div
    class="themed-component"
    :class="themeClasses"
  >
    <div class="component-header">
      <h2 class="component-title">{{ title }}</h2>
      <button
        class="theme-toggle"
        @click="toggleTheme"
      >
        <i :class="themeIcon"></i>
      </button>
    </div>
    <div class="component-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useColorStore } from '@/stores/modules/color'

interface ThemedComponentProps {
  title: string
}

defineProps<ThemedComponentProps>()

const colorStore = useColorStore()

const themeClasses = computed(() => ({
  'theme-dark': colorStore.isDark,
  'theme-light': colorStore.isLight,
}))

const themeIcon = computed(() =>
  colorStore.isDark ? 'i-mdi:weather-sunny' : 'i-mdi:weather-night'
)

const toggleTheme = () => {
  colorStore.toggleTheme()
}
</script>

<style scoped>
.themed-component {
  @apply card p-6 transition-colors duration-300;
}

.component-header {
  @apply flex-between mb-4;
}

.component-title {
  @apply text-title;
}

.theme-toggle {
  @apply btn-ghost p-2;
}

.component-content {
  @apply text-body;
}

/* 主题特定样式 */
.theme-dark .themed-component {
  @apply bg-bg-300;
}

.theme-light .themed-component {
  @apply bg-white;
}
</style>
```

### 2. 动态样式绑定

```vue
<template>
  <div
    class="dynamic-component"
    :style="dynamicStyles"
    :class="dynamicClasses"
  >
    <div
      class="progress-bar"
      :style="{ width: `${progress}%` }"
    ></div>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface DynamicComponentProps {
  color?: string
  size?: number
  progress?: number
  variant?: 'solid' | 'outline' | 'gradient'
}

const props = withDefaults(defineProps<DynamicComponentProps>(), {
  color: 'var(--primary-color)',
  size: 16,
  progress: 0,
  variant: 'solid',
})

const dynamicStyles = computed(() => ({
  '--component-color': props.color,
  '--component-size': `${props.size}px`,
  fontSize: `${props.size}px`,
}))

const dynamicClasses = computed(() => [
  'dynamic-component',
  `variant-${props.variant}`,
  {
    'is-complete': props.progress >= 100,
  },
])
</script>

<style scoped>
.dynamic-component {
  position: relative;
  padding: var(--component-size);
  border-radius: calc(var(--component-size) / 4);
  transition: all 0.3s ease;
}

.variant-solid {
  background-color: var(--component-color);
  color: white;
}

.variant-outline {
  border: 2px solid var(--component-color);
  color: var(--component-color);
}

.variant-gradient {
  background: linear-gradient(135deg, var(--component-color), transparent);
}

.progress-bar {
  @apply absolute top-0 left-0 h-1 bg-current transition-all duration-300;
}

.is-complete .progress-bar {
  @apply bg-success;
}
</style>
```

## 🔧 最佳实践

### 1. 性能优化

```vue
<template>
  <!-- 使用 v-once 优化静态内容 -->
  <div
    v-once
    class="static-header"
  >
    <h1>{{ title }}</h1>
  </div>

  <!-- 使用 v-memo 优化复杂列表 -->
  <div
    v-for="item in list"
    :key="item.id"
    v-memo="[item.id, item.status, item.priority]"
    class="list-item"
  >
    <span>{{ item.name }}</span>
    <span :class="getStatusClass(item.status)">{{ item.status }}</span>
  </div>

  <!-- 懒加载大量数据 -->
  <div
    ref="containerRef"
    class="virtual-list"
  >
    <div
      v-for="item in visibleItems"
      :key="item.id"
      class="virtual-item"
      :style="{ height: itemHeight + 'px' }"
    >
      {{ item.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useVirtualList } from '@/composables/useVirtualList'

// 虚拟滚动优化大列表
const containerRef = ref<HTMLElement>()
const itemHeight = 60

const { visibleItems } = useVirtualList({
  container: containerRef,
  itemHeight,
  items: props.items,
})

// 防抖优化搜索
const searchDebounced = useDebounceFn((keyword: string) => {
  // 搜索逻辑
}, 300)
</script>
```

### 2. 错误边界

```vue
<template>
  <div class="error-boundary">
    <div
      v-if="error"
      class="error-fallback"
    >
      <h2>组件加载失败</h2>
      <p>{{ error.message }}</p>
      <button
        @click="retry"
        class="btn-primary"
      >
        重试
      </button>
    </div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const error = ref<Error | null>(null)

// 捕获子组件错误
onErrorCaptured((err, vm, info) => {
  error.value = err
  console.error('组件错误:', err, info)
  return false // 阻止错误向上传播
})

const retry = () => {
  error.value = null
}
</script>
```

### 3. 测试友好

```vue
<template>
  <div
    class="testable-component"
    data-testid="user-card"
  >
    <button
      data-testid="edit-button"
      :aria-label="`编辑用户 ${user.name}`"
      @click="handleEdit"
    >
      编辑
    </button>

    <div
      data-testid="user-status"
      :data-status="user.status"
    >
      {{ statusText }}
    </div>
  </div>
</template>

<script setup lang="ts">
// 暴露测试方法
defineExpose({
  // 测试辅助方法
  getUser: () => props.user,
  triggerEdit: () => handleEdit(),

  // 状态查询方法
  isLoading: () => loading.value,
  hasError: () => !!error.value,
})
</script>
```

## 📋 组件清单

### 通用组件

| 组件名         | 路径                        | 描述         | 状态 |
| -------------- | --------------------------- | ------------ | ---- |
| LanguageSwitch | `common/LanguageSwitch.vue` | 语言切换组件 | ✅   |
| ThemeToggle    | `common/ThemeToggle.vue`    | 主题切换组件 | ✅   |
| LoadingSpinner | `common/LoadingSpinner.vue` | 加载动画组件 | ✅   |

### 表单组件

| 组件名       | 路径                    | 描述       | 状态 |
| ------------ | ----------------------- | ---------- | ---- |
| FormInput    | `form/FormInput.vue`    | 输入框组件 | ✅   |
| FormSelect   | `form/FormSelect.vue`   | 选择框组件 | 🚧   |
| FormCheckbox | `form/FormCheckbox.vue` | 复选框组件 | 🚧   |
| FormRadio    | `form/FormRadio.vue`    | 单选框组件 | 🚧   |

### UI 组件

| 组件名 | 路径            | 描述       | 状态 |
| ------ | --------------- | ---------- | ---- |
| Button | `ui/Button.vue` | 按钮组件   | ✅   |
| Modal  | `ui/Modal.vue`  | 模态框组件 | 🚧   |
| Table  | `ui/Table.vue`  | 表格组件   | 🚧   |
| Card   | `ui/Card.vue`   | 卡片组件   | ✅   |

### 业务组件

| 组件名      | 路径                       | 描述     | 状态 |
| ----------- | -------------------------- | -------- | ---- |
| UserCard    | `business/UserCard.vue`    | 用户卡片 | ✅   |
| DataChart   | `business/DataChart.vue`   | 数据图表 | 🚧   |
| SearchPanel | `business/SearchPanel.vue` | 搜索面板 | 🚧   |

## 🎯 总结

CC-Admin 的组件开发体系具有以下特点：

- ✅ **现代化语法**: 使用 Vue 3.5+ 和组合式 API
- ✅ **类型安全**: 完整的 TypeScript 类型支持
- ✅ **模块化设计**: 清晰的组件分类和目录结构
- ✅ **可复用性**: 高度可配置和可扩展的组件设计
- ✅ **性能优化**: 虚拟滚动、懒加载等性能优化策略
- ✅ **主题集成**: 完美集成主题系统和响应式设计
- ✅ **测试友好**: 提供测试辅助属性和方法
- ✅ **开发体验**: 丰富的开发工具和最佳实践指南

通过统一的设计原则和开发规范，确保组件系统的一致性、可维护性和开发效率！🚀
