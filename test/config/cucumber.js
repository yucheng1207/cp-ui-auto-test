/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-19 09:55:26
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-04-12 17:10:21
 * @FilePath: /ui-auto-test/cucumber.js
 * @Description: cucumber 配置
 */

const testResult = 'report';

const baseConfig = {
  paths: ['test/features', 'test/pro-features', 'lib/helper/features'], // 定义 feature 文件路径，只有这些路径下的 feature 会被识别
  require: ['test/steps/**/*.ts', 'lib/helper/steps/**/*.ts', 'lib/helper/hooks/**/*.ts'], // 定义 steps / hook 文件路径，只有这些路径下的 steps / hook 会被识别
  format: [
    // "progress-bar",
    `html:${testResult}/cucumber-report.html`,
    `json:${testResult}/cucumber-report.json`,
    `summary:${testResult}/summary.txt`,
    `rerun:@rerun.txt`,
  ],
  formatOptions: { snippetInterface: 'synchronous' },
  requireModule: ['ts-node/register'],
  parallel: 2,
  retry: 3,
};

// https://github.com/cucumber/cucumber-js/blob/main/docs/configuration.md
module.exports = {
  default: {
    ...baseConfig,
    tags: 'not @lib',
    parallel: 1,
  },
  rerun: {
    ...baseConfig,
    paths: [], // 重跑不需要执行 paths
    parallel: 5,
    retry: 1,
  },
  local: {
    ...baseConfig,
    paths: [],
    parallel: 1,
    retry: 0,
  },
  auth: {
    ...baseConfig,
    tags: '@auth',
    parallel: 3,
  },
  h5: {
    ...baseConfig,
    tags: '@h5 and not @prd',
    parallel: 5,
    retry: 1,
  },
  online: {
    ...baseConfig,
    tags: '@online and not @prd',
    parallel: 5,
    retry: 1,
  },
  h5_prd: {
    ...baseConfig,
    tags: '@h5 and @prd',
    parallel: 5,
    retry: 1,
  },
  online_prd: {
    ...baseConfig,
    tags: '@online and @prd',
    parallel: 5,
    retry: 1,
  },
  demo: {
    ...baseConfig,
    tags: '@demo',
    parallel: 5,
    retry: 3,
  },
};
