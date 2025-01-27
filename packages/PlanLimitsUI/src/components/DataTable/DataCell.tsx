import React from 'react';
import { isDate } from 'lodash';
import { isNumber, isNumberString, numValue } from '@lib/numValue';
import { ColumnDescriptor, DataValueType } from './DataTable';
import { calculate } from './calculateValue';

interface DataCellProps {
  col: ColumnDescriptor;
  value: DataValueType;
  children?: React.ReactNode;
  className?: string;
  ignoreFormula?: boolean;
  currentRow?: Record<string, DataValueType>;
}

const displayValue = (
  value: DataValueType | undefined,
  row?: Record<string, DataValueType>,
  cd?: ColumnDescriptor,
): string => {

  const scaleNumber = (input: number | string, scale?: number) => {
    if (typeof input === 'string') input = parseFloat(input);
    if (isNaN(input)) return input;
    if (scale === undefined) return input;
    return input / Math.pow(10, scale);
  };

  if (cd?.formula && row) value = calculate(cd, row);
  if ((value ?? null) === null) return '';
  if (isDate(value)) return value.toLocaleDateString();
  if (cd?.type === 'percent' && isNumber(value)) return `${numValue(value).toFixed(2)}%`;
  if (isNumber(value) || isNumberString(value)) return scaleNumber(numValue(value), cd?.scale).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + (cd?.scaleSymbol ?? '');
  return value!.toString();
};

const errorFlag = (props: { col: ColumnDescriptor; s: DataValueType }) =>
  props.col.valueOk?.some((fn) => !fn(props.s)) ? (
    <span className="font-extrabold">&nbsp;!</span>
  ) : '';

export function DataCell({
  col,
  value,
  children,
  className,
  ignoreFormula,
  currentRow,
}: DataCellProps): React.ReactElement {
  return (
    <td
      className={`py-2 px-2 p-2 ${className ?? ''} ${col.highlight?.('gray') ?? ''}`}
      style={{ textAlign: col.align }}
    >
      {children ||
        displayValue(
          value,
          currentRow,
          ignoreFormula ? { ...col, formula: undefined } : col
        ) ||
        ''}
      <span>{errorFlag({ col, s: value })}</span>
    </td>
  );
}

export default DataCell;
