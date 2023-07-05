import format from 'date-fns/format';

// https://date-fns.org/v2.16.1/docs/format
const DATE_FORMAT = 'd MMM yy h:mm a';

export function formatDate(date: Date): string {
  return format(date, DATE_FORMAT);
}
