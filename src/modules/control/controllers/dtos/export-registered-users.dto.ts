import { RequestQuery } from '@core/libs/types';

export class ExportRegisteredUsersDto extends RequestQuery {
  dateStart: string;
  dateEnd: string;
  ids?: string[];
  userTimezone: number
}
