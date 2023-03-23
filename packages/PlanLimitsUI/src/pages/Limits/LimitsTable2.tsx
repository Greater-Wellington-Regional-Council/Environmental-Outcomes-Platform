import { FeatureCollection, Geometry } from 'geojson';

import type { GroundwaterZoneBoundariesProperties } from '../../api';
import type { AppState } from './useAppState';
import type { WaterTakeFilter } from './';

const BLANK_CELL_CHAR = '-';
const GROUNDWATER_CATEGORY_B_RULE = (
  <>
    See Table 4.1 of PNRP
    <sup>
      <a href="#PNRP41">1</a>
    </sup>
  </>
);
const DEFAULT_RULE = (
  <>
    Refer to Policy P121 of PRNP
    <sup>
      <a href="#PRNP121">2</a>
    </sup>
  </>
);

type Props = {
  waterTakeFilter: WaterTakeFilter;
  appState: AppState;
  groundWaterZoneGeoJson: FeatureCollection<
    Geometry,
    GroundwaterZoneBoundariesProperties
  >;
};

export default function LimitsTable({ waterTakeFilter, appState }: Props) {
  if (!appState.swLimit || appState.gwLimits?.length === 0) return <></>;

  const showFootnote =
    appState.swLimit?.useDefaultRuleForSubUnit ||
    appState.swLimit?.useDefaultRuleForUnit ||
    appState.gwLimits?.some(
      (gwLimit) =>
        gwLimit.useDefaultRuleForSubUnit || gwLimit.useDefaultRuleForUnit
    );

  return (
    <>
      <h3 className="text-lg uppercase mb-2 tracking-wider">Limits</h3>
      <table className="border-collapse border">
        <thead>
          <tr>
            <th className="border p-2 text-left text-sm font-normal bg-gray-100 w-28">
              Type
            </th>
            <th className="border p-2 text-left text-sm font-normal bg-gray-100">
              Bore screen depth
            </th>
            <th className="border p-2 text-left text-sm font-normal bg-gray-100">
              Category
            </th>
            <th className="border p-2 text-left text-sm font-normal bg-gray-100">
              Sub-unit Allocation Limit
            </th>
            <th className="border p-2 text-left text-sm font-normal bg-gray-100">
              Sub-unit Allocated
            </th>
            <th className="border p-2 text-left text-sm font-normal bg-gray-100">
              Catchment Management Unit Allocation Limit
            </th>
            <th className="border p-2 text-left text-sm font-normal bg-gray-100">
              Catchment Management Unit Allocated
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Surface water */}
          {['Combined', 'Surface'].includes(waterTakeFilter) && (
            <>
              <tr>
                <td className="border p-2 text-left text-sm">Surface water</td>
                <td className="border p-2 text-left text-sm">
                  {BLANK_CELL_CHAR}
                </td>
                <td className="border p-2 text-left text-sm">
                  {BLANK_CELL_CHAR}
                </td>
                <td className="border p-2 text-left text-sm">
                  {appState.swLimit?.useDefaultRuleForSubUnit
                    ? DEFAULT_RULE
                    : appState.swLimit?.subUnitLimit || BLANK_CELL_CHAR}
                </td>
                <td className="border p-2 text-left text-sm">
                  {appState.surfaceWaterMgmtSubUnitAllocated ? (
                    <>
                      {appState.surfaceWaterMgmtSubUnitAllocated}
                      <br />
                      {appState.surfaceWaterMgmtSubUnitAllocatedPercentage}%
                    </>
                  ) : (
                    BLANK_CELL_CHAR
                  )}
                </td>
                <td className="border p-2 text-left text-sm">
                  {appState.swLimit?.useDefaultRuleForUnit
                    ? DEFAULT_RULE
                    : appState.swLimit?.unitLimit || BLANK_CELL_CHAR}
                </td>
                <td className="border p-2 text-left text-sm">
                  {appState.surfaceWaterMgmtUnitAllocated ? (
                    <>
                      {appState.surfaceWaterMgmtUnitAllocated}
                      <br />
                      {appState.surfaceWaterMgmtUnitAllocatedPercentage}%
                    </>
                  ) : (
                    BLANK_CELL_CHAR
                  )}
                </td>
              </tr>
            </>
          )}
          {['Combined', 'Ground'].includes(waterTakeFilter) && (
            <>
              {appState.gwLimits?.map((gwLimit, index) => (
                <tr key={index}>
                  <td className="border p-2 text-left text-sm">Ground water</td>
                  <td className="border p-2 text-left text-sm">
                    {gwLimit.depth}
                  </td>
                  <td className="border p-2 text-left text-sm">
                    {gwLimit.category}
                  </td>
                  <td className="border p-2 text-left text-sm">
                    {gwLimit.useDefaultRuleForSubUnit
                      ? gwLimit.category === 'B'
                        ? GROUNDWATER_CATEGORY_B_RULE
                        : DEFAULT_RULE
                      : gwLimit.subUnitLimit || BLANK_CELL_CHAR}
                  </td>
                  <td className="border p-2 text-left text-sm">
                    {gwLimit.subUnitAllocated ? (
                      <>
                        {gwLimit.subUnitAllocated.amount}
                        <br />
                        {gwLimit.subUnitAllocated.percentage}%
                      </>
                    ) : (
                      BLANK_CELL_CHAR
                    )}
                  </td>
                  <td className="border p-2 text-left text-sm">
                    {gwLimit.useDefaultRuleForUnit
                      ? gwLimit.category === 'B'
                        ? GROUNDWATER_CATEGORY_B_RULE
                        : DEFAULT_RULE
                      : gwLimit.unitLimit || BLANK_CELL_CHAR}
                  </td>
                  <td className="border p-2 text-left text-sm">
                    {gwLimit.unitAllocated ? (
                      <>
                        {gwLimit.unitAllocated.amount}
                        <br />
                        {gwLimit.unitAllocated.percentage}%
                      </>
                    ) : (
                      BLANK_CELL_CHAR
                    )}
                  </td>
                </tr>
              ))}
            </>
          )}
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
