import { ExportPageEnum } from '@modules/export-task/domain/export-task.entity';

export class CreateExportTaskDto {
  userId: string
  page: ExportPageEnum
}