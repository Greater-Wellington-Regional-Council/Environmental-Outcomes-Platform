import { useUsageQuery } from '../api';
import { format, addDays, addWeeks, parse } from 'date-fns';

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
  };
}

function transformUsageData(
  usageData: Usage[],
  swAreaId: string,
  gwAreaIds: string[]
) {
  const swUsagePerDay = usageData.filter((ud) => ud.area_id === swAreaId);
  const swHeatmapData = [
    {
      id: 'Usage',
      data: swUsagePerDay.map((d) => {
        return {
          x: format(parse(d.date, 'yyyy-MM-dd', new Date()), 'EEE d'),
          // y: (d.daily_usage / d.metered_daily_allocation) * 100,
          y: (d.daily_usage / 100) * 100,
        };
      }),
    },
  ];
  console.log('swHeatmapData', swHeatmapData);

  return {
    swHeatmapData,
  };
}
