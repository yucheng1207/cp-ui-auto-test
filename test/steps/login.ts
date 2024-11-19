/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-19 09:56:20
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-01-25 16:23:07
 * @FilePath: /ui-auto-test/src/test/steps/login.js
 * @Description: login 步骤定义
 */
import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
setDefaultTimeout(60000)

Given('要执行测试了', async () => {
    console.log(`step: 进入了测试`)
});

Then('提前做一些事情', async () => {
    console.log(`step: 提前做一些事情`)
});


Given('进入{string}页', async (name) => {
    console.log(`step: 进入${name}页`)
});

When('点击登入會員按钮', async () => {
    console.log(`step: 点击登入會員按钮`)
});

When('我输入账号{string}', async (username) => {
    console.log(`step: 点击登入會員按钮`)
});

When('点击继续', async () => {
    console.log(`step: 点击继续`)
});

When('我输入密码{string}', async (password) => {
    console.log(`step: 我输入密码${password}`)
});


When('点击登录', async () => {
    console.log(`step: 点击登录`)
});

Then('登录成功', async () => {
    console.log(`step: 登录成功`)
});


Then('密码错误', async () => {
    console.log(`step: 密码错误`)
});
