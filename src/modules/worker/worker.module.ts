import { Global, Module } from '@nestjs/common';
import { WorkerService } from '@modules/worker/services/worker.service';
import { WorkerService as SdoWorkerService } from '@modules/worker/application/worker.service';
import { WorkerStatService } from '@modules/worker/application/worker-stat.service';

@Global()
@Module({
  providers: [WorkerService, SdoWorkerService, WorkerStatService],
  exports: [WorkerService, SdoWorkerService],
})
export class WorkerModule {}
