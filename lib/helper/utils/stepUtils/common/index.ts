/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-03-05 18:18:53
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-03-05 18:19:29
 * @FilePath: /ibu-pay-ui-auto-test/lib/helper/utils/stepUtils/common/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { DataTable } from '@cucumber/cucumber';

/**
 * Convert DataTable to Object
 */
export const dataTableToObject = <T>(table: DataTable): T => {
  const data = table.rowsHash();
  const result = {};
  Object.keys(data).forEach(key => {
    try {
      const value = data[key];
      const obj = JSON.parse(value);
      if (obj && typeof obj === 'object') {
        result[key] = obj;
      } else {
        result[key] = value;
      }
    } catch (error) {
      // JSON.parse 解析失败
      const value = data[key];
      result[key] = value;
    }
  });
  return result as T;
};

/**
 * convert step parameters to object
 * @param param DataTable or """"""
 * @returns T
 */
export const convertStepParamToObject = <T = any>(param: DataTable | string): T => {
  if (typeof param === 'string') {
    return JSON.parse(param);
  }
  if (typeof param === 'object') {
    return dataTableToObject(param);
  }
  throw new Error('Invalid parameter');
};
