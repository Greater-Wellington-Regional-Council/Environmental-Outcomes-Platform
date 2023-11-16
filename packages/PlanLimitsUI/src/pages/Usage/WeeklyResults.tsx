import { ResponsiveHeatMapCanvas, type ComputedCell } from '@nivo/heatmap';
import { format } from 'date-fns';
import { round } from 'lodash';
import type { GroupedWaterUseData } from '../../lib/useDetailedWaterUseData';

export default function WeeklyResults({ data }: { data: GroupedWaterUseData }) {
  return (
    <>
      <h2 className="text-xl mb-2">Weekly usage grouped by area</h2>
      {data.groups.map((usageGroup, index) => {
        return (
          <div
            id={`weekly-usage-${usageGroup.name}`}
            key={usageGroup.name}
            className="mb-4"
          >
            {!usageGroup.hideLabel && (
              <h2 className="text-lg mb-2">{usageGroup.name}</h2>
            )}
            <div>
              <WeeklyUsageHeatMap
                data={usageGroup.weeklyData}
                showWeeks={index === 0}
                showLegend={usageGroup.showLegend}
              ></WeeklyUsageHeatMap>
            </div>
          </div>
        );
      })}
    </>
  );
}

function WeeklyUsageHeatMap({
  data,
  showWeeks,
  showLegend,
}: {
  data: HeatmapData[];
  showWeeks: boolean;
  showLegend: boolean;
}) {
  const axisTop = showWeeks
    ? {
        tickSize: 0,
        tickRotation: -50,
        legend: 'Week ending',
        legendOffset: -70,
      }
    : null;

  const marginTop = showWeeks ? 75 : 0;
  const marginBottom = showLegend ? 50 : 0;
  const height = (data.length * 16 + marginTop + marginBottom).toString();

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <ResponsiveHeatMapCanvas
        data={data}
        enableLabels={false}
        onClick={(cell) => {
          window.location.href = `#daily-usage-${cell.serieId}`;
        }}
        tooltip={CustomTooltip}
        forceSquare={true}
        margin={{ top: marginTop, right: 50, bottom: marginBottom, left: 130 }}
        colors={{
          type: 'sequential',
          scheme: 'oranges',
          minValue: 0,
          maxValue: 1,
        }}
        borderWidth={1}
        borderColor={'#ddd'}
        emptyColor={'#fff'}
        axisTop={axisTop}
        axisLeft={{
          tickSize: 0,
        }}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            translateY: 35,
            title: 'Median usage (%) →',
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
  cell: ComputedCell<WeeklyUsageHeatmapDataItem>;
}) {
  return (
    <div className="bg-gray-500 text-white opacity-90 text-xs p-2 rounded shadow">
      <div className="font-semibold">{cell.serieId}</div>
      <div>
        Week ending{' '}
        <span className="font-semibold">
          {format(cell.data.endOfWeek, 'EEEE do MMMM yyyy')}
        </span>
      </div>
      <div>
        Median usage:{' '}
        <span className="font-semibold">{round(cell.value * 100, 1)}%</span>
      </div>
    </div>
  );
}
