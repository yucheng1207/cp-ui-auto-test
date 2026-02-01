import { defineStep } from '@cucumber/cucumber';
import {
  // checkRequestCache,
  clickElement,
  clickText,
  convertStepParamToObject,
  findElementAndInput,
  findElementToBeHidden,
  findElementToBeVisible,
  findElementToContainElement,
  findElementToContainText,
  findElementToHaveText,
  findText,
  gotoPage,
  listenAndCheckResponse,
  listenAndCheckResponseCode,
  // listenAndSaveRequestCache,
  screenshot,
  wait,
  waitAndCheckResponse,
  waitAndCheckResponseCode,
  listenAndCheckStatusCode,
  waitResponse,
} from '../utils/stepUtils';
import { mockServiceWithExpectData, useMockData } from '../utils/mock';
import { getContext } from '../utils/cucumber';

defineStep('进入网页{string}', async function (url) {
  await gotoPage(url, 'load');
});

defineStep('等待{int}秒', async function (int) {
  await wait(int);
});

defineStep('页面渲染完成出现元素{string}', async function (selector) {
  await findElementToBeVisible(selector);
});

defineStep('点击{string}', async function (selector) {
  await clickElement(selector);
});

defineStep('点击元素{string}', async function (selector) {
  await clickElement(selector);
});

defineStep('点击文案{string}', async function (text) {
  await clickText(text);
});

defineStep('存在文案{string}', async function (text) {
  if (!findText(text)) {
    throw new Error(`不存在文案${text}`);
  }
});

defineStep('不存在文案{string}', async function (text) {
  if (findText(text)) {
    throw new Error(`存在文案${text}`);
  }
});

defineStep('存在元素{string}', async function (selector) {
  await findElementToBeVisible(selector);
});

defineStep('不存在元素{string}', async function (selector) {
  await findElementToBeHidden(selector);
});

defineStep('{string}的文案为{string}', async function (selector, text) {
  await findElementToHaveText(selector, text);
});

defineStep('元素{string}的文案包含{string}', async function (selector, text) {
  await findElementToContainText(selector, text);
});

defineStep('元素{string}中存在元素{string}', async function (selector1, selector2) {
  await findElementToContainElement(selector1, selector2);
});

defineStep('元素{string}中清空并输入{string}', async function (selector, text) {
  await findElementAndInput(selector, text);
});

// defineStep('文案[{string}]的属性[{string}]为[{string}]', async function(text)  {
// });

defineStep('全屏截图,名称为{string}', async function (name) {
  await screenshot.call(this, name);
});

// defineStep('在[{string}]中向[{string}]查找[{string}]的元素', async function(...params)  {

// });

// defineStep('在[{string}]中选择[{string}]', async function(...params)  {

// });

// defineStep('存在[父选择器]的[子选择器]的元素', async function(...params)  {

// });

// defineStep('[父选择器]的[子选择器]的文案为[{string}]', async function(...params)  {

// });

// defineStep('缓存服务请求[operation[,operation …]]', async function(...params)  {

// });

// defineStep('移除请求缓存[operation[,operation …]]', async function(...params)  {

// });

// defineStep('移除所有请求缓存', async function(...params)  {

// });

// defineStep('监听服务[operation[,operation …]]绑定MockCase[mockCaseId[,mockCaseId …]]', async function(...params)  {

// });

// defineStep('移除服务监听[operation[,operation …]]', async function(...params)  {

// });

// defineStep('移除所有服务监听', async function(...params)  {

// });

// defineStep('验证服务请求[operation]与[target_data_path]一致', async function(...params)  {

// });

// defineStep('验证服务非json请求[operation]与[target_data_path]一致', async function(...params)  {

// });

// defineStep('验证服务[operation]的请求参数[target_json_path]与[expect_value]一致', async function(...params)  {

// });

defineStep('等待请求{string}响应', async function (str) {
  await waitResponse(str);
});

defineStep('校验请求{string}响应{int}次', async function (str, count) {
  await waitResponse(str, count);
});

defineStep('等待请求{string}响应{int}次', async function (str, count) {
  await waitResponse(str, count);
});

defineStep('等待请求{string}响应并校验请求结果', async function (str, result) {
  await waitAndCheckResponse(str, convertStepParamToObject(result));
});

defineStep('等待请求{string}响应并校验第{int}次请求结果', async function (str, count, result) {
  await waitAndCheckResponse(str, convertStepParamToObject(result), count);
});

defineStep('等待请求{string}响应并校验code等于{int}', async function (str, code) {
  await waitAndCheckResponseCode(str, code, 'equal');
});

defineStep('等待请求{string}响应并校验code大于{int}', async function (str, code) {
  await waitAndCheckResponseCode(str, code, 'greaterThan');
});

defineStep('等待请求{string}响应并校验code大于等于{int}', async function (str, code) {
  await waitAndCheckResponseCode(str, code, 'greaterThanOrEqual');
});

defineStep('等待请求{string}响应并校验code小于{int}', async function (str, code) {
  await waitAndCheckResponseCode(str, code, 'lessThan');
});

defineStep('等待请求{string}响应并校验code小于等于{int}', async function (str, code) {
  await waitAndCheckResponseCode(str, code, 'lessThanOrEqual');
});

defineStep('等待请求{string}响应并校验第{int}次code等于{int}', async function (str, count, code) {
  await waitAndCheckResponseCode(str, code, 'equal', count);
});

defineStep('等待请求{string}响应并校验第{int}次code大于{int}', async function (str, count, code) {
  await waitAndCheckResponseCode(str, code, 'greaterThan', count);
});

defineStep(
  '等待请求{string}响应并校验第{int}次code大于等于{int}',
  async function (str, count, code) {
    await waitAndCheckResponseCode(str, code, 'greaterThanOrEqual', count);
  },
);

defineStep('等待请求{string}响应并校验第{int}次code小于{int}', async function (str, count, code) {
  await waitAndCheckResponseCode(str, code, 'lessThan', count);
});

defineStep(
  '等待请求{string}响应并校验第{int}次code小于等于{int}',
  async function (str, count, code) {
    await waitAndCheckResponseCode(str, code, 'lessThanOrEqual', count);
  },
);

defineStep('监听请求{string}并校验code等于{int}', async function (str, code) {
  await listenAndCheckResponseCode(str, code, 'equal');
});

defineStep('监听请求{string}并校验code大于{int}', async function (str, code) {
  await listenAndCheckResponseCode(str, code, 'greaterThan');
});

defineStep('监听请求{string}并校验code大于等于{int}', async function (str, code) {
  await listenAndCheckResponseCode(str, code, 'greaterThanOrEqual');
});

defineStep('监听请求{string}并校验code小于{int}', async function (str, code) {
  await listenAndCheckResponseCode(str, code, 'lessThan');
});

defineStep('监听请求{string}并校验code小于等于{int}', async function (str, code) {
  await listenAndCheckResponseCode(str, code, 'lessThanOrEqual');
});

defineStep('监听请求{string}并校验请求结果', async function (str, result) {
  await listenAndCheckResponse(str, convertStepParamToObject(result));
});

// defineStep('监听并缓存请求{string}，缓存key为{string}', async function (str, key) {
//   await listenAndSaveRequestCache(str, key);
// });

// defineStep('读取{string}请求缓存并校验请求结果', async function (key, result) {
//   await checkRequestCache(key, convertStepParamToObject(result));
// });

defineStep('使用Mock配置{string}', async function (filename) {
  const { page } = getContext();
  await useMockData(page, filename);
});

defineStep('Mock服务{string}', async function (name, expectData) {
  await mockServiceWithExpectData(name, convertStepParamToObject(expectData));
});

defineStep('监听请求{string}并校验statusCode等于{int}', async function (str, code) {
  await listenAndCheckStatusCode(str, code, 'equal');
});
