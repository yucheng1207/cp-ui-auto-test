/*
 * @Description:
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-29 15:22:27
 * @LastEditTime: 2024-01-29 20:13:28
 * @LastEditors: ychengzhang ychengzhang@trip.com
 */
module.exports = {
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:import/typescript',
  ],
  plugins: ['cucumber', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  rules: {
    'cucumber/async-then': 'error',
    'cucumber/expression-type': 'error',
    'cucumber/no-restricted-tags': ['error', 'wip', 'todo'],
    'import/extensions': 0, // 取消导入时不使用文件扩展名的警告
    'class-methods-use-this': 0, // 解决 class 组件中没用this报错警告
    'no-console': [
      'error',
      {
        allow: ['error', 'warn'],
      },
    ],
    'no-nested-ternary': 0, // 取消三元嵌套的警告，如 i?j?z?z():j():i():null
    'no-plusplus': 0, // 取消使用++的警告，如i++
    'no-use-before-define': 0, // 取消警告，即在定义变量之前使用它们。
    'no-useless-escape': 0, // 取消转义字符的警告，即模板文字和正则表达式中的非特殊字符不会产生任何影响
    'prefer-promise-reject-errors': 0, // reject可以任意传参
    'prefer-regex-literals': 0, // 解决RegExp报错问题
    '@typescript-eslint/no-explicit-any': 0,
    'prefer-arrow-callback': 0,
    'func-names': 0,
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': 0,
    'no-await-in-loop': 0,
    'prefer-destructuring': 0,
    'no-else-return': 0,
  },
  overrides: [
    {
      files: ['*.ts', '*.jsx', '*.tsx'],
      rules: {
        'no-unused-expressions': 'off',
        'no-shadow': 0, // 解决enum警告
        '@typescript-eslint/no-unused-expressions': 2, // 不允许 a && a()这种写法，只允许if(a) {a()}
      },
    },
  ],
};
