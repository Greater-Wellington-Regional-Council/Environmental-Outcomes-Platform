import { useAtom } from 'jotai';
import { councilAtom } from '../../lib/loader';
import useDetailedWaterUseData from '../../lib/useDetailedWaterUseData';
import { LoadingIndicator } from '../../components/Indicators';
import { ResponsiveHeatMapCanvas, type ComputedCell } from '@nivo/heatmap';

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
  const waterUseData = useDetailedWaterUseData(council.id);

  return (
    <div className="p-4">
      <div className="flex items-baseline justify-between">
        <h1 id="top" className="text-xl font-light mb-2 uppercase">
          Water Usage
        </h1>
        <p className="mb-2">
          Telemetered usage against allocation for {council.name}
        </p>
      </div>

      <h2 className="text-lg">Surface Water Weekly</h2>

      {waterUseData.isLoading && (
        <LoadingIndicator>Loading...</LoadingIndicator>
      )}
      {!waterUseData.isLoading &&
        waterUseData.data &&
        waterUseData.data.usage.map((usage) => (
          <>
            <h2>{usage.groupName}</h2>
            <HeatMap data={usage.data}></HeatMap>
            Missing areas: {usage.missingAreas.join(', ')}
          </>
        ))}
    </div>
  );
}

function HeatMap({ data }) {
  return (
    <div className="w-full h-[400px] mb-8">
      <ResponsiveHeatMapCanvas
        onClick={(cell) => {
          window.location.href = `#daily-${cell.serieId}`;
        }}
        tooltip={CustomTooltip}
        data={data}
        valueFormat={'=-0.0~%'}
        margin={{ top: 60, right: 70, bottom: 0, left: 130 }}
        colors={{
          type: 'sequential',
          scheme: 'oranges',
          minValue: 0,
          maxValue: 1,
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
  );
}
