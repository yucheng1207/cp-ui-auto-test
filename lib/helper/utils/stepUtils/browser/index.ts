import { expect } from 'playwright/test';
import { getConfig } from '../../config';
import { getPage } from '../../cache/selector';
import browserInstance from './instance/browserManager';

const config = getConfig();

export const { setBrowserStorageState } = browserInstance;

export { getBrowserStorageStatePath } from './instance/browserManager';

export const getElement = (selector: string) => {
  const { elements } = config;
  let realSelector = selector;
  if (elements[selector]) {
    realSelector = elements[selector];
  }
  return realSelector;
};

export async function gotoPage(
  url: string,
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit',
) {
  const page = getPage();
  const pageConfig = config.pages;
  let realUrl = url;
  if (pageConfig[url]) {
    realUrl = pageConfig[url];
  }
  await page.goto(realUrl, {
    waitUntil: waitUntil || 'load',
  });
}

export async function wait(second: number) {
  const page = getPage();
  await page.waitForTimeout(second * 1000);
}

export async function clickElement(selector: string) {
  const page = getPage();
  await page.locator(getElement(selector)).click();
}

export async function clickText(text: string) {
  const page = getPage();
  await page.getByText(text).click();
}

export async function findText(text: string) {
  const page = getPage();
  const content = await page.content();
  if (content.includes(text)) {
    return true;
  }
  return false;
}

export async function findElementToBeVisible(selector: string) {
  const page = getPage();
  try {
    await expect(page.locator(getElement(selector))).toBeVisible();
  } catch (e) {
    await screenshot(selector, true);
    throw new Error(e);
  }
}

export async function findElementToBeHidden(selector: string) {
  const page = getPage();
  try {
    await expect(page.locator(getElement(selector))).toBeHidden();
  } catch (e) {
    await screenshot(selector, true);
    throw new Error(e);
  }
}

export async function findElementToHaveText(selector: string, text: string) {
  const page = getPage();
  try {
    await page.locator(getElement(selector));
    await expect(page.locator(getElement(selector))).toHaveText(text);
  } catch (e) {
    await screenshot(selector, true);
    console.error(e);
    throw new Error(e);
  }
}

export async function findElementToContainText(selector: string, text: string) {
  const page = getPage();
  try {
    await page.locator(getElement(selector));
    await expect(page.locator(getElement(selector))).toContainText(text);
  } catch (e) {
    await screenshot(selector, true);
    console.error(e);
    throw new Error(e);
  }
}

export async function findElementToContainElement(selector1: string, selector2: string) {
  try {
    const page = getPage();
    const parentElement = await page.$(selector1);
    const childElement = await parentElement?.$(selector2);
    if (!childElement) {
      throw new Error(`${selector1}中没有找到元素${selector2}`);
    }
  } catch (e) {
    throw new Error(e);
  }
}

export async function findElementAndInput(selector: string, text: string) {
  try {
    const page = getPage();
    await page.locator(getElement(selector)).click();
    await page.locator(getElement(selector)).fill(text);
  } catch (e) {
    throw new Error(`输入失败${e}`);
  }
}

export async function screenshot(name?: string, doAttach: boolean = true) {
  const img = await browserInstance.screenshot(name, doAttach);
  return img;
}
