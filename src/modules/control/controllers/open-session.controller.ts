import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { OpenSessionService } from '@modules/control/application/open-session.service';
import { Page } from '@core/libs/page.decorator';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { Response } from 'express';
import { RequestQuery } from '@core/libs/types';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';
import { ExportOpenSessionDto } from '@modules/control/controllers/dtos/export-open-session.dto';
import { UserId } from '@core/libs/user-id.decorator';

@Controller('control/open-session')
export class OpenSessionController {
  constructor(private openSessionService: OpenSessionService) {}

  @Page('Отчет по открытым сессиям пользователей')
  @UseAuthPermissions(PermissionEnum.CONTROL_SESSIONS)
  @Get()
  async getOpenSessions(@Query() query: RequestQuery) {
    const [data, total] = await this.openSessionService.getOpenSessions(query);
    return { data, total };
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-xlsx')
  async exportXlsx(@Body() query: ExportOpenSessionDto, @Res() response: Response, @UserId() userId: string) {
    return await this.openSessionService.exportXlsx(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-xls')
  async exportXls(@Body() query: ExportOpenSessionDto, @Res() response: Response, @UserId() userId: string) {
    return await this.openSessionService.exportXls(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-ods')
  async exportOds(@Body() query: ExportOpenSessionDto, @Res() response: Response, @UserId() userId: string) {
    return await this.openSessionService.exportOds(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_PRINT)
  @Post('print')
  async print(@Body() query: ExportOpenSessionDto, @Res() response: Response, @UserId() userId: string) {
    return await this.openSessionService.print(query, response, userId);
  }
}
