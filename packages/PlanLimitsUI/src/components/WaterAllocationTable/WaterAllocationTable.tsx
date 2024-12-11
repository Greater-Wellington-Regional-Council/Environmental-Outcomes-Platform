import React from 'react';
import DataTable, {
  ColumnDescriptor,
  DataValueType,
  FilterDescriptor,
  MonthYearFilter,
  SimpleFilter,
} from '@components/DataTable/DataTable';
import { isDate } from 'lodash';

export const WaterAllocationTable: React.FC = () => {
  const columns: ColumnDescriptor[] = [
    { name: 'catchment', heading: 'Catchment', type: 'string', visible: true, width: "20%" },
    { name: 'categoryA', heading: 'Category A', type: 'number', visible: true, aggregateBy: 'sum' },
    { name: 'categoryB', heading: 'Category B', type: 'number', visible: true, aggregateBy: 'sum' },
    { name: 'surfaceTake', heading: 'Surface Take', type: 'number', visible: true, aggregateBy: 'sum' },
    { name: 'totalAllocated', heading: 'Total Allocated', type: 'number', visible: true, aggregateBy: 'sum' },
    { name: 'allocationLimit', heading: 'Allocation Limit', type: 'number', visible: true, aggregateBy: 'sum' },
    { name: 'percentAllocated', heading: 'Percent Allocated', type: 'percent', visible: true, aggregateBy: 'percent', formula: 'percent(totalAllocated, allocationLimit)' },
    { name: 'notes', heading: 'Notes', type: 'string', visible: true },
    { name: 'date', heading: 'Date', type: 'date', visible: false },
  ];

  const data: DataValueType[][] = [
    [
      'BoothsSW', '-', 6.72, 77, 83.72, 25, 334.9, '-', new Date('2024-01-01')
    ],
    [
      'HuangaruaSW', '18.4', 23.6, 9, 51, 110, 46.4, '-', new Date('2024-01-01')
    ],
    [
      'Hutt_LowerSW', '-', 512.51, 66.4, 578.91, 2140, 113.5, 'The PNRP limit combines Hutt (Lower) and Hutt (Upper)', new Date('2024-01-01')
    ],
    [
      'Hutt_UpperSW', '-', '-', 1850, 1850, 'See above', 'See above', '-', new Date('2024-01-01')
    ],
    [
      'Ruamahanga_LowerSW', 659.93, 176, 1045.8, 1881.73, 1370, 137.4, '-', new Date('2024-01-01')
    ],
    [
      'Ruamahanga_MiddleSW', 798.23, '-', 259.4, 1057.63, 1240, 85.3, 'Allocation includes ____ and ____ catchment management sub-units', new Date('2024-01-01')
    ],
    [
      'Ruamahanga_UpperSW', 221.01, 50.6, 481.51, 753.12, 1200, 62.8, '-', new Date('2024-01-01')
    ],
  ];

  const columnGroups = [
    { name: 'allocation', heading: 'Allocated amount - litres per second (L/sec)', firstColumn: 'categoryA', lastColumn: 'percentAllocated' },
  ];

  const outerFilters: FilterDescriptor[] = [
    {
      name: 'date',
      type: MonthYearFilter,
      columns: ['date'],
      valueMatchesFilter: (value: unknown, filterValue: unknown) => {
        if (!isDate(value) || !isDate(filterValue)) {
          return false;
        }
        return value.getFullYear() === filterValue.getFullYear() && value.getMonth() === filterValue.getMonth()
      }
    }
  ];

  const innerFilters: FilterDescriptor[] = [
    {
      name: 'catchment',
      type: SimpleFilter,
      columns: ['catchment'],
      options: data.map(row => row[0]),
    }
  ];

  return <DataTable data={data} columns={columns} columnGroups={columnGroups} outerFilters={outerFilters} innerFilters={innerFilters} options={{includeTotals: true}}/>;
};

export default WaterAllocationTable;
