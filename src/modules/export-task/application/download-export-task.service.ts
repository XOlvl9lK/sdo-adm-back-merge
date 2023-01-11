import { Injectable } from '@nestjs/common';
import { FileService } from '@modules/file/infrastructure/file.service';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';

@Injectable()
export class DownloadExportTaskService {
  constructor(
    private fileService: FileService,
    private exportTaskRepository: ExportTaskRepository
  ) {}

  async download(id: string) {
    const exportTask = await this.exportTaskRepository.findById(id)
    const fileStream = await this.fileService.get(exportTask.href)
    return {
      exportTask,
      fileStream
    }
  }
}