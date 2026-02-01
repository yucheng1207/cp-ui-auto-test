/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-29 19:15:35
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-02-04 14:04:33
 * @Description: 配置 ENV
 */
import * as dotenv from 'dotenv';

export const initEnv = () => {
  if (process.env.ENV) {
    dotenv.config({
      override: true,
      path: `test/env/.env.${process.env.ENV}`,
    });
  } else {
    // console.error("NO ENV PASSED!")
    dotenv.config({
      override: true,
      path: `test/env/.env.prod`, // ${process.env.ENV}`,
    });
  }
};
