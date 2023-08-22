import { useAtom } from 'jotai';
import { councilAtom } from '../../lib/loader';
import {
  generateDailyUsageData,
  generateHeatmapData,
} from '../../api/mock-data';
import { ResponsiveTimeRange } from '@nivo/calendar';
import { ResponsiveHeatMapCanvas, ComputedCell } from '@nivo/heatmap';

const CustomTooltip = ({ cell }: { cell: ComputedCell<any> }) => {
  return (
    <div className="bg-gray-500 text-white opacity-90 text-xs p-2 rounded shadow">
      {cell.serieId}
      <br />
      Week of {cell.data.x}
      <br />
      Usage: <strong>{cell.formattedValue}</strong>
    </div>
  );
};

export default function Usage() {
  const [council] = useAtom(councilAtom);
  const allUsageData = generateDailyUsageData();
  const heatmapData = generateHeatmapData();

  return (
    <div className="p-4">
      <h1 className="mb-4">
        Telemetered water usage against allocation for {council.name} by area
      </h1>

      <h2>Weekly</h2>
      <div className="w-full h-[700px] mb-8">
        <ResponsiveHeatMapCanvas
          tooltip={CustomTooltip}
          data={heatmapData}
          valueFormat={'=-0.0~%'}
          margin={{ top: 80, right: 80, bottom: 0, left: 120 }}
          colors={{
            type: 'sequential',
            scheme: 'oranges',
          }}
          enableLabels={false}
          axisTop={{
            tickRotation: -90,
          }}
          borderWidth={1}
          animate={false}
          legends={[
            {
              anchor: 'right',
              translateX: 30,
              translateY: 0,
              length: 200,
              thickness: 10,
              direction: 'column',
              tickPosition: 'after',
              tickSize: 3,
              tickSpacing: 4,
              tickOverlap: false,
              tickFormat: '=-0.0~%',
              titleAlign: 'start',
              titleOffset: 4,
            },
          ]}
        />
      </div>

      {allUsageData.map((usageDataForArea) => (
        <div key={usageDataForArea.area} className="w-full h-44 mb-8">
          <h2 className="mb-2">Daily - {usageDataForArea.area}</h2>
          <div className="h-44">
            <ResponsiveTimeRange
              tooltip={(data) => (
                <div className="bg-gray-500 text-white opacity-90 text-xs p-2 rounded shadow">
                  <strong>{data.day}</strong>
                  <br />
                  Usage: <strong>{data.value}%</strong>
                </div>
              )}
              data={usageDataForArea.data}
              from={usageDataForArea.start}
              to={usageDataForArea.end}
              margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
              dayRadius={10}
              colors={[
                'rgb(254, 231, 208)',
                'rgb(252, 146, 68)',
                'rgb(240, 107, 24)',
                'rgb(206, 71, 3)',
              ]}
              // monthLegendOffset={10}
              // monthLegendPosition={'after'}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
