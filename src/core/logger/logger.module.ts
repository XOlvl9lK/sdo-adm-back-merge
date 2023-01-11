import { Logger, Module } from '@nestjs/common';
import { LoggerController } from 'src/core/logger/logger.controller';
import { LoggerService } from 'src/core/logger/logger.service';

@Module({
  controllers: [LoggerController],
  providers: [LoggerService],
})
export class LoggerModule extends Logger {}
