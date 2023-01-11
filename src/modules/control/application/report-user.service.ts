import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupRepository } from '@modules/group/infrastructure/database/group.repository';
import {
  ExportReportUserCourseDto,
  GetReportUserCourseDto,
} from '@modules/control/controllers/dtos/get-report-user-course.dto';
import { PerformanceRepository } from '@modules/performance/infrastructure/database/performance.repository';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { Response } from 'express';
import { ExcelHelper } from '@modules/control/infrastructure/excel.helper';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { ExcelServiceBase } from '@core/libs/excel-service.base';
import { PerformanceEntity } from '@modules/performance/domain/performance.entity';
import {
  DepartmentRepository,
  SubdivisionRepository,
} from '@modules/authority/infrastructure/database/authority.repository';
import { CourseRepository } from '@modules/course/infrastructure/database/course.repository';
import {
  EducationProgramRepository
} from '@modules/education-program/infrastructure/database/education-program.repository';
import { getClientDate, getClientDateAndTime } from '@core/libs/getClientDateAndTime';
import { FileService } from '@modules/file/infrastructure/file.service';
import { CreateExportTaskService } from '@modules/export-task/application/create-export-task.service';
import { UpdateExportTaskService } from '@modules/export-task/application/update-export-task.service';
import { ExportPageEnum } from '@modules/export-task/domain/export-task.entity';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';

@Injectable()
export class ReportUserService extends ExcelServiceBase {
  constructor(
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
    @InjectRepository(PerformanceRepository)
    private performanceRepository: PerformanceRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(DepartmentRepository)
    private departmentRepository: DepartmentRepository,
    @InjectRepository(SubdivisionRepository)
    private subdivisionRepository: SubdivisionRepository,
    @InjectRepository(CourseRepository)
    private courseRepository: CourseRepository,
    @InjectRepository(EducationProgramRepository)
    private educationProgramRepository: EducationProgramRepository,
    @InjectRepository(ExportTaskRepository)
    exportTaskRepository: ExportTaskRepository,
    fileService: FileService,
    createExportTaskService: CreateExportTaskService,
    updateExportTaskService: UpdateExportTaskService,
  ) {
    super(
      {
        xlsx: (userTimezone: number, number?: number) =>
          `Аудит успеваемости пользователей по заданным элементам обучения_${getClientDateAndTime(new Date(), userTimezone)}${
            number ? `_${number}` : ''
          }.xlsx`,
        xls: (userTimezone: number, number?: number) =>
          `Аудит успеваемости пользователей по заданным элементам обучения_${getClientDateAndTime(new Date(), userTimezone)}${
            number ? `_${number}` : ''
          }.xls`,
        ods: (userTimezone: number, number?: number) =>
          `Аудит успеваемости пользователей по заданным элементам обучения_${getClientDateAndTime(new Date(), userTimezone)}${
            number ? `_${number}` : ''
          }.ods`,
        native: 'Аудит успеваемости пользователей по заданным элементам обучения',
      },
      fileService,
      createExportTaskService,
      updateExportTaskService,
      exportTaskRepository
    );
    this.createExcel = this.createExcel.bind(this);
    this.getData = this.getData.bind(this)
  }

  async getReportCourse({
    courseId,
    dateStart,
    dateEnd,
    groupIds,
    userId,
    subdivisionId,
    departmentId,
    type,
    programId,
    ...requestQuery
  }: GetReportUserCourseDto) {
    const courseIdArr = Array.isArray(courseId) ? courseId : [courseId].filter(Boolean);
    const programIdArr = Array.isArray(programId) ? programId : [programId].filter(Boolean);
    const userIdArr = Array.isArray(userId) ? userId : [userId].filter(Boolean);
    let groupIdsArray = Array.isArray(groupIds) ? groupIds : [groupIds].filter(Boolean)
    return await this.performanceRepository.findForReportUser(
      dateStart,
      dateEnd,
      type,
      requestQuery,
      userIdArr,
      courseIdArr,
      programIdArr,
      subdivisionId,
      departmentId,
      groupIdsArray
    )
  }

  async exportXlsx(dto: ExportReportUserCourseDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-report-user',
        userId,
        'xlsx',
        dto.type === EducationElementTypeEnum.PROGRAM ? ExportPageEnum.CONTROL_AUDIT_PROGRAM: ExportPageEnum.CONTROL_AUDIT_COURSE
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'xlsx', response);
  }

  async exportXls(dto: ExportReportUserCourseDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-report-user',
        userId,
        'xls',
        dto.type === EducationElementTypeEnum.PROGRAM ? ExportPageEnum.CONTROL_AUDIT_PROGRAM: ExportPageEnum.CONTROL_AUDIT_COURSE
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'xls', response);
  }

  async exportOds(dto: ExportReportUserCourseDto, response: Response, userId: string) {
    if (dto.pageSize && dto.pageSize > 100) {
      const exportTask = await this.exportLargeData(
        this.createExcel,
        dto,
        'export-report-user',
        userId,
        'ods',
        dto.type === EducationElementTypeEnum.PROGRAM ? ExportPageEnum.CONTROL_AUDIT_PROGRAM: ExportPageEnum.CONTROL_AUDIT_COURSE
      )

      return response.json(exportTask)
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel, dto, data, 'ods', response);
  }

  private async createExcel(dto: ExportReportUserCourseDto, data: PerformanceEntity[]) {
    let groupIdsArray: string[];
    if (typeof dto.groupIds === 'object') {
      groupIdsArray = dto.groupIds;
    } else {
      groupIdsArray = [dto.groupIds];
    }
    const userIdArr = Array.isArray(dto.userId) ? dto.userId : [dto.userId].filter(Boolean);
    const courseIdArr = Array.isArray(dto.courseId) ? dto.courseId : [dto.courseId].filter(Boolean);
    const programIdArr = Array.isArray(dto.programId) ? dto.programId : [dto.programId].filter(Boolean);
    const [groups, users, department, subdivision, courses, programs] = await Promise.all([
      this.groupRepository.findByIds(groupIdsArray),
      this.userRepository.findByIds(userIdArr),
      this.departmentRepository.findById(dto.departmentId),
      this.subdivisionRepository.findById(dto.subdivisionId),
      this.courseRepository.findByIds(courseIdArr),
      this.educationProgramRepository.findByIds(programIdArr),
    ]);

    return new ExcelHelper()
      .title(
        `Аудит успеваемости пользователей по заданным ${
          dto.type === EducationElementTypeEnum.COURSE ? 'курсам' : 'программам'
        }`,
        'A1:I1',
      )
      .columns([
        { key: 'id' },
        { key: 'login', width: 30 },
        { key: 'department', width: 30 },
        { key: 'subdivision', width: 30 },
        { key: 'course', width: 40 },
        { key: 'group', width: 30 },
        { key: 'result', width: 20 },
        { key: 'status', width: 20 },
        { key: 'createdAt', width: 30 },
      ])
      .header(
        [
          '№ п/п',
          'Логин ДО и ТП',
          'Ведомство',
          'Подразделение',
          `${dto.type === EducationElementTypeEnum.COURSE ? 'Курс' : 'Программа'}`,
          'Наименование группы',
          'Результат, %',
          'Статус',
          'Дата регистрации на портале',
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
      })
      .cells([
        {
          index: 'C3',
          value: `Группы: ${groups.map(g => g.title).join('; ')}`,
        },
        {
          index: 'C4',
          value: `Период регистрации на портале: ${getClientDate(new Date(dto.dateStart), dto.userTimezone)} - ${
            getClientDate(new Date(dto.dateEnd), dto.userTimezone)
          }`,
        },
        { index: 'C5', value: `Логины ДОиТП: ${users?.map(u => u.login)?.join(', ') || ''}` },
        { index: 'F3', value: `Ведомство: ${department?.title || ''}` },
        { index: 'F4', value: `Подразделение: ${subdivision?.title || ''}` },
        {
          index: 'F5',
          value: `${dto.type === 'COURSE' ? 'Курсы' : 'Программы'}: ${
            courses?.map(c => c.title)?.join(', ') || programs?.map(p => p.title).join(', ') || ''
          }`,
        },
      ])
      .fill(
        data.map((p, idx) => ({
          id: idx + 1,
          login: p.user.login,
          department: p.user.department?.title || '-',
          subdivision: p.user.subdivision?.title || '-',
          course: p.educationElement?.title || '-',
          group: p.assignment?.group?.title || '-',
          result: p.result,
          status: p.status,
          createdAt: getClientDateAndTime(new Date(p.user.createdAt), dto.userTimezone),
        })),
        8,
      );
  }

  private async getData(dto: ExportReportUserCourseDto) {
    if (dto.ids) {
      const idsArray = Array.isArray(dto.ids) ? dto.ids : [dto.ids];
      return await this.performanceRepository.findByIdsSorted(idsArray, dto);
    }
    return (await this.getReportCourse(dto))[0];
  }
}
