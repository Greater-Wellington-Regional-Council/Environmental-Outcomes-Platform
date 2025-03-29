import monthToToday, { lastPastDay } from '@lib/monthToToday';

export function isValidDate(dateString: string): boolean {
  // Regular expression to match date patterns (e.g., YYYY-MM-DD, MM/DD/YYYY)
  const datePattern = /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/;
  return datePattern.test(dateString);
}

export function convertDate(d: unknown | Date, orNull: boolean = false): unknown | Date | null {
  if (d instanceof Date) {
    return d;
  } else if (typeof d === 'string') {
    if (isValidDate(d)) {
      const date = new Date(d);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }
  return orNull ? null : d;
}

export function dateString(d: unknown, orNull: boolean = false, format : 'dmy' | 'my' | 'mmm yyyy' | 'lmy' = 'lmy'): string | null {
  const date  = (d instanceof Date) ? d : convertDate(d, orNull) as Date;

  if (!date) return null

  switch (format) {
    case 'lmy':
      return monthToToday(lastPastDay(date.getFullYear(), date.getMonth(), true));
    case 'my':
      return `${date.getMonth() + 1}/${date.getFullYear()}`;
    case 'mmm yyyy':
      return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    default:
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
}
