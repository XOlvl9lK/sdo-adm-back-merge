import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionRepository } from '@modules/user/infrastructure/database/session.repository';
import { RequestQuery } from '@core/libs/types';
import { DeleteSessionDto } from '@modules/control/controllers/dtos/delete-session.dto';
import { Response } from 'express';
import * as PDFDocument from 'pdfkit-table';
import { join } from 'path';
import { ExcelHelper } from '@modules/control/infrastructure/excel.helper';
import { ExcelServiceBase } from '@core/libs/excel-service.base';
import { getClientDate, getClientDateAndTime } from '@core/libs/getClientDateAndTime';
import { ExportSessionsDto } from '@modules/control/controllers/dtos/export-sessions.dto';
import { SessionEntity } from '@modules/user/domain/session.entity';
import { FileService } from '@modules/file/infrastructure/file.service';
import { CreateExportTaskService } from '@modules/export-task/application/create-export-task.service';
import { UpdateExportTaskService } from '@modules/export-task/application/update-export-task.service';
import { ExportPageEnum } from '@modules/export-task/domain/export-task.entity';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import { ContentTable } from 'pdfmake/interfaces';
import { getPdfContentTable } from '@core/libs/getPdfContentTable';
import { generatePdfTable } from '@core/libs/generatePdfTable';

@Injectable()
export class SessionService extends ExcelServiceBase {
  constructor(
    @InjectRepository(SessionRepository)
    private sessionRepository: SessionRepository,
    @InjectRepository(ExportTaskRepository) exportTaskRepository: ExportTaskRepository,
    fileService: FileService,
    createExportTaskService: CreateExportTaskService,
    updateExportTaskService: UpdateExportTaskService,
  ) {
    super(
      {
        xlsx: (userTimezone: number, number?: number) =>
          `Активные сессии пользователей_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.xlsx`,
        xls: (userTimezone: number, number?: number) =>
          `Активные сессии пользователей_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.xls`,
        ods: (userTimezone: number, number?: number) =>
          `Активные сессии пользователей_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.ods`,
        native: 'Активные сессии пользователей',
      },
      fileService,
      createExportTaskService,
      updateExportTaskService,
      exportTaskRepository
    )
    this.createExcel = this.createExcel.bind(this);
    this.getData = this.getData.bind(this)
  }

  async exportXlsx(dto: ExportSessionsDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-session',
        userId,
        'xlsx',
        ExportPageEnum.CONTROL_SESSIONS
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'xlsx', response);
  }

  async exportXls(dto: ExportSessionsDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-session',
        userId,
        'xls',
        ExportPageEnum.CONTROL_SESSIONS
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'xls', response);
  }

  async exportOds(dto: ExportSessionsDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-session',
        userId,
        'ods',
        ExportPageEnum.CONTROL_SESSIONS
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'ods', response);
  }

  async findAll(requestQuery: RequestQuery) {
    return await this.sessionRepository.findAll(requestQuery);
  }

  async delete({ ids }: DeleteSessionDto) {
    const sessions = await this.sessionRepository.findByIds(ids);
    return await this.sessionRepository.remove(sessions);
  }

  private async createExcel(dto: ExportSessionsDto, data: SessionEntity[]) {
    return new ExcelHelper()
      .title('Открытые сессии пользователей', 'A1:H1')
      .columns([
        { key: 'id' },
        { key: 'sessionId', width: 40 },
        { key: 'login', width: 40 },
        { key: 'fullName', width: 40 },
        { key: 'ip', width: 20 },
        { key: 'lastPage', width: 40 },
        { key: 'createdAt', width: 30 },
        { key: 'updatedAt', width: 30 },
      ])
      .header(
        [
          '№ п/п',
          'ID сессии',
          'Логин',
          'Ф.И.О.',
          'IP',
          'Последнее посещение',
          'Время создания',
          'Последняя активность',
        ],
        3,
      )
      .columnAlignment({
        A: { horizontal: 'right' },
        B: { horizontal: 'center' },
        C: { horizontal: 'center' },
        E: { horizontal: 'center' },
        F: { horizontal: 'center' },
        G: { horizontal: 'center' },
        H: { horizontal: 'center' },
      })
      .fill(
        data.map((session, idx) => ({
          id: idx + 1,
          sessionId: session.id,
          login: session.user.login,
          fullName: session.user.fullName || '-',
          ip: session.ip,
          lastPage: session.lastPage,
          createdAt: getClientDateAndTime(session.createdAt, dto.userTimezone),
          updatedAt: getClientDateAndTime(session.updatedAt, dto.userTimezone),
        })),
        4,
      )
  }

  private async getData(dto: ExportSessionsDto) {
    if (dto.ids) {
      const idsArray = Array.isArray(dto.ids) ? dto.ids : [dto.ids];
      return await this.sessionRepository.findByIds(idsArray, { relations: ['user'] })
    }
    return (await this.findAll(dto))[0]
  }

  async printSessions(dto: ExportSessionsDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-session',
        userId,
        'pdf',
        ExportPageEnum.CONTROL_SESSIONS
      )

      return response.json(exportTask)
    }

    const encodedFileName = encodeURIComponent('Активные сессии пользователей.pdf');
    response.setHeader('Content-Disposition', `attachment; filename=${encodedFileName}`);
    const sessions = (await this.findAll({}))[0];

    const contentTable: ContentTable = getPdfContentTable({
      header: ['№ п/п', 'ID сессии', 'Логин', 'Ф.И.О.', 'IP', 'Последнее посещение', 'Время создания', 'Последняя активность'],
      getDataRow: d => [
        d.id,
        d.user.login,
        d.user.fullName || '-',
        d.ip,
        d.lastPage,
        getClientDateAndTime(new Date(d.createdAt), dto.userTimezone),
        getClientDateAndTime(new Date(d.updatedAt), dto.userTimezone)
      ],
      data: sessions,
    })

    const pdf = generatePdfTable({
      generateDate: getClientDate(new Date(), dto.userTimezone),
      total: sessions.length,
      contentTable,
      title: this.fileName.native
    })

    pdf.pipe(response)
    pdf.end()
  }
}
