/* eslint-disable @typescript-eslint/naming-convention */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 提交类型枚举，严格限制可用的提交类型
    'type-enum': [
      2,
      'always',
      [
        'feat', // ✨ 新功能
        'fix', // 🐛 修复错误
        'docs', // 📝 文档更新
        'style', // 💄 代码格式化（不影响功能的更改）
        'refactor', // ♻️ 代码重构（既不修复错误也不添加功能）
        'perf', // ⚡️ 性能优化
        'test', // ✅ 添加测试
        'build', // 📦 影响构建系统或外部依赖的更改
        'ci', // 👷 持续集成相关的更改
        'chore', // 🔧 其他不修改源代码的更改
        'revert', // ⏪ 撤销先前的提交
        'wip', // 🚧 开发中（临时提交）
        'release', // 🔖 发布版本
      ],
    ],

    // 作用域规则
    'scope-enum': [
      1,
      'always',
      [
        'components', // Vue组件相关
        'utils', // 工具函数
        'api', // API相关
        'types', // 类型定义
        'styles', // 样式相关
        'router', // 路由相关
        'store', // 状态管理
        'config', // 配置文件
        'deps', // 依赖相关
        'build', // 构建相关
        'docs', // 文档
        'test', // 测试
        'ci', // 持续集成
        'release', // 发布相关
      ],
    ],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-empty': [1, 'never'], // 建议填写作用域

    // 主题规则
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [2, 'always', 50],
    'subject-min-length': [2, 'always', 4],

    // 标题规则
    'header-max-length': [2, 'always', 72],
    'header-min-length': [2, 'always', 10],

    // 正文规则
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'body-min-length': [1, 'always', 10],

    // 页脚规则
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],

    // 类型规则
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],

    // 引用规则
    'references-empty': [1, 'never'], // 建议关联issue
  },

  // 自定义解析器配置
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*)(?:\(([\w$.-\s]*?)\))?\s*:\s*(.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
      noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
      revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
      revertCorrespondence: ['header', 'hash'],
    },
  },

  // 忽略的提交模式
  ignores: [
    commit => commit.includes('WIP'),
    commit => commit.includes('wip'),
    commit => /^Merge/.test(commit),
    commit => /^Initial commit/.test(commit),
  ],

  // 默认忽略合并提交
  defaultIgnores: true,

  // 帮助URL
  helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
}
