### 📋 支持的全局函数

| 函数                | 说明             | 示例                       |
| :------------------ | :--------------- | :------------------------- |
| $t(key, params?)    | 翻译文本         | $t('common.actions.save')  |
| $te(key)            | 检查键是否存在   | $te('user.profile.title')  |
| $d(date, format?)   | 格式化日期       | $d(new Date(), 'datetime') |
| $n(number, format?) | 格式化数字       | $n(1234.56)                |
| $tm(key)            | 获取翻译消息对象 | $tm('common.actions')      |
| $rt(message)        | 渲染翻译消息     | $rt(template)              |
