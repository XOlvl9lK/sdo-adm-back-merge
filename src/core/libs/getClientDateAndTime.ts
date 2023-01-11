import { add, format } from 'date-fns';

export const getClientDateAndTime = (date: Date, userTimezone: number) => {
  if (!date) return ''
  const difference = new Date().getTimezoneOffset() - userTimezone
  const hours = difference < 0 ? Math.ceil(difference / 60) : Math.floor(difference / 60)
  const minutes = difference % 60
  return format(add(date, { hours, minutes }), 'dd.MM.yyyy HH:mm:ss')
}

export const getClientDate = (date: Date, userTimezone: number) => {
  if (!date) return ''
  const difference = new Date().getTimezoneOffset() - userTimezone
  const hours = difference < 0 ? Math.ceil(difference / 60) : Math.floor(difference / 60)
  const minutes = difference % 60
  return format(add(date, { hours, minutes }), 'dd.MM.yyyy')
}