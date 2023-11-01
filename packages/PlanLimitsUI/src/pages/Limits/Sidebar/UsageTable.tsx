import { useState } from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ResponsiveHeatMapCanvas, ComputedCell } from '@nivo/heatmap';
import useWaterUseData, {
  type SWAndGWHeatmapData,
} from '../../../lib/useWaterUseData';
import Button from '../../../components/Button';
import {
  LoadingIndicator,
  ErrorIndicator,
} from '../../../components/Indicators';

const MIN_OFFSET = -52;
const MAX_OFFSET = 0;
const formatNumber = Intl.NumberFormat();

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
  // TODO: Handle errors
  const handleUpdateDateOffset = (change: number) => {
    const updatedOffet = weekOffset + change;
    if (updatedOffet < MIN_OFFSET || updatedOffet > MAX_OFFSET) return;

    setWeekOffset(updatedOffet);
  };

  const waterUseData = useWaterUseData(
    council.id,
    appState.surfaceWaterSubUnitLimit?.sourceId || '',
    appState.groundWaterLimits.map((gwl) => gwl.sourceId),
    weekOffset,
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
          loadingError={Boolean(waterUseData.error)}
          data={waterUseData.data.usage}
          waterTakeFilter={waterTakeFilter}
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

function Table({
  loadingError,
  data,
  waterTakeFilter,
}: {
  loadingError: boolean;
  data?: SWAndGWHeatmapData;
  waterTakeFilter: WaterTakeFilter;
}) {
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
        {['Surface', 'Combined'].includes(waterTakeFilter) && (
          <tr className="h-18">
            <td className="border p-2 text-center bg-gray-100">SW</td>
            {!data && (
              <td
                rowSpan={waterTakeFilter === 'Surface' ? 1 : 2}
                className={`border text-center ${
                  waterTakeFilter === 'Surface' ? 'h-16' : 'h-32'
                }`}
              >
                {loadingError ? (
                  <ErrorIndicator>Error loading data</ErrorIndicator>
                ) : (
                  <LoadingIndicator />
                )}
              </td>
            )}
            {data && <UsageCell data={data.sw} />}
          </tr>
        )}
        {['Ground', 'Combined'].includes(waterTakeFilter) && (
          <tr>
            <td className="border p-2 text-center bg-gray-100">GW</td>
            {!data && waterTakeFilter === 'Ground' && (
              <td className="border text-center h-16">
                {loadingError ? (
                  <ErrorIndicator>Error loading data</ErrorIndicator>
                ) : (
                  <LoadingIndicator />
                )}
              </td>
            )}
            {data && <UsageCell data={data.gw} />}
          </tr>
        )}
      </tbody>
    </table>
  );
}

function UsageCell({ data }: { data: HeatmapData[] }) {
  if (data.length === 0) {
    return <td className="border text-center h-16">No data</td>;
  }
  return (
    <td className="border p-0">
      <HeatMap usage={data} />
    </td>
  );
}

function HeatMap({ usage }: { usage: HeatmapData[] }) {
  return (
    <div className="h-16">
      <ResponsiveHeatMapCanvas
        tooltip={CustomTooltip}
        data={usage}
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

const CustomTooltip = ({ cell }: { cell: ComputedCell<HeatmapDataItem> }) => {
  return (
    <div className="bg-gray-500 text-white opacity-90 text-xs p-2 rounded shadow">
      {formatNumber.format(cell.data.usage)} of{' '}
      {formatNumber.format(cell.data.allocation)} m<sup>3</sup>/day
    </div>
  );
};
