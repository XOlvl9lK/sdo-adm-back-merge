import { Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ReportUserService } from '@modules/control/application/report-user.service';
import { Page } from '@core/libs/page.decorator';
import { JwtAuthGuard } from '@modules/user/infrastructure/guards/jwt-auth.guard';
import {
  ExportReportUserCourseDto,
  GetReportUserCourseDto,
} from '@modules/control/controllers/dtos/get-report-user-course.dto';
import { Response } from 'express';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';
import { UserId } from '@core/libs/user-id.decorator';

@Controller('control/report-course')
export class ReportUserController {
  constructor(private reportUserService: ReportUserService) {}

  @Page('Отчет успеваемости пользователей по заданным курсам')
  @UseGuards(JwtAuthGuard)
  @Get()
  async getReportUserCourse(@Query() query: GetReportUserCourseDto) {
    const [data, total] = await this.reportUserService.getReportCourse(query);
    return { data, total };
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-xlsx')
  async exportXlsx(@Body() query: ExportReportUserCourseDto, @Res() response: Response, @UserId() userId: string) {
    return this.reportUserService.exportXlsx(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-xls')
  async exportXls(@Body() query: ExportReportUserCourseDto, @Res() response: Response, @UserId() userId: string) {
    return this.reportUserService.exportXls(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-ods')
  async exportOds(@Body() query: ExportReportUserCourseDto, @Res() response: Response, @UserId() userId: string) {
    return this.reportUserService.exportOds(query, response, userId);
  }
}
