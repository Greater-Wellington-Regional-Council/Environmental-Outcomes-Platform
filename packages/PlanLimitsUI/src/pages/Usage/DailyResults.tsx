import { round } from 'lodash';
import { format, getWeekOfMonth } from 'date-fns';
import {
  ResponsiveHeatMapCanvas,
  type ComputedCell,
  type CellCanvasRendererProps,
  type HeatMapDatum,
} from '@nivo/heatmap';
import type {
  GroupedWaterUseData,
  DailyHeatmapData,
} from '../../lib/useDetailedWaterUseData';

interface Props {
  data: GroupedWaterUseData;
  from: string;
  to: string;
}
const formatNumber = Intl.NumberFormat();

export default function DailyResults({ data }: Props) {
  console.log(data);
  return (
    <>
      <h2 className="text-xl mb-2">Daily usage grouped by area</h2>
      {data.groups.map((usageGroup) => {
        return (
          <div key={usageGroup.name} className="my-6 border-b">
            {!usageGroup.hideLabel ? (
              <h2 className="text-lg mb-2">{usageGroup.name}</h2>
            ) : (
              <></>
            )}
            <div>
              {usageGroup.dailyData.map((dailyData) => {
                return (
                  <div key={dailyData.areaId} className="mb-6">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <h3
                          id={`daily-usage-${dailyData.areaId}`}
                          className="mb-2"
                        >
                          Daily usage for {dailyData.areaId}
                        </h3>
                      </div>
                      <a
                        className="underline text-xs mr-16"
                        href={`#weekly-usage-${usageGroup.name}`}
                      >
                        ↑ Back to top
                      </a>
                    </div>
                    <HeatmapResult dailyData={dailyData} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

function HeatmapResult({ dailyData }: { dailyData: DailyHeatmapData }) {
  return (
    <div className="h-48">
      <ResponsiveHeatMapCanvas
        data={dailyData.data}
        enableLabels={false}
        renderCell={renderRect}
        tooltip={CustomTooltip}
        forceSquare={true}
        margin={{
          top: 0,
          right: 50,
          bottom: 25,
          left: 130,
        }}
        colors={{
          type: 'sequential',
          scheme: 'oranges',
          minValue: 0,
          maxValue: 1,
        }}
        borderWidth={1}
        borderColor={'#ddd'}
        emptyColor={'#fff'}
        axisLeft={{
          tickSize: 0,
        }}
        axisTop={{
          tickSize: 0,
          format: (endOfWeekAsJSONDate: string) => {
            const date = new Date(endOfWeekAsJSONDate);
            const weekOfMonth = getWeekOfMonth(date);
            return weekOfMonth === 1 ? format(date, 'MMM') : '';
          },
        }}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            translateY: 35,
            title: 'Daily usage (%) →',
            length: 300,
            titleOffset: 5,
            titleAlign: 'middle',
            thickness: 10,
            tickFormat: '=-0~%',
          },
        ]}
      />
    </div>
  );
}

function CustomTooltip({
  cell,
}: {
  cell: ComputedCell<DailyUsageHeatmapDataItem>;
}) {
  return (
    <div className="bg-gray-500 text-white opacity-90 text-xs p-2 rounded shadow">
      {cell.data.y === null && <strong>No data</strong>}

      {cell.data.y !== null && (
        <>
          <div className="font-semibold">
            {format(cell.data.date, 'EEEE do MMMM yyyy')}
          </div>
          <div>
            Usage:{' '}
            <span className="font-semibold">
              {round(cell.data.y * 100, 1)}% (
              {formatNumber.format(cell.data.usage)} of{' '}
              {formatNumber.format(cell.data.allocation)} m<sup>3</sup>/day)
            </span>
          </div>
        </>
      )}
    </div>
  );
}

// Copied from https://github.com/plouc/nivo/blob/6dc6636cb64135104264547f05a3f44c787c6508/packages/heatmap/src/canvas.tsx
// so we can customise as needed
export const renderRect = <Datum extends HeatMapDatum>(
  ctx: CanvasRenderingContext2D,
  {
    cell: {
      x,
      y,
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
    ctx.fillText(label, x, y);
  }

  ctx.restore();
};
