import { loader } from './index';
import { expect } from 'vitest';

describe('loader', () => {
  it('should redirect to default when location is invalid', () => {
    const result: Response = loader({
      params: { location: 'FOO' },
      request: new Request('http://foo/limits/FOO'),
    });

    expect(result.headers.get('location')).toEqual(`/limits/@-41,175.35,8z`);
  });

  it('should return location as loader data', () => {
    const result = loader({
      params: { location: '@-41.32,175.166,8z' },
      request: new Request('http://foo/limits/@-41.32,175.166,8z'),
    });

    expect(result).toEqual({
      locationString: {
        latitude: -41.32,
        longitude: 175.166,
        zoom: 8,
      },
    });
  });

  it('should return pinnedLocation as data', () => {
    const result = loader({
      params: { location: '@-41.32,175.166,8z' },
      request: new Request(
        'http://foo/limits/@-41.32,175.166,8z?pinned=-42.36,175.166'
      ),
    });

    expect(result.pinnedLocation).toEqual({
      latitude: -42.36,
      longitude: 175.166,
    });
  });
});
