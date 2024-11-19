/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-25 17:37:32
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-01-26 13:41:00
 * @FilePath: /ui-auto-test/test/steps/test.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Given, When, Then, setDefaultTimeout, defineParameterType } from "@cucumber/cucumber";
import { chromium, expect, test, Page, Browser } from "@playwright/test";
setDefaultTimeout(60000)

let page: Page;
let browser: Browser;

Given('快速体验', async () => {
    browser = await chromium.launch({ headless: false });

    const context = await browser.newContext();

    page = await context.newPage();
    await page.goto('https://www.baidu.com');
});

Given('I have {int} cucumbers in my belly', async (data1, data2) => {
    console.log('I have {int} cucumbers in my belly', data1, data2);
});

Given('I have 42.2 cucumbers in my belly', async (data1) => {
    console.log('I have 42.2 cucumbers in my belly', data1);
});

Given('I have {string} cucumbers in my belly', async (data1) => {
    console.log('I have {string} cucumbers in my belly', data1);
});

class Color {
    private color: string;
    constructor(color: string) {
        this.color = color;
    }
}

defineParameterType({
    name: 'color',
    regexp: /red|blue|yellow/,
    transformer: s => new Color(s)
})

Given('I have a {color} ball', async (data1) => {
    console.log('I have a {color} ball', data1);
});

Given('the following animals', async (data1) => {
    console.log('the following animals', data1, data1.transpose());
});

Given('test json', async (data1) => {
    console.log('test json', data1);
});

Given('输入{string}', async (data1) => {
    console.log('输入{string}', data1);
});

Then('显示{string}', async (data1) => {
    console.log('显示{string}', data1);
});