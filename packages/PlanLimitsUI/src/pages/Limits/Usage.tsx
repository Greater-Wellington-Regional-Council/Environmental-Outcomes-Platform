import { useState } from 'react';
import clsx from 'clsx';
import { ResponsiveHeatMapCanvas, ComputedCell } from '@nivo/heatmap';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

type DisplayOptions = 'table' | 'sections';

const TestData = [
  {
    id: 'Usage',
    data: [
      {
        x: 'Sun',
        y: 0.1,
      },
      {
        x: 'Mon',
        y: 0.3,
      },
      {
        x: 'Tue',
        y: 0.4,
      },
      {
        x: 'Wed',
        y: 0.6,
      },
      {
        x: 'Thu',
        y: 0.4,
      },
      {
        x: 'Fri',
        y: 0.2,
      },
      {
        x: 'Sat',
        y: 0.8,
      },
    ],
  },
];

export default function Usage() {
  const [displayOption, setDisplayOption] = useState<DisplayOptions>('table');

  return (
    <>
      <h3 className="text-lg uppercase mb-2 tracking-wider">Usage</h3>
      {/* <div className="mb-4">
        Show as:
        <button
          className={clsx('mx-2', displayOption === 'table' && 'font-bold')}
          onClick={() => setDisplayOption('table')}
        >
          Table
        </button>
        |
        <button
          className={clsx('mx-2', displayOption === 'sections' && 'font-bold')}
          onClick={() => setDisplayOption('sections')}
        >
          Sections
        </button>
      </div> */}
      <div className="mb-4">
        {displayOption === 'table' ? <Table /> : <Sections />}
      </div>
      <a
        href="usage"
        className="text-sm underline block mb-2"
        target="_blank"
        rel="noreferrer"
      >
        View more detailed SW usage
        <ArrowTopRightOnSquareIcon className="h-4 inline pl-1 align-text-bottom" />
      </a>
    </>
  );
}

function Table() {
  return (
    <table className="border-collapse w-full">
      <thead>
        <tr>
          <th className=""></th>
          <th className="border p-2 text-sm font-normal bg-gray-100 w-32">
            Consented Allocation
          </th>
          <th className="border p-2 text-sm font-normal bg-gray-100">
            Water Use
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-2 text-center bg-gray-100">SW</td>
          <td className="border p-2 text-center text-sm">
            17,842
            <br />m<sup>3</sup>/day
          </td>
          <td className="border text-center p-0">
            <div className="flex flex-col">
              <div className="p-2 bg-gray-100 text-xs border-b">
                Past 7 days
              </div>
              <div className="p-2 text-sm">
                <HeatMap />
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td className="border p-2 text-center bg-gray-100">GW</td>
          <td className="border p-2 text-center text-sm">
            40,000
            <br />m<sup>3</sup>/day
          </td>
          <td className="border text-center p-0">
            <div className="flex flex-col">
              <div className="p-2 bg-gray-100 text-xs border-b">2023</div>
              <div className="p-2 text-sm">
                20,000 m<sup>3</sup>/year
                <br />
                50%
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function Sections() {
  return (
    <>
      <h4 className="font-semibold">Surface water</h4>
      Consented: 17,842 m3 / day Usage: 20,842 m3 / day
      <h4 className="font-semibold">Groundwater</h4>
      Consented: 40,000 m3/year Usage: 20,000 m3/year 50%
    </>
  );
}

function HeatMap() {
  return (
    <div className="h-16">
      <ResponsiveHeatMapCanvas
        tooltip={CustomTooltip}
        data={TestData}
        valueFormat={'=-0.0~%'}
        margin={{ top: 30, bottom: 0, left: 0 }}
        colors={{
          type: 'sequential',
          scheme: 'oranges',
        }}
      />
    </div>
  );
}
const Total = 17842;
const format = Intl.NumberFormat();

const CustomTooltip = ({ cell }: { cell: ComputedCell<any> }) => {
  const usageValue = Math.round(Total * cell.value);
  return (
    <div className="bg-gray-500 text-white opacity-90 text-xs p-2 rounded shadow">
      <strong>{format.format(usageValue)}</strong> used of 17,842m<sup>3</sup>
      /day
    </div>
  );
};
