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

interface ParsedUsage extends Usage {
  parsedDate: Date;
  endOfWeek: Date;
}

const AreaPresentationGroups = [
  {
    name: 'Kapiti',
    areaIds: [
      'WaitohuSW',
      'OtakiSW',
      'MangaoneSW',
      'OtakiGW',
      'OtakiRiverGW',
      'Te HoroGW',
      'WaikanaeSW',
      'WaikanaeRiverGW',
      'WaikanaeGW',
      'RaumatiGW',
    ],
  },
  {
    name: 'Te Awarua-o-Porirua Whaitua',
    areaIds: [
      'HuttSW',
      'Upper HuttGW',
      'Lower HuttGW',
      'WainuiomataSW',
      'OrongorongoSW',
    ],
  },
  {
    name: 'Ruamahanga',
    areaIds: [
      'RuamahangaTotalSW',
      'Ruamahanga_UpperSW',
      'Upper RuamahangaGW',
      'Te Ore OreGW',
      'KopuarangaSW',
      'WaipouaSW',
      'WaingawaSW',
      'WaingawaGW',
    ],
  },
  {
    name: 'Ruamahanga 2',
    hideGroupLabel: true,
    areaIds: [
      'Ruamahanga_MiddleSW',
      'Middle RuamahangaGW',
      'Fernhill TiffenGW',
      'MangatarereSW',
      'MangatarereGW',
      'BoothsSW',
      'ParkvaleSW',
      'Parkvale_ConfinedGW',
      'WaiohineSW',
      'PapawaiSW',
      'WaiohineGW',
    ],
  },
  {
    name: 'Ruamahanga 3',
    hideLabel: true,
    areaIds: [
      'LakeWairarapaSW',
      'LakeGW',
      'TauherenikauSW',
      'OtukuraSW',
      'TauherenikauGW',
    ],
  },
  {
    name: 'Ruamahanga 4',
    hideLabel: true,
    areaIds: [
      'Ruamahanga_LowerSW',
      'MoikiGW',
      'MartinboroughGW',
      'HuangaruaSW',
      'HuangaruaGW',
      'OnokeGW',
    ],
  },
];

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

  const parsedUsage = parseUsage(usage);
  const usageGroupedByArea = groupBy<ParsedUsage>(parsedUsage, 'areaId');
  const heatmapDataPerArea = Object.keys(usageGroupedByArea).map((areaId) =>
    transformUsageToHeatmapData(areaId, usageGroupedByArea[areaId]),
  );

  const groupedHeatmapDataPerArea = AreaPresentationGroups.map((group) => {
    const data: HeatmapData[] = [];
    const missingAreas: string[] = [];
    group.areaIds.forEach((areaId) => {
      const areaData = heatmapDataPerArea.find((hmd) => hmd.id === areaId);
      if (areaData) {
        data.push(areaData);
      } else {
        missingAreas.push(areaId);
      }
    });

    return {
      ...group,
      // TODO can we make use of the usageGroupedByArea dictionary
      data,
      missingAreas,
    };
  });

  return {
    allMissingAreas: flatten(
      groupedHeatmapDataPerArea.map((a) => a.missingAreas),
    ),
    groups: groupedHeatmapDataPerArea,
  };
}

function parseUsage(usage: Usage[]) {
  return usage.map((usage) => {
    const parsedDate = parse(usage.date, 'yyyy-MM-dd', new Date());
    return {
      ...usage,
      parsedDate,
      endOfWeek: lastDayOfWeek(parsedDate),
      week: getWeek(parsedDate),
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
