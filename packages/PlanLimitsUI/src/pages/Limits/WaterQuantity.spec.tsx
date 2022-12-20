import { expect } from 'vitest';
import waterQuantity from './WaterQuantity';

describe('.waterQuantity', () => {
  test('should format number with units', () => {
    expect(waterQuantity(100, 'L/S')).toEqual('100 L/S');
  });

  test('should format number with number, units and commas for large numbers', () => {
    expect(waterQuantity(100000, 'L/S')).toEqual('100,000 L/S');
  });
});
