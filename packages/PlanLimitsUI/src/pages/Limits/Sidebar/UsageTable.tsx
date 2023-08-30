import { format } from 'date-fns';
import { useState } from 'react';
import { ResponsiveHeatMapCanvas, ComputedCell } from '@nivo/heatmap';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { sevenDaySWUsage, gwUsage } from '../../../api/mock-data';

type DisplayOptions = 'table' | 'sections';

export default function UsageTable({
  gwUnit,
  swUnit,
}: {
  gwUnit?: number;
  swUnit?: number;
}) {
  const [displayOption, setDisplayOption] = useState<DisplayOptions>('table');
  const [weekOffset, setWeekOffset] = useState(0);
  const usageData = {
    swUsage: sevenDaySWUsage(weekOffset, swUnit),
    gwUsage: gwUsage(gwUnit),
  };

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
        {displayOption === 'table' ? (
          <Table
            usageData={usageData}
            setWeekOffset={setWeekOffset}
            weekOffset={weekOffset}
          />
        ) : (
          <Sections />
        )}
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

function Table({ usageData, weekOffset, setWeekOffset }) {
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
        {usageData.swUsage && (
          <tr>
            <td className="border p-2 text-center bg-gray-100">SW</td>
            <td className="border p-2 text-center text-sm">
              {usageData.swUsage.allocation}
              <br />m<sup>3</sup>/day
            </td>
            <td className="border text-center p-0">
              <div className="flex flex-col">
                <div className="p-2 bg-gray-100 text-xs border-b">
                  Week ending {format(usageData.swUsage.end, 'do LLLL y')}
                </div>
                <div className="px-2 text-sm">
                  <HeatMap usageData={usageData.swUsage} />
                </div>
                <div className="w-full flex justify-between p-2 text-xs">
                  <button
                    className="underline"
                    onClick={() => setWeekOffset(weekOffset - 1)}
                  >
                    View earlier data
                  </button>

                  {weekOffset < 0 && (
                    <button
                      className="underline"
                      onClick={() => setWeekOffset(weekOffset + 1)}
                    >
                      View later data
                    </button>
                  )}
                </div>
              </div>
            </td>
          </tr>
        )}
        {usageData.gwUsage && (
          <tr>
            <td className="border p-2 text-center bg-gray-100">GW</td>
            <td className="border p-2 text-center text-sm">
              {usageData.gwUsage.allocation}
              <br />m<sup>3</sup>/year
            </td>
            <td className="border text-center p-0">
              <div className="flex flex-col">
                <div className="p-2 bg-gray-100 text-xs border-b">2023</div>
                <div className="p-2 text-sm">
                  {usageData.gwUsage.usage} m<sup>3</sup>/year
                  <br />
                  {usageData.gwUsage.percent}%
                </div>
              </div>
            </td>
          </tr>
        )}
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

function HeatMap({ usageData }) {
  return (
    <div className="h-16">
      <ResponsiveHeatMapCanvas
        tooltip={CustomTooltip}
        data={usageData.data}
        valueFormat={'=-0.0~%'}
        margin={{ top: 30, bottom: 0, left: 0 }}
        colors={{
          type: 'sequential',
          scheme: 'oranges',
          minValue: 0,
          maxValue: 1,
        }}
      />
    </div>
  );
}
const Total = 17842;
const formatNumber = Intl.NumberFormat();

const CustomTooltip = ({ cell }: { cell: ComputedCell<any> }) => {
  const usageValue = Math.round(Total * cell.value);
  return (
    <div className="bg-gray-500 text-white opacity-90 text-xs p-2 rounded shadow">
      {formatNumber.format(usageValue)} of 17,842 m<sup>3</sup>/day
    </div>
  );
};
