import { FindOperator, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';

export const createDateFindOperator = (
  start?: number | Date | string,
  finish?: number | Date | string,
): FindOperator<Date> | undefined => {
  if (start && !finish) return MoreThanOrEqual(new Date(start));
  if (!start && finish) return LessThanOrEqual(new Date(finish));
  if (start && finish) return Between(new Date(start), new Date(finish));
  return undefined;
};
