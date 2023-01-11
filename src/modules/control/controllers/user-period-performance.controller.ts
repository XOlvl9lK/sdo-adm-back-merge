import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { UserPeriodPerformanceService } from '@modules/control/application/user-period-performance.service';
import { Page } from '@core/libs/page.decorator';
import {
  ExportUserPeriodPerformanceDto,
  GetUserPeriodPerformanceDto,
} from '@modules/control/controllers/dtos/get-user-period-performance.dto';
import { Response } from 'express';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { LoggerService } from '@core/logger/logger.service';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';
import { UserId } from '@core/libs/user-id.decorator';

@Controller('control/user-period')
export class UserPeriodPerformanceController {
  constructor(private userPeriodPerformanceService: UserPeriodPerformanceService) {}

  @Page('Обучение пользователя за период')
  @UseAuthPermissions(PermissionEnum.CONTROL_USER_PERIOD)
  @Get()
  async getUserPeriodPerformance(@Query() query: GetUserPeriodPerformanceDto) {
    const [data, total] = await this.userPeriodPerformanceService.getUserPeriodPerformance(query);
    return { data, total };
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-xlsx')
  async exportXlsx(@Body() query: ExportUserPeriodPerformanceDto, @Res() response: Response, @UserId() userId: string) {
    return await this.userPeriodPerformanceService.exportXlsx(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-xls')
  async exportXls(@Body() query: ExportUserPeriodPerformanceDto, @Res() response: Response, @UserId() userId: string) {
    return await this.userPeriodPerformanceService.exportXls(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-ods')
  async exportOds(@Body() query: ExportUserPeriodPerformanceDto, @Res() response: Response, @UserId() userId: string) {
    return await this.userPeriodPerformanceService.exportOds(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_PRINT)
  @Post('print')
  async printUserPeriodPerformance(@Body() query: ExportUserPeriodPerformanceDto, @Res() response: Response, @UserId() userId: string) {
    return await this.userPeriodPerformanceService.printUserPeriodPerformance(query, response, userId);
  }
}
