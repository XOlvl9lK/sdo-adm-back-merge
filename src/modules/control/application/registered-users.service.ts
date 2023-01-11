import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { FindRegisteredUsersDto } from '@modules/other/controllers/dtos/find-registered-users.dto';
import { Response } from 'express';
import { format } from 'date-fns';
import { RequestQuery } from '@core/libs/types';
import { ExcelHelper } from '@modules/control/infrastructure/excel.helper';
import { EducationProgramPerformanceRepository } from '@modules/performance/infrastructure/database/performance.repository';
import { GroupingHelper } from '@modules/control/infrastructure/grouping.helper';
import { ExcelServiceBase } from '@core/libs/excel-service.base';
import { ArchiverService } from '@modules/archiver/application/archiver.service';
import { ExportRegisteredUsersDto } from '@modules/control/controllers/dtos/export-registered-users.dto';
import { PdfHelper } from '@modules/control/infrastructure/pdf.helper';
import { orderBy } from 'lodash';
import { getClientDate, getClientDateAndTime } from '@core/libs/getClientDateAndTime';
import { FileService } from '@modules/file/infrastructure/file.service';
import { CreateExportTaskService } from '@modules/export-task/application/create-export-task.service';
import { UpdateExportTaskService } from '@modules/export-task/application/update-export-task.service';
import { ExportPageEnum } from '@modules/export-task/domain/export-task.entity';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import { ContentTable } from 'pdfmake/interfaces';
import { generatePdfTable } from '@core/libs/generatePdfTable';
import { getPdfContentTable } from '@core/libs/getPdfContentTable';

@Injectable()
export class RegisteredUsersService extends ExcelServiceBase {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(EducationProgramPerformanceRepository)
    private educationProgramPerformanceRepository: EducationProgramPerformanceRepository,
    @InjectRepository(ExportTaskRepository)
    exportTaskRepository: ExportTaskRepository,
    fileService: FileService,
    createExportTaskService: CreateExportTaskService,
    updateExportTaskService: UpdateExportTaskService,
  ) {
    super(
      {
        xlsx: (userTimezone: number, number?: number) =>
          `Отчет по зарегистрированным пользователям_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.xlsx`,
        xls: (userTimezone: number, number?: number) =>
          `Отчет по зарегистрированным пользователям_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.xls`,
        ods: (userTimezone: number, number?: number) =>
          `Отчет по зарегистрированным пользователям_${getClientDateAndTime(new Date(), userTimezone)}${number ? `_${number}` : ''}.ods`,
        native: 'Отчет по зарегистрированным пользователям',
      },
      fileService,
      createExportTaskService,
      updateExportTaskService,
      exportTaskRepository
    );
    this.createExcel = this.createExcel.bind(this);
    this.getData = this.getData.bind(this)
  }

  async getRegisteredUsers({ dateStart, dateEnd }: FindRegisteredUsersDto, requestQuery: RequestQuery) {
    const [users, total] = await this.userRepository.findByDateFilter(dateStart, dateEnd, requestQuery);
    return {
      total,
      data: users,
    };
  }

  async exportXlsx(dto: ExportRegisteredUsersDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-registered-users',
        userId,
        'xlsx',
        ExportPageEnum.CONTROL_REGISTERED
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'xlsx', response);
  }

  async exportXls(dto: ExportRegisteredUsersDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-registered-users',
        userId,
        'xls',
        ExportPageEnum.CONTROL_REGISTERED
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'xls', response);
  }

  async exportOds(dto: ExportRegisteredUsersDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-registered-users',
        userId,
        'ods',
        ExportPageEnum.CONTROL_REGISTERED
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'ods', response);
  }

  private async createExcel(dto: ExportRegisteredUsersDto, data: any) {
    return new ExcelHelper()
      .title('Отчет по зарегистрированным пользователям', 'A1:F1')
      .columns([
        { key: 'id' },
        { key: 'login', width: 30 },
        { key: 'department_title', width: 30 },
        { key: 'subdivision_title', width: 30 },
        { key: 'completed_programs', width: 30 },
        { key: 'createdAt', width: 30 },
      ])
      .header(
        [
          '№ п/п',
          'Логин ДОиТП',
          'Ведомство',
          'Подразделение',
          'Количество пройденных программ обучения',
          'Дата регистрации на портале',
        ],
        5,
      )
      .intermediate({
        row: 3,
        mergeCells: 'A3:F3',
        alignment: { horizontal: 'center' },
        value: `Период: ${getClientDate(new Date(dto.dateStart), dto.userTimezone)} - ${
          getClientDate(new Date(dto.dateEnd), dto.userTimezone)
        }`,
      })
      .fill(
        data.map((d, idx) => ({
          id: idx + 1,
          login: d.login,
          department_title: d.department_title || '',
          subdivision_title: d.subdivision_title || '',
          completed_programs: d.completed_programs,
          createdAt: getClientDateAndTime(new Date(d.createdAt), dto.userTimezone),
        })),
        6,
      );
  }

  async printRegisteredUsers(dto: ExportRegisteredUsersDto & RequestQuery, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-registered-users',
        userId,
        'pdf',
        ExportPageEnum.CONTROL_REGISTERED
      )

      return response.json(exportTask)
    }

    const encodedFileName = encodeURIComponent(
      `Отчет по зарегистрированным пользователям_${this.createDateString}.pdf`,
    );
    response.setHeader('Content-Disposition', `attachment; filename=${encodedFileName}`);
    const { data } = await this.getRegisteredUsers(dto, dto);

    const contentTable: ContentTable = getPdfContentTable<any>({
      header: ['№ п/п', 'Логин ДОиТП', 'Ведомство', 'Подразделение', 'Количество пройденных программ обучения', 'Дата регистрации на портале'],
      getDataRow: d => [
        d.login,
        d.department_title || '-',
        d.subdivision_title || '-',
        d.completed_programs || '-',
        getClientDateAndTime(new Date(d.createdAt), dto.userTimezone),
      ],
      data,
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

  private async getData(dto: ExportRegisteredUsersDto) {
    if (dto.ids) {
      const idsArray = Array.isArray(dto.ids) ? dto.ids : [dto.ids];
      const parsedSort = JSON.parse(dto?.sort);
      const sortKey = Object.keys(parsedSort)[0];
      const sortValue = parsedSort[sortKey];
      return orderBy(await this.getRegisteredUsersByIds(idsArray), sortKey, sortValue);
    }
    return (await this.getRegisteredUsers(dto, dto)).data;
  }

  private async getRegisteredUsersByIds(ids: string[]) {
    const [users, completedPrograms] = await Promise.all([
      this.userRepository.findByIds(ids),
      this.educationProgramPerformanceRepository.findCompletedByUserIds(ids),
    ]);
    return GroupingHelper.groupUsersAndCompletedPrograms(users, completedPrograms);
  }
}
