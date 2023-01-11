import { BeforeApplicationShutdown, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import { UpdateExportTaskDto } from '@modules/export-task/controllers/dto/update-export-task.dto';
import { FileRepository } from '@modules/file/infrastructure/database/file.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { ExportTaskProgressEvent } from '@modules/event/infrastructure/events/export-task-progress.event';
import { ExportStatusEnum } from '@modules/export-task/domain/export-task.entity';

@Injectable()
export class UpdateExportTaskService implements BeforeApplicationShutdown {
  constructor(
    @InjectRepository(ExportTaskRepository)
    private exportTaskRepository: ExportTaskRepository,
    @InjectRepository(FileRepository)
    private fileRepository: FileRepository,
    private eventEmitter: EventEmitter2
  ) {}

  async update({ id, status, progress, href, fileName }: UpdateExportTaskDto) {
    const exportTask = await this.exportTaskRepository.findById(id)
    exportTask.update(status, progress)
    if (progress) this.eventEmitter.emit(EventActionEnum.EXPORT_TASK_PROGRESS + '_' + exportTask.userId, new ExportTaskProgressEvent(exportTask.id, progress, href, fileName))
    return await this.exportTaskRepository.save(exportTask)
  }

  async beforeApplicationShutdown() {
    const inProcessExportTasks = await this.exportTaskRepository.findInProcess()
    inProcessExportTasks.forEach(task => {
      task.status = ExportStatusEnum.ERROR
      task.errorDescription = 'Сервер остановлен'
    })
    await this.exportTaskRepository.save(inProcessExportTasks)
  }
}