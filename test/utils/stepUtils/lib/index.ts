/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-31 16:58:31
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-03-05 20:03:02
 * @FilePath: /ibu-pay-ui-auto-test/test/utils/index.ts
 * @Description: 导出 lib 提供的方法
 */
import { getRequestResponseData } from '../../../../lib/helper';
export * from '../../../../lib/helper'; // 慎用 * 的写法

// 重命名lib函数
/**
 * 获取请求缓存，如果请求没有返回会自动等待请求
 * Get the request cache. If the request does not return, it will automatically wait for the request.
 */
export const getGlobalServiceCache = getRequestResponseData;

// 一些公共方法，后期可以移到 lib 中
