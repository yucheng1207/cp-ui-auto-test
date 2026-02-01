/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-02-07 15:11:57
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-04-11 14:17:35
 * @FilePath: /ibu-pay-ui-auto-test/lib/helper/utils/cache/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-02-05 14:27:31
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-02-08 10:39:54
 * @FilePath: /ibu-pay-ui-auto-test/lib/helper/utils/cache/index.ts
 * @Description: cache
 */

import { Pickle } from '@cucumber/messages';
import { Browser, BrowserContext, Page, Response } from '@playwright/test';
import { ICreateAttachment } from '@cucumber/cucumber/lib/runtime/attachment_manager';
import { IConfig, getConfig } from '../config';
import { createSingleton } from '../singleton';

const config = getConfig();

const defaultGlobalRequestArray = [
  'queryAbTestResult',
  'paymentListSearch',
  'queryOrderExtend',
  'applePaySubmit',
  'queryPayResult',
  'cardContinuePay',
  'queryCardInfoByCardNo',
  'queryEGift',
  'queryBindEGift',
  'queryCoinsInfo',
  'cardStageInfoQuery',
  'sendMessage',
  'queryPoint',
  'queryOBFee',
  'submitPayment',
  'queryPayOrder',
  'saveUsedCard',
  'bindGiftCard',
  'queryDccExchangeRate',
  'usedCardSecond',
  'sendEmail',
  'generateToken',
  'continuePay',
  'queryRedirectInfo',
  'queryAddress',
  'create_payment_resource', // PayPal
];

export interface IRequestCacheItem {
  url: string;
  requestPayload: any;
  responseBody: any;
  response: Response;
}

/* eslint-disable no-underscore-dangle */
interface ICache {
  __attach__?: ICreateAttachment;
  __pickle__?: Pickle;
  __tags__: string[];
  __browser__?: Browser;
  __browserContext__?: BrowserContext;
  __page__?: Page;
  __config__: IConfig;
  __isH5__: boolean;
  __isOnline__: boolean;
  // __request__: {
  //   [key: string]: IRequestCacheItem;
  // };
  __globalRequest__: {
    [key: string]: IRequestCacheItem[];
  };
  __domContentLoaded__: { [key: string]: number };
  __state__: any;
}

type CacheKey = keyof ICache;

function getObjectData<T extends ICache, Key extends CacheKey>(obj: T, key: Key) {
  return obj[key];
}

function defaultAttach() {
  throw new Error('attach function not exists');
}
export class CacheManager {
  private cache: ICache;

  constructor() {
    this.cache = {
      __pickle__: null,
      __tags__: [],
      __browser__: null,
      __browserContext__: null,
      __page__: null,
      __config__: config,
      __isH5__: false,
      __isOnline__: false,
      // __request__: {},
      __globalRequest__: {},
      __domContentLoaded__: {},
      __attach__: defaultAttach as unknown as ICreateAttachment,
      __state__: {},
    };
  }

  public setCache = (data: Partial<ICache>) => {
    this.cache = {
      ...this.cache,
      ...data,
    };
    return this.cache;
  };

  // public setRequestCache = (key: string, value: IRequestCacheItem) => {
  //   this.cache.__request__[key] = value;
  // };

  // public getRequestCache = (key: string) => cacheInstance.getCache('__request__')[key];

  public initGlobalRequestListening = () => {
    const page = this.cache.__page__;
    // const { requests } = config;
    if (page) {
      page.on('response', async response => {
        const url = response.url();

        const matchKey = defaultGlobalRequestArray.find(key => {
          const pattern = new RegExp(key);
          return pattern.test(url); // url.includes(name)
        });
        if (matchKey) {
          const resBodyJson = await response.text();
          const responseBody = JSON.parse(resBodyJson);
          const request = response.request();
          const requestPayload = await request.postDataJSON();
          this.addGlobalRequestCache(matchKey, {
            url,
            requestPayload,
            responseBody,
            response,
          });
        }
      });
    }
  };

  private addGlobalRequestCache = (key: string, value: IRequestCacheItem) => {
    if (this.cache.__globalRequest__[key]) {
      this.cache.__globalRequest__[key].push(value);
    } else {
      this.cache.__globalRequest__[key] = [value];
    }
  };

  private initDomContentLoadedCache = () => {
    const page = this.cache.__page__;
    if (page) {
      page.on('domcontentloaded', async evData => {
        const pageUrl = await evData.url();
        const domContentLoadedCache = this.cache.__domContentLoaded__;
        this.cache.__domContentLoaded__[pageUrl] = domContentLoadedCache[pageUrl]
          ? domContentLoadedCache[pageUrl]++
          : 1;
      });
    }
  };

  public initCache = (cache: Required<ICache>) => {
    const realCache = this.setCache(cache);
    this.initGlobalRequestListening();
    this.initDomContentLoadedCache();
    return realCache;
  };

  public getCache = <S extends CacheKey>(key: S) => getObjectData(this.cache, key);

  public getAllCaches = () => this.cache;
}

const cacheInstance = createSingleton(CacheManager)();
export default cacheInstance;
