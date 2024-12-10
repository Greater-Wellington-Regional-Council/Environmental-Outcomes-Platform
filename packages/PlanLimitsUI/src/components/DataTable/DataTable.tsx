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

type ColumnDescriptor = {
  name: string;
  heading: string;
  type: string;
  visible: boolean;
  width?: string;
  [key: string]: string | number | boolean | undefined;
};

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
};

export const MonthYearFilter: React.FC<{ filter: FilterDescriptor, currentValue: unknown, onChange: (filter: FilterDescriptor, value: unknown) => void }> = ({ filter, currentValue, onChange }) => {
  return (
    <MonthYearPicker
      onChange={(date) => onChange(filter, date)}
      dataTestid={`dropdown-months-${filter.name}`}
      current={currentValue as Date}
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
      placeholder={filter.placeholder || 'Select...'}
      dataTestid={`dropdown-${filter.name}`}
      className={'bg-transparent p-4'}
      dropdownClassName={'w-64'}
      optionClassName={'p-2'}
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
};

type FilterValues = {
  [key: string]: unknown;
}

const Filters: React.FC<{ filters: FilterDescriptor[], filterValue: FilterValues, setFilterValue: (value: FilterValues) => void }> = ({ filters, filterValue, setFilterValue }) => {

  return (
    <div className="flex space-x-4">
      {filters.map((filter: FilterDescriptor) =>
        React.createElement(filter.type, {
          filter,
          onChange: (filter, value) => {
            setFilterValue({ ...filterValue, [filter.name]: value })
          },
          currentValue: _.get(filterValue, filter.name),
          key: `${filter.name}-${randomString()}`,
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
                                             }) => {
  const [filterValue, setFilterValue] = useState<FilterValues>({});

  const filtered = (data: DataValueType[][], filters: FilterDescriptor[]): DataValueType[][] => {
    console.log('filters', filters);
    return data.filter((row) => filters.every((filter) => {
      const value: unknown = _.get(filterValue, filter.name);
      console.log('value', value, filterValue, filter);
      if (!value || value === SELECT_ALL) return true;
      const columnIndex = columns.findIndex((col) => col.name === filter.name);
      console.log('columnIndex', columnIndex, columns, filter.name, row[columnIndex], value, (row[columnIndex] as Date) === (value as Date) ? 'matched' : 'not matched');
      return filter.valueMatchesFilter ? filter.valueMatchesFilter!(row[columnIndex], value) : (row[columnIndex] === value);
    }));
  }

  const filteredData = useMemo(() =>
     filtered(data, [ ...(outerFilters || []), ...(innerFilters || []) ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [data, outerFilters, innerFilters]);

  const grandTotal = (columnName: string): string => {
    const columnIndex = columns.findIndex((col) => col.name === columnName);
    if (columnIndex === -1) return '0.00';

    return filteredData
      .reduce((total, row) => total + numValue(row[columnIndex]), 0)
      .toFixed(2);
  };

  const displayValue = (value: DataValueType): string => {
    if (value === null) return '';
    if (isDate(value)) return value.toLocaleDateString();
    return value.toString();
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

  const visibleColumns = columns.filter((col) => col.visible);

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="text-gray-700 font-bold w-full pt-3 pb-1">Show data for:</label>

      {/* Outer filters & actions (eg, water type and month) */}
      <div className="flex justify-between items-center mt-2 mb-6">
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
            <th key={col.name} className="bg-kapiti text-right text-white p-2 font-medium">
              {col.heading}
            </th>
          ))}
        </tr>

        {/* Filters */}
        <tr>
          <th colSpan={99}>
            <Filters filters={innerFilters} filterValue={filterValue} setFilterValue={setFilterValue} />
          </th>
        </tr>
        </thead>

        {/* Data */}
        <tbody>
        {filteredData.map((row, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-100' : ''}>
            {visibleColumns.map((col) => (
              <td key={col.name} className={`text-right p-2 w-[${col.width || 'auto'}]`}>
                {displayValue(row[columns.findIndex((column) => column.name === col.name)])}
              </td>
            ))}
          </tr>
        ))}
        </tbody>

        {/* Totals in footer */}
        <tfoot>
        <tr className="font-medium bg-nui text-white">
          {visibleColumns.map((col) => (
            <td key={col.name} className={`text-right p-2 w-[${col.width || 'auto'}]`}>
              {col.type === 'number' ? grandTotal(col.name) : ''}
            </td>
          ))}
        </tr>
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
