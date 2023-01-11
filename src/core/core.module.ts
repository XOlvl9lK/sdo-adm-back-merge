import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/core/logger/logger.module';

@Module({
  imports: [LoggerModule],
})
export class CoreModule {}
