import { PerformanceStatusEnum } from '@modules/performance/domain/performance.entity';

export class GetGroupPeriodPerformanceDto {
  groupId: string;
  dateStart: string;
  dateEnd: string;
  statuses: PerformanceStatusEnum[] | PerformanceStatusEnum;
}
