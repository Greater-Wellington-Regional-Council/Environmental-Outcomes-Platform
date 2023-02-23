import formatWaterQuantity from './formatWaterQuantity';
import type { GroundwaterZoneBoundariesProperties } from '../../api';
import type { FeatureCollection, Geometry } from 'geojson';
import type { WaterTakeFilter } from './';

const BLANK_CELL_CHAR = '-';

export const GROUNDWATER_CATEGORY_B_RULE = (
  <>
    See Table 4.1 of PNRP
    <sup>
      <a href="#PNRP41">1</a>
    </sup>
  </>
);

export const SURFACE_WATER_DEFAULT_RULE = (
  <>
    Refer to Policy P121 of PRNP
    <sup>
      <a href="#PRNP121">2</a>
    </sup>
  </>
);

const HEADERS = [
  'Type',
  'Bore screen depth',
  'Category',
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
    if (!surfaceWaterMgmtUnitLimit && !surfaceWaterMgmtSubUnitLimit) {
      showFootnote = true;
      rows.push([
        'Surface water',
        BLANK_CELL_CHAR,
        BLANK_CELL_CHAR,
        SURFACE_WATER_DEFAULT_RULE,
      ]);
    } else {
      rows.push([
        'Surface water',
        BLANK_CELL_CHAR,
        BLANK_CELL_CHAR,
        <>
          {surfaceWaterMgmtSubUnitLimit
            ? surfaceWaterMgmtSubUnitLimit
            : BLANK_CELL_CHAR}
        </>,
        surfaceWaterMgmtUnitLimit,
      ]);
    }
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
        if (!feature.swAllocationAmount && !surfaceWaterMgmtUnitLimit) {
          rows.push([
            'Groundwater',
            feature.depth,
            'A',
            SURFACE_WATER_DEFAULT_RULE,
          ]);
        } else {
          const limit = feature.swAllocationAmount
            ? formatWaterQuantity(
                feature.swAllocationAmount,
                feature.swAllocationUnit
              )
            : BLANK_CELL_CHAR;
          rows.push([
            'Groundwater',
            feature.depth,
            'A',
            limit,
            surfaceWaterMgmtUnitLimit,
          ]);
        }
      });

    activeFeatures
      .filter((feature) => feature.category === 'Category B')
      .forEach((feature) => {
        showFootnote = true;
        rows.push([
          'Groundwater',
          feature.depth,
          'B',
          GROUNDWATER_CATEGORY_B_RULE,
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

  return { rows, headers: HEADERS, showFootnote };
}
