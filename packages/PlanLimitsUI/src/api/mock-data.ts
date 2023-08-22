import { take } from 'lodash';
import {
  addYears,
  addDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  getDate,
  getMonth,
  getYear,
  format,
} from 'date-fns';
import noise from '../noise.js';
noise(window);

const DATE_FORMAT = 'yyyy-MM-dd';

function rnd(n) {
  return window.noise.perlin2(0.1, n / 100);
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

export function generateHeatmapData() {
  const interval = generateInterval();
  return Areas.map((area) => {
    // const data = eachMonthOfInterval(interval).map((month) => {
    //   return {
    //     x: format(month, 'MMM yy'),
    //     y: Math.round(Math.random() * 100),
    //   };
    // });
    const data = eachWeekOfInterval(interval).map((month) => {
      return {
        x: '' + format(month, 'yyyy-MM-dd'),
        y: Math.random(),
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

  return Areas.map((area) => {
    const data = eachDayOfInterval(interval).map((day) => {
      return {
        day: format(day, DATE_FORMAT),
        value: Math.round(Math.random() * 100),
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

const Areas = [
  'BoothsSW',
  'HuangaruaSW',
  'HuttSW',
  'KopuarangaSW',
  'LakeWairarapaSW',
  'MangaoneSW',
  'MangatarereSW',
  'OrongorongoSW',
  'OtakiSW',
  'OtukuraSW',
  'PapawaiSW',
  'ParkvaleSW',
  'Ruamahanga_LowerSW',
  'Ruamahanga_MiddleSW',
  'Ruamahanga_UpperSW',
  'TauherenikauSW',
  'WaikanaeSW',
  'WaingawaSW',
  'WainuiomataSW',
  'WaiohineSW',
  'WaipouaSW',
  'WaitohuSW',
  'Dry RiverGW',
  'Fernhill TiffenGW',
  'HuangaruaGW',
  'LakeGW',
  'Lower HuttGW',
  'MangatarereGW',
  'MartinboroughGW',
  'OnokeGW',
  'Parkvale_ConfinedGW',
  'ParkvaleUnconfinedGW',
  'RaumatiGW',
  'TaratahiGW',
  'TauherenikauGW',
  'Te HoroGW',
  'Te Ore OreGW',
  'Upper HuttGW',
  'Upper RuamahangaGW',
  'WaikanaeGW',
  'WaingawaGW',
  'WaitohuGW',
  'RuamahangaTotalSW',
];
