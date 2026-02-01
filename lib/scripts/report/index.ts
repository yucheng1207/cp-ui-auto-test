/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-29 19:15:35
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-04-11 15:26:02
 * @FilePath: /ibu-pay-ui-auto-test/test/resource/helper/report/report.ts
 * @Description: 测试报告生成脚本
 */
import * as report from 'multiple-cucumber-html-reporter';
// import path = require('path');
// const root = process.cwd();
const testResult = 'report';

report.generate({
  // 页面title
  pageTitle: 'Cucumber UI自动化测试报告',
  // 导入json
  jsonDir: testResult,
  reportPath: 'reports/',
  reportName: 'Cucumber UI自动化测试报告',
  // 展示时间
  displayDuration: true,
  customMetadata: false,
  hideMetadata: true,
  // metadata: {
  //     browser: {
  //         name: "chrome",
  //         version: "112",
  //     },
  //     device: "PC",
  //     platform: {
  //         name: "Windows",
  //         version: "10",
  //     },
  // },
  durationInMS: true,
  //   customData: {
  //     title: "Test Info",
  //     data: [
  //       { label: 'Project', value: 'IBU 预付收银台自动化测试平台' },
  //       { label: "Release", value: "1.0.0" },
  //     ],
  //   },
  customStyle: `${__dirname}/index.css`,
});
