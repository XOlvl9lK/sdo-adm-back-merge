import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRepository } from '@modules/event/infrastructure/database/event.repository';
import { Response } from 'express';
import { ExcelHelper } from '@modules/control/infrastructure/excel.helper';
import { ExcelServiceBase } from '@core/libs/excel-service.base';
import { EventEntity } from '@modules/event/domain/event.entity';
import { ExportEventsDto } from '@modules/event/controllers/dtos/export-events.dto';
import { FindEventService } from '@modules/event/application/find-event.service';
import { getClientDateAndTime } from '@core/libs/getClientDateAndTime';
import { FileService } from '@modules/file/infrastructure/file.service';
import { CreateExportTaskService } from '@modules/export-task/application/create-export-task.service';
import { UpdateExportTaskService } from '@modules/export-task/application/update-export-task.service';
import { ExportPageEnum } from '@modules/export-task/domain/export-task.entity';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';

@Injectable()
export class ExportEventService extends ExcelServiceBase {
  constructor(
    @InjectRepository(EventRepository)
    private eventRepository: EventRepository,
    private findEventService: FindEventService,
    @InjectRepository(ExportTaskRepository)
    exportTaskRepository: ExportTaskRepository,
    updateExportTaskService: UpdateExportTaskService,
    fileService: FileService,
    createExportTaskService: CreateExportTaskService,
  ) {
    super(
      {
        xlsx: (userTimezone: number, number?: number) =>
          `Журнал событий_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.xlsx`,
        xls: (userTimezone: number, number?: number) =>
          `Журнал событий_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.xls`,
        ods: (userTimezone: number, number?: number) =>
          `Журнал событий_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.ods`,
        native: 'Журнал событий',
      },
      fileService,
      createExportTaskService,
      updateExportTaskService,
      exportTaskRepository
    );
    this.createExcel = this.createExcel.bind(this);
    this.getData = this.getData.bind(this)
  }

  async exportXlsx(dto: ExportEventsDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-event',
        userId,
        'xlsx',
        ExportPageEnum.EVENT_LOG
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'xlsx', response);
  }

  async exportXls(dto: ExportEventsDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-event',
        userId,
        'xls',
        ExportPageEnum.EVENT_LOG
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'xls', response);
  }

  async exportOds(dto: ExportEventsDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-event',
        userId,
        'ods',
        ExportPageEnum.EVENT_LOG
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'ods', response);
  }

  private async createExcel(dto: ExportEventsDto, data: EventEntity[]) {
    return new ExcelHelper()
      .title('Журнал событий', 'A1:G1')
      .columns([
        { key: 'number' },
        { key: 'id', width: 20 },
        { key: 'type', width: 15 },
        { key: 'createdAt', width: 30 },
        { key: 'page', width: 20 },
        { key: 'description', width: 40 },
      ])
      .header(['№ п/п', 'ID', 'Тип', 'Дата', 'Страница', 'Событие'], 3)
      .fill(
        data.map((e, idx) => ({
          number: idx + 1,
          ...e,
          description: e.description || '-',
          createdAt: getClientDateAndTime(new Date(e.createdAt), dto.userTimezone),
        })),
        4,
      )
  }

  private async getData(dto: ExportEventsDto) {
    if (dto?.ids) {
      const idsArray = Array.isArray(dto.ids) ? dto.ids : [dto.ids];
      return await this.findEventService.findByIds(idsArray)
    }
    return (await this.findEventService.getAll(dto))[0]
  }
}
