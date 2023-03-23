import { useState } from 'react';
import mapboxgl from 'mapbox-gl';
import formatWaterQuantity from './formatWaterQuantity';
import defaultFlowLimitAndSite from './defaultFlowLimitAndSite';
import { GroundwaterZoneBoundariesProperties } from '../../api';

export type AppState = {
  council?: string | null;
  whaituaId: string;
  whaitua?: string | null;
  surfaceWaterMgmtUnitId: string;
  surfaceWaterMgmtUnitDescription?: string | null;
  surfaceWaterMgmtUnitLimit?: string;
  surfaceWaterMgmtUnitAllocated?: string;
  surfaceWaterMgmtUnitAllocatedPercentage?: number;

  surfaceWaterMgmtSubUnitId: string;
  surfaceWaterMgmtSubUnitDescription?: string | null;
  surfaceWaterMgmtSubUnitLimit?: string;
  surfaceWaterMgmtSubUnitAllocated?: string;
  surfaceWaterMgmtSubUnitAllocatedPercentage?: number;
  swLimit?: SWLimit;
  site?: string | null;
  minimumFlowLimitId: string | null;
  flowRestrictionsManagementSiteId?: string | null;
  flowRestrictionsLevel?: string | JSX.Element | null;
  flowRestrictionsManagementSiteName?: string | JSX.Element | null;
  gwLimits?: GWLimit[];
  groundWaterZones: Array<number>;
  groundWaterZoneName?: string;
};

export function useAppState(): [
  AppState,
  (result: mapboxgl.MapboxGeoJSONFeature[]) => void
] {
  const [appState, setAppState] = useState<AppState>({
    council: null,
    whaituaId: 'NONE',
    whaitua: null,
    surfaceWaterMgmtUnitId: 'NONE',
    surfaceWaterMgmtUnitDescription: null,
    surfaceWaterMgmtSubUnitId: 'NONE',
    surfaceWaterMgmtSubUnitDescription: null,
    site: null,
    minimumFlowLimitId: 'NONE',
    flowRestrictionsManagementSiteId: 'NONE',
    flowRestrictionsLevel: null,
    flowRestrictionsManagementSiteName: null,
    groundWaterZones: [],
  });

  const setAppStateFromResult = (result: mapboxgl.MapboxGeoJSONFeature[]) => {
    const council = findFeature(result, 'councils', 'name');
    const whaitua = findFeature(result, 'whaitua', 'name');
    const whaituaId = findFeatureId(result, 'whaitua') || 'NONE';

    // Surface water MgmtUnit
    const surfaceWaterMgmtUnitId =
      findFeatureId(result, 'surfaceWaterMgmtUnits') || 'NONE';
    const surfaceWaterMgmtUnitDescription = findFeature(
      result,
      'surfaceWaterMgmtUnits',
      'name'
    );
    const surfaceWaterMgmtUnitLimitAmount = findFeature(
      result,
      'surfaceWaterMgmtUnits',
      'allocation_amount'
    );
    const surfaceWaterMgmtUnitLimit = surfaceWaterMgmtUnitLimitAmount
      ? formatWaterQuantity(
          Number(surfaceWaterMgmtUnitLimitAmount),
          findFeature(
            result,
            'surfaceWaterMgmtUnits',
            'allocation_amount_unit'
          ) as string
        )
      : undefined;

    const surfaceWaterMgmtUnitAllocatedAmount = findFeature(
      result,
      'surfaceWaterMgmtUnits',
      'allocated_amount'
    );
    const surfaceWaterMgmtUnitAllocated = surfaceWaterMgmtUnitAllocatedAmount
      ? formatWaterQuantity(
          Math.round(Number(surfaceWaterMgmtUnitAllocatedAmount)),
          findFeature(
            result,
            'surfaceWaterMgmtUnits',
            'allocation_amount_unit'
          ) as string
        )
      : undefined;

    let surfaceWaterMgmtUnitAllocatedPercentage =
      surfaceWaterMgmtUnitLimitAmount && surfaceWaterMgmtUnitAllocatedAmount
        ? Math.round(
            (Number(surfaceWaterMgmtUnitAllocatedAmount) /
              Number(surfaceWaterMgmtUnitLimitAmount)) *
              100
          )
        : undefined;

    // Surface water MgmtSubUnit
    const surfaceWaterMgmtSubUnitId =
      findFeatureId(result, 'surfaceWaterMgmtSubUnits') || 'NONE';
    const surfaceWaterMgmtSubUnitDescription = findFeature(
      result,
      'surfaceWaterMgmtSubUnits',
      'name'
    );
    const surfaceWaterMgmtSubUnitLimitAmount = findFeature(
      result,
      'surfaceWaterMgmtSubUnits',
      'allocation_amount'
    );
    const surfaceWaterMgmtSubUnitLimit = surfaceWaterMgmtSubUnitLimitAmount
      ? formatWaterQuantity(
          Number(surfaceWaterMgmtSubUnitLimitAmount),
          findFeature(
            result,
            'surfaceWaterMgmtSubUnits',
            'allocation_amount_unit'
          ) as string
        )
      : undefined;

    const surfaceWaterMgmtSubUnitAllocatedAmount = findFeature(
      result,
      'surfaceWaterMgmtSubUnits',
      'allocated_amount'
    );
    const surfaceWaterMgmtSubUnitAllocated =
      surfaceWaterMgmtSubUnitAllocatedAmount
        ? formatWaterQuantity(
            Math.round(Number(surfaceWaterMgmtSubUnitAllocatedAmount)),
            findFeature(
              result,
              'surfaceWaterMgmtSubUnits',
              'allocation_amount_unit'
            ) as string
          )
        : undefined;

    let surfaceWaterMgmtSubUnitAllocatedPercentage =
      surfaceWaterMgmtSubUnitLimitAmount &&
      surfaceWaterMgmtSubUnitAllocatedAmount
        ? Math.round(
            (Number(surfaceWaterMgmtSubUnitAllocatedAmount) /
              Number(surfaceWaterMgmtSubUnitLimitAmount)) *
              100
          )
        : undefined;

    const swLimit = getSwLimit(
      whaituaId,
      surfaceWaterMgmtUnitLimit,
      surfaceWaterMgmtSubUnitLimit
    );

    // Groundwater
    const groundWaterZonesData = result
      .filter((value) => value.layer.id === 'groundWater')
      .sort((a, b) => {
        // This specific sorting is ok because the set of values we have for Depths can always be sorted by the first character currently
        const alphabet = '0123456789>';
        const first = a.properties?.depth.charAt(0);
        const second = b.properties?.depth.charAt(1);
        return alphabet.indexOf(first) - alphabet.indexOf(second);
      });

    const groundWaterZones = groundWaterZonesData.map(
      (item) => item.id as number
    );
    const groundWaterZoneName = [
      // Contructing then destructuring from a Set leaves us with unique values
      ...new Set(groundWaterZonesData.map((item) => item.properties!['name'])),
    ].join(', ');

    const gwLimits = getGwLimits(
      groundWaterZonesData as mapboxgl.MapboxGeoJSONFeature[],
      surfaceWaterMgmtSubUnitLimit
    );

    // Flow management
    const site = findFeature(result, 'flowSites', 'Name');

    const minimumFlowLimitId =
      findFeatureId(result, 'minimumFlowLimitBoundaries') || 'NONE';

    const flowRestrictionsManagementSiteId =
      findFeature(result, 'minimumFlowLimitBoundaries', 'site_id') || 'NONE';
    const flowRestrictionsManagementSiteName =
      findFeature(result, 'minimumFlowLimitBoundaries', 'name') ||
      defaultFlowLimitAndSite(whaituaId);

    const flowRestrictionsAmount = findFeature(
      result,
      'minimumFlowLimitBoundaries',
      'plan_minimum_flow_value'
    );

    const flowRestrictionsUnit = findFeature(
      result,
      'minimumFlowLimitBoundaries',
      'plan_minimum_flow_unit'
    );

    const flowRestrictionsLevel = flowRestrictionsAmount
      ? formatWaterQuantity(
          Number(flowRestrictionsAmount),
          flowRestrictionsUnit as string
        )
      : defaultFlowLimitAndSite(whaituaId);

    setAppState({
      ...appState,
      council,
      whaituaId,
      whaitua,

      // SW
      surfaceWaterMgmtUnitId,
      surfaceWaterMgmtUnitDescription,
      surfaceWaterMgmtUnitLimit,
      surfaceWaterMgmtUnitAllocated,
      surfaceWaterMgmtUnitAllocatedPercentage,
      surfaceWaterMgmtSubUnitId,
      surfaceWaterMgmtSubUnitDescription,
      surfaceWaterMgmtSubUnitLimit,
      surfaceWaterMgmtSubUnitAllocated,
      surfaceWaterMgmtSubUnitAllocatedPercentage,

      swLimit,
      // GW
      groundWaterZoneName,
      groundWaterZones,
      gwLimits,
      // Flow
      site,
      minimumFlowLimitId,
      flowRestrictionsLevel,
      flowRestrictionsManagementSiteName,
      flowRestrictionsManagementSiteId,
    });
  };

  return [appState, setAppStateFromResult];
}

const findFeature = (
  features: mapboxgl.MapboxGeoJSONFeature[],
  layer: string,
  prop: string
) =>
  features.find((feat) => feat.layer.id === layer)?.properties?.[prop] as
    | string
    | undefined;

const findFeatureId = (
  features: mapboxgl.MapboxGeoJSONFeature[],
  layer: string
) => features.find((feat) => feat.layer.id === layer)?.id as string;

interface SWLimit {
  subUnitLimit?: string;
  unitLimit?: string;
  useDefaultRuleForUnit: boolean;
  useDefaultRuleForSubUnit: boolean;
}

function getSwLimit(
  whaituaId: string,
  surfaceWaterMgmtUnitLimit?: string,
  surfaceWaterMgmtSubUnitLimit?: string
): SWLimit {
  const stat = {
    unitLimit: surfaceWaterMgmtUnitLimit,
    subUnitLimit: surfaceWaterMgmtSubUnitLimit,
    useDefaultRuleForUnit:
      !surfaceWaterMgmtUnitLimit && !surfaceWaterMgmtSubUnitLimit,
    useDefaultRuleForSubUnit:
      (!surfaceWaterMgmtUnitLimit && !surfaceWaterMgmtSubUnitLimit) ||
      (!surfaceWaterMgmtSubUnitLimit && whaituaId === '4'),
  };
  return stat;
}

interface GWLimit {
  depth: string;
  category?: string;
  subUnitLimit?: string;
  unitLimit?: string;
  useDefaultRuleForUnit: boolean;
  useDefaultRuleForSubUnit: boolean;
  allocated?: string;
  allocatedPercentage?: number;
}

function getGwLimits(
  activeFeatures: mapboxgl.MapboxGeoJSONFeature[],
  surfaceWaterMgmtUnitLimit?: string
) {
  const rows: GWLimit[] = [];
  if (activeFeatures.length === 0) {
    rows.push({
      depth: 'All Depths',
      useDefaultRuleForSubUnit: true,
      useDefaultRuleForUnit: true,
    });
    return rows;
  }

  activeFeatures
    .filter((feature) => feature.properties?.category === 'Category A')
    .forEach((feature) => {
      if (
        !feature.properties?.surface_water_unit_allocation_amount &&
        !surfaceWaterMgmtUnitLimit
      ) {
        rows.push({
          depth: feature.properties?.depth,
          category: 'A',
          useDefaultRuleForSubUnit: true,
          useDefaultRuleForUnit: true,
          allocated: feature.properties?.groundwater_allocated_amount,
        });
      } else {
        const unitLimit = feature.properties
          ?.surface_water_unit_allocation_amount
          ? formatWaterQuantity(
              feature.properties.surface_water_unit_allocation_amount,
              feature.properties.surface_water_unit_allocation_amount_unit
            )
          : undefined;

        const subUnitLimit = feature.properties
          ?.surface_water_sub_unit_allocation_amount
          ? formatWaterQuantity(
              feature.properties.surface_water_sub_unit_allocation_amount,
              feature.properties.surface_water_sub_unit_allocation_amount_unit
            )
          : undefined;

        rows.push({
          depth: feature.properties?.depth,
          category: 'A',
          unitLimit,
          subUnitLimit,
          useDefaultRuleForSubUnit: false,
          useDefaultRuleForUnit: false,
          ...allocatedProps(
            feature.properties?.surface_water_sub_unit_allocation_amount,
            // This should be feature.properties?.parent_surface_water_sub_unit_allocated_amount,
            feature.properties?.groundwater_allocated_amount,
            feature.properties?.groundwater_allocation_amount_unit
          ),
        });
      }
    });

  activeFeatures
    .filter((feature) => feature.properties?.category === 'Category B')
    .forEach((feature) => {
      rows.push({
        depth: feature.properties?.depth,
        category: 'B',
        useDefaultRuleForUnit: true,
        useDefaultRuleForSubUnit: true,
        ...allocatedProps(
          feature.properties?.groundwater_allocation_amount,
          feature.properties?.groundwater_allocated_amount,
          feature.properties?.groundwater_allocation_amount_unit
        ),
      });
    });

  activeFeatures
    .filter((feature) => feature.properties?.category === 'Category C')
    .forEach((feature) => {
      const limit = formatWaterQuantity(
        feature.properties?.groundwater_allocation_amount,
        feature.properties?.groundwater_allocation_amount_unit
      );

      rows.push({
        depth: feature.properties?.depth,
        category: 'C',
        subUnitLimit: limit,
        useDefaultRuleForSubUnit: false,
        useDefaultRuleForUnit: false,
        ...allocatedProps(
          feature.properties?.groundwater_allocation_amount,
          feature.properties?.groundwater_allocated_amount,
          feature.properties?.groundwater_allocation_amount_unit
        ),
      });
    });

  return rows;
}

function allocatedProps(
  limitAmount: string,
  allocatedAmount: string,
  unit: string
) {
  let allocated;
  let allocatedPercentage;
  if (allocatedAmount && unit) {
    allocated = formatWaterQuantity(Number(allocatedAmount), unit);
    if (limitAmount) {
      allocatedPercentage = Math.round(
        (Number(allocatedAmount) / Number(limitAmount)) * 100
      );
    }
  }
  return { allocated, allocatedPercentage };
}
