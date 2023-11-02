import { useAtom } from 'jotai';
import { councilAtom } from '../../lib/loader';
import useDetailedWaterUseData from '../../lib/useDetailedWaterUseData';
import { LoadingIndicator } from '../../components/Indicators';
import {
  ResponsiveHeatMapCanvas,
  type ComputedCell,
  HeatMapDatum,
} from '@nivo/heatmap';
import Header from '../../pages/Limits/Sidebar/Header';

export default function Usage() {
  const [council] = useAtom(councilAtom);
  const waterUseData = useDetailedWaterUseData(council.id);

  return (
    <>
      <div className="flex justify-between items-end border-b">
        <div className="p-4">
          <h1 className="text-2xl font-light mb-2 uppercase">
            Detailed Water Usage
          </h1>
        </div>
        <div className="w-[36rem]">
          <Header council={council} />
        </div>
      </div>
      <main className="p-4">
        <h2 className="text-xl mb-2">Weekly usage grouped by area</h2>
        {waterUseData.isLoading && (
          <LoadingIndicator>Loading...</LoadingIndicator>
        )}
        {!waterUseData.isLoading && waterUseData?.data && (
          <div className="mb-4 italic">
            No data for: {waterUseData.data.usage.allMissingAreas.join(', ')}
          </div>
        )}
        {!waterUseData.isLoading &&
          waterUseData?.data?.usage &&
          waterUseData.data.usage.groups.map((usageGroup, index) => {
            return (
              <div key={usageGroup.name} className="mb-6">
                {!usageGroup.hideLabel ? (
                  <h2 className="text-lg mb-2">{usageGroup.name}</h2>
                ) : (
                  <></>
                )}
                <div className="mb-4">
                  <HeatMap
                    data={usageGroup.data}
                    showWeeks={index === 0}
                  ></HeatMap>
                </div>

                {/* <div className="ml-32">
                  Areas with not data: {usage.missingAreas.join(', ')}
                </div> */}
              </div>
            );
          })}
      </main>
    </>
  );
}

function HeatMap({
  data,
  showWeeks,
}: {
  data: HeatmapData;
  showWeeks: boolean;
}) {
  const axisTop = showWeeks
    ? {
        tickSize: 0,
        tickRotation: -50,
        legend: 'Week ending',
        legendOffset: -65,
      }
    : false;

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

const CustomTooltip = ({ cell }: { cell: ComputedCell<HeatMapDatum> }) => {
  return (
    <div className="bg-gray-500 text-white opacity-90 text-xs p-2 rounded shadow">
      <span className="font-bold">{cell.serieId}</span>
      <br />
      Week ending {cell.data.x}
      <br />
      Median usage: <strong>{cell.formattedValue}</strong>
    </div>
  );
};
