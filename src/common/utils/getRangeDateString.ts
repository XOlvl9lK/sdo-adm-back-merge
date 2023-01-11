import { format } from 'date-fns';

export const getRangeDateString = (from?: string | number | Date, to?: string | number | Date) => {
  return (from ? format(new Date(from), 'dd.MM.yyyy') : '') + ' - ' + (to ? format(new Date(to), 'dd.MM.yyyy') : '');
};
