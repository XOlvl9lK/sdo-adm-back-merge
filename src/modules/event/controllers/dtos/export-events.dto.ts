import { RequestQuery } from '@core/libs/types';

export class ExportEventsDto extends RequestQuery {
  ids?: string[]
  userTimezone: number
}