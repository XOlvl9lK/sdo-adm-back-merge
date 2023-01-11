import { RequestQuery } from '@core/libs/types';

export class GetUserProgramPerformanceDto extends RequestQuery {
  programId: string;
  dateStart: string;
  dateEnd: string;
}

export class ExportUserProgramPerformanceDto extends GetUserProgramPerformanceDto {
  ids?: string[];
  userTimezone: number
}
