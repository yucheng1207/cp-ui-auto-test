/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-02-04 14:56:11
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-04-07 13:38:13
 * @FilePath: /ibu-pay-ui-auto-test/lib/helper/utils/mock/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Page } from '@playwright/test';
import { getConfig } from '../config';
import { getFilePath } from '../file';
import { getContext } from '../cucumber';

interface IMockDataItem {
  name: string;
  reg: string;
  scope: {
    features:
      | {
          name: string;
          scenarios:
            | {
                name: string;
                steps: string[] | 'all';
              }[]
            | 'all';
        }[]
      | 'all';
  };
  response: any;
}

interface IMockData {
  [key: string]: IMockDataItem;
}

export const initMock = async (page: Page, feature?: string, scenario?: string, step?: string) => {
  const config = getConfig();
  const { mock: mockConfig } = config;

  if (mockConfig.enable) {
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires, import/no-dynamic-require
    const cfgData: IMockData = require(getFilePath(`test/config/mock/${mockConfig.name}.json`));
    // const files = getAllFileNames('test/config/mock')
    const matchMap = {};
    await page.route(
      url => {
        let isMatch = false;
        Object.keys(cfgData).forEach(key => {
          const data = cfgData[key];
          const regStr = data.reg;
          const pattern = new RegExp(regStr.replace(/\*\*/g, '.*'));
          if (pattern.test(url.pathname)) {
            const cfgFeatures = data.scope?.features;
            const matchAllFeature = !cfgFeatures || (cfgFeatures && cfgFeatures === 'all');
            const matchCurFeature =
              Array.isArray(cfgFeatures) &&
              feature &&
              cfgFeatures.find(item => item.name === feature);
            if (matchAllFeature) {
              // eslint-disable-next-line no-console
              console.log('Mock data match all features', cfgFeatures);
              isMatch = true;
            } else if (matchCurFeature) {
              const matchAllScenario =
                !matchCurFeature.scenarios || matchCurFeature.scenarios === 'all';
              const matchCurScenario =
                Array.isArray(matchCurFeature.scenarios) &&
                scenario &&
                matchCurFeature.scenarios.find(item => item.name === scenario);
              if (matchAllScenario) {
                // eslint-disable-next-line no-console
                console.log(
                  'Mock data match scenarios',
                  matchCurFeature,
                  matchCurFeature.scenarios,
                );
                isMatch = true;
              } else if (matchCurScenario) {
                const matchAllSteps = !matchCurScenario.steps || matchCurScenario.steps === 'all';
                const matchCurStep =
                  Array.isArray(matchCurScenario.steps) &&
                  step &&
                  matchCurScenario.steps.find(name => name === step); // todo: 这里步骤匹配不能简单的用 ===
                if (matchAllSteps || matchCurStep) {
                  // eslint-disable-next-line no-console
                  console.log(
                    'Mock data match steps',
                    matchCurFeature,
                    matchCurScenario,
                    matchCurScenario.steps,
                  );
                  isMatch = true;
                }
              }
            }
            if (isMatch) {
              matchMap[url.href] = {
                data: data.response,
              };
              // eslint-disable-next-line no-console
              console.log('Mock data match url', url.href);
            }
          }
        });
        return isMatch;
      },
      route => {
        const requestUrl = route.request().url();
        // const requestBody = route.request().postData();

        if (matchMap[requestUrl]) {
          route.fulfill({ body: JSON.stringify(matchMap[requestUrl].data) });
        } else {
          route.continue();
        }
      },
    );
  }
};

/**
 * 使用对应的 Mock 配置文件
 * @param page - playwright page
 * @param filename - mock 文件名
 * @param conversionFunction - mock 转换函数
 */
export const useMockData = async (
  page: Page,
  filename: string,
  conversionFunction?: (data: any) => any,
) => {
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires, import/no-dynamic-require
  const cfgData: IMockData = require(getFilePath(`test/config/mock/${filename}.json`));
  const matchMap = {};
  await page.route(
    url => {
      let isMatch = false;
      Object.keys(cfgData).forEach(key => {
        const data = cfgData[key];
        const regStr = data.reg;
        const pattern = new RegExp(regStr.replace(/\*\*/g, '.*'));
        if (pattern.test(url.pathname)) {
          isMatch = true;
          matchMap[url.href] = {
            data: data.response,
          };
          // eslint-disable-next-line no-console
          console.log('Mock data match url', url.href);
        }
      });
      return isMatch;
    },
    route => {
      const requestUrl = route.request().url();
      // const requestBody = route.request().postData();

      if (matchMap[requestUrl]) {
        const matchData = matchMap[requestUrl].data;
        route.fulfill({
          body: JSON.stringify(conversionFunction ? conversionFunction(matchData) : matchData),
        });
      } else {
        route.continue();
      }
    },
  );
};

function mergeObjects(a, b) {
  // 创建一个新对象来保存结果
  const merged = { ...a };

  // 遍历对象b的属性
  // eslint-disable-next-line no-restricted-syntax
  for (const key in b) {
    // 如果a中已经有了相同的属性，则递归调用mergeObjects函数合并属性值
    if (
      Object.prototype.hasOwnProperty.call(a, key) &&
      typeof a[key] === 'object' &&
      typeof b[key] === 'object'
    ) {
      merged[key] = mergeObjects(a[key], b[key]);
    } else {
      // 否则直接将b的属性合并到结果对象中
      merged[key] = b[key];
    }
  }

  return merged;
}

/**
 * mock 服务
 * @param page - playwright page
 * @param serviceName -  服务名称
 * @param conversionFunction - mock 转换函数
 */
export const mockService = async (serviceName: string, conversionFunction: (data: any) => any) => {
  const { page } = getContext();
  await page.route(
    url => {
      let isMatch = false;
      const regStr = serviceName;
      const pattern = new RegExp(regStr.replace(/\*\*/g, '.*'));
      if (pattern.test(url.pathname) && conversionFunction) {
        isMatch = true;
        // eslint-disable-next-line no-console
        // console.log('Mock service', url.href);
      }
      return isMatch;
    },
    async route => {
      const response = await route.fetch();
      const json = await response.json();
      const result = conversionFunction(json) || json;
      await route.fulfill({
        body: JSON.stringify(result),
      });
    },
  );
};

/**
 * mock 服务
 * @param page - playwright page
 * @param serviceName -  服务名称
 * @param expectData - 期望的返回值
 */
export const mockServiceWithExpectData = async (serviceName: string, expectData: any) => {
  await mockService(serviceName, data => mergeObjects(data, expectData));
};
