/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-25 16:55:24
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-01-25 16:55:33
 * @FilePath: /ui-auto-test/test/helper/report/report.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const report = require("multiple-cucumber-html-reporter");
const path = require('path');
const root = process.cwd();

report.generate({
    // 页面title
    pageTitle: 'Cucumber UI自动化测试报告',
    // 导入json
    jsonDir: 'test-results/report',
    reportPath: "reports/",
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
    //     device: "Koushik - PC",
    //     platform: {
    //         name: "Windows",
    //         version: "10",
    //     },
    // },
    durationInMS: true,
    // openReportInBrowser: OPEN_BROWSER === undefined || OPEN_BROWSER === 'true',
    customData: {
        title: "Test Info",
        data: [
            { label: "Project", value: "Book Cart Application" },
            { label: "Release", value: "1.2.3" },
            { label: "Cycle", value: "Smoke-1" }
        ],
    },
});