import { ResponsiveHeatMapCanvas, type ComputedCell } from '@nivo/heatmap';
import { format } from 'date-fns';
import type { GroupedWaterUseData } from '../../lib/useDetailedWaterUseData';

export default function WeeklyResults({ data }: { data: GroupedWaterUseData }) {
  return (
    <>
      <h2 className="text-xl mb-2">Daily usage grouped by area</h2>
      {data.groups.map((usageGroup) => {
        return (
          <div key={usageGroup.name} className="mb-6">
            {!usageGroup.hideLabel ? (
              <h2 className="text-lg mb-2">{usageGroup.name}</h2>
            ) : (
              <></>
            )}
            <div className="mb-4">
              {usageGroup.areaIds.map((areaId) => {
                return (
                  <div key={areaId} className="mb-6">
                    <h3>{areaId}</h3>
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
