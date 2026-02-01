/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-02-06 11:05:40
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-03-15 16:07:49
 * @FilePath: /ibu-pay-ui-auto-test/lib/helper/utils/steps/common.ts
 * @Description: 步骤方法
 */
import { expect, Response } from 'playwright/test';
import { getPage } from '../../cache/selector';
import cacheInstance, { IRequestCacheItem } from '../../cache';
import { getConfig } from '../../config';

const config = getConfig();
const defaultRequestTimeout = config.webInfo.defaultPageTimeout;

const requestStatus = {} as { [key: string]: number };
/**
 * Record the request monitoring status so that you can check whether there are any unresponsive monitoring requests after the use case is executed.
 * @param nameStr - request name string, you can pass multiple name, using spaces as separators.
 */
function addListenCount(nameStr: string) {
  const nameArray = parseRequestNameStr(nameStr);
  nameArray.forEach(name => {
    if (requestStatus[name]) {
      requestStatus[name] += 1;
    } else {
      requestStatus[name] = 1;
    }
  });
}

function removeListenCount(nameStr: string) {
  const nameArray = parseRequestNameStr(nameStr);
  nameArray.forEach(name => {
    if (requestStatus[name]) {
      requestStatus[name] -= 1;
    } else {
      throw new Error(`removeListenCount failed: ${name} not found`);
    }
  });
}

function getUnresponsiveRequest() {
  const unresponsiveRequest = [];
  Object.keys(requestStatus).forEach(name => {
    const count = requestStatus[name];
    if (count > 0) {
      unresponsiveRequest.push(name);
      // console.warn(`有监听的请求未响应: ${name}, count: ${count}`);
      // throw new Error(`有监听的请求未响应: ${name}, count: ${count}`);
    }
  });
  return unresponsiveRequest;
}

/**
 * Check whether any of the monitored requests are unresponsive
 */
export async function checkAllListenResponded(timeout = 5000) {
  const unresponsiveRequest = getUnresponsiveRequest();
  if (unresponsiveRequest.length > 0) {
    if (timeout === 0) {
      throw new Error(`有监听的请求未响应: ${unresponsiveRequest}`);
    } else {
      setTimeout(() => {
        checkAllListenResponded(0);
      }, timeout);
    }
  }
}

/**
 * Compares whether the contents under the same key of two objects are consistent
 */
export function areCommonKeysEqual(compareObj: object, expectObject: object) {
  const compareKeys = Object.keys(compareObj);
  const expectKeys = Object.keys(expectObject);

  if (expectKeys.filter(key => !compareKeys.includes(key)).length > 0) {
    return false;
  }

  const commonKeys = compareKeys.filter(key => expectKeys.includes(key));
  // eslint-disable-next-line no-restricted-syntax
  for (const key of commonKeys) {
    const value1 = compareObj[key];
    const value2 = expectObject[key];

    // 如果值是对象，则递归进行深度比较
    if (typeof value1 === 'object' && typeof value2 === 'object') {
      return areCommonKeysEqual(value1, value2);
    }
    // 否则，直接比较值
    if (value1 !== value2) {
      return false;
    }
  }

  return true;
}

/**
 * Determine whether nameStr match url
 */
export function matchUrl(url: string, nameStr: string) {
  const pattern = new RegExp(nameStr);
  return pattern.test(url); // url.includes(name)
}

/**
 * parse request name string
 * @param requestNameStr - request name string, multiple request names can be passed, using spaces as separators.
 */
export function parseRequestNameStr(requestNameStr: string | string[]) {
  if (typeof requestNameStr === 'string') {
    return requestNameStr.split(' ');
  }
  return requestNameStr;
}

function customWait(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

export async function getRequestResponseDataImmediately(
  name: string,
  count?: number,
): Promise<IRequestCacheItem> {
  const caches = cacheInstance.getCache('__globalRequest__');
  const cache = caches[name];

  let cacheNum = cache && cache.length - 1;
  if (count !== undefined) {
    cacheNum = count - 1;
  }

  if (cache && cache[cacheNum]) {
    return cache[cacheNum];
  } else {
    return null;
  }
}

/**
 * Get the data returned by the request. If there is data in the cache, use cache data. If not, wait for the request to return.
 * @param name - request name，use to match request
 * @param count - Number of requests, return the nth request result
 * @param timeout - timeout
 * @returns IRequestCacheItem
 */
export async function getRequestResponseData(
  name: string,
  count?: number,
  timeout = defaultRequestTimeout,
): Promise<IRequestCacheItem> {
  await customWait(200);
  const caches = cacheInstance.getCache('__globalRequest__');
  const cache = caches[name];

  let cacheNum = cache && cache.length - 1;
  if (count !== undefined) {
    cacheNum = count - 1;
  }

  if (cache && cache[cacheNum]) {
    return cache[cacheNum];
  }
  const page = getPage();
  await page.waitForResponse(
    response => {
      const url = response.url();
      return matchUrl(url, name);
    },
    {
      timeout,
    },
  );
  await page.waitForTimeout(3); // 这里等待3ms是为了让监听请求函数先执行以更新cache
  const result = await getRequestResponseData(name, count, timeout);
  return result;
}

/**
 * Get response body
 * @param response - response
 * @returns - response body
 */
async function getResponseBody(response: Response) {
  const resBody = await response.text();
  return JSON.parse(resBody);
}

/**
 * Get response code
 * @param response - response
 * @returns - response code
 */
async function getResponseCode(response: Response) {
  const resBody = await getResponseBody(response);
  return resBody?.head?.code;
}

/**
 * Get request payload from response
 * @param response - response
 * @returns - request payload
 */
async function getRequestPayload(response: Response) {
  const request = response.request();
  const requestPayload = await request.postDataJSON();
  return requestPayload;
}

/**
 * Verify whether the response code meets expectations
 * @param response - response
 * @param code - expected code
 * @param opt - comparison operation
 */
async function checkResponseCode(
  response: Response,
  code: number,
  opt: 'equal' | 'lessThan' | 'lessThanOrEqual' | 'greaterThan' | 'greaterThanOrEqual',
) {
  const resCode = await getResponseCode(response);
  if (opt === 'lessThan') {
    expect(resCode).toBeLessThan(code);
  } else if (opt === 'lessThanOrEqual') {
    expect(resCode).toBeLessThanOrEqual(code);
  } else if (opt === 'greaterThan') {
    expect(resCode).toBeGreaterThan(code);
  } else if (opt === 'greaterThanOrEqual') {
    expect(resCode).toBeGreaterThanOrEqual(code);
  } else if (opt === 'equal') {
    expect(resCode).toEqual(code);
  } else {
    throw new Error('checkResponseCode failed: unknown opt');
  }
}

/**
 * Verify whether the response data meets expectations
 * @param response - response
 * @param result - expected result，It can be json or object, and must contain the field request or response
 */
async function checkResponseData(responseData: IRequestCacheItem, result: string | object) {
  const data = typeof result === 'string' ? JSON.parse(result) : result;
  const { requestPayload, responseBody } = responseData;
  const responseValid = data.response ? areCommonKeysEqual(responseBody, data.response) : true;
  const requestPayloadValid = data.request
    ? areCommonKeysEqual(requestPayload, data.request)
    : true;
  const isValid = responseValid && requestPayloadValid;
  if (!requestPayloadValid) {
    console.error(
      'checkResponseData failed: request payload not match',
      data.request,
      requestPayload,
    );
  }
  if (!responseValid) {
    console.error('checkResponseData failed: response body not match', data.response, responseBody);
  }
  expect(isValid).toBe(true);
}

/**
 * Waiting for request response
 * @param nameStr - request name string, you can pass multiple name, using spaces as separators.
 * @param timeout - request timeout
 */
export async function waitResponse(
  nameStr: string,
  count?: number,
  timeout = defaultRequestTimeout,
) {
  const nameArray = parseRequestNameStr(nameStr);
  // eslint-disable-next-line no-restricted-syntax
  for (const cur of nameArray) {
    await getRequestResponseData(cur, count, timeout);
  }
}

/**
 * Wait for request response and verify request result
 * @param nameStr - request name string, you can pass multiple name, using spaces as separators.
 * @param result - Expected result of request response
 * @param timeout - timeout
 */
export async function waitAndCheckResponse(
  nameStr: string,
  result: string | object,
  count?: number,
  timeout = defaultRequestTimeout,
) {
  const nameArray = parseRequestNameStr(nameStr);
  // eslint-disable-next-line no-restricted-syntax
  for (const cur of nameArray) {
    const responseData = await getRequestResponseData(cur, count, timeout);
    await checkResponseData(responseData, result);
  }
}

/**
 * Wait for request response and verify response code
 * @param nameStr - request name string, you can pass multiple name, using spaces as separators.
 * @param code - Response code
 * @param opt - comparison operation
 * @param timeout - timeout
 */
export async function waitAndCheckResponseCode(
  nameStr: string,
  code: number,
  opt: 'equal' | 'lessThan' | 'lessThanOrEqual' | 'greaterThan' | 'greaterThanOrEqual',
  count?: number,
  timeout = defaultRequestTimeout,
) {
  // const data = typeof result === 'string' ? JSON.parse(result) : result;
  const nameArray = parseRequestNameStr(nameStr);
  // eslint-disable-next-line no-restricted-syntax
  for (const cur of nameArray) {
    const result = await getRequestResponseData(cur, count, timeout);
    await checkResponseCode(result.response, code, opt);
  }
}

/**
 * Listen for requests and verify the response code value
 * @param nameStr - request name string, you can pass multiple name, using spaces as separators.
 * @param code - Response code
 * @param opt - comparison operation
 */
export async function listenAndCheckResponseCode(
  nameStr: string,
  code: number,
  opt: 'equal' | 'lessThan' | 'lessThanOrEqual' | 'greaterThan' | 'greaterThanOrEqual',
) {
  const page = getPage();
  addListenCount(nameStr);
  // todo：改成一个 Feature 只用一个监听
  page.on('response', async response => {
    const url = response.url();
    const nameArray = parseRequestNameStr(nameStr);
    const curMatch = nameArray.find(cur => matchUrl(url, cur));
    if (curMatch) {
      removeListenCount(curMatch);
      await checkResponseCode(response, code, opt);
    }
  });
}

/**
 * Listen for requests and verify the response body
 * @param nameStr - request name string, you can pass multiple name, using spaces as separators.
 * @param result - Expected result of request response
 */
export async function listenAndCheckResponseBody(nameStr: string, result: string | object) {
  const page = getPage();
  const data = typeof result === 'string' ? JSON.parse(result) : result;
  addListenCount(nameStr);
  // todo：改成一个Feature 只用一个监听
  page.on('response', async response => {
    const url = response.url();
    const nameArray = parseRequestNameStr(nameStr);
    const curMatch = nameArray.find(cur => matchUrl(url, cur));
    if (curMatch) {
      removeListenCount(curMatch);
      const resBody = await getResponseBody(response);
      const isValid = areCommonKeysEqual(data, resBody);
      expect(isValid).toBe(true);
    }
  });
}

/**
 * Listen for requests and verify request payload or response body
 * @param nameStr - request name string, you can pass multiple name, using spaces as separators.
 * @param result - Expected result of request payload and response
 */
export async function listenAndCheckResponse(nameStr: string, result: string | object) {
  const page = getPage();
  const data = typeof result === 'string' ? JSON.parse(result) : result;
  if (!data.request && !data.response) {
    throw new Error('参数错误，请提供 request 或着 response');
  }
  addListenCount(nameStr);
  // todo：改成一个Feature 只用一个监听
  page.on('response', async response => {
    const url = response.url();
    const nameArray = parseRequestNameStr(nameStr);
    const curMatch = nameArray.find(cur => matchUrl(url, cur));
    if (curMatch) {
      removeListenCount(curMatch);
      const requestPayload = await getRequestPayload(response);
      const resBody = await getResponseBody(response);
      const responseValid = data.response ? areCommonKeysEqual(resBody, data.response) : true;
      const requestPayloadValid = data.request
        ? areCommonKeysEqual(requestPayload, data.request)
        : true;
      const isValid = responseValid && requestPayloadValid;
      if (!requestPayloadValid) {
        console.error(data.request, requestPayload);
      }
      if (!responseValid) {
        console.error(data.response, resBody);
      }
      expect(isValid).toBe(true);
    }
  });
}

/**
 * Listen and cache the request {name}, the cache key is {saveKey}
 * 监听并缓存请求{string}，缓存key为{string}
 * @param name - request name
 * @param saveKey - save key
 */
// export async function listenAndSaveRequestCache(name: string, saveKey: string) {
//   const page = getPage();
//   // eslint-disable-next-line no-console
//   console.log(`监听并缓存请求${name}，缓存key为${saveKey}`);
//   addListenCount(name);
//   // todo：改成一个Feature 只用一个监听
//   page.on('response', async response => {
//     const url = response.url();
//     if (matchUrl(url, name)) {
//       removeListenCount(name);
//       const resBody = await getResponseBody(response);
//       setRequestCache(saveKey, resBody);
//     }
//   });
// }

/**
 * Get request cache
 * Used with method listenAndSaveRequestCache
 * @param key - key set by listenAndSaveRequestCache method
 * @returns - cache value
 */
// export async function getRequestCacheByKey(key: string) {
//   return getRequestCache(key);
// }

/**
 * Check whether the value corresponding to the key meets the expected result
 * Used with method listenAndSaveRequestCache
 * @param key - key set by listenAndSaveRequestCache method
 * @param result - Expected result of cache
 */
// export async function checkRequestCache(key: string, result: string | object) {
//   const data = typeof result === 'string' ? JSON.parse(result) : result;
//   const cache = getRequestCache(key);
//   if (cache) {
//     const isValid = areCommonKeysEqual(data, cache);
//     expect(isValid).toBe(true);
//   } else {
//     throw new Error(`读取${key}请求缓存失败${cache}`);
//   }
// }

/**
 * Wait for request response and verify response code
 * @param nameStr - request name string, you can pass multiple name, using spaces as separators.
 * @param code - Response status code
 * @param opt - comparison operation
 * @param count - Number of requests, return the nth request result
 * @param timeout - timeout
 */
export async function listenAndCheckStatusCode(
  nameStr: string,
  code: number,
  opt: 'equal' | 'lessThan' | 'lessThanOrEqual' | 'greaterThan' | 'greaterThanOrEqual',
  count?: number,
  timeout = defaultRequestTimeout,
) {
  const nameArray = parseRequestNameStr(nameStr);
  // eslint-disable-next-line no-restricted-syntax
  for (const cur of nameArray) {
    const result = await getRequestResponseData(cur, count, timeout);
    await checkResponseStatusCode(result.response, code, opt);
  }
}

/**
 * Verify whether the response code meets expectations
 * @param response - response
 * @param expectedCode - expected code
 * @param opt - comparison operation
 */
export async function checkResponseStatusCode(
  response: Response,
  expectedCode: number,
  opt: 'equal' | 'lessThan' | 'lessThanOrEqual' | 'greaterThan' | 'greaterThanOrEqual',
) {
  const actualStatusCode = getResponseStatusCode(response);
  let error;
  try {
    if (opt === 'lessThan') {
      expect(actualStatusCode).toBeLessThan(expectedCode);
    } else if (opt === 'lessThanOrEqual') {
      expect(actualStatusCode).toBeLessThanOrEqual(expectedCode);
    } else if (opt === 'greaterThan') {
      expect(actualStatusCode).toBeGreaterThan(expectedCode);
    } else if (opt === 'greaterThanOrEqual') {
      expect(actualStatusCode).toBeGreaterThanOrEqual(expectedCode);
    } else if (opt === 'equal') {
      expect(actualStatusCode).toEqual(expectedCode);
    } else {
      error = 'checkResponseStatusCode failed: unknown opt';
    }
  } catch (e) {
    throw Error(error || `预期response status code：${expectedCode}\n实际：${actualStatusCode}`);
  }
}

function getResponseStatusCode(response: Response) {
  return response.status();
}
