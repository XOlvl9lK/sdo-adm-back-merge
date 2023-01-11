import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { FindExportTaskService } from '@modules/export-task/application/find-export-task.service';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { UserId } from '@core/libs/user-id.decorator';
import { RequestQuery } from '@core/libs/types';
import { Response } from 'express';
import { DownloadExportTaskService } from '@modules/export-task/application/download-export-task.service';

@Controller('export-task')
export class ExportTaskController {
  constructor(
    private findExportTaskService: FindExportTaskService,
    private downloadExportTaskService: DownloadExportTaskService
  ) {}

  @UseAuthPermissions(PermissionEnum.DATA_EXPORT)
  @Get()
  async getAll(@UserId() userId: string, @Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findExportTaskService.findByUser(requestQuery, userId)
    return { data, total }
  }

  // @UseAuthPermissions(PermissionEnum.LOGS_EXPORT)
  @Get(':id')
  async getExportFile(@Param('id') id: string, @Res() response: Response) {
    const { fileStream, exportTask } = await this.downloadExportTaskService.download(id)
    response.setHeader('Content-Disposition', `attachment; filename=${encodeURI(exportTask.fileName)}`);
    return fileStream.pipe(response)
  }
}
