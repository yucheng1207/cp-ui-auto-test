/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-22 11:47:43
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-02-06 14:47:43
 * @FilePath: /ui-auto-test/src/helper/report/init.ts
 * @Description: report init
 */
import * as fs from "fs-extra"

try {
    fs.ensureDir("reports");
    fs.emptyDir("reports");
} catch (error) {
    console.error(`Folder not created! ${  error}`);
}