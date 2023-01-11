import { endOfDay, startOfDay } from 'date-fns';

export type ValidityDateType = 'start' | 'end';

export const getValidityDate = (type: ValidityDateType, date?: string) => {
  if (!date) return null;
  if (type === 'start') return startOfDay(new Date(date));
  else return endOfDay(new Date(date));
};
