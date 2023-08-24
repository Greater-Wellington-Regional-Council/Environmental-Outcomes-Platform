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
      <div className="flex items-baseline justify-between">
        <h1 id="top" className="text-xl font-light mb-2 uppercase">
          Surface Water Usage
        </h1>
        <p className="mb-2">
          Telemetered usage against allocation for {council.name}
        </p>
      </div>

      <h2 className="text-lg">Weekly</h2>
      <div className="w-full h-[400px] mb-8">
        <ResponsiveHeatMapCanvas
          onClick={(cell) => {
            console.log(cell.serieId);
            window.location.href = `#daily-${cell.serieId}`;
          }}
          tooltip={CustomTooltip}
          data={heatmapData}
          valueFormat={'=-0.0~%'}
          margin={{ top: 60, right: 60, bottom: 0, left: 110 }}
          colors={{
            type: 'sequential',
            scheme: 'oranges',
            // minValue: 0,
            // maxValue: 1,
          }}
          enableLabels={false}
          axisTop={{
            tickSize: 0,
            tickRotation: -45,
          }}
          borderWidth={1}
          borderColor={'#ddd'}
          axisLeft={{
            tickSize: 0,
          }}
          animate={false}
          legends={[
            {
              anchor: 'right',
              direction: 'column',
              translateX: 30,
              translateY: 20,
              length: 200,
              thickness: 10,
              tickSize: 5,
              tickSpacing: 5,
              tickOverlap: false,
              tickFormat: '=-0.0~%',
            },
          ]}
        />
      </div>

      <div className="mb-96">
        {allUsageData.map((usageDataForArea) => (
          <div key={usageDataForArea.area} className="w-full">
            <div className="flex items-baseline justify-between">
              <h2 id={`daily-${usageDataForArea.area}`} className="text-lg">
                Daily - {usageDataForArea.area}
              </h2>
              <a className="underline text-sm mr-16" href="#top">
                Back to top
              </a>
            </div>
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
                margin={{ top: 20, right: 60, bottom: 0, left: 40 }}
                weekdayTicks={[0, 1, 2, 3, 4, 5, 6]}
                dayBorderWidth={1}
                dayBorderColor={'#ddd'}
                colors={[
                  'rgb(254, 231, 208)',
                  'rgb(252, 146, 68)',
                  'rgb(240, 107, 24)',
                  'rgb(206, 71, 3)',
                ]}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
