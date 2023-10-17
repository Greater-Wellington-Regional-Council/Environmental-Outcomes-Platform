import { useState } from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ResponsiveHeatMapCanvas, ComputedCell } from '@nivo/heatmap';
import useWaterUseData from '../../../lib/useWaterUseData';
import Button from '../../../components/Button';
import { LoadingIndicator } from '../../../components/Indicators';

const MIN_OFFSET = -52;
const MAX_OFFSET = 0;

type Props = {
  waterTakeFilter: WaterTakeFilter;
  appState: AppState;
  council: Council;
};
export default function UsageTable({
  council,
  appState,
  waterTakeFilter,
}: Props) {
  const [weekOffset, setWeekOffset] = useState(0);

  // TODO: Handle button thrashing for slow queries....
  const handleUpdateDateOffset = (change: number) => {
    const updatedOffet = weekOffset + change;
    if (updatedOffet < MIN_OFFSET || updatedOffet > MAX_OFFSET) return;
    setWeekOffset(updatedOffet);
  };

  const waterUseData = useWaterUseData(
    council.id,
    appState.surfaceWaterSubUnitLimit?.sourceId || '',
    appState.groundWaterLimits.map((gwl) => gwl.sourceId),
    weekOffset
  );

  return (
    <>
      <h3 className="text-lg uppercase mb-2 tracking-wider">Usage</h3>
      <div className="flex justify-between mb-4">
        <div className="text-sm">
          For week ending {format(waterUseData.data.to, 'do LLLL y')}
        </div>
        <div className="text-xs">
          <Button
            className="mr-4"
            color="secondary"
            size="xs"
            disabled={weekOffset < MIN_OFFSET}
            onClick={() => handleUpdateDateOffset(-1)}
          >
            ← Earlier data
          </Button>
          <Button
            color="secondary"
            size="xs"
            disabled={weekOffset >= MAX_OFFSET}
            onClick={() => handleUpdateDateOffset(1)}
          >
            Later data →
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Table
          to={waterUseData.data.to}
          setWeekOffset={setWeekOffset}
          weekOffset={weekOffset}
          usage={waterUseData.data.usage}
        />
      </div>

      <a
        href="usage"
        className="text-sm underline block mb-2"
        target="_blank"
        rel="noreferrer"
      >
        View more detailed usage
        <ArrowTopRightOnSquareIcon className="h-4 inline pl-1 align-text-bottom" />
      </a>
    </>
  );
}

function Table({ to, weekOffset, setWeekOffset, usage }) {
  return (
    <table className="border-collapse w-full">
      <thead>
        <tr>
          <th className="w-12"></th>
          <th className="border p-2 text-sm font-normal bg-gray-100">
            Water Use
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="h-18">
          <td className="border p-2 text-center bg-gray-100">SW</td>
          {usage && (
            <td className="border p-0">
              <HeatMap data={usage.swHeatmapData} />
            </td>
          )}

          {!usage && (
            <td className="border text-center h-16">
              <LoadingIndicator />
            </td>
          )}
        </tr>
        <tr>
          <td className="border p-2 text-center bg-gray-100">GW</td>
          <td className="border"></td>
        </tr>
      </tbody>
    </table>
  );
}

function HeatMap({ data }) {
  return (
    <div className="h-16">
      <ResponsiveHeatMapCanvas
        tooltip={CustomTooltip}
        data={data}
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
