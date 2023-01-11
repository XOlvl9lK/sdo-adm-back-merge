import { Injectable } from '@nestjs/common';
import { ExcelServiceBase } from '@core/libs/excel-service.base';
import { InjectRepository } from '@nestjs/typeorm';
import { PerformanceRepository } from '@modules/performance/infrastructure/database/performance.repository';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import {
  ExportUserPerformanceDto,
  GetUserPerformanceDto,
} from '@modules/control/controllers/dtos/get-user-performance.dto';
import { PerformanceEntity } from '@modules/performance/domain/performance.entity';
import { ExcelHelper } from '@modules/control/infrastructure/excel.helper';
import { Response } from 'express';
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
export class UserPerformanceService extends ExcelServiceBase {
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
          `Отчет успеваемости пользователя_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.xlsx`,
        xls: (userTimezone: number, number?: number) =>
          `Отчет успеваемости пользователя_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.xls`,
        ods: (userTimezone: number, number?: number) =>
          `Отчет успеваемости пользователя_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.ods`,
        native: 'Отчет успеваемости пользователя',
      },
      fileService,
      createExportTaskService,
      updateExportTaskService,
      exportTaskRepository
    );
    this.createExcel = this.createExcel.bind(this);
    this.getData = this.getData.bind(this)
  }

  async getUserPerformance({ userId, ...requestQuery }: GetUserPerformanceDto) {
    return await this.performanceRepository.findUserPerformance(userId, requestQuery);
  }

  async exportXlsx(dto: ExportUserPerformanceDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-user-performance',
        userId,
        'xlsx',
        ExportPageEnum.CONTROL_USER_PERFORMANCE
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'xlsx', response);
  }

  async exportXls(dto: ExportUserPerformanceDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-user-performance',
        userId,
        'xls',
        ExportPageEnum.CONTROL_USER_PERFORMANCE
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'xls', response);
  }

  async exportOds(dto: ExportUserPerformanceDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-user-performance',
        userId,
        'ods',
        ExportPageEnum.CONTROL_USER_PERFORMANCE
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'ods', response);
  }

  async printUserPerformance(dto: ExportUserPerformanceDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-user-performance',
        userId,
        'pdf',
        ExportPageEnum.CONTROL_USER_PERFORMANCE
      )

      return response.json(exportTask)
    }

    const encodedFileName = encodeURIComponent(`Отчет успеваемости пользователя_${this.createDateString}.pdf`);
    response.setHeader('Content-Disposition', `attachment; filename=${encodedFileName}`);
    const [[performance], user] = await Promise.all([
      this.getUserPerformance(dto),
      this.userRepository.findById(dto.userId),
    ]);

    const contentTable: ContentTable = getPdfContentTable({
      header: ['№ п/п', 'Программа обучения', 'Наименование группы', 'Результат, %', 'Статус'],
      getDataRow: d => [
        d.educationElement.title,
        d.assignment?.group?.title || '-',
        d.result + '',
        d.status,
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
        }
      ],
    })

    pdf.pipe(response)
    pdf.end()
  }

  private async createExcel(dto: ExportUserPerformanceDto, data: PerformanceEntity[]) {
    const user = await this.userRepository.findById(dto.userId)

    return new ExcelHelper()
      .title(this.fileName.native, 'A1:E1')
      .columns([
        { key: 'id' },
        { key: 'program', width: 30 },
        { key: 'groups', width: 30 },
        { key: 'result', width: 30 },
        { key: 'status', width: 30 },
      ])
      .header(['№ п/п', 'Программа обучения', 'Наименование группы', 'Результат, %', 'Статус'], 5)
      .columnAlignment({
        A: { horizontal: 'right' },
        B: { horizontal: 'left' },
        C: { horizontal: 'center' },
        D: { horizontal: 'center' },
        E: { horizontal: 'center' },
      })
      .intermediate({
        row: 3,
        mergeCells: 'A3:E3',
        value: `Пользователь: ${user.login}`,
        alignment: { horizontal: 'left' },
      })
      .fill(
        data.map((p, idx) => ({
          id: idx + 1,
          program: p?.educationElement?.title,
          groups: p?.assignment?.group?.title,
          result: p.result,
          status: p.status,
        })),
        6,
      );
  }

  private async getData(dto: ExportUserPerformanceDto) {
    if (dto.ids) {
      const idsArray = Array.isArray(dto.ids) ? dto.ids : [dto.ids];
      return await this.performanceRepository.findByIdsSorted(idsArray, dto);
    }
    return (await this.getUserPerformance(dto))[0];
  }
}
