import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerformanceRepository } from '@modules/performance/infrastructure/database/performance.repository';
import {
  ExportUserProgramPerformanceDto,
  GetUserProgramPerformanceDto,
} from '@modules/control/controllers/dtos/get-user-program-performance.dto';
import { Response } from 'express';
import { EducationElementRepository } from '@modules/education-program/infrastructure/database/education-program.repository';
import { ExcelHelper } from '@modules/control/infrastructure/excel.helper';
import { ExcelServiceBase } from '@core/libs/excel-service.base';
import { PerformanceEntity } from '@modules/performance/domain/performance.entity';
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
export class UserProgramPerformanceService extends ExcelServiceBase {
  constructor(
    @InjectRepository(PerformanceRepository)
    private performanceRepository: PerformanceRepository,
    @InjectRepository(EducationElementRepository)
    private educationElementRepository: EducationElementRepository,
    @InjectRepository(ExportTaskRepository)
      exportTaskRepository: ExportTaskRepository,
    fileService: FileService,
    createExportTaskService: CreateExportTaskService,
    updateExportTaskService: UpdateExportTaskService,
  ) {
    super(
      {
        xlsx: (userTimezone: number, number?: number) =>
          `Отчет по обучению пользователей по программе обучения_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.xlsx`,
        xls: (userTimezone: number, number?: number) =>
          `Отчет по обучению пользователей по программе обучения_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.xls`,
        ods: (userTimezone: number, number?: number) =>
          `Отчет по обучению пользователей по программе обучения_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.ods`,
        native: 'Отчет по обучению пользователей по программе обучения',
      },
      fileService,
      createExportTaskService,
      updateExportTaskService,
      exportTaskRepository
    );
    this.createExcel = this.createExcel.bind(this);
    this.getData = this.getData.bind(this)
  }

  async getUserProgramPerformance({ programId, dateStart, dateEnd, ...requestQuery }: GetUserProgramPerformanceDto) {
    return await this.performanceRepository.findUserProgramPerformance(programId, dateStart, dateEnd, requestQuery);
  }

  async exportXlsx(dto: ExportUserProgramPerformanceDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-user-program-performance',
        userId,
        'xlsx',
        ExportPageEnum.CONTROL_USER_PROGRAM
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'xlsx', response);
  }

  async exportXls(dto: ExportUserProgramPerformanceDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-user-program-performance',
        userId,
        'xls',
        ExportPageEnum.CONTROL_USER_PROGRAM
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'xls', response);
  }

  async exportOds(dto: ExportUserProgramPerformanceDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-user-program-performance',
        userId,
        'ods',
        ExportPageEnum.CONTROL_USER_PROGRAM
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'ods', response);
  }

  private async createExcel(dto: ExportUserProgramPerformanceDto, data: PerformanceEntity[]) {
    const program = await this.educationElementRepository.findById(dto.programId);

    return new ExcelHelper()
      .title(this.fileName.native, 'A1:G1')
      .columns([
        { key: 'id' },
        { key: 'login', width: 60 },
        { key: 'department', width: 30 },
        { key: 'subdivision', width: 30 },
        { key: 'groupTitle', width: 30 },
        { key: 'result', width: 20 },
        { key: 'status', width: 30 },
        { key: 'createdAt', width: 30 },
      ])
      .header(
        ['№ п/п', 'Логин ДОиТП', 'Ведомство', 'Подразделение', 'Наименование группы', 'Результат, %', 'Статус', 'Дата регистрации на портале'],
        6,
      )
      .columnAlignment({
        A: { horizontal: 'right' },
        B: { horizontal: 'left' },
        C: { horizontal: 'left' },
        D: { horizontal: 'center' },
        E: { horizontal: 'center' },
        F: { horizontal: 'center' },
        G: { horizontal: 'center' },
        H: { horizontal: 'center' },
      })
      .intermediate({
        row: 3,
        mergeCells: 'A3:G3',
        value: `Программа обучения: ${program.title}`,
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
          groupTitle: p.assignment?.group?.title || '-',
          result: p.result,
          status: p.status,
          createdAt: getClientDateAndTime(p.user.createdAt, dto.userTimezone),
        })),
        7,
      );
  }

  async printUserProgramPerformance(dto: ExportUserProgramPerformanceDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-user-program-performance',
        userId,
        'pdf',
        ExportPageEnum.CONTROL_USER_PROGRAM
      )

      return response.json(exportTask)
    }

    const encodedFileName = encodeURIComponent(`Отчет по обучению пользователей по программе обучения_${this.createDateString}.pdf`);
    response.setHeader('Content-Disposition', `attachment; filename=${encodedFileName}`);
    const [[performance], program] = await Promise.all([
      this.getUserProgramPerformance(dto),
      this.educationElementRepository.findById(dto.programId),
    ]);

    const contentTable: ContentTable = getPdfContentTable({
      header: ['№ п/п', 'Логин ДОиТП', 'Ведомство', 'Подразделение', 'Количество пройденных программ обучения', 'Дата регистрации на портале'],
      getDataRow: d => [
        d.user.login,
        d.user?.department?.title || '-',
        d.user?.subdivision?.title || '-',
        d.assignment?.group?.title || '-',
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
            { text: 'Программа обучения: ', style: 'boldText', margin: [0, 5] },
            program.title
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

  private async getData(dto: ExportUserProgramPerformanceDto) {
    if (dto.ids) {
      const idsArray = Array.isArray(dto.ids) ? dto.ids : [dto.ids];
      return await this.performanceRepository.findByIdsSorted(idsArray, dto);
    }
    return (await this.getUserProgramPerformance(dto))[0];
  }
}
