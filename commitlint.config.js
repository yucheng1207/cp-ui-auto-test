/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-02-07 11:22:44
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-02-07 11:22:50
 * @FilePath: /ibu-pay-ui-auto-test/commitlint.config.js
 * @Description: commitlint.config.js
 */
module.exports = {
  // 继承的规则
  extends: ['@commitlint/config-conventional'],
  // 定义规则类型
  rules: {
    // type 类型定义，表示 git 提交的 type 必须在以下类型范围内
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能 feature
        'fix', // 修复 bug
        'docs', // 文档注释
        'style', // 代码格式(不影响代码运行的变动)
        'refactor', // 重构(既不增加新功能，也不是修复bug)
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回退
        'build', // 打包
      ],
    ],
    // subject 大小写不做校验
    'subject-case': [0],
  },
};
