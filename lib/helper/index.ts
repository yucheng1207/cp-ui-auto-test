/*
 * @Description: 输出给外界的所有方法
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-26 00:22:30
 * @LastEditTime: 2024-02-23 14:46:13
 * @LastEditors: ychengzhang ychengzhang@trip.com
 */
export * from './utils/stepUtils';
export {
  getTags,
  getPlatform,
  getBrowser,
  getPage,
  getBrowserContext,
} from './utils/cache/selector';
export { getConfig } from './utils/config';
export { getStepContext, getContext } from './utils/cucumber';
