import { groupBy, flatten, uniq } from 'lodash';
import {
  format,
  addYears,
  addDays,
  parse,
  lastDayOfWeek,
  getDay,
} from 'date-fns';

import { useWaterUseQuery } from '../api';

interface ParsedUsage extends Usage {
  parsedDate: Date;
  parsedDateJSON: string;
  endOfWeek: Date;
  endOfWeekJSON: string;
  usagePercent: number;
  dayOfWeek: number;
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
          const usageForDay = usage.find(
            (u) => u.endOfWeekJSON === week && u.dayOfWeek === dayOfWeekIndex,
          );
          return usageForDay
            ? {
                x: week,
                y: usageForDay.usagePercent,
                date: usageForDay.parsedDate,
                usage: usageForDay.dailyUsage,
                allocation: usageForDay.meteredDailyAllocation,
                dayOfWeek: usageForDay.dayOfWeek,
              }
            : {
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
