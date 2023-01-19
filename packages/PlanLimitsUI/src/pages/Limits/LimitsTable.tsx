import { FeatureCollection, Geometry } from 'geojson';
import React from 'react';

import { GroundwaterZoneBoundariesProperties } from '../../api';
import compileLimitsTable from './compileLimitsTable';

type Props = {
  showCatchmentUnitLimit: boolean;
  allocationLimit: string | null | undefined;
  surfaceWaterMgmtUnitLimit: string | null | undefined;
  activeZonesIds: Array<number>;
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
  const limitsTable = compileLimitsTable(
    allocationLimit,
    surfaceWaterMgmtUnitLimit,
    activeZonesIds,
    groundWaterZoneGeoJson
  );

  const showFootnote = Boolean(
    limitsTable.find((row) => row[2] === 'Category B')
  );

  return (
    <>
      <table className="border-collapse border mb-3">
        <thead>
          <tr>
            <th className="border p-1 text-left text-sm">Type of take</th>
            <th className="border p-1 text-left text-sm">Bore screen depth</th>
            <th className="border p-1 text-left text-sm">Category</th>

            {showCatchmentUnitLimit ? (
              <>
                <th className="border p-1 text-left text-sm">
                  Sub-unit Allocation Limit
                </th>
                <th className="border p-1 text-left text-sm">
                  Catchment Management Unit Allocation Limit
                </th>
              </>
            ) : (
              <>
                <th className="border p-1 text-left text-sm">
                  Allocation limit
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {limitsTable.map((limit, index) => (
            <tr key={index}>
              <td className="border p-1 text-left">{limit[0]}</td>
              <td className="border p-1 text-left">{limit[1]}</td>
              <td className="border p-1 text-left">{limit[2]}</td>
              <td className="border p-1 text-left">{limit[3]}</td>
              {showCatchmentUnitLimit && (
                <td className="border p-1 text-left">{limit[4]}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {showFootnote && (
        <>
          <a title="#pNRP">
            <sup>1</sup>
          </a>
          <a
            href="https://pnrp.gw.govt.nz/assets/Uploads/7-Chapter-4-Policies-Appeal-version-2022-FORMATTED.pdf#page=10"
            className="text-sm flex-1 underline"
          >
            Table 4.1 of the Proposed Natural Resource Plan Limits
          </a>
        </>
      )}
    </>
  );
}
