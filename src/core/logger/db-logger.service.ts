import { Logger } from 'typeorm/logger/Logger';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { LoggerService } from '@core/logger/logger.service';

export class DbLoggerService implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    LoggerService.log(`Query: ${query}, \nParameters: ${parameters?.join(', ')}`, 'Database');
  }

  logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    let message = '';
    if (typeof error === 'string') {
      message = error;
    } else {
      message = error.message;
    }
    LoggerService.error(message, error, 'Database');
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {}

  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    LoggerService.log(message);
  }

  logMigration(message: string, queryRunner?: QueryRunner): any {
    LoggerService.log(message);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
    switch (level) {
      case 'info':
        LoggerService.log(message);
        break;
      case 'log':
        LoggerService.log(message);
        break;
      case 'warn':
        LoggerService.warn(message);
    }
  }
}
