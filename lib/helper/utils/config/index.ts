/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-30 09:51:33
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-03-05 19:10:18
 * @Description: 获取项目配置
 */
import * as data from '../../../../test/config/base.json';

interface IConfigWebInfo {
  defaultPageTimeout: number;
  headless: boolean;
  enableLog: boolean;
  enableTrace: boolean;
  recordVideo: boolean;
  autoScreenshot: boolean;
}

interface IConfigUser {
  uid: string;
  password: string;
}

interface IConfigUsers {
  [key: string]: IConfigUser;
}

interface IConfigElements {
  [key: string]: string;
}

interface IPages {
  [key: string]: string;
}

interface IMock {
  enable: boolean;
  name: string;
}

// interface IConfigRequest {
//   [key: string]: {
//     // name: string;
//     reg: string;
//   };
// }

export interface IConfig {
  webInfo: IConfigWebInfo;
  mock: IMock;
  users: IConfigUsers;
  pages: IPages;
  elements: IConfigElements;
  // requests: IConfigRequest;
}

export const getConfig: () => IConfig = () => {
  if (process.env.ENV === 'staging') {
    return data as IConfig;
  }
  return data as IConfig;
};
