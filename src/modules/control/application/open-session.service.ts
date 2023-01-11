import { Injectable } from '@nestjs/common';
import { ExcelServiceBase } from '@core/libs/excel-service.base';
import { InjectRepository } from '@nestjs/typeorm';
import { PerformanceRepository } from '@modules/performance/infrastructure/database/performance.repository';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { RequestQuery } from '@core/libs/types';
import { ExcelHelper } from '@modules/control/infrastructure/excel.helper';
import { PerformanceEntity } from '@modules/performance/domain/performance.entity';
import { Response } from 'express';
import { getClientDate, getClientDateAndTime } from '@core/libs/getClientDateAndTime';
import { ExportOpenSessionDto } from '@modules/control/controllers/dtos/export-open-session.dto';
import { FileService } from '@modules/file/infrastructure/file.service';
import { CreateExportTaskService } from '@modules/export-task/application/create-export-task.service';
import { UpdateExportTaskService } from '@modules/export-task/application/update-export-task.service';
import { ExportPageEnum } from '@modules/export-task/domain/export-task.entity';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import { ContentTable } from 'pdfmake/interfaces';
import { getPdfContentTable } from '@core/libs/getPdfContentTable';
import { generatePdfTable } from '@core/libs/generatePdfTable';

@Injectable()
export class OpenSessionService extends ExcelServiceBase {
  constructor(
    @InjectRepository(PerformanceRepository)
    private performanceRepository: PerformanceRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(ExportTaskRepository)
    exportTaskRepository: ExportTaskRepository,
    fileService: FileService,
    createExportTaskService: CreateExportTaskService,
    updateExportTaskService: UpdateExportTaskService,
  ) {
    super(
      {
        xlsx: (userTimezone: number, number?: number) =>
          `Отчет по открытым сессиям пользователей_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.xlsx`,
        xls: (userTimezone: number, number?: number) =>
          `Отчет по открытым сессиям пользователей_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.xls`,
        ods: (userTimezone: number, number?: number) =>
          `Отчет по открытым сессиям пользователей_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.ods`,
        native: 'Отчет по открытым сессиям пользователей',
      },
      fileService,
      createExportTaskService,
      updateExportTaskService,
      exportTaskRepository
    );
    this.createExcel = this.createExcel.bind(this);
    this.getData = this.getData.bind(this)
  }

  async getOpenSessions(requestQuery: RequestQuery) {
    return await this.performanceRepository.findForOpenSessionsReport(requestQuery);
  }

  async exportXlsx(dto: ExportOpenSessionDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-open-session',
        userId,
        'xlsx',
        ExportPageEnum.CONTROL_SESSIONS
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'xlsx', response);
  }

  async exportXls(dto: ExportOpenSessionDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-open-session',
        userId,
        'xls',
        ExportPageEnum.CONTROL_SESSIONS
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'xls', response);
  }

  async exportOds(dto: ExportOpenSessionDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-open-session',
        userId,
        'ods',
        ExportPageEnum.CONTROL_SESSIONS
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'ods', response);
  }

  async print(dto: ExportOpenSessionDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-open-session',
        userId,
        'pdf',
        ExportPageEnum.CONTROL_SESSIONS
      )

      return response.json(exportTask)
    }

    const encodedFileName = encodeURIComponent(`Отчет по открытым сессиям пользователей_${this.createDateString}.pdf`);
    response.setHeader('Content-Disposition', `attachment; filename=${encodedFileName}`);
    const data = (await this.getOpenSessions(dto))[0];

    const contentTable: ContentTable = getPdfContentTable({
      header: ['№ п/п', 'Логин ДОиТП', 'Ведомство', 'Подразделение', 'Программа обучения', 'Наименование группы', 'Результат, %', 'Дата начала сессии', 'Дата регистрации на портале'],
      getDataRow: d => [
        d.user.login,
        d.user?.department?.title || '-',
        d.user?.subdivision?.title || '-',
        d.educationElement?.title || '-',
        d.assignment?.group?.title || '-',
        d.result + '',
        getClientDateAndTime(d.startDate, dto.userTimezone),
        getClientDateAndTime(d.user.createdAt, dto.userTimezone)
      ],
      data,
      widths: [20, 50, 55, 80, 70, 55, 50, 55, 65]
    })

    const pdf = generatePdfTable({
      generateDate: getClientDate(new Date(), dto.userTimezone),
      total: data.length,
      contentTable,
      title: this.fileName.native
    })

    pdf.pipe(response)
    pdf.end()
  }

  private async createExcel(dto: ExportOpenSessionDto, data: PerformanceEntity[]) {
    return new ExcelHelper()
      .title(this.fileName.native, 'A1:I1')
      .columns([
        { key: 'id' },
        { key: 'login', width: 30 },
        { key: 'department', width: 30 },
        { key: 'subdivision', width: 30 },
        { key: 'program', width: 30 },
        { key: 'groups', width: 20 },
        { key: 'result', width: 30 },
        { key: 'startDate', width: 30 },
        { key: 'createdAt', width: 30 },
      ])
      .header(
        [
          '№ п/п',
          'Логин ДОиТП',
          'Ведомство',
          'Подразделение',
          'Программа обучения',
          'Наименование группы',
          'Результат, %',
          'Дата начала сессии',
          'Дата регистрации на портале',
        ],
        3,
      )
      .columnAlignment({
        A: { horizontal: 'right' },
        B: { horizontal: 'left' },
        C: { horizontal: 'center' },
        D: { horizontal: 'center' },
        E: { horizontal: 'center' },
        F: { horizontal: 'center' },
        G: { horizontal: 'center' },
        H: { horizontal: 'center' },
        I: { horizontal: 'center' },
      })
      .fill(
        data.map((p, idx) => ({
          id: idx + 1,
          login: p.user.login,
          department: p.user.department?.title || '-',
          subdivision: p.user.subdivision?.title || '-',
          program: p?.educationElement?.title || '-',
          groups: p?.assignment?.group?.title || '-',
          result: p.result,
          startDate: getClientDateAndTime(p.startDate, dto.userTimezone) || '-',
          createdAt: getClientDateAndTime(p.user.createdAt, dto.userTimezone),
        })),
        4,
      );
  }

  private async getData(dto: RequestQuery & { ids?: string[] }) {
    if (dto.ids) {
      const idsArray = Array.isArray(dto.ids) ? dto.ids : [dto.ids];
      return await this.performanceRepository.findByIdsSorted(idsArray, dto);
    }
    return (await this.getOpenSessions(dto))[0];
  }
}
