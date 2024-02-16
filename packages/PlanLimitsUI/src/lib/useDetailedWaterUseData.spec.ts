import useDetailedWaterUseData from './useDetailedWaterUseData';
import { useWaterUseQuery } from '../api';
import { renderHook } from '@testing-library/react';

vi.mock('../api', () => ({
  useWaterUseQuery: vi.fn().mockReturnValue({ data: null }),
}));

describe('useDetailedWaterUseData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should get data for last year', () => {
    const endOfNormalYear = new Date(2023, 0, 1);

    vi.setSystemTime(endOfNormalYear);

    renderHook(() => useDetailedWaterUseData(9, []));

    expect(useWaterUseQuery).toHaveBeenCalledWith(
      9,
      '2022-01-01',
      '2022-12-31',
    );
  });

  it('should handle a leap year', () => {
    const endOfLeapYear = new Date(2024, 2, 1);

    vi.setSystemTime(endOfLeapYear);

    renderHook(() => useDetailedWaterUseData(9, []));

    expect(useWaterUseQuery).toHaveBeenCalledWith(
      9,
      '2023-03-01',
      '2024-02-29',
    );
  });
});
