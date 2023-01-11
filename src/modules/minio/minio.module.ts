import { Module } from '@nestjs/common';
import { MinioService } from '@modules/minio/services/minio.service';

@Module({
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
