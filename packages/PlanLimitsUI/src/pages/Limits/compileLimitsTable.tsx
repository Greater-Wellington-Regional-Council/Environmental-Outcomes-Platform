import formatWaterQuantity from './formatWaterQuantity';
import type { GroundwaterZoneBoundariesProperties } from '../../api';
import type { FeatureCollection, Geometry } from 'geojson';
import type { WaterTakeFilter } from './';

const BLANK_CELL_CHAR = '-';
const HEADERS = ['Type', 'Bore screen depth', 'Category'];
const LIMIT_HEADERS = ['Allocation limit'];
const LIMIT_HEADERS_WITH_CATCHMENT = [
  'Sub-unit Allocation Limit',
  'Catchment Management Unit Allocation Limit',
];

export default function compileLimitsTable(
  waterTakeFilter: WaterTakeFilter,
  surfaceWaterMgmtUnitId: number,
  surfaceWaterMgmtUnitLimit: string | null | undefined,
  surfaceWaterMgmtSubUnitLimit: string | null | undefined,
  activeZonesIds: Array<number>,
  groundWaterZoneGeoJson: FeatureCollection<
    Geometry,
    GroundwaterZoneBoundariesProperties
  >
) {
  let showFootnote = false;
  const rows = [];

  if (['Combined', 'Surface'].includes(waterTakeFilter)) {
    rows.push([
      'Surface water',
      BLANK_CELL_CHAR,
      BLANK_CELL_CHAR,
      <>{surfaceWaterMgmtSubUnitLimit || surfaceWaterMgmtUnitLimit}</>,
      surfaceWaterMgmtUnitLimit,
    ]);
  }

  if (['Combined', 'Ground'].includes(waterTakeFilter)) {
    const activeFeatures = groundWaterZoneGeoJson.features
      .filter((item) => activeZonesIds.includes(Number(item.id as string)))
      .map((feature) => {
        return {
          gwAllocationAmount: feature.properties.groundwater_allocation_amount,
          gwAllocationUnit:
            feature.properties.groundwater_allocation_amount_unit,
          depth: feature.properties.depth,
          category: feature.properties.category,
          swAllocationUnit:
            feature.properties.surface_water_allocation_amount_unit,
          swAllocationAmount:
            feature.properties.surface_water_allocation_amount,
        };
      });

    activeFeatures
      .filter((feature) => feature.category === 'Category A')
      .forEach((feature) => {
        const limit = formatWaterQuantity(
          feature.swAllocationAmount,
          feature.swAllocationUnit
        );
        rows.push([
          'Groundwater',
          feature.depth,
          'A',
          limit,
          surfaceWaterMgmtUnitLimit,
        ]);
      });

    activeFeatures
      .filter((feature) => feature.category === 'Category B')
      .forEach((feature) => {
        showFootnote = true;
        rows.push([
          'Groundwater',
          feature.depth,
          'B',
          <>
            See Table 4.1 of PNRP
            <sup>
              <a href="#PNRP">1</a>
            </sup>
          </>,
          '-',
        ]);
      });

    activeFeatures
      .filter((feature) => feature.category === 'Category C')
      .forEach((feature) => {
        const limit = formatWaterQuantity(
          feature.gwAllocationAmount,
          feature.gwAllocationUnit
        );
        rows.push(['Groundwater', feature.depth, 'C', limit, '-']);
      });
  }

  // TODO: What is the best way to capture this requirement to show Catchement Level
  // limits for particular units?
  const showCatchmentUnitLimit = [16, 29].includes(surfaceWaterMgmtUnitId);
  // const showCatchmentUnitLimit =
  // surfaceWaterMgmtSubUnitLimit && surfaceWaterMgmtUnitLimit;

  const headers = HEADERS.concat(
    showCatchmentUnitLimit ? LIMIT_HEADERS_WITH_CATCHMENT : LIMIT_HEADERS
  );

  // If we don't need to show the Catchment Unit limit, strip it from the results
  if (!showCatchmentUnitLimit) {
    rows.forEach((row) => row.pop());
  }

  return { rows, headers, showFootnote };
}
