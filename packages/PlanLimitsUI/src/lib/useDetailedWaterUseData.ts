import { groupBy, flatten, uniq, sortBy } from 'lodash';
import {
  format,
  addDays,
  parse,
  parseJSON,
  lastDayOfWeek,
  getDay,
  setDay,
  addYears,
} from 'date-fns';

import { useWaterUseQuery } from '../api';

interface ParsedUsage extends Usage {
  parsedDate: Date;
  parsedDateJSON: string;
  endOfWeek: Date;
  endOfWeekJSON: string;
  usagePercent: number | null;
  dayOfWeek: number;
}

export default function useDetailedWaterUseData(
  councilId: number,
  displayGroups: UsageDisplayGroup[],
) {
  const from = addYears(Date.now(), -1);
  const to = addDays(Date.now(), -1);

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
    const dailyData: DailyHeatmapData[] = [];
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
    const endOfWeek = lastDayOfWeek(parsedDate, { weekStartsOn: 0 });
    return {
      ...usage,
      parsedDate,
      parsedDateJSON: parsedDate.toJSON(),
      endOfWeek,
      endOfWeekJSON: endOfWeek.toJSON(),
      dayOfWeek: getDay(parsedDate),
      usagePercent:
        typeof usage.dailyUsage === 'number' &&
        typeof usage.allocationDailyUsed === 'number' &&
        usage.allocationDailyUsed > 0
          ? usage.dailyUsage / usage.allocationDailyUsed
          : null,
    };
  });
}

function transformUsageToWeeklyHeatmapData(
  areaId: string,
  usage: ParsedUsage[],
) {
  const usageForAreaGroupedByWeek = groupBy(usage, 'endOfWeekJSON');
  const sortedWeeks = Object.keys(usageForAreaGroupedByWeek).sort();

  return {
    id: areaId,
    data: sortedWeeks.map((week) => {
      const usageInWeek = usageForAreaGroupedByWeek[week];
      const endOfWeek = usageInWeek[0].endOfWeek;
      const formattedEndOfWeek = format(endOfWeek, 'MMM dd yyyy');

      const usageInWeekAsPercentages = usageInWeek
        .map((usage) => usage.usagePercent)
        .filter((p): p is number => p !== null);

      const medianUsage =
        usageInWeekAsPercentages.length > 0
          ? median(usageInWeekAsPercentages)
          : null;

      const dailyData = sortBy(usageInWeek, 'parsedDateJSON');

      return {
        endOfWeek,
        dailyData,
        x: formattedEndOfWeek,
        y: medianUsage,
      };
    }),
  };
}

const DayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
function transformUsageToDailyHeatmapData(
  areaId: string,
  usage: ParsedUsage[],
) {
  const allWeeks = uniq(usage.map((u) => u.endOfWeekJSON)).sort();

  return {
    areaId,
    data: DayNames.map((dayOfWeekName, dayOfWeekIndex) => {
      return {
        id: dayOfWeekName,
        data: allWeeks.map((week) => {
          const parsedEndOfWeekWeek = parseJSON(week);
          const date = setDay(parsedEndOfWeekWeek, dayOfWeekIndex);

          const usageForDay = usage.find(
            (u) => u.endOfWeekJSON === week && u.dayOfWeek === dayOfWeekIndex,
          );

          return usageForDay
            ? {
                date,
                dailyUsage: usageForDay.dailyUsage,
                allocationDailyUsed: usageForDay.allocationDailyUsed,
                allocationDaily: usageForDay.allocationDaily,
                x: week,
                y: usageForDay.usagePercent,
              }
            : {
                date,
                dailyUsage: null,
                allocationDailyUsed: null,
                allocationDaily: null,
                x: week,
                y: null,
              };
        }),
      };
    }),
  };
}
export type DailyHeatmapData = ReturnType<
  typeof transformUsageToDailyHeatmapData
>;

function median(values: number[]) {
  const sortedValues = Array.from(values).sort((a, b) => a - b);
  if (sortedValues.length % 2 === 0) {
    const middle = sortedValues.length / 2;
    return (sortedValues[middle - 1] + sortedValues[middle]) / 2;
  } else {
    return sortedValues[Math.floor(sortedValues.length / 2)];
  }
}
