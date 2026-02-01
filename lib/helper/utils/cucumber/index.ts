/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-02-04 10:21:12
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-04-11 14:24:42
 * @Description: cucumber 公共方法
 */
import { IWorld } from '@cucumber/cucumber';
import { Browser, Page } from '@playwright/test';
import { ICreateAttachment } from '@cucumber/cucumber/lib/runtime/attachment_manager';
import { IConfig, getConfig } from '../config';
import {
  getAttach,
  getBrowser,
  getPage,
  getPlatform,
  getState,
  getTags,
  getTestEnv,
  setState,
} from '../cache/selector';

export interface MyContext {
  attach: ICreateAttachment;
  config: IConfig;
  page: Page;
  browser: Browser;
  tags: string[];
  isH5: boolean;
  isOnline: boolean;
  isPrd: boolean;
  getState(key?: string): any;
  setState(state: any): any;
}

export interface MyWorld extends MyContext, Pick<IWorld, 'log' | 'parameters'> {}

/**
 * 获取步骤的上下文，这个方法主要是为了 ts
 */
export function getStepContext(context: IWorld<any>): MyWorld {
  const { isH5, isOnline } = getPlatform();
  const { isPrd } = getTestEnv();
  return {
    ...context,
    config: getConfig(),
    page: getPage(),
    browser: getBrowser(),
    tags: getTags(),
    isH5,
    isOnline,
    isPrd,
    getState,
    setState,
  };
}

export function getContext(): MyContext {
  const { isH5, isOnline } = getPlatform();
  const { isPrd } = getTestEnv();
  return {
    attach: getAttach(),
    config: getConfig(),
    page: getPage(),
    browser: getBrowser(),
    tags: getTags(),
    isH5,
    isOnline,
    isPrd,
    getState,
    setState,
  };
}
