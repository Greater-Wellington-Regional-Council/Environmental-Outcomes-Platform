import { ResponsiveHeatMapCanvas, type ComputedCell } from '@nivo/heatmap';
import { format } from 'date-fns';
import { round } from 'lodash';
import type { GroupedWaterUseData } from '../../lib/useDetailedWaterUseData';

const formatNumber = Intl.NumberFormat();

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
    <div className="bg-gray-500 text-white opacity-90 text-xs p-2 rounded shadow text-center">
      <div>{cell.serieId}</div>
      <div>Week ending {format(cell.data.endOfWeek, 'EEEE do MMMM yyyy')}</div>
      {cell.data.y !== null && (
        <div>Median usage: {round(cell.data.y * 100, 1)}%</div>
      )}
      {cell.data.y === null && <div>No data</div>}

      <table className="border-collapse border m-auto w-full">
        <thead>
          <tr>
            <th className="border">Day</th>
            <th className="border">
              Usage <br />m<sup>3</sup>/day
            </th>
            <th className="border">
              Allocation <br />m<sup>3</sup>/day
            </th>
            <th className="border">
              Usage <br />%
            </th>
          </tr>
        </thead>
        <tbody>
          {cell.data.dailyData.map((u) => (
            <tr key={u.parsedDateJSON}>
              <td className="border">{format(u.parsedDate, 'eeeeee dd')}</td>
              <td className="border">
                {u.dailyUsage !== null
                  ? formatNumber.format(u.dailyUsage)
                  : 'No data'}
              </td>
              <td className="border">
                {u.meteredDailyAllocation !== null
                  ? formatNumber.format(u.meteredDailyAllocation)
                  : 'No data'}
              </td>
              <td className="border">
                {u.usagePercent !== null
                  ? round(u.usagePercent * 100, 1)
                  : 'No data'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
