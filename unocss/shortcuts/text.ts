/* eslint-disable @typescript-eslint/naming-convention */
/**
 * 文本快捷方式
 */
export const textShortcuts = {
  // 文本省略 - 删除冗余的 line-clamp 快捷方式，保留基础省略
  'text-ellipsis': 'truncate overflow-hidden whitespace-nowrap',

  // 文本样式 - 使用新的文本色系统
  'text-title': 'text-xl font-bold text-text100',
  'text-subtitle': 'text-lg font-medium text-text100',
  'text-body': 'text-base text-text100',
  'text-caption': 'text-sm text-text200',
  'text-muted': 'text-sm text-text200',
}
