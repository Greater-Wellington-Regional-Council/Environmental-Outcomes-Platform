import { useAtom } from 'jotai';
import { ResponsiveHeatMapCanvas, type ComputedCell } from '@nivo/heatmap';
import { format } from 'date-fns';

import { councilAtom } from '../../lib/loader';
import useDetailedWaterUseData, {
  type DetailedWaterUseQuery,
} from '../../lib/useDetailedWaterUseData';
import Header from '../../pages/Limits/Sidebar/Header';
import { ErrorIndicator, LoadingIndicator } from '../../components/Indicators';

export default function Usage() {
  const [council] = useAtom(councilAtom);
  const waterUseData = useDetailedWaterUseData(
    council.id,
    council.usageDisplayGroups,
  );

  return (
    <>
      <div className="flex justify-between items-end border-b">
        <div className="px-4 py-2">
          <a href={`/limits/${council.slug}`} className="text-xs underline">
            Back to limits viewer
          </a>
          <h1 className="text-xl font-light uppercase mt-2">
            Detailed Water Usage
          </h1>
        </div>
        <div className="w-[36rem]">
          <Header council={council} />
        </div>
      </div>
      <main className="p-4">
        <h2 className="text-xl mb-2">Weekly usage grouped by area</h2>
        <Results waterUseData={waterUseData} />
      </main>
    </>
  );
}

function Results({ waterUseData }: { waterUseData: DetailedWaterUseQuery }) {
  if (waterUseData.isLoading) {
    return <LoadingIndicator>Loading data</LoadingIndicator>;
  }
  if (waterUseData.isError || !waterUseData.data || !waterUseData.data.usage) {
    return <ErrorIndicator>Error loading data</ErrorIndicator>;
  }
  return (
    <>
      <div className="mb-4 italic text-sm">
        No data for: {waterUseData.data.usage.allMissingAreas.join(', ')}
      </div>
      {waterUseData.data.usage.groups.map((usageGroup, index) => {
        return (
          <div key={usageGroup.name} className="mb-6">
            {!usageGroup.hideLabel ? (
              <h2 className="text-lg mb-2">{usageGroup.name}</h2>
            ) : (
              <></>
            )}
            <div className="mb-4">
              <WeeklyUsageHeatMap
                data={usageGroup.data}
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
          window.location.href = `#daily-${cell.serieId}`;
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

const CustomTooltip = ({
  cell,
}: {
  cell: ComputedCell<WeeklyUsageHeatmapDataItem>;
}) => {
  return (
    <div className="bg-gray-500 text-white opacity-90 text-xs p-2 rounded shadow">
      <span className="font-bold">{cell.serieId}</span>
      <br />
      Week ending {format(cell.data.endOfWeek, 'EEEE do MMMM yyyy')}
      <br />
      Median usage: <strong>{cell.formattedValue}</strong>
    </div>
  );
};
