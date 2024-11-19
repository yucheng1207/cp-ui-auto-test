/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-19 09:55:26
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-01-25 16:56:53
 * @FilePath: /ui-auto-test/cucumber.js
 * @Description: cucumber 配置
 */

// https://github.com/cucumber/cucumber-js/blob/main/docs/configuration.md
module.exports = {
  default: {
    paths: ['test/features'],
    require: ['test/steps/**/*.ts', 'test/hooks/**/*.ts'],
    formatOptions: {'snippetInterface': 'synchronous'},
    requireModule: [
      "ts-node/register"
    ],
    format: [
      "html:test-results/report/cucumber-report.html",
      "json:test-results/report/cucumber-report.json",
      "summary:test-results/report/summary.txt"
    ],
  },
}