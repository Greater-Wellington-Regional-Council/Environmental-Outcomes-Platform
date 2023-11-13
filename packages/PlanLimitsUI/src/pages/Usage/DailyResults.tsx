import { ResponsiveTimeRange, type CalendarTooltipProps } from '@nivo/calendar';
import { format } from 'date-fns';
import type { GroupedWaterUseData } from '../../lib/useDetailedWaterUseData';
import { schemeOranges } from 'd3-scale-chromatic';
import { last, round } from 'lodash';

interface Props {
  data: GroupedWaterUseData;
  from: string;
  to: string;
}

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
              {usageGroup.dailyData.map((dailyData) => {
                return (
                  <div key={dailyData.areaId} className="mb-4">
                    <div className="flex items-baseline justify-between mb-2">
                      <div>
                        <h3 id={`daily-usage-${dailyData.areaId}`}>
                          Daily usage for {dailyData.areaId}
                        </h3>
                      </div>
                      <a
                        className="underline text-sm mr-16"
                        href={`#weekly-usage-${usageGroup.name}`}
                      >
                        Back to top
                      </a>
                    </div>

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
                        minValue={0}
                        maxValue={100}
                        colors={last(schemeOranges)}
                        legends={[
                          {
                            anchor: 'bottom',
                            itemWidth: 28,
                            itemHeight: 36,
                            itemsSpacing: 14,
                            symbolSize: 10,
                            itemCount: 10,
                            justify: true,
                            direction: 'row',
                            translateY: -10,
                          },
                        ]}
                      />
                    </div>
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

function CustomTooltip(data: CalendarTooltipProps) {
  return (
    <div className="bg-gray-500 text-white opacity-90 text-xs p-2 rounded shadow">
      <strong>{format(data.date, 'EEEE do MMMM yyyy')}</strong>
      <br />
      <strong>{round(data.value, 1)}%</strong>
      <br />
      {data.usage} of {data.allocation} m<sup>3</sup>/day
    </div>
  );
}
