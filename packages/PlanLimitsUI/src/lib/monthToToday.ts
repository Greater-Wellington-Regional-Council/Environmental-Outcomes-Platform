export function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

export function lastPastDay(year: number, month: number, includingToday: boolean = true): Date {
  const today = new Date();

  if (today.getFullYear() === year && today.getMonth() === month) {
    if (includingToday) return today;

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday;
  }

  return new Date(year, month + 1, 0);
}

export function monthToToday(today: Date = new Date()) {
  const day = today.getDate();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const suffix = day === lastDayOfMonth ? '' : ` til the ${day}${getOrdinalSuffix(day)}`;
  return `${today.toLocaleString('default', { month: 'long', year: 'numeric' })}${suffix}`;
}

export function monthLabel(date: Date): string {
  return monthToToday(lastPastDay(date.getFullYear(), date.getMonth(), true));
}

export default monthToToday
