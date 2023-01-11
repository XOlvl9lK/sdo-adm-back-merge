import { RequestQuery } from '@core/libs/types';

export class ExportOpenSessionDto extends RequestQuery {
  ids?: string[]
  userTimezone: number
}