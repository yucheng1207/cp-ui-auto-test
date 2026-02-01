/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-30 17:02:53
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-03-25 11:07:47
 * @FilePath: /ibu-pay-ui-auto-test/test/resource/helper/pages/login.ts
 * @Description: LoginPage
 */
import { expect } from '@playwright/test';
import * as fs from 'fs-extra';
import { getConfig } from '../../config';
import { getBrowserStorageStatePath, gotoPage, setBrowserStorageState } from '../browser';
import { getPage, getBrowserContext } from '../../cache/selector';

const config = getConfig();
const { users, pages: pageConfig } = config;
const loginUrl = pageConfig['登录页面'];

const Elements = {
  loginButton: '.mc-hd__login-btn',
  loginModal: 'div#ibu_login_online',
  inputContainer: 'div[class*="r_input"]',
  emailInputContainer: 'div[class*="r_input"]',
  emailInput: "//input[@placeholder='請輸入電郵地址']",
  continueButton: '.ibu-button-submit-class',
  submitButton: '.ibu-button-submit-class',
  pwdInputContainer: "(//div[@class='r_input'])[2]",
  pwdInput: "//input[@placeholder='請輸入密碼']",
  loginIcon: '#header_action_coins i',
  h5ClosePopup: '.tcp-h5-install-popup__close',
  h5OpenMenu: '.tcp-h5-header-wrap .tcp-h5-header-switch-icon',
  h5LoginButton: '.signin',
  h5LoginModal: 'div[class*="loginRegisterPageWrap"]',
  h5InputContainer: 'div[class*="inputMain"]',
  h5SubmitButton: 'button[class*="newButton"]',
  h5PasswordWrapper: 'div[class*="pwdSetWrap"]',
  h5LoggedInIcon: '.tcp-h5-header-switch-login-coins',
};

export default class LoginPage {
  private userInfo: {
    uid: string;
    password: string;
  };

  /**
   * 进入登录页面并完成登录
   * @param uid
   */
  login = async (uid?: string) => {
    if (uid && !users[uid]) {
      throw new Error('登录失败，测试账号不存在');
    } else if (!uid) {
      this.userInfo = users.default;
      console.warn('没有提供测试 uid，使用默认账号：', this.userInfo.uid);
    }
    if (uid && users[uid]) {
      this.userInfo = users[uid];
    }
    await gotoPage(loginUrl, 'domcontentloaded');
    // await wait(20);
    // return;
    const page = getPage();
    let isH5;
    if (page) {
      // await wait(2); // if using h5 to create auth info, enable this
      const adPopup = page.locator(Elements.h5ClosePopup);
      const adPopupCount = await adPopup.count();
      if (adPopupCount === 1) {
        await adPopup.click();
      }
      const h5OpenMenu = await page.locator(Elements.h5OpenMenu);
      if ((await h5OpenMenu.count()) === 1) {
        isH5 = true;
        // H5
        await h5OpenMenu.click();
      }
      // 点击登入會員按钮
      await page.locator(isH5 ? Elements.h5LoginButton : Elements.loginButton).click();
      const loginModal = await page.locator(isH5 ? Elements.h5LoginModal : Elements.loginModal);
      // 点击登入會員按钮
      const emailInputContainer = await page.locator(
        isH5 ? Elements.h5InputContainer : Elements.inputContainer,
      );
      await emailInputContainer.click();
      await emailInputContainer
        .locator(isH5 ? 'input' : Elements.emailInput)
        .fill(this.userInfo.uid);
      // 点击继续
      await loginModal.locator(isH5 ? Elements.h5SubmitButton : Elements.submitButton).click();
      // 输入密码
      await page.locator(isH5 ? Elements.h5InputContainer : Elements.inputContainer).click();
      const passwordInputWrapper = await page.locator(Elements.h5PasswordWrapper);
      if (isH5) {
        await expect(passwordInputWrapper).toHaveCount(1);
      }
      await (isH5 ? passwordInputWrapper : emailInputContainer)
        .locator(isH5 ? 'input' : Elements.pwdInput)
        .fill(this.userInfo.password);
      // 点击登录
      await (isH5 ? passwordInputWrapper : loginModal)
        .locator(isH5 ? Elements.h5SubmitButton : Elements.submitButton)
        .click();
      const loginLogo = page.locator(isH5 ? Elements.h5LoggedInIcon : Elements.loginIcon);
      if (isH5) await expect(loginLogo).toHaveCount(1);
      // 断言登录成功
      await expect(isH5 ? loginLogo : page.locator(Elements.loginIcon)).toBeVisible();
    }
  };

  /**
   * 保存登录状态
   * @param uid
   */
  saveLoginStorage = async (uid: string) => {
    if (users[uid]) {
      this.userInfo = users[uid];
      const page = getPage();
      await page?.waitForTimeout(1000); // 这里要 wait 一下，不然 cookie 存储的不全，原因还没搞清楚
      await setBrowserStorageState(this.userInfo.uid);
    } else {
      throw new Error('Save Login Storage Failed!');
    }
  };

  /**
   * 切换到指定账户，如果未登录，执行登录操作
   * @param uid
   */
  switchUser = async (uid: string) => {
    const context = getBrowserContext();
    const isExistStorage = await fs.pathExists(getBrowserStorageStatePath(uid));
    if (isExistStorage) {
      const cookiesJSON = await fs.readFile(getBrowserStorageStatePath(uid), 'utf-8');
      const { cookies } = JSON.parse(cookiesJSON);
      // 清除当前 context 中的所有 cookies
      await context?.clearCookies();
      // 添加新的 cookies
      await context?.addCookies(cookies);
    } else {
      await this.login(uid);
    }
  };

  clearLoginStorage = async () => {
    const context = getBrowserContext();
    // 清除当前 context 中的所有 cookies
    await context?.clearCookies();
  };
}
