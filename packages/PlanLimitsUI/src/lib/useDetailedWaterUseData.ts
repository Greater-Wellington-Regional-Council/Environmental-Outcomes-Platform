import { useWaterUseQuery } from '../api';
import {
  format,
  addYears,
  addDays,
  getWeek,
  parse,
  lastDayOfWeek,
} from 'date-fns';
import { groupBy } from 'lodash';

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
    usage:
      waterUseQueryResult.data &&
      transformWaterUseData(waterUseQueryResult.data),
  };

  return {
    ...waterUseQueryResult,
    data,
  };
}

function transformWaterUseData(usage: Usage[]) {
  if (usage.length === 0) return [];

  const parsedUsage: ParsedUsage[] = usage.map((usage) => {
    const parsedDate = parse(usage.date, 'yyyy-MM-dd', new Date());
    return {
      ...usage,
      parsedDate,
      endOfWeek: lastDayOfWeek(parsedDate),
      week: getWeek(parsedDate),
    };
  });

  const usageGroupedByArea = groupBy<ParsedUsage>(parsedUsage, 'areaId');

  return Object.keys(usageGroupedByArea).map((areaId) => {
    const usageForArea = usageGroupedByArea[areaId];

    const usageForAreaGroupedByWeek = groupBy<ParsedUsage>(
      usageForArea,
      (usage) => usage.endOfWeek.toJSON(),
    );
    const sortedWeeks = Object.keys(usageForAreaGroupedByWeek).sort();

    return {
      id: areaId,
      data: sortedWeeks.map((week) => {
        const usagesInWeek = usageForAreaGroupedByWeek[week];
        const endOfWeek = usagesInWeek[0].endOfWeek;
        const formattedWeek = format(endOfWeek, 'yyyy-MM-dd');

        const mappedUsagePercentages = usagesInWeek.map((usage) =>
          usage.dailyUsage <= 0 ? 0 : usage.dailyUsage / usage.allocation,
        );

        const medianUsage = median(mappedUsagePercentages);

        return {
          x: formattedWeek,
          y: medianUsage,
        };
      }),
    };
  });
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
