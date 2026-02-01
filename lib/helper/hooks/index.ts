/*
 * @Description:
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-26 00:22:30
 * @LastEditTime: 2024-04-11 17:35:42
 * @LastEditors: ychengzhang ychengzhang@trip.com
 */
import {
  BeforeAll,
  AfterAll,
  Before,
  After,
  BeforeStep,
  Status,
  AfterStep,
} from '@cucumber/cucumber';
import * as fs from 'fs-extra';
// import { Browser } from '@ctrip/node-vampire-playwright';
import { Browser } from '@playwright/test';
import { initEnv } from '../utils/env';
import browserInstance from '../utils/stepUtils/browser/instance/browserManager';
import { getConfig } from '../utils/config';
import { initMock } from '../utils/mock';
import cacheInstance from '../utils/cache';
import { getPlatform } from '../utils/cache/selector';
import {
  checkAllListenResponded,
  getRequestResponseDataImmediately,
  screenshot,
} from '../utils/stepUtils';
import { getContext } from '../utils/cucumber';

const config = getConfig();
const { autoScreenshot } = config.webInfo;
let browser: Browser;
const stepImageList = [];
let timestamp = null;

BeforeAll(async function () {
  initEnv();
  browser = await browserInstance.initBrowser();
});

Before(async function (params) {
  const { pickle, gherkinDocument } = params;
  const tags = pickle.tags.map(tag => tag.name);
  const { isH5, isOnline } = getPlatform(tags);
  const device = tags.filter(tag => tag.includes('device'))[0];
  const context = await browserInstance.createContext({
    id: pickle.id,
    name: pickle.name,
    isH5,
    device: device?.split('=')[1] || undefined,
  });
  const page = await browserInstance.createPage(context, true);
  // this.__cache__ 调试使用，业务中不要使用这个值
  // eslint-disable-next-line no-underscore-dangle
  this.__cache__ = cacheInstance.initCache({
    __pickle__: pickle,
    __tags__: tags,
    __browser__: browser,
    __browserContext__: context,
    __page__: page,
    __config__: config,
    __isH5__: isH5,
    __isOnline__: isOnline,
    // __request__: {},
    __globalRequest__: {},
    __domContentLoaded__: {},
    __attach__: this.attach,
    __state__: {},
  });
  // console.log(`开始测试：${gherkinDocument.feature?.name} ${pickle.name}`);
  this.featureName = gherkinDocument.feature?.name;
  this.scenarioName = pickle.name;
  // await initMock(page, gherkinDocument.feature?.name || '', pickle.name);
  timestamp = new Date().getTime();
});

BeforeStep(async function (params) {
  const { pickle, gherkinDocument, pickleStep } = params;
  const page = cacheInstance.getCache('__page__');
  await initMock(page, gherkinDocument.feature?.name || '', pickle.name, pickleStep.text);
});

AfterStep(async function (params) {
  const { pickle, result, gherkinDocument, pickleStep } = params;
  if (autoScreenshot && !this.skipImage && (result.status === Status.FAILED || Status.PASSED)) {
    const img = await screenshot(
      `${gherkinDocument.feature?.name}-${pickle.name}-${pickleStep.text}`,
      false,
    );
    stepImageList.push(img);
  } else {
    this.skipImage = false;
  }
});

After(async function (params) {
  const { pickle, result } = params;
  const isFailed = result?.status === Status.FAILED;
  const currTimestamp = new Date().getTime();
  // eslint-disable-next-line no-console
  console.log(
    `测试结果：${result?.status} ${this.featureName} ${this.scenarioName}，耗时：${(currTimestamp - timestamp) / 1000}s`,
  );
  await checkAllListenResponded();
  const data = await browserInstance.closeAllPage({
    id: pickle.id,
    name: pickle.name,
    screenshot: isFailed,
  });
  const { imgList: lastImageList, tracePath, videoPathList } = data;
  const imgList = [...stepImageList, ...lastImageList];
  if (imgList.length) {
    imgList.forEach(img => {
      this.attach(img, {
        mediaType: 'image/png',
        fileName: 'image',
      });
    });
  }
  if (videoPathList.length) {
    videoPathList.forEach(videoPath => {
      this.attach(fs.readFileSync(videoPath), {
        mediaType: 'video/webm',
        fileName: 'video',
      });
    });
  }
  if (tracePath) {
    const traceFileLink = `<a href="https://trace.playwright.dev/">Open ${tracePath}</a>`;
    this.attach(`Trace file: ${traceFileLink}`, 'text/html');
  }
  // this.__cache__ 调试使用，业务中不要使用这个值
  // eslint-disable-next-line no-underscore-dangle
  this.__cache__ = cacheInstance.setCache({
    __pickle__: null,
    __tags__: [],
    // __browser__: null,
    __browserContext__: null,
    __page__: null,
    // __config__: getConfig(),
    __isH5__: false,
    __isOnline__: false,
    // __request__: {},
  });
});

AfterAll(async function () {
  await browserInstance.closeBrowser();
  browser = null;
  cacheInstance.setCache({ __browser__: null });
});

function getUrlParams(url: string): any {
  // 通过 ? 分割获取后面的参数字符串
  const urlStr = url.split('?')[1];
  // 创建空对象存储参数
  const obj = {};
  // 再通过 & 将每一个参数单独分割出来
  const paramsArr = urlStr.split('&');
  for (let i = 0, len = paramsArr.length; i < len; i++) {
    // 再通过 = 将每一个参数分割为 key:value 的形式
    const arr = paramsArr[i].split('=');
    obj[arr[0]] = arr[1];
  }
  return obj;
}
