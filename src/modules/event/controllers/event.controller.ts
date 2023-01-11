import { Body, Controller, Delete, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { FindEventService } from '@modules/event/application/find-event.service';
import { IPaginatedResponse, RequestQuery } from '@core/libs/types';
import { EventEntity } from '@modules/event/domain/event.entity';
import { JwtAuthGuard } from '@modules/user/infrastructure/guards/jwt-auth.guard';
import { UserId } from '@core/libs/user-id.decorator';
import { DeleteEventService } from '@modules/event/application/delete-event.service';
import { Page } from '@core/libs/page.decorator';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { Response } from 'express';
import { ExportEventService } from '@modules/event/application/export-event.service';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';
import { ExportEventsDto } from '@modules/event/controllers/dtos/export-events.dto';
import { CreateEventService } from '@modules/event/application/create-event.service';

@Controller('event')
export class EventController {
  constructor(
    private findEventService: FindEventService,
    private deleteEventService: DeleteEventService,
    private exportEventService: ExportEventService,
    private createEventService: CreateEventService
  ) {}

  @Page('Открытые сессии пользователей')
  @UseAuthPermissions(PermissionEnum.LOGS)
  @Get()
  async getAll(@Query() requestQuery: RequestQuery): Promise<IPaginatedResponse<EventEntity[]>> {
    const [events, total] = await this.findEventService.getAll(requestQuery);
    return {
      total,
      data: events,
    };
  }

  @UseAuthPermissions(PermissionEnum.LOGS_EXPORT)
  @Post('export-xlsx')
  async exportXlsx(@Body() query: ExportEventsDto, @Res() response: Response, @UserId() userId: string) {
    return await this.exportEventService.exportXlsx(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.LOGS_EXPORT)
  @Post('export-xls')
  async exportXls(@Body() query: ExportEventsDto, @Res() response: Response, @UserId() userId: string) {
    return await this.exportEventService.exportXls(query, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.LOGS_EXPORT)
  @Post('export-ods')
  async exportOds(@Body() query: ExportEventsDto, @Res() response: Response, @UserId() userId: string) {
    return await this.exportEventService.exportOds(query, response, userId);
  }

  @Page('Открытые сессии пользователей')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.findEventService.findById(id);
  }

  @Post()
  async createMany() {
    await this.createEventService.createMany()
    return { success: true }
  }

  @UseAuthPermissions(PermissionEnum.LOGS_CLEAR)
  @Delete()
  async deleteAll(@UserId() userId: string) {
    return await this.deleteEventService.deleteAll(userId);
  }
}
