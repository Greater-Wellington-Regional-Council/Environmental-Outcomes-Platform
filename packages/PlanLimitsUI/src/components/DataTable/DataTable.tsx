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
import _, { capitalize, isDate } from 'lodash';
import Dropdown from '@components/Dropdown/Dropdown';
import randomString from '@lib/randomeString';

const SELECT_ALL = '(All)';

export type ColumnDescriptor = {
  name: string;
  heading?: string;
  type?: string;
  visible?: boolean;
  width?: string;
  align?: 'left' | 'right' | 'center';
  aggregateBy?: 'sum' | 'percent';
  total?: () => DataValueType;
  formula?: string;
  highlight?: (colour: string) => string;
  [key: string]: string | number | boolean | undefined | null | (() => unknown) | ((c: string) => string);
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
  columns?: string[];
  valueMatchesFilter?: (value: unknown, filterValue: unknown) => boolean;
  options?: unknown[];
  placeholder?: string;
  className?: string;
  onChange?: (v: unknown) => void;
};

export const MonthYearFilter: React.FC<{
  filter: FilterDescriptor,
  currentValue: unknown,
  onChange: (filter: FilterDescriptor, value: unknown) => void
}> = ({ filter, currentValue, onChange }) => {
  const onSelection = (v: unknown) => {
    filter.onChange?.(v)
    onChange?.(filter, v)
  }

  return (
    <MonthYearPicker
      onChange={onSelection}
      dataTestid={`dropdown-months-${filter.name}`}
      current={currentValue as Date}
      className={`bg-transparent p-4 w-[250px] ${filter.className}`}
    />
  );
};

export const SimpleFilter: React.FC<{
  filter: FilterDescriptor,
  currentValue: unknown,
  onChange: (filter: FilterDescriptor, value: unknown) => void
}> = ({ filter, currentValue, onChange }) => {
  const onSelection = (value: string) => onChange?.(filter, value);

  return (
    <Dropdown
      options={[SELECT_ALL, ...(filter.options || [])]}
      onChange={onSelection}
      value={currentValue as string}
      placeholder={filter.placeholder || SELECT_ALL}
      dataTestid={`dropdown-${filter.name}`}
      className={`bg-transparent p-4 w-[250px] ${filter.className}`}
      controlClassName={'p-2'}
    />
  );
};

export const OuterFilter: React.FC<{
  filter: FilterDescriptor,
  currentValue: unknown,
  onChange: (filter: FilterDescriptor, value: unknown) => void
}> = ({ filter, currentValue, onChange }) => {
  const onSelection = (value: string) => {
    filter.onChange?.(value);
    onChange?.(filter, value);
  }

  return (
    <Dropdown
      options={filter.options ?? []}
      selectAll={SELECT_ALL}
      onChange={onSelection}
      value={currentValue as string}
      placeholder={filter.placeholder || SELECT_ALL}
      dataTestid={`dropdown-${filter.name}`}
      className={`bg-transparent p-4 w-[250px] ${filter.className}`}
      controlClassName={`p-2`}
    />
  );
};

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

type Row = Record<string, DataValueType>;

export type DataTableProps<T extends DataValueType[][] | Record<string, DataValueType>[]> = {
  data: T;
  columns: ColumnDescriptor[];
  columnGroups?: ColumnGroup[];
  innerFilters?: FilterDescriptor[];
  outerFilters?: FilterDescriptor[];
  options?: {
    includeTotals?: boolean;
    [key: string]: unknown;
    order?: string[];
  };
};

type FilterValues = {
  [key: string]: unknown;
}

const Filters: React.FC<{
  className?: string,
  filters: FilterDescriptor[],
  filterValue: FilterValues,
  setFilterValue: (value: FilterValues) => void,
  onClose: () => void
}> = ({ filters, filterValue, setFilterValue, className, onClose }) => {
  return (
    <div className={`flex space-x-2 ${className}`}>
      {filters.map((filter: FilterDescriptor, index) =>
        React.createElement(filter.type, {
          filter,
          onChange: (filter, value) => {
            setFilterValue({ ...filterValue, [filter.name]: value });
          },
          currentValue: _.get(filterValue, filter.name),
          key: `${filter.name}-${index}`,
        }),
      )}

      <XToClose onClick={onClose} />
    </div>
  );
};

function DataTable<T extends DataValueType[][] | Record<string, DataValueType>[]>(
  {
    data,
    columns: columnProps,
    columnGroups = [],
    innerFilters = [],
    outerFilters = [],
    options = {}
  }: DataTableProps<T>,
): React.ReactElement {

  const allFilters: FilterDescriptor[] = useMemo(() => [...(outerFilters || []), ...(innerFilters || [])], [innerFilters, outerFilters])

  const initialFilterValues = () => {
    return allFilters.reduce((acc, filter) => {
      acc[filter.name] = filter.initialValue;
      return acc;
    }, {} as Record<string, unknown>);
  };

  const [filterValue, setFilterValue] = useState<FilterValues>(initialFilterValues());
  const clearFilterValue = (name: string) => setFilterValue({ ...filterValue, [name]: null });

  /**
   * Normalize the data into an array of objects (Row).
   */
  const normalizeData = (
    input: Array<Array<DataValueType>> | Array<Record<string, DataValueType>>,
    cols: ColumnDescriptor[],
  ): Row[] => {
    if (input.length === 0) return [];

    const first = input[0];
    const isObjectData = !Array.isArray(first);
    if (isObjectData) {
      // Already array of objects
      return input as Array<Record<string, DataValueType>>;
    }

    return (input as Array<Array<DataValueType>>).map((rowArray) => {
      const rowObj: Row = {};
      cols.forEach((col, idx) => {
        rowObj[col.name] = rowArray[idx];
      });
      return rowObj;
    });
  };

  const columns = useMemo(() => data?.[0] ? Object.keys(data[0]).map((colName: string) => fullColumnDetails(colName)) : [], [data]);
  const column = (c: ColumnType): ColumnDescriptor => fullColumnDetails(c);

  const visibleColumns = (options?.order || columns).map(c => column(c)).filter((c) => c.visible ?? true);
  const rows: Row[] = useMemo(() => normalizeData(data, columns), [data, columns]);

  const filteredData = useMemo(() => {
    return rows.filter((row) =>
      innerFilters.every((filter) => {
        const value = _.get(filterValue, filter.name);
        console.log(value)
        if (!value || value === SELECT_ALL) return true;
        const cellValue = row[filter.name];
        return filter.valueMatchesFilter
          ? filter.valueMatchesFilter(cellValue, value)
          : (cellValue === value);
      }),
    );
  }, [rows, outerFilters, innerFilters, filterValue]);

  function fullColumnDetails(
    col: ColumnType | undefined,
  ): ColumnDescriptor {
    const deriveType = (name: string) => {
      if (!data?.[0]) return 'string';
      if (isNumber(_.get(data[0], name))) return 'number';
      return 'string';
    };

    const deriveAlign = (type: string) =>
      ['number', 'percent'].includes(type) ? 'right' : 'left';

    const deriveHeading = (name: string) => {
      const special = {
        'bc': 'BC',
        'pnrp': 'PNRP',
        'unchanged': ['a', 'of'],
        'area_id': 'Catchment',
      };

      return _.get(special, name) || name
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => _.get(special, word) || (word.charAt(0).toUpperCase() + word.slice(1)))
        .join(' ');
    };

    const sumColumn = (columnName: string): DataValueType => {
      return filteredData
        .reduce((total, row) => total + numValue(_.get(row, columnName)), 0)
        .toFixed(2);
    };

    // const colValues = (row: DataValueType[]): { [key: string]: DataValueType } => {
    //   const result: { [key: string]: DataValueType } = {};
    //   columns.forEach((c, index) => {
    //     result[c.name] = row[index];
    //   });
    //   return result;
    // };

    const formulaArgs = (base: ColumnDescriptor) =>
      base.formula?.match(/\w+/g)?.slice(1) || [];

    const sumPercent = (base: ColumnDescriptor | string): DataValueType => {
      const argNames = formulaArgs(column(base));
      const argValues = argNames.map((arg) => sumColumn(arg));
      return calculate(column(base).name, _.zipObject(argNames, argValues));
    };

    const totalCalc = (agg: string, name: string) => {
      if (agg === 'sum') return sumColumn(name);
      if (agg === 'percent') return sumPercent(name);
      return data?.[0] && typeof _.get(data[0], name) === 'number' ? 'sum' : 'sum'
    };

    if (typeof col === 'number') {
      const base = columnProps[col];
      if (!base) throw new Error(`No column descriptor found at index ${col}`);
      return {
        ...base,
        heading: base.heading ?? deriveHeading(base.name),
        type: deriveType(base.name),
        align: base.align ?? deriveAlign(deriveType(base.name)),
        visible: base.visible ?? true,
        width: base.width ?? 'auto',
        total: () => totalCalc(base.aggregateBy ?? 'sum', base.name),
      };
    }

    if (typeof col === 'string') {
      let base = columnProps.find((c) => c.name === col);
      if (!base) {
        // Create a default descriptor if none found
        base = {
          name: col,
          heading: deriveHeading(col),
          align: deriveAlign(deriveType(col)),
          total: () => totalCalc('sum', col),
        };
      }
      return {
        ...base,
        heading: base.heading ?? deriveHeading(base.name),
        visible: base.visible ?? true,
        width: base.width ?? 'auto',
        type: base.type || deriveType(base.name),
        align: base.align ?? deriveAlign(base.type || deriveType(base.name)),
        total: () => totalCalc(base.aggregateBy ?? 'sum', base.name),
      };
    }

    if (col && typeof col === 'object') {
      return {
        ...col,
        heading: col.heading ?? deriveHeading(col.name),
        align: col.align ?? deriveAlign(col.type || deriveType(col.name)),
        visible: col.visible ?? true,
        width: col.width ?? 'auto',
        type: col.type ?? deriveType(col.name),
        total: () => totalCalc(col.aggregateBy ?? 'sum', col.name)
      };
    }

    return { name: `UnnamedColumn_${randomString()}`, heading: 'unnamed' };
  }

  // const formulaArgs = (c: ColumnType) =>
  //   column(c).formula?.match(/\w+/g)?.slice(1) || [];

  const displayValue = (
    value: DataValueType | undefined,
    row?: Row,
    cd?: ColumnDescriptor,
  ): string => {
    if (cd?.formula && row) value = calculate(cd, row);
    if ((value ?? null) === null) return '';
    if (isDate(value)) return value.toLocaleDateString();
    if (cd?.type === 'percent' && isNumber(value)) return `${numValue(value).toFixed(2)}%`;
    if (isNumber(value)) return numValue(value).toFixed(2);
    return value!.toString();
  };

  const calculate = (col: ColumnType, argValue: Row) => {
    const cellFunctions: { [key: string]: ((a: number, b: number) => number) } = {
      percent: (a: number, b: number) => a / b * 100,
    };

    const c = column(col);
    if (!c.formula) return argValue[c.name];

    const fn = cellFunctions[c.formula.split('(')[0]];
    if (!fn) return '!: ' + c.formula;

    const args: DataValueType[] =
      c.formula.match(/\w+/g)?.slice(1).map((col: string) => _.get(argValue, col)) || [];
    return fn!(...(args as [number, number]));
  };

  const downloadCSV = () => {
    // Convert filteredData (array of objects) into arrays for CSV
    const csvData = filteredData.map((row) => columns.map((c) => row[c.name]));
    const csv = Papa.unparse({ fields: columns.map(c => c.name), data: csvData });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'filtered_data.csv');
  };

  const printPDF = () => {
    const doc = new jsPDF();
    doc.text('Filtered Data', 10, 10);
    const pdfData = filteredData.map((row) => columns.map((c) => row[c.name]));
    doc.autoTable({
      head: [columns.map((col) => col.heading ?? capitalize(col.name))],
      body: pdfData,
    });
    doc.save('filtered_data.pdf');
  };

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="py-2 px-4 text-gray-700 font-bold w-full ">Show data for:</label>

      {/* Outer filters & actions (eg, water type and month) */}
      <div className="flex py-2 px-4 justify-between items-center">
        <Filters filters={outerFilters} filterValue={filterValue} setFilterValue={setFilterValue} onClose={
          () => outerFilters.forEach(f => clearFilterValue(f.name))
      }/>

        {data[0] && <div className="space-x-4">
          <button onClick={downloadCSV}>Download</button>
          <button onClick={printPDF}>Print</button>
        </div>}
      </div>

      {data[0] ? <table className="table-auto border-collapse w-full text-left">

        <thead>
        {/* Column groups */}
        <tr>
          <ColumnGroupHeaders columnGroups={columnGroups} columns={visibleColumns} />
        </tr>

        {/* Column headings */}
        <tr>
          {visibleColumns.map((col) => (
            <th key={col.name} className={`py-2 px-4 bg-kapiti text-${col.align} text-white p-2 font-medium ${col.highlight?.('white')}`}>
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
              onClose={() => innerFilters.forEach(f => clearFilterValue(f.name))}
            />
          </th>
        </tr>
        </thead>

        {/* Data */}
        <tbody>
        {filteredData.map((row, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-100' : ''}>
            {visibleColumns.map((col) => (
              <td key={col.name} className={`border=2 border-r-white py-2 px-4 w-[${col.width || 'auto'}] text-${col.align} ${col.highlight?.('gray')}`}>
                {displayValue(row[col.name], row, col)}
              </td>
            ))}
          </tr>
        ))}
        </tbody>

        {/* Totals in footer */}
        <tfoot>
        {options?.includeTotals && <tr className="font-medium bg-nui text-white">
          {visibleColumns.map((col, index: number) =>
            index === 0
              ? <td key={col.name} className={`py-2 px-4 w-[${col.width || 'auto'}]`}>{'Totals'}</td>
              : <td key={col.name} className={`py-2 px-4 bg-nui text-${col.align} text-white p-2 font-medium ${col.highlight?.('white')}`}>
                {displayValue(col.total?.(), undefined, fullColumnDetails(col))}
              </td>,
          )}
        </tr>}
        </tfoot>

      </table> : <div className="font-bold ml-4 mt-2 text-lg text-nui-20">There is no data for these criteria</div>}

    </div>
  );
}

const ColumnGroupHeaders: React.FC<{ columnGroups: ColumnGroup[], columns: ColumnDescriptor[] }> = ({
                                                                                                      columnGroups,
                                                                                                      columns,
                                                                                                    }) => {
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
    } else if (atGroupStart)
      currentGroup = atGroupStart.name;
    else if (!currentGroup || (col === columns[columns.length - 1])) {
      headers.push(<th key={col.name} className="bg-kapiti text-white p-2 font-medium" />);
    }
  });

  return <>{headers}</>;
};

export default DataTable;
