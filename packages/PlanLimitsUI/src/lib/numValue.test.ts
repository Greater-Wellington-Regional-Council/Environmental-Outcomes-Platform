// Generate tests for numValue.ts
// Generated tests will be written to numValue.test.ts

import { numValue, isNumber, isNumberString } from './numValue';

describe('numValue', () => {
  it('should return 0 for non-numeric values', () => {
    expect(numValue('')).toBe(0);
    expect(numValue('abc')).toBe(0);
    expect(numValue('1.2.3')).toBe(0);
    expect(numValue('73839000.00')).toBe(73839000.00);
  });
});

describe('isNumber', () => {
  it('should return true for numbers', () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber(1)).toBe(true);
    expect(isNumber(1.2)).toBe(true);
    expect(isNumber(-1.2)).toBe(true);
  });

  it('should return false for non-numbers', () => {
    expect(isNumber('')).toBe(false);
    expect(isNumber('abc')).toBe(false);
    expect(isNumber('1.2.3')).toBe(false);
  });
});

describe('isNumberString', () => {
  it('should return true for number strings', () => {
    expect(isNumberString('0')).toBe(true);
    expect(isNumberString('1')).toBe(true);
    expect(isNumberString('1.2')).toBe(true);
    expect(isNumberString('-1.2')).toBe(true);
    expect(isNumberString('-1000.2')).toBe(true);
    expect(isNumberString('-1.2')).toBe(true);
  });

  it('should return false for non-number strings', () => {
    expect(isNumberString('')).toBe(false);
    expect(isNumberString('abc')).toBe(false);
    expect(isNumberString('1.2.3')).toBe(false);
    expect(isNumberString('--1.2')).toBe(false);
    expect(isNumberString('-+1.2')).toBe(false);
    expect(isNumberString('++1.2')).toBe(false);
  });
});
