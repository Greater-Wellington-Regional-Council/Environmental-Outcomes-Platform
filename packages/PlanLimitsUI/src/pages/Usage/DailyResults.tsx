import {
  ResponsiveHeatMapCanvas,
  type ComputedCell,
  type CellCanvasRendererProps,
  type HeatMapDatum,
} from '@nivo/heatmap';
import { ResponsiveTimeRange, type CalendarTooltipProps } from '@nivo/calendar';
import { format, getWeekOfMonth } from 'date-fns';
import type { GroupedWaterUseData } from '../../lib/useDetailedWaterUseData';
import { schemeOranges } from 'd3-scale-chromatic';
import { last, round } from 'lodash';

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
              <h2 className="text-lg mb-2 uppercase">{usageGroup.name}</h2>
            ) : (
              <></>
            )}
            <div>
              {usageGroup.dailyData.map((dailyData, index) => {
                return (
                  <div key={dailyData.areaId} className="mb-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <h3 id={`daily-usage-${dailyData.areaId}`}>
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
                    <h4 className="font-semibold">Alternate graph type</h4>
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
    <div className="h-40 w-full">
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
            translateY: -10,
          },
        ]}
      />
    </div>
  );
}

function HeatmapResult({ dailyData }: { dailyData: any }) {
  return (
    <div key={`daily-alt-${dailyData.areaId}`} className="mb-6">
      <div className="w-full" style={{ height: `200px` }}>
        <ResponsiveHeatMapCanvas
          data={dailyData.data}
          margin={{
            top: 0,
            right: 50,
            bottom: 20,
            left: 130,
          }}
          forceSquare={true}
          colors={{
            type: 'sequential',
            scheme: 'oranges',
            minValue: 0,
            maxValue: 1,
          }}
          enableLabels={false}
          tooltip={CustomTooltipAlt}
          borderWidth={1}
          borderColor={'#ddd'}
          emptyColor={'#fff'}
          renderCell={renderRect}
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
          animate={false}
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
              tickFormat: '=-0.0~%',
            },
          ]}
        />
      </div>
    </div>
  );
}

function CustomTooltip(data: CalendarTooltipProps) {
  return (
    <div className="bg-gray-500 text-white opacity-90 text-xs p-2 rounded shadow">
      <strong>{format(data.date, 'EEEE do MMMM yyyy')}</strong>
      <br />
      <strong>{round(data.value, 1)}%</strong>
      <br />
      {formatNumber.format(data.usage)} of{' '}
      {formatNumber.format(data.allocation)} m<sup>3</sup>/day
    </div>
  );
}

function CustomTooltipAlt({
  cell,
}: {
  cell: ComputedCell<WeeklyUsageHeatmapDataItem>;
}) {
  return (
    <div className="bg-gray-500 text-white opacity-90 text-xs p-2 rounded shadow">
      {cell.data.date && (
        <>
          <strong>{format(cell.data.date, 'EEEE do MMMM yyyy')}</strong>
          <br />
          <strong>{round(cell.data.y * 100, 1)}%</strong>
          <br />
          {formatNumber.format(cell.data.usage)} of{' '}
          {formatNumber.format(cell.data.allocation)} m<sup>3</sup>/day
          <br />
        </>
      )}
      {!cell.data.date && <strong>No data</strong>}
    </div>
  );
}

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
