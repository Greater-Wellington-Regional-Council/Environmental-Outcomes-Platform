import {
  createLocationString,
  createPinnedLocationString,
  parseLocationString,
  parsePinnedLocation,
} from './locationString';
import { expect, test } from 'vitest';

describe('parseLocationString', () => {
  test('should return null when null passed', () => {
    const result = parseLocationString();

    expect(result).toEqual(null);
  });

  test('should return null when string is invalid', () => {
    const result = parseLocationString('foo');

    expect(result).toEqual(null);
  });

  test('should return null when string is invalid', () => {
    const result = parseLocationString('AAA@-40.959,175.455,8z');

    expect(result).toEqual(null);
  });

  test('should return object when string is valid', () => {
    const result = parseLocationString('@-40.959,175.455,8z');

    expect(result).toEqual({
      latitude: -40.959,
      longitude: 175.455,
      zoom: 8,
    });
  });

  test('should return object when string has no decimal places', () => {
    const result = parseLocationString('@-40,175,8z');

    expect(result).toEqual({
      latitude: -40,
      longitude: 175,
      zoom: 8,
    });
  });
});

describe('createLocationString', () => {
  test('should build a string', () => {
    const result = createLocationString({
      latitude: -41.32049184189989,
      longitude: 175.1659546540098,
      zoom: 7.9999,
    });

    expect(result).toEqual('@-41.32,175.166,8z');
  });

  test('should build a string with no decimal places', () => {
    const result = createLocationString({
      latitude: -41,
      longitude: 175,
      zoom: 8,
    });

    expect(result).toEqual('@-41,175,8z');
  });
});

describe('parsePinnedLocation', () => {
  test('should return null when null passed', () => {
    const result = parsePinnedLocation(null);

    expect(result).toEqual(null);
  });

  test('should return null when string is invalid', () => {
    const result = parsePinnedLocation('foo');

    expect(result).toEqual(null);
  });

  test('should return null when string is almost', () => {
    const result = parsePinnedLocation('AA-40.959,175.455ZZ');

    expect(result).toEqual(null);
  });

  test('should return object when string is valid', () => {
    const result = parsePinnedLocation('-40.959,175.455');

    expect(result).toEqual({
      latitude: -40.959,
      longitude: 175.455,
    });
  });

  test('should return object when string has no decimal places', () => {
    const result = parsePinnedLocation('-40,175');

    expect(result).toEqual({
      latitude: -40,
      longitude: 175,
    });
  });
});

describe('createPinnedLocationString', () => {
  test('should build a string', () => {
    const result = createPinnedLocationString({
      latitude: -41.32049184189989,
      longitude: 175.1659546540098,
    });

    expect(result).toEqual('-41.32,175.166');
  });
});
