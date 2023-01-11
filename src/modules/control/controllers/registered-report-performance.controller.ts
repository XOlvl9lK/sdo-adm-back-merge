import { Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { RegisteredReportPerformanceService } from '@modules/control/application/registered-report-performance.service';
import { Page } from '@core/libs/page.decorator';
import { JwtAuthGuard } from '@modules/user/infrastructure/guards/jwt-auth.guard';
import {
  ExportRegisteredReportDto,
  GetRegisteredReportDto
} from '@modules/control/controllers/dtos/get-registered-report.dto';
import { RequestQuery } from '@core/libs/types';
import { Response } from 'express';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';
import { UserId } from '@core/libs/user-id.decorator';

@Controller('control/registered-report')
export class RegisteredReportPerformanceController {
  constructor(private registeredReportPerformanceService: RegisteredReportPerformanceService) {}

  @Page('Отчёты успеваемости пользователей')
  @UseGuards(JwtAuthGuard)
  @Get()
  async getRegisteredReportPerformance(@Query() query: GetRegisteredReportDto) {
    const [data, total] = await this.registeredReportPerformanceService.getRegisteredReportPerformance(query);
    return { data, total };
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-xlsx')
  async exportXlsx(@Body() query: ExportRegisteredReportDto, @Res() response: Response, @UserId() userId: string) {
    return await this.registeredReportPerformanceService.exportXlsx(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-xls')
  async exportXls(@Body() query: ExportRegisteredReportDto, @Res() response: Response, @UserId() userId: string) {
    return await this.registeredReportPerformanceService.exportXls(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-ods')
  async exportOds(@Body() query: ExportRegisteredReportDto, @Res() response: Response, @UserId() userId: string) {
    return await this.registeredReportPerformanceService.exportOds(query, response, userId);
  }
}
