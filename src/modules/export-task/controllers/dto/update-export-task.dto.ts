import { ExportStatusEnum } from '@modules/export-task/domain/export-task.entity';

export class UpdateExportTaskDto {
  id: string
  status?: ExportStatusEnum
  progress?: number
  fileName?: string
  href?: string
}