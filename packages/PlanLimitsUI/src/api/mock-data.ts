import {
  addYears,
  addDays,
  getDayOfYear,
  eachDayOfInterval,
  eachWeekOfInterval,
  getDate,
  getMonth,
  getYear,
  format,
} from 'date-fns';
import noise from '../lib/noise.js';
noise(window);
const DATE_FORMAT = 'yyyy-MM-dd';
window.noise.seed(Math.random());

function rnd(x, y) {
  return window.noise.perlin2(x / 5, y / 5);
}

interface Interval {
  start: Date;
  end: Date;
}

export function generateMockData() {
  const lastYear = generateInterval();
  const gwAnnual = groundWaterAnnual(lastYear);
  const swDaily = surfaceWaterDaily(lastYear);
  const swWeekly = surfaceWaterWeekly(lastYear);

  return {
    regions: Regions,
    start: lastYear.start,
    end: lastYear.end,
    gwAnnual,
    swDaily,
    swWeekly,
  };
}

function generateInterval() {
  const today = new Date();
  const end = addDays(today, -1);
  const start = addYears(today, -1);

  return {
    start: new Date(getYear(start), getMonth(start), getDate(start)),
    end: new Date(getYear(end), getMonth(end), getDate(end)),
  };
}

export function surfaceWaterWeekly(interval: Interval) {
  return SWAreas.map((area, areaIndex) => {
    const data = eachWeekOfInterval(interval).map((month, monthIndex) => {
      console.log(month);
      return {
        x: format(month, 'yyyy-MM-dd'),
        y: Math.abs(rnd(areaIndex, monthIndex)),
      };
    });

    return {
      id: area.source_id,
      data,
    };
  });
}

export function groundWaterAnnual(interval: Interval) {
  // TODO: Correlate this to SW usage average...
  return GWAreas.map((area, areaIndex) => {
    const value = Math.abs(rnd(Math.random() * 100, areaIndex)) * 1.8;
    return {
      id: area.source_id,
      data: [
        {
          x: `${format(interval.start, DATE_FORMAT)} - ${format(
            interval.end,
            DATE_FORMAT
          )}`,
          y: value,
        },
      ],
    };
  });
}

export function surfaceWaterDaily(interval: Interval) {
  return SWAreas.map((area, areaIndex) => {
    const data = eachDayOfInterval(interval).map((day, dayIndex) => {
      return {
        day: format(day, DATE_FORMAT),
        value: 2 * Math.round(Math.abs(rnd(areaIndex, dayIndex)) * 100),
      };
    });
    return {
      area,
      data,
    };
  });
}

const allGWUsage = new Map();
const allSWUsage = new Map();
const formatNumber = Intl.NumberFormat();

export function gwUsage(gwUnit?: number) {
  if (!gwUnit) return;

  if (!allGWUsage.has(gwUnit)) {
    const allocation = Math.round(Math.random() * 100000);
    const usage = Math.round(Math.random() * 100000);
    allGWUsage.set(gwUnit, {
      allocation: formatNumber.format(allocation),
      usage: formatNumber.format(usage),
      percent: Math.round((usage / allocation) * 100),
    });
  }
  return allGWUsage.get(gwUnit);
}

export function sevenDaySWUsage(offset: number, swUnit?: number) {
  if (!swUnit) return;
  const key = `${swUnit}-${offset.toString()}`;
  if (!allSWUsage.has(key)) {
    const allocation = Math.round(Math.random() * 100000);
    const today = new Date();
    const end = addDays(today, offset * 7 - 1);
    const start = addDays(end, -6);
    allSWUsage.set(key, {
      allocation: formatNumber.format(allocation),
      start,
      end,
      data: [
        {
          id: 'Usage',
          data: eachDayOfInterval({ start, end }).map((date) => {
            return {
              x: format(date, 'EEE d'),
              y: 2 * Math.abs(rnd(swUnit, getDayOfYear(date))),
            };
          }),
        },
      ],
    });
  }

  return allSWUsage.get(key);
}

const Regions = [
  'Ruamahanga Whaitua',
  'Te Whanganui-a-Tara Whaitua',
  'Kāpiti Whaitua',
];

const SWAreas = [
  {
    name: 'Mangaone Stream and tributaries',
    region: 'Kāpiti Whaitua',
    source_id: 'MangaoneSW',
  },
  {
    name: 'Ōtaki River and tributaries',
    region: 'Kāpiti Whaitua',
    source_id: 'OtakiSW',
  },
  {
    name: 'Wainuiomata River and tributaries',
    region: 'Te Whanganui-a-Tara Whaitua',
    source_id: 'WainuiomataSW',
  },
  {
    name: 'Te Awa Kairangi/Hutt River and tributaries',
    region: 'Te Whanganui-a-Tara Whaitua',
    source_id: 'HuttSW',
  },
  {
    name: 'Orongorongo River and tributaries',
    region: 'Te Whanganui-a-Tara Whaitua',
    source_id: 'OrongorongoSW',
  },
  {
    name: 'Ruamāhanga River and tributaries, upstream of (but not including) the confluence with the Lake Wairarapa outflow',
    region: 'Ruamahanga Whaitua',
    source_id: 'RuamahangaTotalSW',
  },
  {
    name: 'Lake Wairarapa and tributaries above the confluence of the Lake Wairarapa outflow with the Ruamāhanga River',
    region: 'Ruamahanga Whaitua',
    source_id: 'LakeWairarapaSW',
  },
  {
    name: 'Waikanae River and tributaries',
    region: 'Kāpiti Whaitua',
    source_id: 'WaikanaeSW',
  },
  {
    name: 'Waitohu Stream and tributaries',
    region: 'Kāpiti Whaitua',
    source_id: 'WaitohuSW',
  },
  {
    name: 'Booths Creek and tributaries',
    region: 'Ruamahanga Whaitua',
    source_id: 'BoothsSW',
  },
  {
    name: 'Kopuaranga River and tributaries',
    region: 'Ruamahanga Whaitua',
    source_id: 'KopuarangaSW',
  },
  {
    name: 'Mangatarere Stream and tributaries',
    region: 'Ruamahanga Whaitua',
    source_id: 'MangatarereSW',
  },
  {
    name: 'Parkvale Stream and tributaries',
    region: 'Ruamahanga Whaitua',
    source_id: 'ParkvaleSW',
  },
  {
    name: 'Waingawa River and tributaries',
    region: 'Ruamahanga Whaitua',
    source_id: 'WaingawaSW',
  },
  {
    name: 'Waipoua River and tributaries',
    region: 'Ruamahanga Whaitua',
    source_id: 'WaipouaSW',
  },
  {
    name: 'Huangarua River and tributaries',
    region: 'Ruamahanga Whaitua',
    source_id: 'HuangaruaSW',
  },
  {
    name: 'Ruamāhanga River and tributaries upstream of the confluence with the Papawai Stream',
    region: 'Ruamahanga Whaitua',
    source_id: 'Ruamahanga_MiddleSW',
  },
  {
    name: 'Ruamāhanga River and tributaries upstream of the confluence with the Waingawa River',
    region: 'Ruamahanga Whaitua',
    source_id: 'Ruamahanga_UpperSW',
  },
  {
    name: 'Papawai Stream and tributaries',
    region: 'Ruamahanga Whaitua',
    source_id: 'PapawaiSW',
  },
  {
    name: 'Lower Ruamāhanga River and tributaries upstream of (but not including) the confluence with the Lake Wairarapa outflow',
    region: 'Ruamahanga Whaitua',
    source_id: 'Ruamahanga_LowerSW',
  },
  {
    name: 'Waiohine River and tributaries',
    region: 'Ruamahanga Whaitua',
    source_id: 'WaiohineSW',
  },
  {
    name: 'Tauherenikau River and tributaries',
    region: 'Ruamahanga Whaitua',
    source_id: 'TauherenikauSW',
  },
  {
    name: 'Otukura Stream and tributaries above the confluence with Dock/Stonestead Creek',
    region: 'Ruamahanga Whaitua',
    source_id: 'OtukuraSW',
  },
];

const GWAreas = [
  { name: 'Ōtaki', region: 'Kāpiti Whaitua', source_id: 'OtakiGW' },
  {
    name: 'Ōtaki River subcatchment',
    region: 'Kāpiti Whaitua',
    source_id: 'OtakiRiverGW',
  },
  { name: 'Raumati', region: 'Kāpiti Whaitua', source_id: 'RaumatiGW' },
  { name: 'Te Horo', region: 'Kāpiti Whaitua', source_id: 'Te HoroGW' },
  { name: 'Waikanae', region: 'Kāpiti Whaitua', source_id: 'WaikanaeGW' },
  {
    name: 'Lower Hutt',
    region: 'Te Whanganui-a-Tara Whaitua',
    source_id: 'Lower HuttGW',
  },
  {
    name: 'Upper Hutt',
    region: 'Te Whanganui-a-Tara Whaitua',
    source_id: 'Upper HuttGW',
  },
  {
    name: 'Waikanae River',
    region: 'Kāpiti Whaitua',
    source_id: 'WaikanaeRiverGW',
  },
  {
    name: 'Waitohu Stream subcatchment',
    region: 'Kāpiti Whaitua',
    source_id: 'WaitohuGW',
  },
  { name: 'Dry River', region: 'Ruamahanga Whaitua', source_id: 'Dry RiverGW' },
  {
    name: 'Fernhill-Tiffen',
    region: 'Ruamahanga Whaitua',
    source_id: 'Fernhill TiffenGW',
  },
  { name: 'Huangarua', region: 'Ruamahanga Whaitua', source_id: 'HuangaruaGW' },
  { name: 'Lake', region: 'Ruamahanga Whaitua', source_id: 'LakeGW' },
  {
    name: 'Lower Ruamāhanga',
    region: 'Ruamahanga Whaitua',
    source_id: 'Lower RuamahangaGW',
  },
  {
    name: 'Mangatarere',
    region: 'Ruamahanga Whaitua',
    source_id: 'MangatarereGW',
  },
  {
    name: 'Martinborough',
    region: 'Ruamahanga Whaitua',
    source_id: 'MartinboroughGW',
  },
  {
    name: 'Middle Ruamāhanga',
    region: 'Ruamahanga Whaitua',
    source_id: 'Middle RuamahangaGW',
  },
  { name: 'Moiki', region: 'Ruamahanga Whaitua', source_id: 'MoikiGW' },
  { name: 'Onoke', region: 'Ruamahanga Whaitua', source_id: 'OnokeGW' },
  {
    name: 'Parkvale',
    region: 'Ruamahanga Whaitua',
    source_id: 'Parkvale_ConfinedGW',
  },
  { name: 'Taratahi', region: 'Ruamahanga Whaitua', source_id: 'TaratahiGW' },
  {
    name: 'Tauherenikau',
    region: 'Ruamahanga Whaitua',
    source_id: 'TauherenikauGW',
  },
  {
    name: 'Te Ore Ore',
    region: 'Ruamahanga Whaitua',
    source_id: 'Te Ore OreGW',
  },
  {
    name: 'Upper Ruamāhanga',
    region: 'Ruamahanga Whaitua',
    source_id: 'Upper RuamahangaGW',
  },
  { name: 'Waingawa', region: 'Ruamahanga Whaitua', source_id: 'WaingawaGW' },
  { name: 'Waiohine', region: 'Ruamahanga Whaitua', source_id: 'WaiohineGW' },
];
