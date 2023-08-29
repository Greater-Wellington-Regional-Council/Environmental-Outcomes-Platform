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
import perlin from '../lib/perlin';
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

function generateInterval() {
  const today = new Date();
  const end = addDays(today, -1);
  const start = addYears(today, -1);
  return {
    start: new Date(getYear(start), getMonth(start), getDate(start)),
    end: new Date(getYear(end), getMonth(end), getDate(end)),
  };
}

export function sevenDayUsage(offset: number) {
  const today = new Date();
  const end = addDays(today, offset * 7 - 1);
  const start = addDays(end, -6);
  return {
    start,
    end,
    data: [
      {
        id: 'Usage',
        data: eachDayOfInterval({ start, end }).map((date, dayIndex) => {
          return {
            x: format(date, 'EEE d'),
            y: 2 * Math.abs(rnd(50, getDayOfYear(date))),
          };
        }),
      },
    ],
  };
}

export function generateHeatmapData() {
  const interval = generateInterval();
  return Areas.map((area, areaIndex) => {
    const data = eachWeekOfInterval(interval).map((month, monthIndex) => {
      return {
        x: format(month, 'yyyy-MM-dd'),
        y: Math.abs(rnd(areaIndex, monthIndex)),
      };
    });

    return {
      id: area,
      data,
    };
  });
}

export function generateDailyUsageData() {
  const today = new Date();
  const end = addDays(today, -1);
  const start = addYears(today, -1);
  const interval = generateInterval();

  return Areas.map((area, areaIndex) => {
    const data = eachDayOfInterval(interval).map((day, dayIndex) => {
      return {
        day: format(day, DATE_FORMAT),
        value: Math.round(Math.abs(rnd(areaIndex, dayIndex)) * 100),
      };
    });
    return {
      area,
      data,
      start: format(start, DATE_FORMAT),
      end: format(end, DATE_FORMAT),
    };
  });
}

export function generateMockData() {
  const lastYear = generateInterval();
  return {
    gwAnnual: groundWaterUsage(lastYear),
  };
}

export function groundWaterUsage(interval: Interval) {
  // TODO: Correlate this to SW usage average...
  return GWAreas.map((area, areaIndex) => {
    // const value = Math.abs(rnd2(Math.random() * 100, areaIndex / 50)) * 2;
    const value =
      Math.abs(perlin.get(Math.random() * 100, areaIndex / 100)) * 2;
    console.log(value);
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

const Areas = [
  // Ruamahanga Whaitua
  'Booths',
  'Huangarua',
  'Kopuaranga',
  'LakeWairarapa',
  'Mangatarere',
  'Otukura',
  'Papawai',
  'Parkvale',
  'Ruamahanga-Lower',
  'Ruamahanga-Middle',
  'Ruamahanga-Upper',
  'Tauherenikau',
  'Waingawa',
  'Waiohine',
  'Waipoua',
  // Kāpiti Whaitua
  'Mangaone',
  'Otaki',
  'Waikanae',
  'Waitohu',
  // Te Whanganui-a-Tara Whaitua
  'Hutt',
  'Orongorongo',
  'Wainuiomata',
];

const Regions = [
  'Ruamahanga Whaitua',
  'Te Whanganui-a-Tara Whaitua',
  'Kāpiti Whaitua',
];

const SWAreas = [
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
    name: 'Waikanae River',
    region: 'Kāpiti Whaitua',
    source_id: 'WaikanaeRiverGW',
  },
  {
    name: 'Waitohu Stream subcatchment',
    region: 'Kāpiti Whaitua',
    source_id: 'WaitohuGW',
  },
];
