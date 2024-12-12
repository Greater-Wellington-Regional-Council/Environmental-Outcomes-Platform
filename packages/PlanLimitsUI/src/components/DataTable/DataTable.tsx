import React, { useState, useMemo, ReactNode } from 'react';
import 'react-dropdown/style.css';
import 'react-datepicker/dist/react-datepicker.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import MonthYearPicker from '@components/MonthYearPicker';
import XToClose from '@components/XToClose/XToClose';
import numValue, { isNumber } from '@lib/numValue';
import _, { isDate } from 'lodash';
import Dropdown from '@components/Dropdown/Dropdown';

const SELECT_ALL = '(All)';

export type ColumnDescriptor = {
  name: string;
  heading: string;
  type: string;
  visible?: boolean;
  width?: string;
  align?: 'left' | 'right' | 'center';
  aggregateBy?: 'sum' | 'percent' // | 'average' | 'count' | 'min' | 'max' ;
  total?: () => DataValueType;
  [key: string]: string | number | boolean | undefined | null | (() => unknown);
  formula?: string;
};

type ColumnType = ColumnDescriptor | string | number;

type ColumnGroup = {
  name: string;
  heading: string;
  firstColumn: string;
  lastColumn: string;
};

export type FilterDescriptor = {
  name: string;
  type: React.FC<{
    filter: FilterDescriptor;
    currentValue: unknown;
    onChange: (filter: FilterDescriptor, value: unknown) => void;
  }>;
  initialValue?: unknown;
  key?: string;
  columns: string[];
  valueMatchesFilter?: (value: unknown, filterValue: unknown) => boolean;
  options?: unknown[];
  placeholder?: string;
  className?: string;
};

export const MonthYearFilter: React.FC<{ filter: FilterDescriptor, currentValue: unknown, onChange: (filter: FilterDescriptor, value: unknown) => void }> = ({ filter, currentValue, onChange }) => {
  return (
    <MonthYearPicker
      onChange={(date) => onChange(filter, date)}
      dataTestid={`dropdown-months-${filter.name}`}
      current={currentValue as Date}
      className={`bg-transparent p-4 w-[250px] ${filter.className}`}
    />
  );
}

export const SimpleFilter: React.FC<{ filter: FilterDescriptor, currentValue: unknown, onChange: (filter: FilterDescriptor, value: unknown) => void }> = ({ filter, currentValue, onChange }) => {
  const onSelection = (value: string) => onChange?.(filter, value);

  return (
    <Dropdown
      options={[SELECT_ALL, ...filter.options!]}
      onChange={onSelection}
      value={currentValue as string}
      placeholder={filter.placeholder || SELECT_ALL}
      dataTestid={`dropdown-${filter.name}`}
      className={`bg-transparent p-4 w-[250px] ${filter.className}`}
      controlClassName={'p-2'}
    />
  );
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      head: Array<Array<string | { content: string; styles?: object }>>;
      body: Array<Array<DataValueType>>;
      foot?: Array<Array<string | number>>;
      theme?: 'striped' | 'grid' | 'plain';
      styles?: object;
      headStyles?: object;
      bodyStyles?: object;
      footStyles?: object;
      alternateRowStyles?: object;
      tableLineColor?: string | number[];
      tableLineWidth?: number;
      margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
      didDrawPage?: (data: unknown) => void;
    }) => jsPDF;
  }
}

export type DataValueType = string | number | boolean | null | Date;

export type DataTableProps = {
  data: Array<Array<DataValueType>>;
  columns: ColumnDescriptor[];
  columnGroups?: ColumnGroup[];
  innerFilters?: FilterDescriptor[];
  outerFilters?: FilterDescriptor[];
  options?: {
    includeTotals?: boolean;
    [key: string]: unknown;
  }
};

type FilterValues = {
  [key: string]: unknown;
}

const Filters: React.FC<{ className?: string, filters: FilterDescriptor[], filterValue: FilterValues, setFilterValue: (value: FilterValues) => void }> = ({ filters, filterValue, setFilterValue, className }) => {

  return (
    <div className={`flex space-x-2 ${className}`}>
      {filters.map((filter: FilterDescriptor, index ) =>
        React.createElement(filter.type, {
          filter,
          onChange: (filter, value) => {
            setFilterValue({ ...filterValue, [filter.name]: value })
          },
          currentValue: _.get(filterValue, filter.name),
          key: `${filter.name}-${index}`,
        }),
      )}

      <XToClose onClick={() => setFilterValue({})} />
    </div>
  );
}

const DataTable: React.FC<DataTableProps> = ({
                                               data,
                                               columns,
                                               columnGroups = [],
                                               innerFilters = [],
                                               outerFilters = [],
                                               options = {},
                                             }) => {
  const [filterValue, setFilterValue] = useState<FilterValues>({});

  const filtered = (data: DataValueType[][], filters: FilterDescriptor[]): DataValueType[][] => {
    return data.filter((row) => filters.every((filter) => {
      const value: unknown = _.get(filterValue, filter.name);
      if (!value || value === SELECT_ALL) return true;
      const columnIndex = columns.findIndex((col) => col.name === filter.name);
      return filter.valueMatchesFilter ? filter.valueMatchesFilter!(row[columnIndex], value) : (row[columnIndex] === value);
    }));
  }

  // Convenience function to get a column descriptor by name or index
  const colDesc = (c: ColumnType | undefined): ColumnDescriptor => {

    const findCol = (c: ColumnType | undefined) => {
      if (typeof c === 'string') return columns.find((cd) => c === cd.name)!;
      if (typeof c === 'number') return columns[c];
      return c;
    }

    const chooseAggregateBy = (c: ColumnDescriptor) => {
      if (c.aggregateBy) return c.aggregateBy;
      if (c.type === 'number') return 'sum';
      if (c.type === 'percent') return 'percent';
      return undefined;
    }

    const cd = findCol(c);
    if (!cd) throw new Error(`Column ${c} not found`);

    return {
      ...cd,

      total: cd.total || (() => {
          if (chooseAggregateBy(cd) === 'sum') return sumColumn(cd.name);
          if (chooseAggregateBy(cd)  === 'percent') return sumPercent(cd.name);
          return null
        }),

      align: cd.align || (['number', 'percent'].includes(cd.type) ? 'right' : 'left'),
      visible: cd.visible ?? true,
      width: cd.width || 'auto'
    }
  }

  // Convenience function to get a column index by name or descriptor
  // Like Array::findIndex, returns -1 if not found
  const colIndex = (col: string | ColumnDescriptor | number): number => {
    if (typeof col === 'string') return columns.findIndex((c) => c.name === col);
    if (typeof col === 'number') return col;
    return columns.findIndex((c) => c.name === col.name);
  }

  const sumColumn = (columnName: string): DataValueType => {
    return (colIndex(columnName) === -1) ? '0.00' :
      filteredData
        .reduce((total, row) => total + numValue(row[colIndex(columnName)]), 0)
        .toFixed(2);
  };

  const colValues = (row: DataValueType[]): { [key: string]: DataValueType } => {
    const result: { [key: string]: DataValueType } = {};
    columns.forEach((c, index) => {
      result[c.name] = row[index];
    });
    return result;
  };

  const formulaArgs = (column: ColumnType) =>
    colDesc(column).formula?.match(/\w+/g)?.slice(1) || [];

  const sumPercent = (columnName: string): DataValueType => {
    const argNames = formulaArgs(columnName);
    const argValues  = argNames.map((arg) => sumColumn(arg));
    return calculate(columnName, _.zipObject(argNames, argValues));
  }

  const filteredData = useMemo(() =>
     filtered(data, [ ...(outerFilters || []), ...(innerFilters || []) ])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [data, outerFilters, innerFilters, filterValue]);

  const displayValue = (value: DataValueType | undefined, row?: DataValueType[], columnDetails?: ColumnType): string => {
    const cd: ColumnDescriptor | undefined = colDesc(columnDetails);
    if (cd?.formula && row) value = calculate(cd, colValues(row!));
    if ((value ?? null) === null) return '';
    if (isDate(value)) return value.toLocaleDateString();
    if (columnDetails && colDesc(columnDetails).type === 'percent') return `${numValue(value).toFixed(2)}%`;
    if (isNumber(value)) return numValue(value).toFixed(2);
    return value!.toString();
  }

  const cellFunctions: { [key: string]: ((a: number, b: number) => number) } = {
    // sum: (a: number, b: number) => a + b,
    // average: (a: number, b: number) => (a + b) / 2,
    // min: (a: number, b: number) => Math.min(a, b),
    // max: (a: number, b: number) => Math.max(a, b),
    percent: (a: number, b: number) => a / b * 100,
  }

  const calculate = (column: ColumnType, argValue: { [key: string]: DataValueType }) => {
    const c = colDesc(column);
    if (!c.formula) return argValue[c.name];

    const fn = cellFunctions[c.formula.split('(')[0]];
    if (!fn) return '!: ' + c.formula;

    const args: DataValueType[] = c.formula.match(/\w+/g)?.slice(1).map((col: string) => _.get(argValue, col)) || [];
    return fn!(...(args as [number, number]));
  }

  const downloadCSV = () => {
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'filtered_data.csv');
  };

  const printPDF = () => {
    const doc = new jsPDF();
    doc.text('Filtered Data', 10, 10);
    doc.autoTable({
      head: [columns.map((col) => col.heading)],
      body: filteredData,
    });
    doc.save('filtered_data.pdf');
  };

  const visibleColumns = columns.map(c => colDesc(c)).filter((c) => c.visible ?? true);

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="py-2 px-4 text-gray-700 font-bold w-full ">Show data for:</label>

      {/* Outer filters & actions (eg, water type and month) */}
      <div className="flex py-2 px-4 justify-between items-center">
        <Filters filters={outerFilters} filterValue={filterValue} setFilterValue={setFilterValue} />

        <div className="space-x-4">
          <button onClick={downloadCSV}>Download</button>
          <button onClick={printPDF}>Print</button>
        </div>
      </div>

      <table className="table-auto border-collapse w-full text-left">

        <thead>

        {/* Column groups */}
        <tr>
          {<ColumnGroupHeaders columnGroups={columnGroups} columns={visibleColumns} />}
        </tr>

        {/* Column headings */}
        <tr>
          {visibleColumns.map((col) => (
            <th key={col.name} className={`py-2 px-4 bg-kapiti text-${col.align} text-white p-2 font-medium`}>
              {col.heading}
            </th>
          ))}
        </tr>

        {/* Inner Filters */}
        <tr>
          <th colSpan={99}>
            <Filters
              className="bg-gray-300"
              filters={innerFilters}
              filterValue={filterValue}
              setFilterValue={setFilterValue}
            />
          </th>
        </tr>
        </thead>

        {/* Data */}
        <tbody>
        {filteredData.map((row, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-100' : ''}>
            {visibleColumns.map((col) => (
              <td key={col.name} className={`py-2 px-4 w-[${col.width || 'auto'}] ` +
                `text-${col.align}`}>
                {displayValue(row[colIndex(col)], row, col)}
              </td>
            ))}
          </tr>
        ))}
        </tbody>

        {/* Totals in footer */}
        <tfoot>
        {options?.includeTotals && <tr className="font-medium bg-nui text-white">
          {visibleColumns.map((col, index: number) =>
            (index === 0) ?
              <td key={col.name} className={`py-2 px-4 w-[${col.width || 'auto'}]`}>
                {"Totals"}
              </td>
              :
              <td key={col.name} className={`py-2 px-4 bg-nui text-${col.align} text-white p-2 font-medium`}>
                {displayValue(col.total?.(), undefined, col)}
              </td>
          )}
        </tr>}
        </tfoot>
      </table>
    </div>
  );
};

const ColumnGroupHeaders: React.FC<{ columnGroups: ColumnGroup[], columns: ColumnDescriptor[] }> = ({ columnGroups, columns }) => {

  let currentGroup: string | undefined = undefined;
  const headers: ReactNode[] = [];

  columns.forEach((col) => {
    const atGroupStart = columnGroups.find((group) => group.firstColumn === col.name);
    const atGroupEnd = columnGroups.find((group) => group.lastColumn === col.name);
    if (atGroupEnd) {
      headers.push(<th key={atGroupEnd.name} colSpan={
        columns.findIndex((c) => c.name === atGroupEnd.lastColumn) -
        columns.findIndex((c) => c.name === atGroupEnd.firstColumn) + 1
      } className="bg-kapiti text-white text-center p-2 font-medium">
        {atGroupEnd.heading}
      </th>);
      currentGroup = undefined;
    }
    else if (atGroupStart)
      currentGroup = atGroupStart.name;
    else if (!currentGroup || (col === columns[columns.length -1])) {
      headers.push(<th key={col.name} className="bg-kapiti text-white p-2 font-medium" />);
    }
  });

  return <>{headers}</>;
  }

export default DataTable;
