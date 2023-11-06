import { useWaterUseQuery } from '../api';
import {
  format,
  addYears,
  addDays,
  getWeek,
  parse,
  lastDayOfWeek,
} from 'date-fns';
import { groupBy, flatten } from 'lodash';
import { GWUsagePresentationGroups } from '../lib/councilData';

interface ParsedUsage extends Usage {
  parsedDate: Date;
  endOfWeek: Date;
}

export default function useDetailedWaterUseData(councilId: number) {
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
      ? transformWaterUseData(waterUseQueryResult.data)
      : undefined,
  };

  return {
    ...waterUseQueryResult,
    data,
  };
}

export type DetailedWaterUseQuery = ReturnType<typeof useDetailedWaterUseData>;

function transformWaterUseData(usage: Usage[]) {
  const parsedUsage = parseUsage(usage);
  const areaUsage = groupBy<ParsedUsage>(parsedUsage, 'areaId');

  const groupedAreaUsage = GWUsagePresentationGroups.map((group) => {
    const data: HeatmapData[] = [];
    const missingAreas: string[] = [];
    group.areaIds.forEach((areaId) => {
      if (areaUsage[areaId]) {
        data.push(transformUsageToHeatmapData(areaId, areaUsage[areaId]));
      } else {
        missingAreas.push(areaId);
      }
    });

    return {
      ...group,
      data,
      missingAreas,
    };
  });

  return {
    allMissingAreas: flatten(groupedAreaUsage.map((a) => a.missingAreas)),
    groups: groupedAreaUsage,
  };
}

function parseUsage(usage: Usage[]) {
  return usage.map((usage) => {
    const parsedDate = parse(usage.date, 'yyyy-MM-dd', new Date());
    return {
      ...usage,
      parsedDate,
      endOfWeek: lastDayOfWeek(parsedDate, { weekStartsOn: 6 }),
    };
  });
}

function transformUsageToHeatmapData(areaId: string, usage: ParsedUsage[]) {
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

      const usageInWeekAsPercentages = usageInWeek.map((usage) =>
        usage.dailyUsage <= 0 ? 0 : usage.dailyUsage / usage.allocation,
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

function median(values: number[]) {
  const sortedValues = Array.from(values).sort((a, b) => a - b);
  if (sortedValues.length % 2 === 0) {
    const middle = sortedValues.length / 2;
    return (sortedValues[middle - 1] + sortedValues[middle]) / 2;
  } else {
    return sortedValues[Math.floor(sortedValues.length / 2)];
  }
}
