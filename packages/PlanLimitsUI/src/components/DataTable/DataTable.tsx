import React, { ReactNode, useMemo, useEffect } from 'react';
import 'react-dropdown/style.css';
import 'react-datepicker/dist/react-datepicker.css';
import { jsPDF } from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import numValue, { isNumber } from '@lib/numValue';
import _ from 'lodash';
import Dropdown from '../Dropdown/Dropdown';
import DataCell from './DataCell';
import { calculate } from './calculateValue';
import { OpenSansRegularBase64 } from '@lib/fonts/OpenSansRegularBase64';
import { dateString } from '@lib/convertDate';
import {
  FilterDescriptor,
  FilterPanel,
  SELECT_ALL,
} from '@components/FilterPanel/FilterPanel';

import { useFilterValues } from '@components/FilterPanel/useFilterValues';

import ComplexFilter, { ComparisonOperator } from './ComplexFilter';
import capitalise from '@lib/capitalise';

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
  valueOk?: ((value: DataValueType) => boolean)[];
  scale?: number;
  scaleSymbol?: string;

  [key: string]:
    | string
    | number
    | boolean
    | undefined
    | null
    | (() => unknown)
    | ((c: string) => string)
    | unknown[];
};

type ColumnNameOrDescriptor = ColumnDescriptor | string;

type ColumnGroup = {
  name: string;
  heading: string;
  firstColumn: string;
  lastColumn: string;
};

export type DataValueType =
  | string
  | number
  | boolean
  | null
  | Date
  | undefined
  | ComparisonOperator;

declare module 'jspdf' {
  // @ts-ignore
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
      margin?:
        | number
        | { top?: number; right?: number; bottom?: number; left?: number };
      didDrawPage?: (data: unknown) => void;
    }) => jsPDF;
  }
}

export const OuterFilter: React.FC<FilterDescriptor> = (
  filter: FilterDescriptor,
) => {
  const onSelection = (value: unknown) => {
    filter.onChange?.(value);
  };

  return (
    <Dropdown
      {...filter}
      options={filter.options ?? []}
      selectAll={SELECT_ALL}
      onChange={onSelection}
      value={filter.currentValue as string}
      placeholder={filter.placeholder || SELECT_ALL}
      dataTestid={`dropdown-${filter.name}`}
      className={`bg-transparent p-4 ${filter.className}`}
      controlClassName={`p-2`}
    />
  );
};

export type Row = Record<string, DataValueType>;

export interface ColumnComparison {
  unzipColumn: string;
  keyColumn: string;
  compareColumn: string;
}

export type DataTableProps<
  T extends DataValueType[][] | Record<string, DataValueType>[],
> = {
  data: T;
  columns: ColumnDescriptor[];
  columnGroups?: ColumnGroup[];
  innerFilters?: FilterDescriptor[];
  outerFilters?: FilterDescriptor[];
  onClearFilters?: (e?: unknown) => void;
  options?: {
    includeTotals?: boolean;
    [key: string]: unknown;
    order?: string[];
    rowObjectNamePlural?: string;
    sort?: [{ [key: string]: 'asc' | 'desc' }];
    compareColumn?: ColumnComparison;
    complexFilter?:
      | boolean
      | {
          fieldSupportsOperator?: (
            operator: ComparisonOperator,
            fieldName: string,
            fieldData: DataValueType[],
          ) => boolean;
        };
  };
};

const ColumnGroupHeaders: React.FC<{
  columnGroups: ColumnGroup[];
  columns: ColumnDescriptor[];
}> = ({ columnGroups, columns }) => {
  let currentGroup: string | undefined = undefined;
  const headers: ReactNode[] = [];

  columns.forEach((col) => {
    const atGroupStart = columnGroups.find(
      (group) => group.firstColumn === col.name,
    );
    const atGroupEnd = columnGroups.find(
      (group) => group.lastColumn === col.name,
    );
    if (atGroupEnd) {
      headers.push(
        <th
          key={atGroupEnd.name}
          colSpan={
            columns.findIndex((c) => c.name === atGroupEnd.lastColumn) -
            columns.findIndex((c) => c.name === atGroupEnd.firstColumn) +
            1
          }
          className="bg-kapiti text-white text-center pt-2 font-semibold text-lg"
        >
          {atGroupEnd.heading}
        </th>,
      );
      currentGroup = undefined;
    } else if (atGroupStart) currentGroup = atGroupStart.name;
    else if (!currentGroup || col === columns[columns.length - 1]) {
      headers.push(
        <th
          key={col.name}
          className="bg-kapiti text-white p-2 font-semibold"
        />,
      );
    }
  });

  return <>{headers}</>;
};

function DataTable<
  T extends DataValueType[][] | Record<string, DataValueType>[],
>({
  data,
  columns: columnProps,
  columnGroups = [],
  innerFilters = [],
  outerFilters = [],
  options = { complexFilter: false },
  onClearFilters = undefined,
}: DataTableProps<T>): React.ReactElement {
  const [hideFilters, setHideFilters] = React.useState(false);
  const [hideGroups, setHideGroups] = React.useState(false);
  const [columnGrouping, setColumnGrouping] = React.useState(columnGroups);

  const computedFilters = useMemo(() => {
    const filters = [...(outerFilters || []), ...(innerFilters || [])];
    const result: Record<string, unknown> = {};
    for (const filter of filters) {
      result[filter.name] = filter.currentValue;
    }
    return result;
  }, [
    JSON.stringify(outerFilters?.map((f) => [f.name, f.currentValue])),
    JSON.stringify(innerFilters?.map((f) => [f.name, f.currentValue])),
  ]);

  const { filterValues, setFilterValues, getFilterValue } =
    useFilterValues(computedFilters);

  // Normalize data to array of objects in case it has been passed as array of arrays
  // and an array of column descriptors
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

  // It is possible for the normalized table to transform into a comparison across dates or another column
  // This function does that to the normalized data
  const dataCompared = (
    input: Row[],
    columns: ColumnComparison,
  ): [Row[], ColumnDescriptor[], ColumnDescriptor[]] => {
    const resultMap = new Map<DataValueType, Row>();
    const resultColumns: Array<ColumnDescriptor> = [
      { ...fullColumnDescriptor(columns.keyColumn), visible: true },
    ];

    input.forEach(
      ({
        [columns.unzipColumn]: d,
        [columns.keyColumn]: k,
        [columns.compareColumn]: v,
      }) => {
        const unzipHeader =
          d && fullColumnDescriptor(columns.unzipColumn).type === 'date'
            ? dateString(d, true, 'lmy') || 'No date'
            : (d || 'No label').toString();

        const unzipName = (d || 'zzzzz').toString();

        if (!resultMap.has(k)) {
          resultMap.set(k, { [columns.keyColumn]: k });
        }

        resultMap.get(k)![unzipName] = v;

        if (!resultColumns.find((r: { name: string }) => r.name === unzipName))
          resultColumns.push({
            ...fullColumnDescriptor(columns.compareColumn),
            name: unzipName,
            heading: unzipHeader,
            visible: true,
          });
      },
    );

    setHideFilters(true);
    setHideGroups(false);

    // Key column is always first, then the rest are sorted alphabetically
    // we do this here because we need to know the last column name
    // for the column group
    const columnOrder = [
      fullColumnDescriptor(columns.keyColumn),
      ...resultColumns.slice(1).sort((a, b) => a.name.localeCompare(b.name)),
    ];

    // Add a column group for the comparison columns
    setColumnGrouping([
      {
        name: 'comparisonColumns',
        heading:
          'Compare ' + fullColumnDescriptor(columns.compareColumn).heading,
        firstColumn: columns.keyColumn,
        lastColumn: columnOrder[resultColumns.length - 1].name,
      },
    ]);

    return [Array.from(resultMap.values()), resultColumns, columnOrder];
  };

  // Analyse all column data including defaults, and hydrate and return full column descriptor
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
        bc: 'BC',
        pnrp: 'PNRP',
        unchanged: ['a', 'of'],
        area_id: 'Catchment',
      };

      return (
        _.get(special, name) ||
        name
          .replace(/_/g, ' ')
          .split(' ')
          .map(
            (word) =>
              _.get(special, word) ||
              word.charAt(0).toUpperCase() + word.slice(1),
          )
          .join(' ')
      );
    };

    const deriveAggFromType = (type: string) =>
      type === 'percent' ? 'percent' : 'sum';

    if (!col) return { name: 'unknown' };

    const base = typeof col === 'string' ? { name: col } : col!;
    const givenOptions = columnProps.find((c) => c.name === base.name) || {
      name: base.name,
    };

    base.heading = givenOptions.heading ?? deriveHeadingFromName(base.name);
    base.visible = givenOptions.visible ?? true;
    base.width = givenOptions.width || 'auto';
    base.type = givenOptions.type || deriveTypeFromFirstRecord(base.name);
    base.align = givenOptions.align || deriveAlignFromType(base.type);
    base.aggregateBy = givenOptions.aggregateBy || deriveAggFromType(base.type);
    base.total = () => columnAggregationFunctions.selectAndCalculate(base);
    base.formula = givenOptions.formula || undefined;
    base.valueOk = givenOptions.valueOk || [];
    base.scale = givenOptions.scale || undefined;
    base.scaleSymbol = givenOptions.scaleSymbol || undefined;
    base.comparisonOperators = givenOptions.comparisonOperators || undefined;

    return base;
  }

  // Use the above methods to prepare the data and columns,
  // normalizing the data and columns, and comparing if necessary
  const [rows, columns, visibleColumns] = useMemo(() => {
    const columns = data?.[0]
      ? Object.keys(data[0]).map((colName: string) =>
          fullColumnDescriptor(colName),
        )
      : [];
    const normalizedData = normalizeData(data, columns);

    if (options?.compare)
      return dataCompared(normalizedData, options.compare as ColumnComparison);

    return [
      normalizedData,
      columns,
      (options?.order || columns)
        .map((c) => fullColumnDescriptor(c))
        .filter((c) => c.visible ?? true),
      [columns],
    ];
  }, [data, options.compare, filterValues]);

  useEffect(() => {
    if (!options?.compare) {
      setHideFilters(false);
      setHideGroups(false);
      setColumnGrouping(columnGroups);
    }
  }, []);

  // Sort the data based on the sort options
  const sortArray = (
    data: Row[],
    sort: [{ [key: string]: 'asc' | 'desc' }?],
  ) => {
    return data.sort((a, b) => {
      for (const s of sort) {
        if (!s) continue;
        const key = Object.keys(s)[0];
        const direction = s[key];
        const aVal = a[key as keyof Row] ?? '';
        const bVal = b[key as keyof Row] ?? '';
        if (aVal === bVal) continue;
        if (direction === 'asc') return aVal > bVal ? 1 : -1;
        return aVal < bVal ? 1 : -1;
      }
      return 0;
    });
  };

  // Filter rows based on the inner filters
  // which are displayed in the table header
  const innerFiltersWithComplex = options?.complexFilter
    ? ([
        ...innerFilters,
        {
          name: 'complexFilter',
          type: ComplexFilter,
          currentValue: undefined,
          defaultValue: undefined,
          options: [],
          onChange: (v: unknown) => console.log('Selected:', v),
          data: data,
          columns: visibleColumns,
          fieldSupportsOperator:
            typeof options.complexFilter === 'object'
              ? options.complexFilter.fieldSupportsOperator
              : (op: ComparisonOperator, fieldName: string) =>
                  Array.isArray(
                    columns.find((c) => c.name === fieldName)
                      ?.comparisonOperators,
                  )
                    ? (
                        columns.find((c) => c.name === fieldName)!
                          .comparisonOperators as ComparisonOperator[]
                      ).includes(op)
                    : true,
          valueMatchesFilter: (row: unknown, filterValue: unknown) => {
            const values = filterValue as DataValueType[];
            const matchValue = (row as Row)[
              values[0] as string
            ] as DataValueType;

            if (values[1] === ComparisonOperator.EqualTo) {
              if (Array.isArray(values[2])) {
                return values[2].includes(matchValue);
              } else {
                return matchValue === values[2];
              }
            }

            if (values[1] === ComparisonOperator.NotEqualTo) {
              if (Array.isArray(values[2])) {
                return !values[2].includes(matchValue);
              } else {
                return matchValue !== values[2];
              }
            }

            if (!matchValue || !values[2]) return false;

            if (values[1] === ComparisonOperator.GreaterThan)
              return matchValue > values[2]!;
            if (values[1] === ComparisonOperator.LessThan)
              return matchValue < values[2]!;
            if (values[1] === ComparisonOperator.GreaterThanOrEqualTo)
              return matchValue >= values[2]!;
            if (values[1] === ComparisonOperator.LessThanOrEqualTo)
              return matchValue <= values[2]!;

            return false;
          },
        },
      ] as FilterDescriptor[])
    : innerFilters;

  const filteredData = useMemo(() => {
    return sortArray(
      rows.filter((row) =>
        innerFiltersWithComplex.every((filter) => {
          const value = getFilterValue(filter.name);
          if (value === undefined) return true;
          return filter.valueMatchesFilter
            ? filter.valueMatchesFilter(row as Row, value)
            : (row as Row)[filter.name] === value;
        }),
      ) as Row[],
      options.sort ?? [],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, outerFilters, innerFilters, filterValues]);

  // Define aggregation functions for column types
  // whose results are displayed in the footer of the table
  // sum: sums the values in the column
  // percent: calculates a percentage based on the formula
  // selectAndCalculate: selects the correct aggregation function (one of the above)
  // based on the column type
  const columnAggregationFunctions = {
    sum: (col: ColumnDescriptor): DataValueType => {
      return filteredData
        .reduce((total, row) => total + numValue(_.get(row, col.name)), 0)
        .toFixed(2);
    },

    percent: (col: ColumnDescriptor): DataValueType => {
      if (!col.formula) return '';
      const formulaArgs = (base: ColumnDescriptor) =>
        base.formula?.match(/\w+/g)?.slice(1) || [];

      const argNames = formulaArgs(fullColumnDescriptor(col));
      const argValues = argNames.map(
        (arg) => numValue(fullColumnDescriptor(arg).total?.()) ?? 0,
      );

      return calculate(
        fullColumnDescriptor(col),
        _.zipObject(argNames, argValues),
      );
    },

    selectAndCalculate: (c: ColumnNameOrDescriptor) => {
      const col = fullColumnDescriptor(c);
      if (col.aggregateBy === 'sum') return columnAggregationFunctions.sum(col);
      if (col.aggregateBy === 'percent')
        return columnAggregationFunctions.percent(col);
      return '';
    },
  };

  // Generate a filename for the downloaded CSV or PDF file
  // based on a queryKey property in the options object and the current date
  const queryKeyToFile = (
    date: Date,
    extension: string,
    prefix: string = '',
  ) => {
    const key = options?.queryKeys
      ? (options.queryKeys as unknown[])
          .map((k: unknown) => {
            if (typeof k !== 'string') {
              // @ts-ignore
              return k.toString();
            }
            return k;
          })
          .join('-')
      : '';

    const dateStr = date.toLocaleDateString();
    return `${prefix ? prefix + '-' : ''}${key}-${dateStr}.${extension}`;
  };

  const downloadCSV = () => {
    const csvData = filteredData.map((row) =>
      columns.map((c) => row[typeof c === 'string' ? c : c.name]),
    );
    const csv = Papa.unparse({
      fields: columns.map((c) => (typeof c === 'string' ? c : c.name)),
      data: csvData,
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    saveAs(blob, queryKeyToFile(new Date(), 'csv'));
  };

  function printPDF() {
    applyPlugin(jsPDF);
    const doc = new jsPDF();

    doc.addFileToVFS('OpenSans-Regular.ttf', OpenSansRegularBase64);
    doc.addFont('OpenSans-Regular.ttf', 'OpenSans', 'normal');
    doc.setFont('OpenSans', 'normal');

    const pdfData = filteredData.map((row) =>
      visibleColumns.map(
        (c) =>
          row[c.name]?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) ?? '',
      ),
    );

    const buildColumnStyles = () =>
      visibleColumns.reduce(
        (acc, columnKey, index) => {
          const detail = fullColumnDescriptor(columnKey);
          if (!detail) return acc;
          if (detail.type === 'number' || detail.type === 'percent')
            acc[index] = { halign: 'right' };
          return acc;
        },
        {} as Record<number, { halign: 'right' | 'left' | 'center' }>,
      );

    const tableConfig = {
      head: [visibleColumns.map((col) => col.heading || capitalise(col.name))],
      body: pdfData,
      styles: {
        font: 'OpenSans',
      },
      // @ts-ignore
      columnStyles: buildColumnStyles() as Object,
    };

    doc.autoTable(tableConfig);
    const dateStr = new Date().toLocaleDateString();
    doc.text(`Generated on: ${dateStr}`, 8, doc.internal.pageSize.height - 8);

    doc.save(queryKeyToFile(new Date(), 'pdf'));
  }

  return (
    <div className="data-table-container min-w-[639px] flex-col">
      {/* Outer filters & actions (eg, water type and month) */}
      <div
        className="flex pt-0 mt-0 pr-4 justify-between items-end flex-wrap"
        style={{ textAlign: 'unset' }}
      >
        <FilterPanel
          filters={outerFilters}
          filterValues={filterValues}
          setFilterValues={setFilterValues}
          onClose={onClearFilters}
          label="Show data for:"
          labelInline={false}
        />
        {data[0] && (
          <div className="action-buttons space-x-4 mb-4">
            <button onClick={downloadCSV}>Download</button>
            <button onClick={printPDF}>Print</button>
          </div>
        )}
      </div>

      {data[0] ? (
        <table className="table-auto border-collapse w-full">
          <thead>
            {/* Inner Filters */}
            {!hideFilters && (
              <tr>
                <th colSpan={99}>
                  <FilterPanel
                    className="bg-gray-300 p-4"
                    filters={innerFiltersWithComplex}
                    filterValues={filterValues}
                    setFilterValues={setFilterValues}
                    label={`Show ${options.rowObjectNamePlural || `rows`} where:`}
                  ></FilterPanel>
                </th>
              </tr>
            )}

            {/* Column groups */}
            {!hideGroups && (
              <tr>
                <ColumnGroupHeaders
                  columnGroups={columnGrouping}
                  columns={visibleColumns}
                />
              </tr>
            )}

            {/* Column headings */}
            <tr>
              {visibleColumns.map((col, colIndex) => (
                <th
                  key={col.name}
                  className={`${col.name} py-2 px-1 bg-kapiti font-semibold ${'text-' + (col.align ?? 'left')} text-white p-2 ${col.highlight?.('white')}`}
                >
                  {colIndex == 0 ? '' : col.heading}
                </th>
              ))}
            </tr>
          </thead>

          {/* Data */}
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? 'bg-gray-100' : ''}
              >
                {visibleColumns.map((col, colIndex) => (
                  <DataCell
                    key={col.name}
                    currentRow={row}
                    className={`${colIndex == 0 ? 'row-title font-bold' : 'data font-lighter border-gray-200 border-r-2 tracking-wider'} ${col.highlight?.('gray') ?? ''}`}
                    col={col}
                    value={row[col.name]}
                    ignoreFormula={true}
                  />
                ))}
              </tr>
            ))}
          </tbody>

          {/* Totals in footer */}
          <tfoot>
            {options?.includeTotals && (
              <tr className="font-medium bg-nui text-white">
                {visibleColumns.map((col, index: number) =>
                  index === 0 ? (
                    <td
                      key={col.name}
                      className={`py-2 px-4 w-[${col.width || 'auto'}]`}
                    >
                      {'Grand total'}
                    </td>
                  ) : (
                    <DataCell
                      key={col.name}
                      className={`${col.name} totals text-white ${col.highlight?.('white') ?? ''}`}
                      col={col}
                      value={col.total?.() ?? ''}
                    />
                  ),
                )}
              </tr>
            )}
          </tfoot>
        </table>
      ) : (
        <div className="font-bold ml-4 mt-2 text-lg text-nui-20">
          There is no data for these criteria
        </div>
      )}
    </div>
  );
}

export default DataTable;
