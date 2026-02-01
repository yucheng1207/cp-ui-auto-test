/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-31 14:04:04
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-02-06 12:55:40
 * @FilePath: /ibu-pay-ui-auto-test/test/resource/steps/common/auth.steps.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { IWorld, defineStep } from '@cucumber/cucumber';
import { clearLoginStorage, generateAuthCache, login, switchUser } from '../utils/stepUtils';

defineStep('生成测试账号缓存文件', async function (this: IWorld<any>) {
  await generateAuthCache();
});

defineStep('登录账号{string}', async function (uid) {
  await login(uid);
});

defineStep('登录账号{string}，且保存登录状态', async function (uid) {
  await login(uid, true);
});

defineStep('切换账号{string}', async function (uid) {
  this.skipImage = true;
  await switchUser(uid);
});

defineStep('将当前账号环境设置为{string}', async function (uid) {
  await switchUser(uid);
});

defineStep('清除登录状态', async function () {
  await clearLoginStorage();
});

// defineStep('登录账号[{string}]密码[{string}]', async ()  {

// });

// defineStep('退出登录', async ()  {

// });
