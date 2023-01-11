import { Body, Controller, Delete, Get, Post, Query, Res } from '@nestjs/common';
import { Page } from '@core/libs/page.decorator';
import { SessionService } from '@modules/control/application/session.service';
import { RequestQuery } from '@core/libs/types';
import { DeleteSessionDto } from '@modules/control/controllers/dtos/delete-session.dto';
import { Response } from 'express';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';
import { ExportSessionsDto } from '@modules/control/controllers/dtos/export-sessions.dto';
import { UserId } from '@core/libs/user-id.decorator';

@Controller('control/session')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Page('Открытые сессии пользователей')
  @UseAuthPermissions(PermissionEnum.CONTROL_SESSIONS)
  @Get()
  async getAll(@Query() requestQuery: RequestQuery) {
    const [data, total] = await this.sessionService.findAll(requestQuery);
    return { data, total };
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_SESSIONS_DELETE)
  @Delete()
  async delete(@Body() sessionDto: DeleteSessionDto) {
    return await this.sessionService.delete(sessionDto);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-xlsx')
  async exportXlsx(@Body() query: ExportSessionsDto, @Res() response: Response, @UserId() userId: string) {
    return await this.sessionService.exportXlsx(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-xls')
  async exportXls(@Body() query: ExportSessionsDto, @Res() response: Response, @UserId() userId: string) {
    return await this.sessionService.exportXls(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-ods')
  async exportOds(@Body() query: ExportSessionsDto, @Res() response: Response, @UserId() userId: string) {
    return await this.sessionService.exportOds(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_PRINT)
  @Post('print')
  async printSessions(@Body() query: ExportSessionsDto, @Res() response: Response, @UserId() userId: string) {
    return await this.sessionService.printSessions(query, response, userId);
  }
}
