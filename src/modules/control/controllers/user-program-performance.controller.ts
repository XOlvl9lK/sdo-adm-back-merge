import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { UserProgramPerformanceService } from '@modules/control/application/user-program-performance.service';
import { Page } from '@core/libs/page.decorator';
import {
  ExportUserProgramPerformanceDto,
  GetUserProgramPerformanceDto,
} from '@modules/control/controllers/dtos/get-user-program-performance.dto';
import { Response } from 'express';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { LoggerService } from '@core/logger/logger.service';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';
import { UserId } from '@core/libs/user-id.decorator';

@Controller('control/user-program')
export class UserProgramPerformanceController {
  constructor(private userProgramPerformanceService: UserProgramPerformanceService) {}

  @Page('Обучение пользователя по программе обучения')
  @UseAuthPermissions(PermissionEnum.CONTROL_USER_PROGRAM)
  @Get()
  async getUserProgramPerformance(@Query() query: GetUserProgramPerformanceDto) {
    const [data, total] = await this.userProgramPerformanceService.getUserProgramPerformance(query);
    return { data, total };
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-xlsx')
  async exportXlsx(@Body() query: ExportUserProgramPerformanceDto, @Res() response: Response, @UserId() userId: string) {
    return await this.userProgramPerformanceService.exportXlsx(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-xls')
  async exportXls(@Body() query: ExportUserProgramPerformanceDto, @Res() response: Response, @UserId() userId: string) {
    return await this.userProgramPerformanceService.exportXls(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-ods')
  async exportOds(@Body() query: ExportUserProgramPerformanceDto, @Res() response: Response, @UserId() userId: string) {
    return await this.userProgramPerformanceService.exportOds(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_PRINT)
  @Post(':programId/print')
  async printUserProgramPerformance(
    @Param('programId') programId: string,
    @Body() query: Omit<ExportUserProgramPerformanceDto, 'performanceId'>,
    @Res() response: Response,
    @UserId() userId: string
  ) {
    try {
      return await this.userProgramPerformanceService.printUserProgramPerformance({ programId, ...query }, response, userId);
    } catch (e: any) {
      LoggerService.error(JSON.stringify(e) || '', e?.stack, 'PRINT');
      throw e;
    }
  }
}
