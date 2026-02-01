/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-31 16:26:27
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-01-31 16:26:49
 * @FilePath: /ibu-pay-ui-auto-test/test/lib/resource/utils/logger.ts
 * @Description: Logger
 */
import { transports, format, createLogger as createFun } from 'winston';

const testResult = 'report';

function generateOptions(scenarioName: string) {
  return {
    transports: [
      new transports.File({
        filename: `${testResult}/logs/${scenarioName}/log.log`,
        level: 'info',
        format: format.combine(
          format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
          format.align(),
          format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
        ),
      }),
    ],
  };
}

export function createLogger(scenarioName: string) {
  return createFun(generateOptions(scenarioName));
}
