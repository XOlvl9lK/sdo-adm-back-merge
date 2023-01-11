import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Page } from '@core/libs/page.decorator';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { GetUserPeriodPerformanceDto } from '@modules/control/controllers/dtos/get-user-period-performance.dto';
import { Response } from 'express';
import { LoggerService } from '@core/logger/logger.service';
import { UserPerformanceService } from '@modules/control/application/user-performance.service';
import {
  ExportUserPerformanceDto,
  GetUserPerformanceDto,
} from '@modules/control/controllers/dtos/get-user-performance.dto';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';
import { UserId } from '@core/libs/user-id.decorator';

@Controller('control/user-performance')
export class UserPerformanceController {
  constructor(private userPerformanceService: UserPerformanceService) {}

  @Page('Отчет успеваемости пользователя')
  @UseAuthPermissions(PermissionEnum.CONTROL_USER_PERIOD)
  @Get()
  async getUserPeriodPerformance(@Query() query: GetUserPerformanceDto) {
    const [data, total] = await this.userPerformanceService.getUserPerformance(query);
    return { data, total };
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-xlsx')
  async exportXlsx(@Body() query: ExportUserPerformanceDto, @Res() response: Response, @UserId() userId: string) {
    return await this.userPerformanceService.exportXlsx(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-xls')
  async exportXls(@Body() query: ExportUserPerformanceDto, @Res() response: Response, @UserId() userId: string) {
    return await this.userPerformanceService.exportXls(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-ods')
  async exportOds(@Body() query: ExportUserPerformanceDto, @Res() response: Response, @UserId() userId: string) {
    return await this.userPerformanceService.exportOds(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_PRINT)
  @Post('print')
  async printUserPeriodPerformance(@Body() query: ExportUserPerformanceDto, @Res() response: Response, @UserId() userId: string) {
    return await this.userPerformanceService.printUserPerformance(query, response, userId);
  }
}
