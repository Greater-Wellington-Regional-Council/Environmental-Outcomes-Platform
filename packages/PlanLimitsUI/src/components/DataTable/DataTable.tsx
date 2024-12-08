import './DataTable.scss';
import React, { useState } from 'react';
import Dropdown from '@components/Dropdown/Dropdown';
import 'react-dropdown/style.css';
import 'react-datepicker/dist/react-datepicker.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import MonthYearPicker from '@components/MonthYearPicker';
import XToClose from '@components/XToClose/XToClose';

type TableRow = {
  id: number;
  catchment: string;
  categoryA: string;
  categoryB: string;
  surfaceTake: number;
  totalAllocated: number;
  allocationLimit: number | string;
  percentAllocated: number | string;
  notes: string;
  date: Date;
};


declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      head: Array<Array<string | { content: string; styles?: object }>>;
      body: Array<Array<string | number>>;
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

const DataTable: React.FC = () => {
  const [data] = useState<TableRow[]>([
    {
      id: 1,
      catchment: 'BoothsSW',
      categoryA: '-',
      categoryB: '6.72',
      surfaceTake: 77,
      totalAllocated: 83.72,
      allocationLimit: 25,
      percentAllocated: 334.9,
      notes: '-',
      date: new Date('2024-01-01'),
    },
    {
      id: 2,
      catchment: 'HuangaruaSW',
      categoryA: '18.4',
      categoryB: '23.6',
      surfaceTake: 9,
      totalAllocated: 51,
      allocationLimit: 110,
      percentAllocated: 46.4,
      notes: '-',
      date: new Date('2024-01-01'),
    },
    {
      id: 3,
      catchment: 'Hutt_LowerSW',
      categoryA: '-',
      categoryB: '512.51',
      surfaceTake: 66.4,
      totalAllocated: 578.91,
      allocationLimit: 2140,
      percentAllocated: 113.5,
      notes: 'The PNRP limit combines Hutt (Lower) and Hutt (Upper)',
      date: new Date('2024-01-01'),
    },
    {
      id: 4,
      catchment: 'Hutt_UpperSW',
      categoryA: '-',
      categoryB: '-',
      surfaceTake: 1850,
      totalAllocated: 1850,
      allocationLimit: 'See above',
      percentAllocated: 'See above',
      notes: '-',
      date: new Date('2024-01-01'),
    },
    {
      id: 5,
      catchment: 'Ruamahanga_LowerSW',
      categoryA: '659.93',
      categoryB: '176',
      surfaceTake: 1045.8,
      totalAllocated: 1881.73,
      allocationLimit: 1370,
      percentAllocated: 137.4,
      notes: '-',
      date: new Date('2024-01-01'),
    },
    {
      id: 6,
      catchment: 'Ruamahanga_MiddleSW',
      categoryA: '798.23',
      categoryB: '-',
      surfaceTake: 259.4,
      totalAllocated: 1057.63,
      allocationLimit: 1240,
      percentAllocated: 85.3,
      notes: 'Allocation includes ____ and ____ catchment management sub-units',
      date: new Date('2024-01-01'),
    },
    {
      id: 7,
      catchment: 'Ruamahanga_UpperSW',
      categoryA: '221.01',
      categoryB: '50.6',
      surfaceTake: 481.51,
      totalAllocated: 753.12,
      allocationLimit: 1200,
      percentAllocated: 62.8,
      notes: '-',
      date: new Date('2024-01-01'),
    },
  ]);

  const [month, setMonth] = useState<Date | null>(null);
  const [filterColumn1, setFilterColumn1] = useState<string | null>(null);
  const [waterType, setWaterType] = useState<string | null>("Surface water");

  const SELECT_ALL = '(All)';

  const filteredData = () => {
    let filtered = data;

    if (filterColumn1 === SELECT_ALL) setFilterColumn1(null);

    if (filterColumn1 && filterColumn1 !== SELECT_ALL) {
      filtered = filtered.filter((row) => row.catchment === filterColumn1);
    }

    if (month) {
      filtered = filtered.filter(
        (row) =>
          row.date.getMonth() === month.getMonth() &&
          row.date.getFullYear() === month.getFullYear(),
      );
    }

    return filtered;
  };

  function isNumber(value: unknown): boolean {
    return typeof value === 'number' && !Number.isNaN(value);
  }

  const grandTotal = (column: keyof TableRow): string =>
    filteredData().reduce(
      (total, row) => total + (isNumber(row[column]) ? (row[column] as number) : 0),
      0,
    ).toFixed(3);

  const downloadCSV = () => {
    const csv = Papa.unparse(filteredData());
    console.log(csv);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'filtered_data.csv');
  };

  const printPDF = () => {
    const doc = new jsPDF();
    doc.text('Filtered Data', 10, 10);
    doc.autoTable({
      head: [
        ['Catchment', 'Category A', 'Category B', 'Surface Take', 'Total Allocated', 'Allocation Limit', 'Percent Allocated', 'Notes'],
      ],
      body: filteredData().map((row) => [
        row.catchment,
        row.categoryA,
        row.categoryB,
        row.surfaceTake,
        row.totalAllocated,
        row.allocationLimit,
        row.percentAllocated,
        row.notes,
      ]),
    });
    doc.save('filtered_data.pdf');
  };

  const tdClass = 'text-right p-2 text';
  const thClass = 'bg-kapiti text-right text-white p-2 font-medium';

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="text-gray-700 font-bold w-full pt-3 pb-1">Show data for:</label>

      {/* High level filters - left aligned */}
      <div className="flex justify-between items-center mt-2 mb-6">
        <div className="flex space-x-4">
          <Dropdown
            options={['Surface water', 'Groundwater']}
            onChange={(e) => setWaterType(e)}
            value={waterType || ''}
            placeholder="Water type"
            dataTestid={'dropdown-water-types'}
          />
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="text-gray-700 font-bold pt-3">From:</label>
          <MonthYearPicker
            onChange={(date) => setMonth(date as Date)}
            current={month || undefined}
          />
          <XToClose onClick={() => setMonth(null)} />
        </div>

        {/* Buttons (Right-Aligned) */}
        <div className="space-x-4">
          <button
            onClick={downloadCSV}
            className=""
          >
            Download
          </button>
          <button
            onClick={printPDF}
            className=""
          >
            Print
          </button>
        </div>
      </div>

      <Dropdown
        options={[SELECT_ALL, 'BoothsSW', 'HuangaruaSW', 'Hutt_LowerSW', 'Hutt_UpperSW', 'Ruamahanga_LowerSW', 'Ruamahanga_MiddleSW', 'Ruamahanga_UpperSW']}
        onChange={(e) => setFilterColumn1(e)}
        value={filterColumn1 || ''}
        placeholder="Filter catchments"
        controlClassName="absolute bg-white top-6 left-4 w-[180px]"
        dropdownClassName="absolute top-16 w-[160px] ml-4"
      />

      <table className="table-auto border-collapse w-full text-left">
        <thead>

        <tr className="bg-kapiti text-white">
          <th />
          <th colSpan={4} className="text-center bg-kapiti pt-2">
            Allocated amount - litres per second (L/sec)
          </th>
          <th colSpan={1} className="text-center bg-kapiti border-white border-r-2 border-l-2" />
          <th colSpan={1} className="text-center bg-kapiti" />
          <th></th>
        </tr>

        <tr className="bg-kapiti text-white">
          <th className={thClass}></th>
          <th className={thClass}>Category A</th>
          <th className={thClass}>Category B</th>
          <th className={thClass}>Surface Take</th>
          <th className={thClass}>Total Allocated</th>
          <th className={thClass + ' border-white border-r-2 border-l-2'}>Allocation Limit</th>
          <th className={thClass}>Percent Allocated</th>
          <th className={'text-left'}>Notes</th>
        </tr>

        </thead>

        <tbody>

        {filteredData().map((row, index) => (
          <tr key={row.id} className={'p-1 ' + (index % 2 === 0 ? 'bg-gray-100' : '')}>
            <td className="font-semibold pl-2 w-[18%]">{row.catchment}</td>
            <td className={tdClass}>{row.categoryA}</td>
            <td className={tdClass}>{row.categoryB}</td>
            <td className={tdClass}>{row.surfaceTake}</td>
            <td className={tdClass}>{row.totalAllocated}</td>
            <td className={tdClass + ' border-r-2 border-l-2 border-gray-300'}>{row.allocationLimit}</td>
            <td className={tdClass}>{row.percentAllocated}</td>
            <td className={'text-left font-normal text-sm w-[25%]'}>{row.notes}</td>
          </tr>
        ))}

        </tbody>

        {/* Grand Total */}
        <tfoot>
        <tr className="font-medium bg-nui text-white">
          <td className={'text-left pl-2'}>Grand Total</td>
          <td className={tdClass}>{grandTotal('categoryA')}</td>
          <td className={tdClass}>{grandTotal('categoryB')}</td>
          <td className={tdClass}>{grandTotal('surfaceTake')}</td>
          <td className={tdClass}>{grandTotal('totalAllocated')}</td>
          <td className={tdClass + 'border-white border-r-2 border-l-2'}>{grandTotal('allocationLimit')}</td>
          <td className={tdClass}>{grandTotal('percentAllocated')}</td>
          <td className={tdClass}>{}</td>
        </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default DataTable;

