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
import noise from '../noise.js';
noise(window);

const DATE_FORMAT = 'yyyy-MM-dd';

window.noise.seed(Math.random());
function rnd(x, y) {
  return window.noise.perlin2(x / 5, y / 5);
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
    // const data = eachMonthOfInterval(interval).map((month) => {
    //   return {
    //     x: format(month, 'MMM yy'),
    //     y: Math.round(Math.random() * 100),
    //   };
    // });
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

const Areas = [
  'Booths',
  'Huangarua',
  'Hutt',
  'Kopuaranga',
  'LakeWairarapa',
  'Mangaone',
  'Mangatarere',
  'Orongorongo',
  'Otaki',
  'Otukura',
  'Papawai',
  'Parkvale',
  'Ruamahanga-Lower',
  'Ruamahanga-Middle',
  'Ruamahanga-Upper',
  'Tauherenikau',
  'Waikanae',
  'Waingawa',
  'Wainuiomata',
  'Waiohine',
  'Waipoua',
  'Waitohu',
];
