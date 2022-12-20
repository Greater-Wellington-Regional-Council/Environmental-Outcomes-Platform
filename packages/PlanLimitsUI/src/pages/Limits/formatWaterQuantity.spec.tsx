import { expect } from 'vitest';
import formatWaterQuantity from './formatWaterQuantity';

describe('.waterQuantity', () => {
  test('should format number with units', () => {
    expect(formatWaterQuantity(100, 'L/S')).toEqual('100 L/S');
  });

  test('should format number with number, units and commas for large numbers', () => {
    expect(formatWaterQuantity(100000, 'L/S')).toEqual('100,000 L/S');
  });
});
