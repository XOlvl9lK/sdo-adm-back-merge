import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerformanceRepository } from '@modules/performance/infrastructure/database/performance.repository';
import { GroupRepository, UserInGroupRepository } from '@modules/group/infrastructure/database/group.repository';
import {
  ExportRegisteredReportDto,
  GetRegisteredReportDto,
} from '@modules/control/controllers/dtos/get-registered-report.dto';
import { GroupEntity, UserInGroupEntity } from '@modules/group/domain/group.entity';
import { RegionEntity } from '@modules/authority/domain/region.entity';
import { DepartmentEntity } from '@modules/authority/domain/department.entity';
import { SubdivisionEntity } from '@modules/authority/domain/subdivision.entity';
import { Response } from 'express';
import { ExcelHelper } from '@modules/control/infrastructure/excel.helper';
import { ExcelServiceBase } from '@core/libs/excel-service.base';
import { getClientDate, getClientDateAndTime } from '@core/libs/getClientDateAndTime';
import { FileService } from '@modules/file/infrastructure/file.service';
import { CreateExportTaskService } from '@modules/export-task/application/create-export-task.service';
import { UpdateExportTaskService } from '@modules/export-task/application/update-export-task.service';
import { ExportPageEnum } from '@modules/export-task/domain/export-task.entity';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import { ControlRepository, RegisteredPerformanceReportItem } from 'src/modules/control/infrastructure/database/control.repository';

@Injectable()
export class RegisteredReportPerformanceService extends ExcelServiceBase {
  constructor(
    private controlRepository: ControlRepository,
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
    @InjectRepository(ExportTaskRepository)
    exportTaskRepository: ExportTaskRepository,
    fileService: FileService,
    createExportTaskService: CreateExportTaskService,
    updateExportTaskService: UpdateExportTaskService,
  ) {
    super(
      {
        xlsx: (userTimezone: number, number?: number) =>
          `Сводный аудит по успеваемости зарегистрированных пользователей_${getClientDateAndTime(new Date(), userTimezone)}${
            number ? `_${number}` : ''
          }.xlsx`,
        xls: (userTimezone: number, number?: number) =>
          `Сводный аудит по успеваемости зарегистрированных пользователей_${getClientDateAndTime(new Date(), userTimezone)}${
            number ? `_${number}` : ''
          }.xls`,
        ods: (userTimezone: number, number?: number) =>
          `Сводный аудит по успеваемости зарегистрированных пользователей_${getClientDateAndTime(new Date(), userTimezone)}${
            number ? `_${number}` : ''
          }.ods`,
        native: 'Сводный отчёт по успеваемости зарегистрированных пользователей',
      },
      fileService,
      createExportTaskService,
      updateExportTaskService,
      exportTaskRepository
    );
    this.createExcel = this.createExcel.bind(this);
    this.getData = this.getData.bind(this)
  }

  async exportXlsx(dto: ExportRegisteredReportDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-registered-report-performance',
        userId,
        'xlsx',
        ExportPageEnum.CONTROL_AUDIT_REGISTERED
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'xlsx', response);
  }

  async exportXls(dto: ExportRegisteredReportDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-registered-report-performance',
        userId,
        'xls',
        ExportPageEnum.CONTROL_AUDIT_REGISTERED
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'xls', response);
  }

  async exportOds(dto: ExportRegisteredReportDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-registered-report-performance',
        userId,
        'ods',
        ExportPageEnum.CONTROL_AUDIT_REGISTERED
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'ods', response);
  }

  private async createExcel(dto: ExportRegisteredReportDto, data: RegisteredPerformanceReportItem[]) {
    let groupIdsArray: string[] = [];
    if (typeof dto.groupIds === 'object') {
      groupIdsArray = dto.groupIds;
    } else if (dto.groupIds) {
      groupIdsArray = [dto.groupIds];
    }
    const groups = await this.groupRepository.findByIds(groupIdsArray)

    return new ExcelHelper()
      .title('Сводный аудит по успеваемости зарегистрированных пользователей', 'A1:O1')
      .columns([
        { key: 'id' },
        { key: 'regionTitle', width: 20 },
        { key: 'departmentTitle', width: 20 },
        { key: 'subdivisionTitle', width: 20 },
        { key: 'groupTitle', width: 20 },
        { key: 'userCount', width: 18 },
        { key: 'completedEducation', width: 18 },
        { key: 'completedEducationPercentage', width: 18 },
        { key: 'userAddedCountLastMonth', width: 18 },
        { key: 'userAddedCountLastMonthPercentage', width: 18 },
        { key: 'completedEducationLastMonth', width: 18 },
        { key: 'completedEducationLastMonthPercentage', width: 18 },
        { key: 'notCompletedEducation', width: 18 },
        { key: 'notCompletedEducationPercentage', width: 18 },
        { key: 'groupCreatedAt', width: 30 },
      ])
      .header(
        [
          '№ п/п',
          'Регион',
          'Ведомство',
          'Подразделение',
          `Наименование группы`,
          `Общее кол-во пользователей`,
          'Кол-во пользователей завершивших обучение',
          '% от общего количества (столбец 7/6)',
          'Кол-во пользователей добавленных за последний месяц',
          '% от общего количества (столбец 9/6)',
          'Кол-во пользователей завершивших обучение за последний месяц',
          '% от общего количества (столбец 11/6)',
          'Кол-во пользователей не завершивших обучение',
          '% от общего количества (столбец 13/6)',
          'Дата создания группы',
        ],
        7,
      )
      .columnAlignment({
        A: { horizontal: 'right' },
        B: { horizontal: 'center' },
        C: { horizontal: 'center' },
        D: { horizontal: 'center' },
        E: { horizontal: 'center' },
        F: { horizontal: 'center' },
        G: { horizontal: 'center' },
        H: { horizontal: 'center' },
        I: { horizontal: 'center' },
        J: { horizontal: 'center' },
        K: { horizontal: 'center' },
        L: { horizontal: 'center' },
        M: { horizontal: 'center' },
        N: { horizontal: 'center' },
        O: { horizontal: 'center' },
      })
      .intermediate({
        row: 3,
        mergeCells: 'A3:O3',
        value: `Период регистрации пользователей на портале: ${
          dto.dateStart && dto.dateEnd
            ? getClientDate(new Date(dto.dateStart), dto.userTimezone) + ' - ' + getClientDate(new Date(dto.dateEnd), dto.userTimezone)
            : ''
        }`,
        alignment: { horizontal: 'left' },
      })
      .intermediate({
        row: 4,
        mergeCells: 'A4:O4',
        value: `Период создания группы: ${
          dto.groupDateStart && dto.groupDateEnd
            ? getClientDate(new Date(dto.groupDateStart), dto.userTimezone) + ' - ' + getClientDate(new Date(dto.groupDateEnd), dto.userTimezone)
            : ''
        }`,
        alignment: { horizontal: 'left' },
      })
      .intermediate({
        row: 5,
        mergeCells: 'A5:O5',
        value: `Группы: ${
          groups?.length ? groups.map(g => g.title).join(', ') : ''
        }`,
        alignment: { horizontal: 'left' },
      })
      .cells([
        { index: 'A8', value: 1, alignment: { horizontal: 'center' } },
        { index: 'B8', value: 2, alignment: { horizontal: 'center' } },
        { index: 'C8', value: 3, alignment: { horizontal: 'center' } },
        { index: 'D8', value: 4, alignment: { horizontal: 'center' } },
        { index: 'E8', value: 5, alignment: { horizontal: 'center' } },
        { index: 'F8', value: 6, alignment: { horizontal: 'center' } },
        { index: 'G8', value: 7, alignment: { horizontal: 'center' } },
        { index: 'H8', value: 8, alignment: { horizontal: 'center' } },
        { index: 'I8', value: 9, alignment: { horizontal: 'center' } },
        { index: 'J8', value: 10, alignment: { horizontal: 'center' } },
        { index: 'K8', value: 11, alignment: { horizontal: 'center' } },
        { index: 'L8', value: 12, alignment: { horizontal: 'center' } },
        { index: 'M8', value: 13, alignment: { horizontal: 'center' } },
        { index: 'N8', value: 14, alignment: { horizontal: 'center' } },
        { index: 'O8', value: 15, alignment: { horizontal: 'center' } },
      ])
      .fill(
        data.map((p, idx) => ({
          ...p,
          id: idx + 1,
        })),
        9,
      );
  }

  private async getData(dto: ExportRegisteredReportDto) {
    if (dto.ids) {
      const idsArray = Array.isArray(dto.ids) ? dto.ids : [dto.ids];
      return await this.getRegisteredReportPerformanceByIds(dto, idsArray);
    }
    return (await this.getRegisteredReportPerformance(dto))[0];
  }

  async getRegisteredReportPerformance(dto: GetRegisteredReportDto) {
    return await this.controlRepository.getRegisteredReportPerformance(dto);
  }

  private async getRegisteredReportPerformanceByIds(dto: ExportRegisteredReportDto, ids: string[]) {
    const [data, total] = await this.controlRepository.getRegisteredReportPerformance(dto, ids);
    return data;
  }
}
