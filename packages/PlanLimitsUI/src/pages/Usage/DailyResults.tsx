import { last, round } from 'lodash';
import { format, getWeekOfMonth } from 'date-fns';
import {
  ResponsiveHeatMapCanvas,
  type ComputedCell,
  type CellCanvasRendererProps,
  type HeatMapDatum,
} from '@nivo/heatmap';
import { ResponsiveTimeRange, type CalendarTooltipProps } from '@nivo/calendar';
import { schemeOranges } from 'd3-scale-chromatic';
import type { GroupedWaterUseData } from '../../lib/useDetailedWaterUseData';

interface Props {
  data: GroupedWaterUseData;
  from: string;
  to: string;
}
const formatNumber = Intl.NumberFormat();

export default function WeeklyResults({ data, from, to }: Props) {
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
              {usageGroup.dailyData.map((dailyData, index) => {
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
                    <TimeRangeResult
                      dailyData={dailyData}
                      from={from}
                      to={to}
                    />
                    <p className="italic text-sm">Alternate graph type</p>
                    <HeatmapResult dailyData={usageGroup.dailyDataAlt[index]} />
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

function TimeRangeResult({
  dailyData,
  from,
  to,
}: {
  dailyData: any;
  from: string;
  to: string;
}) {
  return (
    <div className="h-40">
      <ResponsiveTimeRange
        data={dailyData.data}
        from={from}
        to={to}
        tooltip={CustomTooltip}
        margin={{ top: 20, right: 60, bottom: 20, left: 60 }}
        weekdayTicks={[0, 1, 2, 3, 4, 5, 6]}
        dayBorderWidth={1}
        dayBorderColor={'#ddd'}
        square={true}
        minValue={0}
        maxValue={100}
        colors={last(schemeOranges)}
        legends={[
          {
            anchor: 'bottom',
            itemWidth: 28,
            itemHeight: 36,
            itemsSpacing: 12,
            symbolSize: 10,
            itemCount: 10,
            justify: true,
            direction: 'row',
            translateY: -15,
          },
        ]}
      />
    </div>
  );
}

function HeatmapResult({ dailyData }: { dailyData: any }) {
  return (
    <div className="h-48">
      <ResponsiveHeatMapCanvas
        data={dailyData.data}
        enableLabels={false}
        renderCell={renderRect}
        tooltip={CustomTooltipAlt}
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

function CustomTooltip(data: DailyUsageTimeRangeDataItem) {
  return (
    <div className="bg-gray-500 text-white opacity-90 text-xs p-2 rounded shadow">
      <>
        <div className="font-semibold">
          {format(data.date, 'EEEE do MMMM yyyy')}
        </div>
        <div>
          Usage:{' '}
          <span className="font-semibold">
            {round(data.value, 1)}% ({formatNumber.format(data.usage)} of{' '}
            {formatNumber.format(data.allocation)} m<sup>3</sup>/day)
          </span>
        </div>
      </>
    </div>
  );
}

function CustomTooltipAlt({
  cell,
}: {
  cell: ComputedCell<DailyUsageHeatmapDataItem>;
}) {
  return (
    <div className="bg-gray-500 text-white opacity-90 text-xs p-2 rounded shadow">
      {!cell.data.date && <strong>No data</strong>}

      {cell.data.date && (
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
