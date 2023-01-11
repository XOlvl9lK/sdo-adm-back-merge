import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import { RequestQuery } from '@core/libs/types';

@Injectable()
export class FindExportTaskService {
  constructor(
    @InjectRepository(ExportTaskRepository)
    private exportTaskRepository: ExportTaskRepository
  ) {}

  async findByUser(requestQuery: RequestQuery, userId: string) {
    return await this.exportTaskRepository.findByUserId(requestQuery, userId)
  }
}