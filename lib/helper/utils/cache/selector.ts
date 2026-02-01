/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-02-08 10:27:33
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-03-05 14:24:34
 * @FilePath: /ibu-pay-ui-auto-test/lib/helper/utils/cache/selector.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import cacheInstance from '.';

export const getTags = () => cacheInstance.getCache('__tags__');

export const getPlatform = (tags?: string[]) => {
  const realTags = tags || getTags() || [];
  return {
    isH5: realTags.includes('@h5'),
    isOnline: realTags.includes('@online'),
  };
};

export const getTestEnv = (tags?: string[]) => {
  const realTags = tags || getTags() || [];
  return {
    isPrd: realTags.includes('@prd'),
  };
};

// export const { setRequestCache, getRequestCache } = cacheInstance;

export const getBrowser = () => cacheInstance.getCache('__browser__');

export const getBrowserContext = () => cacheInstance.getCache('__browserContext__');

export const getPage = () => cacheInstance.getCache('__page__');

export const getAttach = () => cacheInstance.getCache('__attach__');

export const getState = (key?: string) => {
  const state = cacheInstance.getCache('__state__');
  if (!key) {
    return state;
  } else {
    return state[key];
  }
};

/**
 * 用于存放一些自定义变量，多个步骤之间需要存数据时很有用，但是不建议在写 case 时使用该方法
 */
export const setState = data => {
  if (Object.prototype.toString.call(data) === '[object Object]') {
    const state = cacheInstance.getCache('__state__');
    cacheInstance.setCache({
      __state__: {
        ...state,
        ...data,
      },
    });
  } else {
    throw new Error('setState failed: param is not a object');
  }
};
