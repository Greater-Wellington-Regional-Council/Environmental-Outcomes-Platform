import zip from 'lodash/zip';

// Colors stolen from https://ourworldindata.org/grapher/average-precipitation-per-year
const colors = [
  'rgb(255, 255, 209)',
  'rgb(233, 249, 162)',
  'rgb(188, 231, 165)',
  'rgb(111, 196, 173)',
  'rgb(55, 168, 183)',
  'rgb(40, 147, 181)',
  'rgb(28, 126, 178)',
  'rgb(27, 99, 165)',
  'rgb(27, 72, 151)',
  'rgb(28, 52, 141)',
];

const GWColors = [
  'rgb(255, 255, 190)',
  'rgb(255, 255, 161)',
  'rgb(255, 246, 85)',
  'rgb(179, 237, 53)',
  'rgb(116, 203, 29)',
  'rgb(45, 155, 41)',
  'rgb(80, 172, 136)',
  'rgb(123, 181, 254)',
  'rgb(41, 107, 255)',
  'rgb(37, 71, 154)',
];

const steps1hr = [1, 5, 10, 20, 30, 40, 50, 60, 75, null];
const steps2hr = [1, 5, 10, 20, 40, 60, 80, 100, 150, null];
const steps24hr = [1, 10, 25, 50, 75, 100, 200, 300, 400, null];

// zip infers the wrong return type, so explicitly set this with "as"
export const colorScale1r = zip(steps1hr, colors) as ColorScale;
export const colorScale2r = zip(steps2hr, colors) as ColorScale;
export const colorScale24 = zip(steps24hr, colors) as ColorScale;
