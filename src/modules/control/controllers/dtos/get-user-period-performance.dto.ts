import { PerformanceStatusEnum } from '@modules/performance/domain/performance.entity';
import { RequestQuery } from '@core/libs/types';

export class GetUserPeriodPerformanceDto extends RequestQuery {
  userId: string;
  dateStart: string;
  dateEnd: string;
}

export class ExportUserPeriodPerformanceDto extends GetUserPeriodPerformanceDto {
  ids?: string[];
  userTimezone: number
}
