export function isValidDate(dateString: string): boolean {
  // Regular expression to match date patterns (e.g., YYYY-MM-DD, MM/DD/YYYY)
  const datePattern = /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/;
  return datePattern.test(dateString);
}

export function convertDate(d: unknown | Date, orNull: boolean = false): Date | null {
  if (d instanceof Date) {
    return d;
  } else if (typeof d === 'string') {
    if (isValidDate(d)) {
      const date = new Date(d);
      // Check if the date is valid
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }
  return orNull ? null : null;
}

export default convertDate;
