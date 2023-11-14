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
            className="mb-4"
          >
            {!usageGroup.hideLabel ? (
              <h2 className="text-lg">{usageGroup.name}</h2>
            ) : (
              <></>
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
    : undefined;

  const marginTop = showWeeks ? 75 : 0;
  const marginBottom = showLegend ? 50 : 0;
  const height = (data.length * 16 + marginTop + marginBottom).toString();

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <ResponsiveHeatMapCanvas
        onClick={(cell) => {
          window.location.href = `#daily-usage-${cell.serieId}`;
        }}
        tooltip={CustomTooltip}
        data={data}
        valueFormat={'=-0.0~%'}
        margin={{ top: marginTop, right: 50, bottom: marginBottom, left: 130 }}
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
            tickFormat: '=-0.0~%',
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
      <span className="font-bold">{cell.serieId}</span>
      <br />
      Week ending {format(cell.data.endOfWeek, 'EEEE do MMMM yyyy')}
      <br />
      Median usage: <strong>{round(cell.value, 1)}%</strong>
    </div>
  );
}
