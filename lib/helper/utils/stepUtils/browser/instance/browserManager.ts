/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-22 10:41:46
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-04-12 14:07:48
 * @FilePath: /cucumber-playwright-demo/src/instance/browserManager.ts
 * @Description: browser manager
 */
import {
  devices,
  Browser,
  BrowserContext,
  BrowserContextOptions,
  Page,
  LaunchOptions,
  chromium,
  firefox,
  webkit,
} from '@playwright/test';
// } from '@ctrip/node-vampire-playwright';
import { Logger } from 'winston';
import { createSingleton } from '../../../singleton';
import { createLogger } from '../../../logger';
import { getConfig } from '../../../config/index';
import { getContext } from '../../../cucumber';

const config = getConfig();
const { webInfo } = config;
const testResult = 'report';

const ENABLE_LOGGER = webInfo.enableLog;
const ENABLE_TRACE = webInfo.enableTrace;
const RECORD_VIDEO = webInfo.recordVideo;

const { headless, defaultPageTimeout } = webInfo;

const invokeBrowser = () => {
  const browserType = process.env.npm_config_BROWSER || process.env.BROWSER || 'chrome';
  const browserOptions: LaunchOptions = {
    headless,
    // 以下两条目前sxy专用
    // args: ['--disable-features=ChromeBrowserCloudManagement'],
    // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // 确认路径正确
  };
  switch (browserType) {
    case 'chrome':
      return chromium.launch(browserOptions);
    case 'firefox':
      return firefox.launch(browserOptions);
    case 'webkit':
      return webkit.launch(browserOptions);
    default:
      throw new Error('Please set the proper browser!');
  }
};

export function getBrowserStorageStatePath(user: string): string {
  return `auth/${user || 'default'}.json`;
}

interface ICreateContextParam {
  id: string;
  name: string;
  recordVideo?: string;
  storage?: {
    uid: string;
  };
  isH5?: boolean;
  device?: string;
}

export class BrowserManager {
  private curPage?: Page | null;

  private pageList: Page[] = [];

  private browser?: Browser | null;

  private context?: BrowserContext | null;

  private logger: Logger;

  public initBrowser = async () => {
    this.browser = await invokeBrowser();
    return this.browser;
  };

  public createContext = async (params: ICreateContextParam): Promise<BrowserContext> => {
    const deviceLookup = {
      Samsung: 'Galaxy Note II',
    };
    const { id, name, recordVideo, storage, isH5, device } = params;
    const scenarioName = name + id;
    const contextParams: BrowserContextOptions = {
      ...(isH5 ? devices[deviceLookup[device] || 'iPhone 6'] : {}),
    };
    if (storage) {
      contextParams.storageState = getBrowserStorageStatePath(storage.uid);
    }
    if (RECORD_VIDEO) {
      contextParams.recordVideo = {
        dir: recordVideo || `${testResult}/videos`,
      };
    }
    this.context = await this.browser?.newContext(contextParams);
    if (ENABLE_TRACE) {
      await this.context?.tracing.start({
        name: scenarioName,
        title: name,
        sources: true,
        screenshots: true,
        snapshots: true,
      });
    }
    if (ENABLE_LOGGER) {
      this.logger = createLogger(scenarioName);
    }
    return this.context as BrowserContext;
  };

  public createPage = async (context: BrowserContext, switchToPage: boolean) => {
    const page = await context?.newPage();
    page?.setDefaultTimeout(defaultPageTimeout);
    if (ENABLE_LOGGER) {
      page?.on('console', message => {
        const logText = `[${message.type().toUpperCase()}] ${message.text()}`;
        this.logger.info(logText);
      });
    }
    this.pageList.push(page);
    if (switchToPage) {
      this.curPage = page;
    }
    return page;
  };

  // public initPage = async (params: ICreateContextParam): Promise<{
  //   page: Page;
  //   context: BrowserContext;
  // }> => {
  //   let {context} = this
  //   if (!context) {
  //     context = await this.createContext(params);
  //   }
  //   const page = await this.createPage(context);
  //   this.curPage = page
  //   return {
  //     page,
  //     context
  //   };
  // };

  // public closePage = async (params: { id: string; name: string; screenshot?: boolean }) => {
  //   if (!this.curPage || !this.context) {
  //     throw new Error(`Page or Context not found`);
  //   }
  //   const { id, name, screenshot } = params;
  //   // let img: Buffer;
  //   const result: {
  //     img: Buffer | null;
  //     tracePath: string;
  //     videoPath: string;
  //   } = {
  //     img: null,
  //     tracePath: '',
  //     videoPath: '',
  //   };
  //   if (screenshot) {
  //     result.img = await this.page.screenshot({
  //       path: `./${testResult}/screenshots/${name}.png`,
  //       type: 'png',
  //     });
  //   }
  //   result.videoPath = (await this.page?.video?.()?.path()) || '';
  //   if (ENABLE_TRACE) {
  //     const path = `./${testResult}/trace/${id}.zip`;
  //     await this.context.tracing.stop({ path });
  //     result.tracePath = path;
  //   }
  //   await this.page.close();
  //   await this.context.close();
  //   this.page = null;
  //   this.context = null;
  //   return result;
  // };

  public screenshot = async (name?: string, doAttach: boolean = true) => {
    const { page, attach } = getContext();
    const img = await page.screenshot({
      path: `./${testResult}/screenshots/${name.replace('.jpeg', '').replace('.png', '') || new Date().getTime()}.jpeg`,
      type: 'jpeg',
      scale: 'css',
      quality: 80,
    });
    if (doAttach) {
      await attach(img, {
        mediaType: 'image/png',
        fileName: 'image',
      });
    }
    return img;
  };

  public closeAllPage = async (params: { id: string; name: string; screenshot?: boolean }) => {
    if (!this.pageList.length || !this.context) {
      throw new Error(`Page or Context not found`);
    }
    const { id, name, screenshot: doScreenshot } = params;
    // let img: Buffer;
    const result: {
      imgList: Buffer[];
      tracePath: string;
      videoPathList: string[];
    } = {
      imgList: [],
      tracePath: '',
      videoPathList: [],
    };
    for (let i = 0; i < this.pageList.length; i++) {
      const page = this.pageList[i];
      if (doScreenshot) {
        const img = await this.screenshot(i === 0 ? name : name + i.toString(), false);
        result.imgList.push(img);
      }
      if (RECORD_VIDEO) {
        const videoPath = (await page?.video?.()?.path()) || '';
        result.videoPathList.push(videoPath);
      }
      await page.close();
    }
    if (ENABLE_TRACE) {
      const path = `./${testResult}/trace/${id}.zip`;
      await this.context.tracing.stop({ path });
      result.tracePath = path;
    }
    await this.context.close();
    this.curPage = null;
    this.pageList = [];
    this.context = null;
    return result;
  };

  public closeBrowser = async () => {
    if (this.browser) {
      await this.browser.close();
    }
  };

  public goto = async (
    url: string,
    option?: {
      referer?: string;
      timeout?: number;
      waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
    },
  ) => {
    try {
      if (this.curPage) {
        await this.curPage.goto(
          url,
          option || {
            waitUntil: 'load', // 默认等待页面加载完成
          },
        );
      } else {
        throw Error();
      }
    } catch (e) {
      throw Error(e);
    }
  };

  public getBrowser = () => this.browser as Browser;

  public getPage = () => this.curPage as Page;

  public getPageList = () => this.pageList;

  public getBrowserContext = () => this.context as BrowserContext;

  public setBrowserStorageState = async (uid: string) => {
    if (this.context) {
      const storageState = await this.context.storageState({
        path: getBrowserStorageStatePath(uid),
      });
      return storageState;
    }
    throw new Error('setStorageState failed!');
  };
}

const browserInstance = createSingleton(BrowserManager)();

export default browserInstance;
