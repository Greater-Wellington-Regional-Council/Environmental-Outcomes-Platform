import { describe, it, expect } from 'vitest';
import { isValidDate, convertDate } from './convertDate';

describe('isValidDate', () => {
  it('should return true for valid date in YYYY-MM-DD format', () => {
    expect(isValidDate('2023-10-15')).toBe(true);
  });

  it('should return true for valid date in MM/DD/YYYY format', () => {
    expect(isValidDate('10/15/2023')).toBe(true);
  });

  it('should return false for invalid date string', () => {
    expect(isValidDate('invalid-date')).toBe(false);
  });

  it('should return false for date string with incorrect format', () => {
    expect(isValidDate('15-10-2023')).toBe(false);
  });
});

describe('convertDate', () => {
  it('should return the same Date object if input is a Date', () => {
    const date = new Date();
    expect(convertDate(date)).toBe(date);
  });

  it('should convert valid date string to Date object', () => {
    const dateString = '2023-10-15';
    const date = convertDate(dateString);
    expect(date).toBeInstanceOf(Date);
    expect(date?.toISOString().startsWith('2023-10-15')).toBe(true);
  });

  it('should return null for invalid date string', () => {
    expect(convertDate('invalid-date')).toBe('invalid-date');
  });

  it('should return null for non-string, non-Date input', () => {
    expect(convertDate(12345)).toBe(12345);
  });

  it('should return null if orNull is true and input is invalid', () => {
    expect(convertDate('invalid-date', true)).toBe(null);
  });

  it('should return null if orNull is true and input is non-string, non-Date', () => {
    expect(convertDate(12345, true)).toBe(null);
  });
});
