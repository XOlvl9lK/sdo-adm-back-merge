import { RequestQuery } from '@core/libs/types';

export class GetUserPerformanceDto extends RequestQuery {
  userId: string;
}

export class ExportUserPerformanceDto extends GetUserPerformanceDto {
  ids?: string;
  userTimezone: number
}
