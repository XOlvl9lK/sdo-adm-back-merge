import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { GroupProgramPerformanceService } from '@modules/control/application/group-program-performance.service';
import { Page } from '@core/libs/page.decorator';
import {
  ExportGroupProgramPerformanceDto,
  GetGroupProgramPerformanceDto
} from '@modules/control/controllers/dtos/get-group-program-performance.dto';
import { Response } from 'express';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { LoggerService } from '@core/logger/logger.service';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';
import { UserId } from '@core/libs/user-id.decorator';

@Controller('control/group-program')
export class GroupProgramPerformanceController {
  constructor(private groupProgramPerformanceService: GroupProgramPerformanceService) {}

  @Page('Обучение группы по программе обучения')
  @UseAuthPermissions(PermissionEnum.CONTROL_GROUP_PROGRAM)
  @Get()
  async getGroupProgramPerformance(@Query() query: GetGroupProgramPerformanceDto) {
    const [data, total] = await this.groupProgramPerformanceService.getGroupProgramPerformance(query);
    return { data, total };
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-xlsx')
  async exportXlsx(@Body() query: ExportGroupProgramPerformanceDto, @Res() response: Response, @UserId() userId: string) {
    return await this.groupProgramPerformanceService.exportXlsx(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-xls')
  async exportXls(@Body() query: ExportGroupProgramPerformanceDto, @Res() response: Response, @UserId() userId: string) {
    return await this.groupProgramPerformanceService.exportXls(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-ods')
  async exportOds(@Body() query: ExportGroupProgramPerformanceDto, @Res() response: Response, @UserId() userId: string) {
    return await this.groupProgramPerformanceService.exportOds(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_PRINT)
  @Post(':programId/print')
  async printUserProgramPerformance(
    @Param('programId') programId: string,
    @Body() query: Omit<ExportGroupProgramPerformanceDto, 'programId'>,
    @Res() response: Response,
    @UserId() userId: string
  ) {
    return await this.groupProgramPerformanceService.printGroupProgramPerformance({ programId, ...query }, response, userId);
  }
}
