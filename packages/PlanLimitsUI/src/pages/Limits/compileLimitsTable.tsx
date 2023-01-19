import formatWaterQuantity from './formatWaterQuantity';
import type { GroundwaterZoneBoundariesProperties } from '../../api';
import type { FeatureCollection, Geometry } from 'geojson';

const BLANK_CELL_CHAR = '-';
const HEADERS = ['Type', 'Bore screen depth', 'Category'];
const LIMIT_HEADERS = ['Allocation limit'];
const LIMIT_HEADERS_WITH_CATCHMENT = [
  'Sub-unit Allocation Limit',
  'Catchment Management Unit Allocation Limit',
];

export default function compileLimitsTable(
  showCatchmentUnitLimit: boolean,
  allocationLimit: string | null | undefined,
  surfaceWaterMgmtUnitLimit: string | null | undefined,
  activeZonesIds: Array<number>,
  groundWaterZoneGeoJson: FeatureCollection<
    Geometry,
    GroundwaterZoneBoundariesProperties
  >
) {
  const headers = HEADERS.concat(
    showCatchmentUnitLimit ? LIMIT_HEADERS_WITH_CATCHMENT : LIMIT_HEADERS
  );
  const rows = [
    [
      'Surface water',
      BLANK_CELL_CHAR,
      BLANK_CELL_CHAR,
      <>{allocationLimit}</>,
      surfaceWaterMgmtUnitLimit,
    ],
  ];

  const activeFeatures = groundWaterZoneGeoJson.features
    .filter((item) => activeZonesIds.includes(Number(item.id as string)))
    .map((feature) => {
      return {
        gwAllocationAmount: feature.properties.groundwater_allocation_amount,
        gwAllocationUnit: feature.properties.groundwater_allocation_amount_unit,
        depth: feature.properties.depth,
        category: feature.properties.category,
        swAllocationUnit:
          feature.properties.surface_water_allocation_amount_unit,
        swAllocationAmount: feature.properties.surface_water_allocation_amount,
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
        feature.category,
        limit,
        surfaceWaterMgmtUnitLimit,
      ]);
    });

  activeFeatures
    .filter((feature) => feature.category === 'Category B')
    .forEach((feature) => {
      rows.push([
        'Groundwater',
        feature.depth,
        feature.category,
        <>
          See Table 4.1 in PNRP
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
      rows.push(['Groundwater', feature.depth, feature.category, limit, '-']);
    });

  const showFootnote = Boolean(rows.find((row) => row[2] === 'Category B'));

  if (!showCatchmentUnitLimit) {
    rows.forEach((row) => row.pop());
  }

  return { rows, headers, showFootnote };
}
