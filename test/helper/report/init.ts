/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-22 11:47:43
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-01-22 14:37:57
 * @FilePath: /ui-auto-test/src/helper/report/init.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const fs = require("fs-extra");
try {
    fs.ensureDir("reports");
    fs.emptyDir("reports");

} catch (error) {
    console.log("Folder not created! " + error);
}