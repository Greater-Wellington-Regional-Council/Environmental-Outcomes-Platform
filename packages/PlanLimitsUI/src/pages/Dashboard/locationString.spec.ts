import { createLocationString, parseLocationString } from './locationString';
import { expect, test } from 'vitest';

test('parseLocationString - should return null when string is invalid', () => {
  const result = parseLocationString('foo');

  expect(result).toEqual(null);
});

test('parseLocationString - should return object when string is valid', () => {
  const result = parseLocationString('@-40.959,175.455,8z');

  expect(result).toEqual({
    latitude: -40.959,
    longitude: 175.455,
    zoom: 8,
  });
});

test('createLocationString - should build a string', () => {
  const result = createLocationString({
    latitude: -41.32049184189989,
    longitude: 175.1659546540098,
    zoom: 7.9999,
  });

  expect(result).toEqual('@-41.32,175.166,8z');
});
