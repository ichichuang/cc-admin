/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - layout
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/* eslint-disable @typescript-eslint/naming-convention */
/**
 * 布局快捷方式
 */
export const layoutShortcuts = {
  // 基础布局
  full: 'w-full h-full',
  container: 'w-full h-full bg-bg100 color-text100',
  screen: 'min-h-screen',

  // Flex 布局
  center: 'flex items-center justify-center',
  between: 'flex items-center justify-between',
  around: 'flex items-center justify-around',
  start: 'flex items-center justify-start',
  end: 'flex items-center justify-end',
  'center-col': 'flex flex-col items-center justify-center',
  'between-col': 'flex flex-col justify-between',
  'evenly-col': 'flex flex-col justify-evenly',
  'around-col': 'flex flex-col justify-around',
  'start-col': 'flex flex-col justify-start',
  'end-col': 'flex flex-col justify-end',

  // Grid 布局
  'grid-center': 'grid place-items-center',
}
