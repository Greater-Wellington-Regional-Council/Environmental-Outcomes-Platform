import { FeatureCollection, Geometry } from 'geojson';
import React from 'react';

import { GroundwaterZoneBoundariesProperties } from '../../api';
import compileLimitsTable from './compileLimitsTable';

type Props = {
  showCatchmentUnitLimit: boolean;
  allocationLimit: string | null | undefined;
  surfaceWaterMgmtUnitLimit: string | null | undefined;
  activeZonesIds: number[];
  groundWaterZoneGeoJson: FeatureCollection<
    Geometry,
    GroundwaterZoneBoundariesProperties
  >;
};

export default function LimitsTable({
  showCatchmentUnitLimit,
  allocationLimit,
  surfaceWaterMgmtUnitLimit,
  activeZonesIds,
  groundWaterZoneGeoJson,
}: Props) {
  const { headers, rows, showFootnote } = compileLimitsTable(
    showCatchmentUnitLimit,
    allocationLimit,
    surfaceWaterMgmtUnitLimit,
    activeZonesIds,
    groundWaterZoneGeoJson
  );

  return (
    <>
      <table className="border-collapse border mb-3">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="border p-1 text-left text-sm">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border p-1 text-left text-sm">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {showFootnote && (
        <>
          <a title="#PNRP">
            <sup>1</sup>
          </a>
          <a
            href="https://pnrp.gw.govt.nz/assets/Uploads/7-Chapter-4-Policies-Appeal-version-2022-FORMATTED.pdf#page=52"
            className="text-sm flex-1 underline"
          >
            Table 4.1 of the Proposed Natural Resource Plan Limits
          </a>
        </>
      )}
    </>
  );
}
