// Test lastPastDay
import { lastPastDay } from './monthToToday';

describe('lastPastDay', () => {
  it('should return the last day of the month for a given year and month', () => {
    const january = new Date(2023, 0, 31);
    const februaryNonLeap = new Date(2023, 1, 28);
    const februaryLeap = new Date(2024, 1, 29);
    const march = new Date(2023, 2, 31);
    const april = new Date(2023, 3, 30);
    const may = new Date(2023, 4, 31);
    const june = new Date(2023, 5, 30);
    const july = new Date(2023, 6, 31);
    const august = new Date(2023, 7, 31);
    const september = new Date(2023, 8, 30);
    const october = new Date(2023, 9, 31);
    const november = new Date(2023, 10, 30);
    const december = new Date(2023, 11, 31);

    expect(lastPastDay(2023, 0)).toEqual(january); // January
    expect(lastPastDay(2023, 1)).toEqual(februaryNonLeap); // February (non-leap year)
    expect(lastPastDay(2024, 1)).toEqual(februaryLeap); // February (leap year)
    expect(lastPastDay(2023, 2)).toEqual(march); // March
    expect(lastPastDay(2023, 3)).toEqual(april); // April
    expect(lastPastDay(2023, 4)).toEqual(may); // May
    expect(lastPastDay(2023, 5)).toEqual(june); // June
    expect(lastPastDay(2023, 6)).toEqual(july); // July
    expect(lastPastDay(2023, 7)).toEqual(august); // August
    expect(lastPastDay(2023, 8)).toEqual(september); // September
    expect(lastPastDay(2023, 9)).toEqual(october); // October
    expect(lastPastDay(2023, 10)).toEqual(november); // November
    expect(lastPastDay(2023, 11)).toEqual(december); // December
  });

  it('should return the last day of the month for a given year and month with includingToday set to true', () => {
    const today = new Date();
    expect(
      lastPastDay(today.getFullYear(), today.getMonth(), true),
    ).toStrictEqual(today);
  });

  it('should return the last day of the month for a given year and month with includingToday set to false', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    expect(
      lastPastDay(today.getFullYear(), today.getMonth(), false),
    ).toStrictEqual(yesterday);
  });
});
