import formatWaterQuantity from './formatWaterQuantity';
import type { GroundwaterZoneBoundariesProperties } from '../../api';
import type { FeatureCollection, Geometry } from 'geojson';
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
  >,
  whaituaId: string
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
        DEFAULT_RULE,
      ]);
    } else {
      rows.push([
        'Surface water',
        BLANK_CELL_CHAR,
        BLANK_CELL_CHAR,
        <>
          {surfaceWaterMgmtSubUnitLimit
            ? surfaceWaterMgmtSubUnitLimit
            : whaituaId.toString() === '4'
            ? DEFAULT_RULE
            : BLANK_CELL_CHAR}
        </>,
        surfaceWaterMgmtUnitLimit,
      ]);
    }
  }

  if (['Combined', 'Ground'].includes(waterTakeFilter)) {
    const activeFeatures = groundWaterZoneGeoJson.features
      .filter((item) => activeZonesIds.includes(Number(item.id as string)))
      .sort((a, b) => {
        // This specific sorting is ok because the set of values we have for Depths can always be sorted by the first character currently
        const alphabet = '0123456789>';
        const first = a.properties.depth.charAt(0);
        const second = b.properties.depth.charAt(1);
        return alphabet.indexOf(first) - alphabet.indexOf(second);
      })
      .map((feature) => {
        return {
          gwAllocationAmount: feature.properties.groundwater_allocation_amount,
          gwAllocationUnit:
            feature.properties.groundwater_allocation_amount_unit,
          depth: feature.properties.depth,
          category: feature.properties.category,
          swUnitAllocationUnit:
            feature.properties.surface_water_unit_allocation_amount_unit,
          swUnitAllocationAmount:
            feature.properties.surface_water_unit_allocation_amount,
          swSubUnitAllocationUnit:
            feature.properties.surface_water_sub_unit_allocation_amount_unit,
          swSubUnitAllocationAmount:
            feature.properties.surface_water_sub_unit_allocation_amount,
        };
      });

    if (activeFeatures.length === 0) {
      showFootnote = true;
      rows.push(['Groundwater', 'All Depths', BLANK_CELL_CHAR, DEFAULT_RULE]);
    } else {
      activeFeatures
        .filter((feature) => feature.category === 'Category A')
        .forEach((feature) => {
          if (!feature.swUnitAllocationAmount && !surfaceWaterMgmtUnitLimit) {
            rows.push(['Groundwater', feature.depth, 'A', DEFAULT_RULE]);
          } else {
            const swUnitLimit = feature.swUnitAllocationAmount
              ? formatWaterQuantity(
                  feature.swUnitAllocationAmount,
                  feature.swUnitAllocationUnit
                )
              : BLANK_CELL_CHAR;

            const swSubUnitLimit = feature.swSubUnitAllocationAmount
              ? formatWaterQuantity(
                  feature.swSubUnitAllocationAmount,
                  feature.swSubUnitAllocationUnit
                )
              : BLANK_CELL_CHAR;
            rows.push([
              'Groundwater',
              feature.depth,
              'A',
              swSubUnitLimit,
              swUnitLimit,
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
  }

  return { rows, headers: HEADERS, showFootnote };
}
