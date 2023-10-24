import type { UseQueryResult } from '@tanstack/react-query';
import { useWaterUseQuery } from '../api';
import { format, addDays, addWeeks, parse } from 'date-fns';
import { groupBy, sumBy } from 'lodash';

export interface HeatmapDataItem {
  usage: number;
  allocation: number;
  x: string;
  y: number;
}

export interface HeatmapData {
  id: string;
  data: HeatmapDataItem[];
}

export interface SWAndGWHeatmapData {
  sw: HeatmapData[];
  gw: HeatmapData[];
}

export interface WaterUseData {
  from: Date;
  to: Date;
  formattedFrom: string;
  formattedTo: string;
  heatmapData?: SWAndGWHeatmapData;
}

type useWaterUseData = UseQueryResult & {
  data: WaterUseData;
};

export default function useWaterUseData(
  councilId: number,
  swAreaId: string,
  gwAreaIds: string[],
  weekOffset: number
) {
  const yesterday = addDays(new Date(), -1);
  const to = addWeeks(yesterday, weekOffset);
  const from = addDays(to, -6);
  const formattedFrom = format(from, 'yyyy-MM-dd');
  const formattedTo = format(to, 'yyyy-MM-dd');
  const waterUseQueryResult = useWaterUseQuery(
    councilId,
    formattedFrom,
    formattedTo
  );

  const data = {
    from,
    to,
    formattedFrom,
    formattedTo,
    usage:
      waterUseQueryResult.data &&
      transformWaterUseData(waterUseQueryResult.data, swAreaId, gwAreaIds)
  };

  return {
    ...waterUseQueryResult,
    data
  } as useWaterUseData;
}

function transformWaterUseData(
  usage: Usage[],
  swAreaId: string,
  gwAreaIds: string[]
) {
  const swUsagePerDay = usage.filter((u) => u.areaId === swAreaId);
  const gwUsagePerDay = usage.filter((u) => gwAreaIds.includes(u.areaId));

  return {
    sw: transformUsageToHeatMap(swUsagePerDay),
    gw: transformUsageToHeatMap(gwUsagePerDay)
  };
}

function transformUsageToHeatMap(usage: Usage[]) {
  if (usage.length === 0) return [];

  const usageGroupedByDay = groupBy<Usage>(usage, 'date');
  const sortedDates = Object.keys(usageGroupedByDay).sort();

  return [
    {
      id: 'Usage',
      data: sortedDates.map((date) => {
        const usage = sumBy(usageGroupedByDay[date], 'dailyUsage');
        const allocation = sumBy(
          usageGroupedByDay[date],
          'meteredDailyAllocation'
        );

        return {
          usage,
          allocation,
          date,
          x: format(parse(date, 'yyyy-MM-dd', new Date()), 'EEE d'),
          y: usage <= 0 ? 0 : usage / allocation
        };
      })
    }
  ];
}
