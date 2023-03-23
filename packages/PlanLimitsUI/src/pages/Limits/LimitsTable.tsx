import { FeatureCollection, Geometry } from 'geojson';
import compileLimitsTable from './compileLimitsTable';
import type { GroundwaterZoneBoundariesProperties } from '../../api';
import type { AppState } from './useAppState';
import type { WaterTakeFilter } from './';

type Props = {
  waterTakeFilter: WaterTakeFilter;
  appState: AppState;
  groundWaterZoneGeoJson: FeatureCollection<
    Geometry,
    GroundwaterZoneBoundariesProperties
  >;
};

export default function LimitsTable({
  waterTakeFilter,
  appState,
  groundWaterZoneGeoJson,
}: Props) {
  const { headers, rows, showFootnote } = compileLimitsTable(
    waterTakeFilter,
    appState,
    groundWaterZoneGeoJson
  );

  if (rows.length === 0) return <></>;

  return (
    <>
      <h3 className="text-lg uppercase mb-2 tracking-wider">Limits (Old)</h3>
      <table className="border-collapse border">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                // Give the first column a little more space to avoid contents wrapping
                className={`border p-2 text-left text-sm font-normal bg-gray-100 ${
                  index === 0 && 'w-28'
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  colSpan={cellIndex === 3 && row.length === 4 ? 2 : 1}
                  key={cellIndex}
                  className="border p-2 text-left text-sm"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {showFootnote && (
        <>
          <div className="mt-3">
            <a title="#PNRP41">
              <sup>1</sup>
            </a>
            <a
              target="_blank"
              href="https://pnrp.gw.govt.nz/assets/Uploads/7-Chapter-4-Policies-Appeal-version-2022-FORMATTED.pdf#page=52"
              className="text-sm flex-1 underline"
            >
              Table 4.1 of the Proposed Natural Resource Plan Limits
            </a>
          </div>
          <div>
            <a title="#PNRP121">
              <sup>2</sup>
            </a>
            <a
              target="_blank"
              href="https://pnrp.gw.govt.nz/assets/Uploads/7-Chapter-4-Policies-Appeal-version-2022-FORMATTED.pdf#page=59"
              className="text-sm flex-1 underline"
            >
              Policy P121 of the Proposed Natural Resource Plan Limits
            </a>
          </div>
        </>
      )}
    </>
  );
}
