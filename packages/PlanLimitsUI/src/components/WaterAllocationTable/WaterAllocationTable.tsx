import React from 'react';
import DataTable, {
  ColumnDescriptor, DataValueType,
  FilterDescriptor,
  MonthYearFilter,
  SimpleFilter,
} from '@components/DataTable/DataTable';
import { isDate } from 'lodash';
import { useGroundwaterAllocationQuery } from '@src/api';
import { data } from 'autoprefixer';

export const WaterAllocationTable: React.FC = (councilId: number) => {
  const columns: ColumnDescriptor[] = [
    { name: 'catchment', heading: 'Catchment', type: 'string', width: "20%" },
    { name: 'categoryA', heading: 'Category A', type: 'number' },
    { name: 'categoryB', heading: 'Category B', type: 'number' },
    { name: 'surfaceTake', heading: 'Surface Take', type: 'number' },
    { name: 'totalAllocated', heading: 'Total Allocated', type: 'number' },
    { name: 'allocationLimit', heading: 'Allocation Limit', type: 'number' },
    { name: 'percentAllocated', heading: 'Percent Allocated', type: 'percent', formula: 'percent(totalAllocated, allocationLimit)' },
    { name: 'notes', heading: 'Notes', type: 'string' },
    { name: 'date', heading: 'Date', type: 'date', visible: false },
  ];

  function useGroundwaterAllocationData(councilId: number) {
    return useGroundwaterAllocationQuery(councilId);
  }

  const tableData: GroundwaterAllocation[] = useGroundwaterAllocationData(councilId);

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

  return <DataTable
    data={tableData.map(gwa => [
      gwa.name,
      gwa.categoryA,
      gwa.categoryB,
      gwa.surfaceTake,
      gwa.totalAllocated,
      gwa.allocationLimit,
      gwa.pnrpAllocationPercentage,
      gwa.notes,
      gwa.monthStart,
    ] as DataValueType[]) as DataValueType[][]}
    columns={columns}
    columnGroups={columnGroups}
    outerFilters={outerFilters}
    innerFilters={innerFilters}
    options={{includeTotals: true}}
  />;
};

export default WaterAllocationTable;
