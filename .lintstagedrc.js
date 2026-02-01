/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-02-07 11:21:07
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-02-07 11:21:35
 * @FilePath: /ibu-pay-ui-auto-test/.lintstagedrc.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{less,scss}': 'prettier --write',
  '*.{js,css,json,md}': 'prettier --write',
};
