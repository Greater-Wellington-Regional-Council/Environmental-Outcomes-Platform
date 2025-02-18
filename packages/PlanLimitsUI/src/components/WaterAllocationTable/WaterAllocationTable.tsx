import DataTable, {
  ColumnDescriptor, DataValueType,
  OuterFilter,
} from '@components/DataTable/DataTable';

import { useWaterAllocationQuery, WaterType } from '@src/api';
import { useState, useMemo } from 'react';
import { FilterDescriptor } from '@components/FilterPanel/FilterPanel';
import { MonthYearFilter } from '@components/FilterPanel/Filters/MonthYearFilter/MonthYearFilter';
import numValue from '@lib/numValue';

export const WaterAllocationTable = ({ council }: { council: Council }) => {
  const DEFAULT_MONTHS = [new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)]

  const [waterType, setWaterType] = useState<WaterType>('ground');
  const [monthStart, setMonthStart] = useState(DEFAULT_MONTHS);
  const [compareColumn, setCompareColumn] = useState('pnrp_allocation_percentage');

  const tableData = (useWaterAllocationQuery(council.id, waterType, monthStart).data || []) as GroundwaterAllocation[] | SurfaceWaterAllocation[];

  const columns: ColumnDescriptor[] = [
    { name: 'plan_region_id', visible: false },
    {
      name: 'pnrp_allocation_percentage', type: 'percent', formula: 'percent(total_allocation, allocation_limit)',
      valueOk: [(value: DataValueType) => numValue(value) <= 100],
    },
    { name: 'area_id', visible: false },
    { name: 'name', heading: 'Catchment' },
    { name: 'allocation_limit', scale: 3, scaleSymbol: 'k' },
    { name: 'total_allocation', highlight: (c: string) => `border-r-2 border-l-2 border-${c}` },
    { name: 'month_start',visible: false },
  ];

  const getColumnGroups = (waterType: string) => {
    return waterType === 'ground'
      ? [{
        name: 'allocation',
        heading: 'Allocated amount - litres per second (L/sec)',
        firstColumn: 'category_b',
        lastColumn: 'total_allocation',
      }]
      : [{
        name: 'allocation',
        heading: 'Allocated amount - litres per second (L/sec)',
        firstColumn: 'category_a',
        lastColumn: 'total_allocation',
      }];
  };

  const getOrder = (waterType: string) => {
    return waterType === 'ground'
      ? ['name', 'category_b', 'category_bc', 'category_c', 'total_allocation', 'allocation_limit', 'pnrp_allocation_percentage']
      : ['name', 'category_a', 'category_b', 'surface_take', 'total_allocation', 'allocation_limit', 'pnrp_allocation_percentage'];
  };

  let outerFilters: FilterDescriptor[] = useMemo(() => {
    const filters = [{
      name: 'waterType',
      type: OuterFilter,
      currentValue: waterType,
      options: [{ label: 'Groundwater', value: 'ground' }, { label: 'Surface water', value: 'surface' }],
      onChange: (waterType: WaterType) => setWaterType(waterType as WaterType),
      suppressSelectAll: true,
      className: 'pl-0 pr-0',
    },
      {
        name: 'month_start',
        type: MonthYearFilter,
        currentValue: monthStart,
        onChange: ((ms: Date[]) => {
          setMonthStart(ms as Date[]);
        }),
        label: 'from:',
        className: 'pl-0',
        multiSelect: true,
        useModifierKeys: true
      },
    ] as unknown as FilterDescriptor[];

    if (compareColumn && tableData && monthStart.length > 1)
      filters.push({
          name: 'compare',
          type: OuterFilter,
          currentValue: compareColumn,
          options: getOrder(waterType).filter(c => !['name'].includes(c)).map(c => ({ label: c, value: c })),
          onChange: (compareCol: unknown) => setCompareColumn(compareCol as string),
          suppressSelectAll: true,
          className: 'pl-0 pr-0',
          label: 'Compare',
        });

    return filters;
  }, [monthStart, waterType, compareColumn, tableData]);

  return (
    <DataTable<any>
      data={tableData}
      columns={columns}
      columnGroups={getColumnGroups(waterType)}
      outerFilters={outerFilters}
      innerFilters={[]}
      options={{
        includeTotals: false,
        order: getOrder(waterType),
        rowObjectNamePlural: 'catchments',
        sort: [{ name: 'asc' }],
        queryKeys: [
          waterType,
          'allocations',
          council.slug,
          (monthStart.length > 1 ? `compare-${compareColumn}-` : 'from-') +
            monthStart.at(0)?.toLocaleDateString('en-US', {
              month: 'short',
              year: '2-digit',
          }).replace(' ', '-'),
        ],
        compare: monthStart.length > 1 && {
          unzipColumn: 'month_start',
          keyColumn: 'name',
          compareColumn: compareColumn,
        },
      }}
  />
  );
};


export default WaterAllocationTable;
