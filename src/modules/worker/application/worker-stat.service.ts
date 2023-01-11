import { Injectable } from '@nestjs/common';
import { WorkerService } from '@modules/worker/application/worker.service';

@Injectable()
export class WorkerStatService {
  constructor(
    private workerService: WorkerService
  ) {}

  getStats() {
    const threads = this.workerService.pool.threads
    const completedTasks = this.workerService.pool.completed
    const poolAlive = this.workerService.pool.duration
    const poolOptions = this.workerService.pool.options
    const runTime = this.workerService.pool.runTime
    const queueSize = this.workerService.pool.queueSize
    const utilization = this.workerService.pool.utilization
    const waitTime = this.workerService.pool.waitTime
    return { threads, completedTasks, poolAlive: Math.round(poolAlive), poolOptions, runTime, queueSize, utilization, waitTime }
  }
}