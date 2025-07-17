import { useState } from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import {
  ResponsiveHeatMapCanvas,
  ComputedCell,
  type CellCanvasRendererProps,
  type HeatMapDatum,
} from '@nivo/heatmap';
import useWaterUseData, {
  type SWAndGWHeatmapData,
} from '../../../lib/useWaterUseData';
import Button from '../../../components/Button';
import { LoadingIndicator, ErrorIndicator } from '@components/Indicators';

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

  const handleUpdateDateOffset = (change: number) => {
    const updatedOffet = weekOffset + change;
    if (updatedOffet < MIN_OFFSET || updatedOffet > MAX_OFFSET) return;

    setWeekOffset(updatedOffet);
  };

  const swAreaId = appState.surfaceWaterSubUnitLimit
    ? appState.surfaceWaterSubUnitLimit.sourceId
    : appState.surfaceWaterUnitLimit?.sourceId || '';

  const waterUseData = useWaterUseData(
    council.id,
    swAreaId,
    appState.groundWaterLimits.map((gwl) => gwl.sourceId),
    weekOffset,
  );

  return (
    <>
      <h3 className="text-lg uppercase mb-2 tracking-wider">Water Use</h3>
      <p className="mb-2">
        The data below <strong>is not all Water Use data</strong> supplied to
        Greater Wellington. It only includes data provided using timely
        automated telemetered systems.
      </p>
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
        href={`/limits/${council.slug}/usage`}
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
            % of Consented Water Used
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
        renderCell={renderRect}
        valueFormat={'=-0.0~%'}
        margin={{ top: 30, bottom: 0, left: 0 }}
        colors={{
          type: 'sequential',
          scheme: 'oranges',
          minValue: 0,
          maxValue: 1,
        }}
        borderWidth={1}
        emptyColor={'#fff'}
      />
    </div>
  );
}

const CustomTooltip = ({
  cell,
}: {
  cell: ComputedCell<DailyUsageHeatmapDataItem>;
}) => {
  return (
    <div className="bg-gray-500 text-white opacity-90 text-xs p-2 rounded shadow text-center">
      <>
        <div>
          Usage:{' '}
          {cell.data.usage !== null ? (
            <>
              {formatNumber.format(cell.data.dailyUsage)}m<sup>3</sup>/day
            </>
          ) : (
            'No data'
          )}
        </div>
        <div>
          Measured Allocation:{' '}
          {cell.data.allocation !== null ? (
            <>
              {formatNumber.format(cell.data.allocationDailyUsed)}m<sup>3</sup>
              /day
            </>
          ) : (
            'No data'
          )}
        </div>
        <div>
          Allocation Total:{' '}
          {cell.data.allocation !== null ? (
            <>
              {formatNumber.format(cell.data.allocationDaily)}m<sup>3</sup>/day
            </>
          ) : (
            'No data'
          )}
        </div>
      </>
    </div>
  );
};

// Copied from https://github.com/plouc/nivo/blob/6dc6636cb64135104264547f05a3f44c787c6508/packages/heatmap/src/canvas.tsx
// so we can customise as needed
export const renderRect = <Datum extends HeatMapDatum>(
  ctx: CanvasRenderingContext2D,
  {
    cell: {
      x,
      y,
      data,
      width,
      height,
      color,
      borderColor,
      opacity,
      labelTextColor,
      label,
    },
    borderWidth,
    enableLabels,
    theme,
  }: CellCanvasRendererProps<Datum>,
) => {
  ctx.save();
  ctx.globalAlpha = opacity;

  ctx.fillStyle = color;
  if (borderWidth > 0) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
  }

  ctx.fillRect(x - width / 2, y - height / 2, width, height);
  if (borderWidth > 0) {
    ctx.strokeRect(x - width / 2, y - height / 2, width, height);
  }

  if (enableLabels) {
    ctx.fillStyle = labelTextColor;
    ctx.font = `${
      theme.labels.text.fontWeight ? `${theme.labels.text.fontWeight} ` : ''
    }${theme.labels.text.fontSize}px ${theme.labels.text.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(data.y !== null ? label : 'No data', x, y);
  }

  ctx.restore();
};
