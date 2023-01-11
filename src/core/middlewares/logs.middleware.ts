import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from 'src/core/logger/logger.service';
import { Request, Response } from 'express';

@Injectable()
export class LogsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    res.on('finish', () => {
      const { method, originalUrl } = req;
      const { statusCode, statusMessage } = res;

      const logMessage = `${method} ${originalUrl} Status Code: ${statusCode} Status Message: ${statusMessage}`;

      return LoggerService.log(logMessage, 'HTTP');
    });

    next();
  }
}
