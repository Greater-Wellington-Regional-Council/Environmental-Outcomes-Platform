import React, { useMemo, ReactNode, useState } from 'react';
import 'react-dropdown/style.css';
import 'react-datepicker/dist/react-datepicker.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import numValue, { isNumber } from '@lib/numValue';
import _, { capitalize, isDate } from 'lodash';
import Dropdown, { DropdownOption, DropdownValueType } from '@components/Dropdown/Dropdown';

import {
  FilterDescriptor,
  FilterPanel,
  SELECT_ALL
} from '@components/FilterPanel/FilterPanel';

import { useFilterValues } from '@components/FilterPanel/useFilterValues';

import CompoundFilter from '@components/FilterPanel/Filters/CompoundFilter/CompoundFilter';

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

type ColumnNameOrDescriptor = ColumnDescriptor | string;

type ColumnGroup = {
  name: string;
  heading: string;
  firstColumn: string;
  lastColumn: string;
};

export type DataValueType = string | number | boolean | null | Date;

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

export const OuterFilter: React.FC<FilterDescriptor> = (filter: FilterDescriptor) => {
  const onSelection = (value: unknown) => {
    filter.onChange?.(value);
  };

  return (
    <Dropdown
      options={filter.options ?? []}
      selectAll={SELECT_ALL}
      onChange={onSelection}
      value={filter.currentValue as string}
      placeholder={filter.placeholder || SELECT_ALL}
      dataTestid={`dropdown-${filter.name}`}
      className={`bg-transparent p-4 w-[250px] ${filter.className}`}
      controlClassName={`p-2`}
    />
  );
};

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
      } className="bg-kapiti text-white text-center pt-2 font-semibold text-lg">
        {atGroupEnd.heading}
      </th>);
      currentGroup = undefined;
    } else if (atGroupStart)
      currentGroup = atGroupStart.name;
    else if (!currentGroup || (col === columns[columns.length - 1])) {
      headers.push(<th key={col.name} className="bg-kapiti text-white p-2 font-semibold" />);
    }
  });

  return <>{headers}</>;
};

function DataTable<T extends DataValueType[][] | Record<string, DataValueType>[]>(
  {
    data,
    columns: columnProps,
    columnGroups = [],
    innerFilters = [],
    outerFilters = [],
    options = {},
  }: DataTableProps<T>,
): React.ReactElement {

  const allFilters: FilterDescriptor[] = useMemo(() => [...(outerFilters || []), ...(innerFilters || [])], [innerFilters, outerFilters]);

  const {
    filterValues,
    setFilterValues,
    getFilterValue,
    resetFilters: clearFilterValue,
  } = useFilterValues(allFilters.reduce(
    (acc, filter) => {
      acc[filter.name] = filter.currentValue;
      return acc;
    }, {} as Record<string, unknown>),
  );

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

  const columns = useMemo(() => data?.[0] ? Object.keys(data[0]).map((colName: string) => fullColumnDescriptor(colName)) : [], [data]);
  const column = (c: ColumnNameOrDescriptor): ColumnDescriptor => fullColumnDescriptor(c);

  const visibleColumns = (options?.order || columns).map(c => column(c)).filter((c) => c.visible ?? true);
  const rows: Row[] = useMemo(() => normalizeData(data, columns), [data, columns]);

  const filteredData = useMemo(() => {
    return rows.filter((row) =>
      innerFilters.every((filter) => {
        const value = getFilterValue(filter.name);
        if (value === undefined) return true;
        const cellValue = row[filter.name];
        return filter.valueMatchesFilter
          ? filter.valueMatchesFilter(cellValue, value)
          : (cellValue === value || undefined);
      }),
    );
  }, [rows, outerFilters, innerFilters, filterValues]);

  const columnAggregationFunctions = {

    /* Simple column sum */
    sum: (col: ColumnDescriptor): DataValueType => {
      return filteredData
        .reduce((total, row) => total + numValue(_.get(row, col.name)), 0)
        .toFixed(2);
    },

    /* Summarize a percentage of two other columns. */
    percent: (col: ColumnDescriptor): DataValueType => {
      if (!col.formula) return '';

      const formulaArgs = (base: ColumnDescriptor) =>
        base.formula?.match(/\w+/g)?.slice(1) || [];

      const argNames = formulaArgs(column(col));
      const argValues = argNames.map((arg) => numValue(column(arg).total?.()) ?? 0);

      return calculate(column(col), _.zipObject(argNames, argValues));
    },

    selectAndCalculate: (c: ColumnNameOrDescriptor) => {
      const col = column(c);
      if (col.aggregateBy === 'sum') return columnAggregationFunctions.sum(col);
      if (col.aggregateBy === 'percent') return columnAggregationFunctions.percent(col);
      return '';
    },
  };

  function fullColumnDescriptor(
    col: ColumnNameOrDescriptor | undefined,
  ): ColumnDescriptor {
    const deriveTypeFromFirstRecord = (name: string) => {
      if (!data?.[0]) return 'string';
      if (isNumber(_.get(data[0], name))) return 'number';
      return 'string';
    };

    const deriveAlignFromType = (type: string) =>
      ['number', 'percent'].includes(type) ? 'right' : 'left';

    const deriveHeadingFromName = (name: string) => {
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

    const deriveAggFromType = (type: string) =>
      type === 'percent' ? 'percent' : 'sum';

    if (!col) return { name: 'unknown' };

    let base = (typeof col === 'string') ? { name: col } : col!;
    const givenOptions = columnProps.find((c) => c.name === base.name) || { name: base.name };

    base.heading = givenOptions.heading ?? deriveHeadingFromName(base.name);
    base.visible = givenOptions.visible ?? true;
    base.width = givenOptions.width || 'auto';
    base.type = givenOptions.type || deriveTypeFromFirstRecord(base.name);
    base.align = givenOptions.align || deriveAlignFromType(base.type);
    base.aggregateBy = givenOptions.aggregateBy || deriveAggFromType(base.type);
    base.total = () => columnAggregationFunctions.selectAndCalculate(base);
    base.formula = givenOptions.formula || undefined;

    return base;
  }

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

  function DataCell(props: {
    col: ColumnDescriptor,
    s: DataValueType,
    children?: React.ReactNode,
    className?: string,
    ignoreFormula?: boolean,
    currentRow?: Record<string, DataValueType>
  }): React.ReactElement {
    const col = fullColumnDescriptor(props.col);
    return <td
      className={`py-2 px-2 p-2 ${props.className ?? ''}`}
      style={{ textAlign: col.align }}>
      {props.children || displayValue(props.s, props.currentRow, props.ignoreFormula ? {
        ...col,
        formula: undefined,
      } : col) || ''}
    </td>;
  }

  const calculate = (col: ColumnDescriptor, argValues: Row) => {
    const cellFunctions: { [key: string]: ((a: number, b: number) => number) } = {
      // These are the functions that can be used in a formula for a column.
      //
      // Currently only one formula is supported.
      // col.formula is a string like "percent(a, b)" where a and b are other column names.
      // The formula is evaluated by looking up the values of the other columns in the current row
      // and applying the function to them by using the function name as a key to this object.
      //
      percent: (a: number, b: number) => {
        if (b === 0) return 0;
        return a / b * 100;
      },
    };

    if (!col.formula) return argValues[col.name];

    const fn = cellFunctions[col.formula.split('(')[0]];
    if (!fn) return '!: ' + col.formula;

    const args: DataValueType[] =
      col.formula.match(/\w+/g)?.slice(1).map((col: string) => _.get(argValues, col)) || [];

    if (args.some((arg) => !isNumber(arg))) return '';
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

  const ComplexFilter: React.FC<FilterDescriptor> = (props) => {
    const [filterValues, setFilterValues] = useState<DataValueType[]>(props.currentValue as DataValueType[]);
    const [fieldDetails, setFieldDetails] = useState<{ fieldName: string, conditions: DataValueType[], values: DropdownValueType[] } | undefined>(undefined);

    const handleNewField = (name: string) => {
      if (name) setFieldDetails(getFieldDetails(name, filteredData))
    };

    const handleSubmit = (values: DataValueType[]) => {
      if (!values[0] || !values[1]) return;
      setFilterValues(values);
      props.onChange?.(values);
    };

    const getFieldDetails = (fieldName: string, data: Row[]) => {
      const fieldData = data.map((row) => row[fieldName]);
      const uniqueValues = _.uniq(fieldData);
      const conditions = ['=', '!=', '>', '<', '>=', '<='];
      return { fieldName, conditions, values: uniqueValues };
    };

    const getCandidateValues = (fieldDetails: { fieldName: string, conditions: DataValueType[], values: DropdownValueType[] }) => {
      const values = fieldDetails?.values || [];
      const selectedCondition = filterValues[1] as string;
      const selectedValue = filterValues[2] as DataValueType;
      if (selectedCondition === '!=') {
        return values.filter((v) => v !== selectedValue);
      }
      return values;
    }

    return <div className="flex space-x-2">
      <CompoundFilter
        filter={{ name: 'complexFilter' }}
        options={[
          {
            name: 'Field Name',
            options: columns.map((c) => ({ label: c.heading, value: c.name } as DropdownOption)),
            allowFreeText: false,
            onSelect: ((fieldName) => handleNewField(fieldName as string)),
            className: 'w-[300px]',
            placeholder: 'Column',
          },
          {
            name: 'Condition',
            options: (fieldDetails?.conditions || []) as string[],
            allowFreeText: false,
            className: 'w-[100px] text-center',
            placeholder: '=',
            onSelect: (v) => setFilterValues([fieldDetails?.fieldName as DataValueType, v, filterValues[2]]),
          },
          {
            name: 'Field Value',
            options: (fieldDetails ? getCandidateValues(fieldDetails) : []).map(v => ({ label: v, value: v } as DropdownOption)),
            allowFreeText: true,
            placeholder: 'Value',
            onSelect: (v) => handleSubmit([fieldDetails?.fieldName as DataValueType, filterValues[1], v]),
          },
        ]}
        currentValue={filterValues}
        defaultValues={props.defaultValue as DataValueType[]}
        onSelect={handleSubmit}
        clearOn={['Field Name']}
        hideSubmitButton={true}
      />
    </div>;
  };

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="pt-2 px-4 text-gray-700 font-bold w-full ">Show data for:</label>

      {/* Outer filters & actions (eg, water type and month) */}
      <div className="flex pb-2 pt-0 mt-0 px-4 justify-between items-center" style={{ textAlign: 'unset' }}>
        <FilterPanel filters={outerFilters} filterValues={filterValues} setFilterValues={setFilterValues} onClose={
          () => clearFilterValue(outerFilters.map(f => f.name))
        } />

        {data[0] && <div className="space-x-4">
          <button onClick={downloadCSV}>Download</button>
          <button onClick={printPDF}>Print</button>
        </div>}
      </div>

      {data[0] ? <table className="table-auto border-collapse w-full">

        <thead>
        {/* Column groups */}
        <tr>
          <ColumnGroupHeaders columnGroups={columnGroups} columns={visibleColumns} />
        </tr>

        {/* Column headings */}
        <tr>
          {visibleColumns.map((col, colIndex) => (
            <th key={col.name}
                className={`py-2 px-1 bg-kapiti font-semibold ${'text-' + (col.align ?? 'left')} text-white p-2 ${col.highlight?.('white')}`}>
              {colIndex == 0 ? '' : col.heading}
            </th>
          ))}
        </tr>

        {/* Inner Filters */}
        <tr>
          <th colSpan={99}>
            <FilterPanel
              className="bg-gray-300"
              filters={innerFilters}
              filterValues={filterValues}
              setFilterValues={setFilterValues}
              label="Show rows where:"
              onClose={() => clearFilterValue(innerFilters.map(f => f.name))}>
              <ComplexFilter {...{
                name: 'complexFilter',
                type: ComplexFilter,
                currentValue: [undefined, '=' , undefined] as DataValueType[],
                defaultValue: [undefined, '=', undefined] as DataValueType[],
                options: [],
                onChange: (v: unknown) => console.log('Selected:', v),
              }} />
            </FilterPanel>
          </th>
        </tr>
        </thead>

        {/* Data */}
        <tbody>
        {filteredData.map((row, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-100' : ''}>
            {visibleColumns.map((col, colIndex) => <DataCell key={col.name} currentRow={row}
               className={`${colIndex == 0 ? 'row-title font-bold' : 'data font-light border-white border-r-2'} ${col.highlight?.('gray') ?? ''}`}
               col={col} s={row[col.name]} ignoreFormula={true} />)
            }
          </tr>
        ))}
        </tbody>

        {/* Totals in footer */}
        <tfoot>
        {options?.includeTotals && <tr className="font-medium bg-nui text-white">
          {visibleColumns.map((col, index: number) =>
            index === 0
              ? <td key={col.name} className={`py-2 px-4 w-[${col.width || 'auto'}]`}>{'Totals'}</td>
              : <DataCell key={col.name} className={`totals text-white ${col.highlight?.('white') ?? ''}`} col={col}
                          s={col.total?.() ?? ''} />,
          )}
        </tr>}
        </tfoot>

      </table> : <div className="font-bold ml-4 mt-2 text-lg text-nui-20">There is no data for these criteria</div>}

    </div>
  );
}

export default DataTable;
