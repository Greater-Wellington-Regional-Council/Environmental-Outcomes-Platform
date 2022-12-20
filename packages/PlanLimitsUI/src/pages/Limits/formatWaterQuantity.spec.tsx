import { expect } from 'vitest';
import formatWaterQuantity from './formatWaterQuantity';

describe('.waterQuantity', () => {
  it('should format quantity with units', () => {
    expect(formatWaterQuantity(100, 'L/S')).toEqual('100 L/S');
  });

  it('should format quantity with commas for large numbers', () => {
    expect(formatWaterQuantity(100000, 'L/S')).toEqual('100,000 L/S');
  });
});
