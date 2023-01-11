import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';
import { LoggerService } from 'src/core/logger/logger.service';

@Controller('logger')
export class LoggerController {
  private readonly logsFilePath = join(__dirname, 'logs.txt');

  @Get('get')
  async getLogs(@Res() res: Response) {
    LoggerService.log('Accessing to log file', LoggerController.name);
    res.set({
      'Content-Type': 'text/plain',
    });
    const logFile = readFileSync(this.logsFilePath);
    res.send(logFile);
  }
}
