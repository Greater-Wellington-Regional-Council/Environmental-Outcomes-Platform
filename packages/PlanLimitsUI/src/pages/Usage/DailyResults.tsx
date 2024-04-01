import { isNumber, round } from 'lodash';
import { format, getWeekOfMonth } from 'date-fns';
import { ResponsiveHeatMapCanvas, type ComputedCell } from '@nivo/heatmap';
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
  return (
    <>
      <h2 className="text-xl mb-2">Daily usage grouped by area</h2>
      <div className="space-y-10 divide-y">
        {data.groups.map((usageGroup) => {
          return (
            <div key={usageGroup.name} className="space-y-6">
              {!usageGroup.hideLabel ? (
                <h2 className="text-lg mb-2 mt-6">{usageGroup.name}</h2>
              ) : (
                <></>
              )}
              {usageGroup.dailyData.map((dailyData) => {
                return (
                  <div key={dailyData.areaId}>
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
          );
        })}
      </div>
    </>
  );
}

function HeatmapResult({ dailyData }: { dailyData: DailyHeatmapData }) {
  return (
    <div className="h-48">
      <ResponsiveHeatMapCanvas
        data={dailyData.data}
        enableLabels={false}
        tooltip={CustomTooltip}
        forceSquare={true}
        margin={{
          top: 30,
          right: 0,
          bottom: 60,
          left: 80,
        }}
        colors={{
          type: 'sequential',
          scheme: 'oranges',
          minValue: 0,
          maxValue: 1,
        }}
        borderWidth={1}
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
    <div className="bg-gray-500 text-white opacity-90 text-xs p-2 rounded shadow text-center">
      <>
        <div>{format(cell.data.date, 'EEEE do MMMM yyyy')}</div>

        {cell.data.y !== null && (
          <>
            <div>Usage: {round(cell.data.y * 100, 1)}% </div>
            <div>
              {formatNumber.format(cell.data.dailyUsage)} of measured{' '}
              {formatNumber.format(cell.data.allocationDailyUsed)}m<sup>3</sup>
              /day <br />
              from a total allocation of{' '}
              {formatNumber.format(cell.data.allocationDaily)}m<sup>3</sup>/day
            </div>
          </>
        )}
        {cell.data.y === null && (
          <>
            <div>
              Usage:{' '}
              {isNumber(cell.data.usage) ? (
                <>
                  {formatNumber.format(cell.data.usage)}m<sup>3</sup>/day
                </>
              ) : (
                'No data'
              )}
            </div>
            <div>
              Allocation:{' '}
              {isNumber(cell.data.allocation) ? (
                <>
                  {formatNumber.format(cell.data.allocation)}m<sup>3</sup>/day
                </>
              ) : (
                'No data'
              )}
            </div>
          </>
        )}
      </>
    </div>
  );
}
