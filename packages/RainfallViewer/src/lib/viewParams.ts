import type { ReadonlyURLSearchParams } from 'next/navigation';
import startOfHour from 'date-fns/startOfHour';
import addHours from 'date-fns/addHours';
import compareAsc from 'date-fns/compareAsc';
import getMinutes from 'date-fns/getMinutes';
import { colorScale1r, colorScale24 } from './colorScale';

export const DateLagMins = 15;
export const HourOptions = new Map<number, string>([
  [1, '1hr'],
  [6, '6hr'],
  [12, '12hr'],
  [24, '24hr'],
  [48, '48hr'],
]);

export function serializeViewParams(qsParams: QSParams) {
  const params = new URLSearchParams({
    hours: qsParams.hours.toString(),
    to: qsParams.to !== null ? qsParams.to.getTime() : undefined,
    showTotals: qsParams.showTotals ? 'true' : 'false',
    showAccumulation: qsParams.showAccumulation ? 'true' : 'false',
  });
  return '?' + params.toString();
}

export function getDefaultDate() {
  const now = new Date();
  const startOfHourNow = startOfHour(now);

  // If we are less than DATA_LAG_MINS past the hour, use the previous hour
  const startOfHourInclLag = addHours(
    startOfHourNow,
    getMinutes(now) < DateLagMins ? -1 : 0
  );
  return startOfHourInclLag;
}

export function parseViewParams(
  searchParams: ReadonlyURLSearchParams
): ViewParams {
  const qsHours = parseInt(searchParams.get('hours') || '1');
  const hours = HourOptions.has(qsHours) ? qsHours : 1;

  const defaultDate = getDefaultDate();
  let to = defaultDate;
  const qsTo = parseInt(searchParams.get('to') || '0');
  if (qsTo) {
    const parsedQSTo = new Date(qsTo);
    if (compareAsc(to, parsedQSTo) === 1) {
      to = parsedQSTo;
    }
  }
  const from = addHours(to, -hours);
  const showAccumulation = searchParams.get('showAccumulation') === 'true';
  const showTotals = searchParams.get('showTotals') === 'true';

  const canShow1HrLater = compareAsc(addHours(to, 1), defaultDate) > 0;
  const canShow24HrLater = compareAsc(addHours(to, 24), defaultDate) > 0;

  const colorScale = hours === 1 ? colorScale1r : colorScale24;

  return {
    hours,
    to,
    from,
    showAccumulation,
    showTotals,
    canShow1HrLater,
    canShow24HrLater,
    colorScale,
  };
}

export function serializeViewParamsWithHours(
  viewParams: ViewParams,
  hours: number
) {
  return serializeViewParams({
    ...viewParams,
    to: addHours(viewParams.to, hours),
  });
}
