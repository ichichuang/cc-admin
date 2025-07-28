/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - button
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/* eslint-disable @typescript-eslint/naming-convention */
/**
 * 按钮快捷方式 - 使用完整的功能色系统
 */
export const buttonShortcuts = {
  // 基础按钮样式
  btn: 'inline-flex center px-gap py-gaps mx-gaps rounded transition-slow focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer',

  // 默认按钮
  'btn-default':
    'btn bg-bg200 text-text100 border border-bg300 hover:bg-bg300 focus:ring-primary100',

  // 功能色按钮 - 主要
  'btn-primary':
    'btn bg-primaryColor color-primaryLightColor hover:bg-primaryHoverColor focus:ring-primaryColor active:bg-primaryActiveColor disabled:bg-primaryDisabledColor',
  'btn-success':
    'btn bg-successColor color-successLightColor hover:bg-successHoverColor focus:ring-successColor active:bg-successActiveColor disabled:bg-successDisabledColor',
  'btn-warning':
    'btn bg-warningColor color-warningLightColor hover:bg-warningHoverColor focus:ring-warningColor active:bg-warningActiveColor disabled:bg-warningDisabledColor',
  'btn-error':
    'btn bg-errorColor color-errorLightColor hover:bg-errorHoverColor focus:ring-errorColor active:bg-errorActiveColor disabled:bg-errorDisabledColor',
  'btn-info':
    'btn bg-infoColor color-infoLightColor hover:bg-infoHoverColor focus:ring-infoColor active:bg-infoActiveColor disabled:bg-infoDisabledColor',

  // 轮廓按钮
  'btn-outline-primary':
    'btn border border-primaryColor text-primaryColor bg-transparent hover:bg-primaryLightColor focus:ring-primaryColor',
  'btn-outline-success':
    'btn border border-successColor text-successColor bg-transparent hover:bg-successLightColor focus:ring-successColor',
  'btn-outline-warning':
    'btn border border-warningColor text-warningColor bg-transparent hover:bg-warningLightColor focus:ring-warningColor',
  'btn-outline-error':
    'btn border border-errorColor text-errorColor bg-transparent hover:bg-errorLightColor focus:ring-errorColor',
  'btn-outline-info':
    'btn border border-infoColor text-infoColor bg-transparent hover:bg-infoLightColor focus:ring-infoColor',
}
