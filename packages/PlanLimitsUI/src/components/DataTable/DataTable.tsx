import React, { useState, useMemo, ReactNode, useEffect } from 'react';
import 'react-dropdown/style.css';
import 'react-datepicker/dist/react-datepicker.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import MonthYearPicker from '@components/MonthYearPicker';
import XToClose from '@components/XToClose/XToClose';
import numValue from '@lib/numValue';
import randomString from '@lib/randomeString';
import _, { isDate } from 'lodash';
import Dropdown from '@components/Dropdown/Dropdown';

const SELECT_ALL = '(All)';

export type ColumnDescriptor = {
  name: string;
  heading: string;
  type: string;
  visible: boolean;
  width?: string;
  align?: 'left' | 'right' | 'center';
  aggregateBy?: 'sum' | 'percent' // | 'average' | 'count' | 'min' | 'max' ;
  total?: () => number | string | null;
  [key: string]: string | number | boolean | undefined | null | (() => unknown);
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
  const setSelectedOption = useState<unknown>(currentValue)[1];

  useEffect(() => {
    setSelectedOption(currentValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue]);

  const handleSelection = (value: string) => {
    const [month, year] = value.split('-').map(Number);
    const selected = { month, year };
    setSelectedOption(selected);
    onChange?.(filter, value);
  };

  return (
    <Dropdown
      options={[SELECT_ALL, ...filter.options!]}
      onChange={(value) => handleSelection(value)}
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
    <div className={`flex space-x-4 ${className}`}>
      {filters.map((filter: FilterDescriptor) =>
        React.createElement(filter.type, {
          filter,
          onChange: (filter, value) => {
            setFilterValue({ ...filterValue, [filter.name]: value })
          },
          currentValue: _.get(filterValue, filter.name),
          key: `${filter.name}-${randomString()}`
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
  const col = (c: ColumnType): ColumnDescriptor => {

    const findCol = (c: ColumnType) => {
      if (typeof c === 'string') return columns.find((cd) => c === cd.name)!;
      if (typeof c === 'number') return columns[c];
      return c;
    }

    const cd = findCol(c);

    return {
      ...cd,

      total: cd.total || (() => {
          if (cd.aggregateBy === 'sum') return sumColumn(cd.name);
          if (cd.aggregateBy === 'percent') return sumPercentsColumn(cd.name);
          return null
        }),

      alignment: cd.alignment || (['number', 'percent'].includes(cd.type) ? 'right' : 'left'),
    }
  }

  // Convenience function to get a column index by name or descriptor
  // Like Array::findIndex, returns -1 if not found
  const colIndex = (col: string | ColumnDescriptor | number): number => {
    if (typeof col === 'string') return columns.findIndex((c) => c.name === col);
    if (typeof col === 'number') return col;
    return columns.findIndex((c) => c.name === col.name);
  }

  const sumColumn = (columnName: string): string => {
    return (colIndex(columnName) === -1) ? '0.00' :
      filteredData
        .reduce((total, row) => total + numValue(row[colIndex(columnName)]), 0)
        .toFixed(2);
  };

  const sumPercentsColumn = (columnName: string): string => {
    if (colIndex(columnName) === -1) return '0.00';

    return filteredData
      .reduce((total, row) => (total + numValue(row[colIndex(columnName)]))/2, 0)
      .toFixed(2);
  };

  const filteredData = useMemo(() =>
     filtered(data, [ ...(outerFilters || []), ...(innerFilters || []) ])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [data, outerFilters, innerFilters, filterValue]);

  const displayValue = (value: DataValueType | undefined, columnDetails?: ColumnType): string => {
    if ((value ?? null) === null) return '';
    if (isDate(value)) return value.toLocaleDateString();
    if (columnDetails && col(columnDetails).type === 'percent') return `${value}%`;
    return value!.toString();
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

  const visibleColumns = columns.filter((c) => c.visible).map(c => col(c));

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
            <th key={col.name} className={`py-2 px-4 bg-kapiti `+
              `text-${col.align || (col.type === 'number' ? 'right' : 'left')}`+
              `text-right text-white p-2 font-medium`}>
              {col.heading}
            </th>
          ))}
        </tr>

        {/* Inner Filters */}
        <tr>
          <th colSpan={99}>
            <Filters className="bg-gray-300" filters={innerFilters} filterValue={filterValue} setFilterValue={setFilterValue} />
          </th>
        </tr>
        </thead>

        {/* Data */}
        <tbody>
        {filteredData.map((row, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-100' : ''}>
            {visibleColumns.map((col) => (
              <td key={col.name} className={`py-2 px-4 w-[${col.width || 'auto'}] ` +
                `text-${col.alignment}`}>
                {displayValue(row[colIndex(col)], col)}
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
              <td key={col.name} className={`py-2 px-4 w-[${col.width || 'auto'}] text-right`}>
                {displayValue(col.total?.(), col)}
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
