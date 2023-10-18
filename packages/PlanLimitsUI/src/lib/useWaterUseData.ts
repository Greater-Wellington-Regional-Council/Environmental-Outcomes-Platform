import { useUsageQuery } from '../api';
import { format, addDays, addWeeks, parse } from 'date-fns';
import { groupBy, sumBy } from 'lodash';
import type { UseQueryResult } from '@tanstack/react-query';

export interface GWandSWUsage {
  sw: UsageHeatmapData[];
  gw: UsageHeatmapData[];
}

export interface WaterUseData {
  from: Date;
  to: Date;
  formattedFrom: string;
  formattedTo: string;
  usage?: GWandSWUsage;
}

export interface UsageHeatmapData {
  id: string;
  data: {
    x: string;
    y: number;
  }[];
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
  const usageData = useUsageQuery(councilId, formattedFrom, formattedTo);

  const data = {
    from,
    to,
    formattedFrom,
    formattedTo,
    usage:
      usageData.data && transformUsageData(usageData.data, swAreaId, gwAreaIds),
  };

  return {
    ...usageData,
    data,
  } as useWaterUseData;
}

function transformUsageData(
  usageData: Usage[],
  swAreaId: string,
  gwAreaIds: string[]
) {
  const swUsagePerDay = usageData.filter((ud) => ud.area_id === swAreaId);
  const gwUsagePerDay = usageData.filter((ud) =>
    gwAreaIds.includes(ud.area_id)
  );

  return {
    sw: transformUsageForHeatMap(swUsagePerDay),
    gw: transformUsageForHeatMap(gwUsagePerDay),
  };
}

function transformUsageForHeatMap(usage: Usage[]) {
  if (usage.length === 0) return [];

  const usageGroupedByDay = groupBy<Usage>(usage, 'date');

  return [
    {
      id: 'Usage',
      data: Object.keys(usageGroupedByDay).map((date) => {
        const usage = sumBy(usageGroupedByDay[date], 'daily_usage');
        const allocation = sumBy(
          usageGroupedByDay[date],
          'metered_daily_allocation'
        );

        return {
          usage,
          allocation,
          x: format(parse(date, 'yyyy-MM-dd', new Date()), 'EEE d'),
          // y: (d.daily_usage / d.metered_daily_allocation) * 100,
          y: usage <= 0 ? 0 : usage / allocation,
        };
      }),
    },
  ];
}
