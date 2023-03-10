import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerformanceRepository } from '@modules/performance/infrastructure/database/performance.repository';
import {
  ExportUserPeriodPerformanceDto,
  GetUserPeriodPerformanceDto,
} from '@modules/control/controllers/dtos/get-user-period-performance.dto';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { Response } from 'express';
import { ExcelHelper } from '@modules/control/infrastructure/excel.helper';
import { PerformanceEntity } from '@modules/performance/domain/performance.entity';
import { ExcelServiceBase } from '@core/libs/excel-service.base';
import { getClientDate, getClientDateAndTime } from '@core/libs/getClientDateAndTime';
import { FileService } from '@modules/file/infrastructure/file.service';
import { CreateExportTaskService } from '@modules/export-task/application/create-export-task.service';
import { UpdateExportTaskService } from '@modules/export-task/application/update-export-task.service';
import { ExportPageEnum } from '@modules/export-task/domain/export-task.entity';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import { ContentTable } from 'pdfmake/interfaces';
import { getPdfContentTable } from '@core/libs/getPdfContentTable';
import { generatePdfTable } from '@core/libs/generatePdfTable';

@Injectable()
export class UserPeriodPerformanceService extends ExcelServiceBase {
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
          `Отчет по обучению пользователя за период_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.xlsx`,
        xls: (userTimezone: number, number?: number) =>
          `Отчет по обучению пользователя за период_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.xls`,
        ods: (userTimezone: number, number?: number) =>
          `Отчет по обучению пользователя за период_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.ods`,
        native: 'Отчет по обучению пользователя за период',
      },
      fileService,
      createExportTaskService,
      updateExportTaskService,
      exportTaskRepository
    );
    this.createExcel = this.createExcel.bind(this);
  }

  async getUserPeriodPerformance({ userId, dateStart, dateEnd, ...requestQuery }: GetUserPeriodPerformanceDto) {
    return await this.performanceRepository.findUserPeriodPerformance(userId, dateStart, dateEnd, requestQuery);
  }

  async exportXlsx(dto: ExportUserPeriodPerformanceDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-user-period-performance',
        userId,
        'xlsx',
        ExportPageEnum.CONTROL_USER_PERIOD
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'xlsx', response);
  }

  async exportXls(dto: ExportUserPeriodPerformanceDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-user-period-performance',
        userId,
        'xls',
        ExportPageEnum.CONTROL_USER_PERIOD
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'xls', response);
  }

  async exportOds(dto: ExportUserPeriodPerformanceDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-user-period-performance',
        userId,
        'ods',
        ExportPageEnum.CONTROL_USER_PERIOD
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'ods', response);
  }

  private async createExcel(dto: ExportUserPeriodPerformanceDto, data: PerformanceEntity[]) {
    const user = await this.userRepository.findById(dto.userId)

    return new ExcelHelper()
      .title(this.fileName.native, 'A1:H1')
      .columns([
        { key: 'id' },
        { key: 'login', width: 30 },
        { key: 'department', width: 30 },
        { key: 'subdivision', width: 30 },
        { key: 'program', width: 30 },
        { key: 'result', width: 20 },
        { key: 'status', width: 30 },
        { key: 'createdAt', width: 30 },
      ])
      .header(
        [
          '№ п/п',
          'Логин ДОиТП',
          'Ведомство',
          'Подразделение',
          'Программа обучения',
          'Результат, %',
          'Статус',
          'Дата регистрации на портале',
        ],
        6,
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
      })
      .intermediate({
        row: 3,
        mergeCells: 'A3:G3',
        value: `Пользователь: ${user.login}`,
        alignment: { horizontal: 'left' },
      })
      .intermediate({
        row: 4,
        mergeCells: 'A4:G4',
        value: `Период: ${getClientDate(new Date(dto.dateStart), dto.userTimezone)} - ${
          getClientDate(new Date(dto.dateEnd), dto.userTimezone)
        }`,
        alignment: { horizontal: 'left' },
      })
      .fill(
        data.map((p, idx) => ({
          id: idx + 1,
          login: p.user.login,
          department: p.user.department?.title || '-',
          subdivision: p.user.subdivision?.title || '-',
          program: p?.educationElement?.title || '-',
          result: p.result,
          status: p.status,
          createdAt: getClientDateAndTime(p.user.createdAt, dto.userTimezone),
        })),
        7,
      );
  }

  async printUserPeriodPerformance(dto: ExportUserPeriodPerformanceDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-user-period-performance',
        userId,
        'pdf',
        ExportPageEnum.CONTROL_USER_PERIOD
      )

      return response.json(exportTask)
    }

    const encodedFileName = encodeURIComponent(`Отчет по обучению пользователя за период_${this.createDateString}.pdf`);
    response.setHeader('Content-Disposition', `attachment; filename=${encodedFileName}`);
    const [[performance], user] = await Promise.all([
      this.getUserPeriodPerformance(dto),
      this.userRepository.findById(dto.userId),
    ]);

    const contentTable: ContentTable = getPdfContentTable({
      header: ['№ п/п', 'Логин ДОиТП', 'Ведомство', 'Подразделение', 'Программа обучения', 'Результат, %', 'Статус', 'Дата регистрации на портале'],
      getDataRow: d => [
        d.user.login,
        d.user?.department?.title || '-',
        d.user?.subdivision?.title || '-',
        d.educationElement.title,
        d.result + '',
        d.status,
        getClientDateAndTime(d.user.createdAt, dto.userTimezone),
      ],
      data: performance,
    })

    const pdf = generatePdfTable({
      generateDate: getClientDate(new Date(), dto.userTimezone),
      total: performance.length,
      contentTable,
      title: this.fileName.native,
      filters: [
        {
          text: [
            { text: 'Пользователь: ', style: 'boldText', margin: [0, 5] },
            user.login
          ]
        }, {
          text: [
            { text: 'Период: ', style: 'boldText', margin: [0, 5] },
            `${getClientDate(new Date(dto.dateStart), dto.userTimezone)} - ${getClientDate(new Date(dto.dateEnd), dto.userTimezone)}`
          ]
        }
      ]
    })

    pdf.pipe(response)
    pdf.end()
  }

  private async getData(dto: ExportUserPeriodPerformanceDto) {
    if (dto.ids) {
      const idsArray = Array.isArray(dto.ids) ? dto.ids : [dto.ids];
      return await this.performanceRepository.findByIdsSorted(idsArray, dto);
    }
    return (await this.getUserPeriodPerformance(dto))[0];
  }
}
