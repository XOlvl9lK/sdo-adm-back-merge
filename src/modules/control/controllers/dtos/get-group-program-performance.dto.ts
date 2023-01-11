import { RequestQuery } from '@core/libs/types';

export class GetGroupProgramPerformanceDto extends RequestQuery {
  programId: string;
  groupId: string;
  dateStart: string;
  dateEnd: string;
}

export class ExportGroupProgramPerformanceDto extends GetGroupProgramPerformanceDto {
  ids?: string[];
  userTimezone: number
}
