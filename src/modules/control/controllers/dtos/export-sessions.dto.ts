import { RequestQuery } from '@core/libs/types';

export class ExportSessionsDto extends RequestQuery {
  ids?: string[];
  userTimezone: number
}