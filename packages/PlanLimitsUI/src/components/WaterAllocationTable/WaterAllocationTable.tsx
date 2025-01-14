import DataTable, {
  ColumnDescriptor,
  OuterFilter,
} from '@components/DataTable/DataTable';

import { useWaterAllocationQuery } from '@src/api';
import { useState } from 'react';
import { FilterDescriptor } from '@components/FilterPanel/FilterPanel';
import { MonthYearFilter } from '@components/FilterPanel/Filters/MonthYearFilter/MonthYearFilter';

export const WaterAllocationTable = ({ council  } : { council: Council }) => {
  const [ waterType, setWaterType ] = useState<string>('ground')
  const [ monthStart, setMonthStart ] = useState(new Date(2024, 10, 1))

  const tableData = (useWaterAllocationQuery(council.id, waterType, monthStart).data || []) as GroundwaterAllocation[] | SurfaceWaterAllocation[];

  const columns: ColumnDescriptor[] = [
    { name: 'plan_region_id', visible: false },
    { name: 'pnrp_allocation_percentage', type: 'percent', formula: 'percent(total_allocation, allocation_limit)' },
    { name: 'area_id', visible: false },
    { name: 'name', heading: 'Catchment' },
    { name: 'total_allocation', highlight: (c: string) => `border-r-2 border-l-2 border-${c}` },
  ];

  const outerFilters: FilterDescriptor[] = [
    {
      name: 'waterType',
      type: OuterFilter,
      currentValue: waterType,
      options: [{ label: 'Groundwater', value: 'ground' }, {label: 'Surface water', value: 'surface' }],
      onChange: (waterType) => setWaterType(waterType as string),
    },
    {
      name: 'month_start',
      type: MonthYearFilter,
      currentValue: monthStart,
      onChange: (ms => {console.log('outer onChange ms, monthStart: ', ms, monthStart); setMonthStart(ms as Date); })
    }
  ];

  return waterType === 'ground' ? (
    <DataTable<GroundwaterAllocation[]>
      data={tableData as GroundwaterAllocation[]}
      columns={columns}
      columnGroups={[
        { name: 'allocation', heading: 'Allocated amount - litres per second (L/sec)', firstColumn: 'category_b', lastColumn: 'pnrp_allocation_percentage' },
      ]}
      outerFilters={outerFilters}
      innerFilters={[]}
      options={{
        includeTotals: true,
        order: [
          "name",
          "month_start",
          "category_b",
          "category_bc",
          "category_c",
          "total_allocation",
          "allocation_limit",
          "pnrp_allocation_percentage"
        ]
      }}
    />
  ) : (
    <DataTable<SurfaceWaterAllocation[]>
      data={tableData as SurfaceWaterAllocation[]}
      columns={columns}
      columnGroups={[
        { name: 'allocation', heading: 'Allocated amount - litres per second (L/sec)', firstColumn: 'category_a', lastColumn: 'pnrp_allocation_percentage' },
      ]}
      outerFilters={outerFilters}
      innerFilters={[]}
      options={{
        includeTotals: true,
        order: [
          "name",
          "category_a",
          "category_b",
          "surface_take",
          "total_allocation",
          "allocation_limit",
          "pnrp_allocation_percentage",
        ]
      }}
    />
  );
};

export default WaterAllocationTable;
