import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { RequestQuery } from '@core/libs/types';

export class GetReportUserCourseDto extends RequestQuery {
  groupIds: string[] | string;
  dateStart: string;
  dateEnd: string;
  userId: string[] | string;
  departmentId?: string;
  subdivisionId?: string;
  courseId?: string[] | string;
  programId?: string[] | string;
  type: EducationElementTypeEnum.COURSE | EducationElementTypeEnum.PROGRAM;
}

export class ExportReportUserCourseDto extends GetReportUserCourseDto {
  ids?: string[];
  userTimezone: number
}
