import React from 'react';
import { isDate } from 'lodash';
import { isNumber, numValue } from '@lib/numValue';
import { ColumnDescriptor, DataValueType } from './DataTable';
import { calculate } from './calculateValue';

interface DataCellProps {
  col: ColumnDescriptor;
  s: DataValueType;
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
  if (cd?.formula && row) value = calculate(cd, row);
  if ((value ?? null) === null) return '';
  if (isDate(value)) return value.toLocaleDateString();
  if (cd?.type === 'percent' && isNumber(value)) return `${numValue(value).toFixed(2)}%`;
  if (isNumber(value)) return numValue(value).toFixed(2);
  return value!.toString();
};

const errorFlag = (props: { col: ColumnDescriptor; s: DataValueType }) =>
  props.col.valueOk?.some((fn) => !fn(props.s)) ? (
    <span className="font-bold">&nbsp;!</span>
  ) : '';

export function DataCell({
  col,
  s,
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
          s,
          currentRow,
          ignoreFormula ? { ...col, formula: undefined } : col
        ) ||
        ''}
      <span>{errorFlag({ col, s })}</span>
    </td>
  );
}

export default DataCell; 