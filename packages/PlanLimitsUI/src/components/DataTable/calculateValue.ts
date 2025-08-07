import { isNumber } from '@lib/numValue';
import { get } from 'lodash';
import { ColumnDescriptor, DataValueType } from './DataTable';

export const calculate = (
  col: ColumnDescriptor,
  argValues: Record<string, DataValueType>,
) => {
  const cellFunctions: { [key: string]: (a: number, b: number) => number } = {
    percent: (a: number, b: number) => {
      if (b === 0) return 0;
      return (a / b) * 100;
    },
  };

  if (!col.formula) return argValues[col.name];

  const fn = cellFunctions[col.formula.split('(')[0]];
  if (!fn) return '!: ' + col.formula;

  const args: DataValueType[] =
    col.formula
      .match(/\w+/g)
      ?.slice(1)
      .map((col: string) => get(argValues, col)) || [];

  if (args.some((arg) => !isNumber(arg))) return '';
  return fn!(...(args as [number, number]));
};
