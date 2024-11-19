/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-22 10:45:23
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-01-25 17:17:25
 * @FilePath: /cucumber-playwright-demo/src/test/hooks/index.ts
 * @Description: 测试 hooks
 */
import { BeforeAll, AfterAll, Before, After, Status } from "@cucumber/cucumber";

BeforeAll(async function () {
    console.log('hook: before all')
});

Before(async function ({ pickle }) {
    console.log('hook: before')
});

After(async function ({ pickle, result }) {
    console.log('hook: after')
});

AfterAll(async function () {
    console.log('hook: after all')
})


