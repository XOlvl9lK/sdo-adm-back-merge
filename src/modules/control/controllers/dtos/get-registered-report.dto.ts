import { RequestQuery } from '@core/libs/types';

export class GetRegisteredReportDto extends RequestQuery {
  dateStart?: string;
  dateEnd?: string;
  groupIds?: string[] | string;
  groupDateStart?: string;
  groupDateEnd?: string;
}

export class ExportRegisteredReportDto extends GetRegisteredReportDto {
  ids?: string[];
  userTimezone: number
}
