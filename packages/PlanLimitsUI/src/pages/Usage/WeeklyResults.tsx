import { ResponsiveHeatMapCanvas, type ComputedCell } from '@nivo/heatmap';
import { format } from 'date-fns';
import type { GroupedWaterUseData } from '../../lib/useDetailedWaterUseData';
import { round } from 'lodash';

export default function WeeklyResults({ data }: { data: GroupedWaterUseData }) {
  return (
    <>
      <h2 className="text-xl mb-2">Weekly usage grouped by area</h2>
      {data.groups.map((usageGroup, index) => {
        return (
          <div
            id={`weekly-usage-${usageGroup.name}`}
            key={usageGroup.name}
            className="mb-6"
          >
            {!usageGroup.hideLabel ? (
              <h2 className="text-lg mb-2">{usageGroup.name}</h2>
            ) : (
              <></>
            )}
            <div className="mb-4">
              <WeeklyUsageHeatMap
                data={usageGroup.weeklyData}
                showWeeks={index === 0}
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
}: {
  data: HeatmapData[];
  showWeeks: boolean;
}) {
  const axisTop = showWeeks
    ? {
        tickSize: 0,
        tickRotation: -50,
        legend: 'Week ending',
        legendOffset: -65,
      }
    : undefined;

  const marginTop = showWeeks ? 70 : 0;
  const height = (data.length * 20 + marginTop).toString();

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <ResponsiveHeatMapCanvas
        onClick={(cell) => {
          window.location.href = `#daily-usage-${cell.serieId}`;
        }}
        tooltip={CustomTooltip}
        data={data}
        valueFormat={'=-0.0~%'}
        margin={{ top: marginTop, right: 50, bottom: 0, left: 130 }}
        colors={{
          type: 'sequential',
          scheme: 'oranges',
          minValue: 0,
          maxValue: 1,
        }}
        enableLabels={false}
        axisTop={axisTop}
        borderWidth={1}
        borderColor={'#ddd'}
        axisLeft={{
          tickSize: 0,
        }}
        animate={false}
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
      <span className="font-bold">{cell.serieId}</span>
      <br />
      Week ending {format(cell.data.endOfWeek, 'EEEE do MMMM yyyy')}
      <br />
      Median usage: <strong>{round(cell.value, 1)}%</strong>
    </div>
  );
}
