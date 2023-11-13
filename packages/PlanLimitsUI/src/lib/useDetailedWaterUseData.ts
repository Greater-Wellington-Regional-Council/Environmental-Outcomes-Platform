import { useWaterUseQuery } from '../api';
import { format, addYears, addDays, parse, lastDayOfWeek } from 'date-fns';
import { groupBy, flatten, sortBy } from 'lodash';

interface ParsedUsage extends Usage {
  parsedDate: Date;
  endOfWeek: Date;
  usagePercent: number;
}

export default function useDetailedWaterUseData(
  councilId: number,
  displayGroups: UsageDisplayGroup[],
) {
  const to = addDays(new Date(), -1);
  const from = addYears(to, -1);
  const formattedFrom = format(from, 'yyyy-MM-dd');
  const formattedTo = format(to, 'yyyy-MM-dd');
  const waterUseQueryResult = useWaterUseQuery(
    councilId,
    formattedFrom,
    formattedTo,
  );

  const data = {
    from,
    to,
    formattedFrom,
    formattedTo,
    usage: waterUseQueryResult.data
      ? transformWaterUseData(waterUseQueryResult.data, displayGroups)
      : undefined,
  };

  return {
    ...waterUseQueryResult,
    data,
  };
}
export type DetailedWaterUseQuery = ReturnType<typeof useDetailedWaterUseData>;

function transformWaterUseData(
  usage: Usage[],
  displayGroups: UsageDisplayGroup[],
) {
  const parsedUsage = parseUsage(usage);
  const areaUsage = groupBy<ParsedUsage>(parsedUsage, 'areaId');

  const groupedAreaUsage = displayGroups.map((group) => {
    const weeklyData: HeatmapData[] = [];
    const dailyData = [];
    const missingAreas: string[] = [];
    group.areaIds.forEach((areaId) => {
      if (areaUsage[areaId]) {
        weeklyData.push(
          transformUsageToWeeklyHeatmapData(areaId, areaUsage[areaId]),
        );
        dailyData.push(
          transformUsageToDailyHeatmapData(areaId, areaUsage[areaId]),
        );
      } else {
        missingAreas.push(areaId);
      }
    });

    return {
      ...group,
      weeklyData,
      dailyData,
      missingAreas,
    };
  });

  return {
    allMissingAreas: flatten(groupedAreaUsage.map((a) => a.missingAreas)),
    groups: groupedAreaUsage,
  };
}
export type GroupedWaterUseData = ReturnType<typeof transformWaterUseData>;

function parseUsage(usage: Usage[]) {
  return usage.map((usage) => {
    const parsedDate = parse(usage.date, 'yyyy-MM-dd', new Date());
    return {
      ...usage,
      parsedDate,
      endOfWeek: lastDayOfWeek(parsedDate, { weekStartsOn: 6 }),
      usagePercent:
        usage.dailyUsage <= 0 || usage.meteredDailyAllocation <= 0
          ? 0
          : usage.dailyUsage / usage.meteredDailyAllocation,
    };
  });
}

function transformUsageToWeeklyHeatmapData(
  areaId: string,
  usage: ParsedUsage[],
) {
  const usageForAreaGroupedByWeek = groupBy<ParsedUsage>(usage, (usage) =>
    usage.endOfWeek.toJSON(),
  );
  const sortedWeeks = Object.keys(usageForAreaGroupedByWeek).sort();

  return {
    id: areaId,
    data: sortedWeeks.map((week) => {
      const usageInWeek = usageForAreaGroupedByWeek[week];
      const endOfWeek = usageInWeek[0].endOfWeek;
      const formattedEndOfWeek = format(endOfWeek, 'MMM dd yyyy');

      const usageInWeekAsPercentages = usageInWeek.map(
        (usage) => usage.usagePercent,
      );

      const medianUsage = median(usageInWeekAsPercentages);

      return {
        endOfWeek,
        x: formattedEndOfWeek,
        y: medianUsage,
      };
    }),
  };
}

function transformUsageToDailyHeatmapData(
  areaId: string,
  usage: ParsedUsage[],
) {
  const data = sortBy(
    usage.map((usage) => {
      return {
        day: usage.date,
        value: usage.usagePercent,
        usage: usage.dailyUsage,
        allocation: usage.meteredDailyAllocation,
      };
    }),
    'day',
  );

  return {
    areaId,
    data,
  };
}

function median(values: number[]) {
  const sortedValues = Array.from(values).sort((a, b) => a - b);
  if (sortedValues.length % 2 === 0) {
    const middle = sortedValues.length / 2;
    return (sortedValues[middle - 1] + sortedValues[middle]) / 2;
  } else {
    return sortedValues[Math.floor(sortedValues.length / 2)];
  }
}
