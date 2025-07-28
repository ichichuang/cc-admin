/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - eslint.config
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { name: 'app/files-to-lint', files: ['**/*.{ts,mts,tsx,vue}'] },
  { name: 'app/files-to-ignore', ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    name: 'app/vue-rules',
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    name: 'app/custom-rules',
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      // 允许未使用的变量以_开头
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // 命名规范：完整版本
      '@typescript-eslint/naming-convention': [
        'error',
        // 变量使用 camelCase，允许 UPPER_CASE 常量和特殊变量
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          filter: {
            regex: '^(__.*__|VITE_.*)',
            match: false,
          },
        },
        // 函数使用 camelCase
        {
          selector: 'function',
          format: ['camelCase'],
        },
        // 参数使用 camelCase
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        // 接口使用 PascalCase
        {
          selector: 'interface',
          format: ['PascalCase'],
        },
        // 类型别名使用 PascalCase
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        // 枚举使用 PascalCase
        {
          selector: 'enum',
          format: ['PascalCase'],
        },
        // 枚举成员使用 PascalCase
        {
          selector: 'enumMember',
          format: ['PascalCase'],
        },
        // 类使用 PascalCase
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        // 类方法使用 camelCase
        {
          selector: 'method',
          format: ['camelCase'],
        },
        // 类属性使用 camelCase，但允许特殊属性名
        {
          selector: 'property',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          filter: {
            regex: '^(@|vue/|no-|prefer-|eqeqeq|curly|VITE_|__.*__|drop_|AtRule)',
            match: false,
          },
        },
      ],

      // Vue 组件命名规范
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/attribute-hyphenation': ['error', 'always'],
      'vue/v-on-event-hyphenation': ['error', 'always'],

      // Vue 最佳实践
      'vue/multi-word-component-names': [
        'off',
        {
          ignores: ['index'],
        },
      ],
      'vue/require-default-prop': 'warn',
      'vue/require-prop-types': 'error',
      'vue/no-unused-components': 'warn',
      'vue/no-unused-vars': 'error',

      // 一般代码质量规则
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-undef': 'off', // TypeScript 处理未定义变量
    },
  }
)
