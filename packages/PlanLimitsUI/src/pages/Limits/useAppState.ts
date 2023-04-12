import { useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import formatWaterQuantity from './formatWaterQuantity';
import defaultFlowLimitAndSite from './defaultFlowLimitAndSite';

export type Whaitua = {
  id: number;
  name: string;
  defaultFlowLimitAndSite: JSX.Element;
};

export type FlowLimitBoundary = {
  id: number;
  name: string;
  siteId: number;
  flowRestriction: string;
};

export type AppState = {
  whaitua: Whaitua | null;
  flowLimitBoundary: FlowLimitBoundary | null;

  surfaceWaterMgmtUnitId: string | null;
  surfaceWaterMgmtUnitDescription?: string | null;
  surfaceWaterMgmtUnitLimit?: string;
  surfaceWaterMgmtUnitAllocated?: string;
  surfaceWaterMgmtUnitAllocatedPercentage?: number;

  surfaceWaterMgmtSubUnitId: string | null;
  surfaceWaterMgmtSubUnitDescription?: string | null;
  surfaceWaterMgmtSubUnitLimit?: string;
  surfaceWaterMgmtSubUnitAllocated?: string;
  surfaceWaterMgmtSubUnitAllocatedPercentage?: number;
  swLimit?: SWLimit;

  gwLimits?: GWLimit[];
  groundWaterZones: Array<number>;
  groundWaterZoneName?: string;
};

function setWhaitua(activeFeatures: mapboxgl.MapboxGeoJSONFeature[]) {
  const whaitua = activeFeatures.find((f) => f.layer.id === 'whaitua');
  if (!whaitua) return null;

  const id = Number(whaitua.id);
  return {
    id,
    name: whaitua.properties?.name,
    defaultFlowLimitAndSite: defaultFlowLimitAndSite(id),
  };
}

function setFlowLimitBoundary(activeFeatures: mapboxgl.MapboxGeoJSONFeature[]) {
  const flowLimitBoundary = activeFeatures.find(
    (f) => f.layer.id === 'minimumFlowLimitBoundaries'
  );
  if (!flowLimitBoundary) return null;

  const properties = flowLimitBoundary.properties!;
  return {
    id: Number(flowLimitBoundary.id),
    name: properties.name,
    siteId: Number(properties.site_id),
    flowRestriction: formatWaterQuantity(
      properties.plan_minimum_flow_value,
      properties.plan_minimum_flow_unit
    ),
  };
}

export function useAppState(): [
  AppState,
  (result: mapboxgl.MapboxGeoJSONFeature[]) => void
] {
  const [appState, setAppState] = useState<AppState>({
    whaitua: null,
    flowLimitBoundary: null,
    surfaceWaterMgmtUnitId: 'NONE',
    surfaceWaterMgmtUnitDescription: null,
    surfaceWaterMgmtSubUnitId: 'NONE',
    surfaceWaterMgmtSubUnitDescription: null,
    groundWaterZones: [],
  });

  const setAppStateFromResult = useCallback(
    (activeFeatures: mapboxgl.MapboxGeoJSONFeature[]) => {
      const whaitua = setWhaitua(activeFeatures);
      const flowLimitBoundary = setFlowLimitBoundary(activeFeatures);

      const result = activeFeatures;
      // Surface water MgmtUnit
      const surfaceWaterMgmtUnitId =
        findFeatureId(result, 'surfaceWaterMgmtUnits') || null;
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

      const surfaceWaterMgmtUnitAllocatedPercentage =
        surfaceWaterMgmtUnitLimitAmount && surfaceWaterMgmtUnitAllocatedAmount
          ? Math.round(
              (Number(surfaceWaterMgmtUnitAllocatedAmount) /
                Number(surfaceWaterMgmtUnitLimitAmount)) *
                100
            )
          : undefined;

      // Surface water MgmtSubUnit
      const surfaceWaterMgmtSubUnitId =
        findFeatureId(result, 'surfaceWaterMgmtSubUnits') || null;
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

      const surfaceWaterMgmtSubUnitAllocatedPercentage =
        surfaceWaterMgmtSubUnitLimitAmount &&
        surfaceWaterMgmtSubUnitAllocatedAmount
          ? Math.round(
              (Number(surfaceWaterMgmtSubUnitAllocatedAmount) /
                Number(surfaceWaterMgmtSubUnitLimitAmount)) *
                100
            )
          : undefined;

      const swLimit = getSwLimit(
        whaitua?.id,
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
          const second = b.properties?.depth.charAt(0);
          return alphabet.indexOf(first) - alphabet.indexOf(second);
        });

      const groundWaterZones = groundWaterZonesData.map(
        (item) => item.id as number
      );
      const groundWaterZoneName = [
        // Contructing then destructuring from a Set leaves us with unique values
        ...new Set(
          groundWaterZonesData.map((item) => item.properties!['name'])
        ),
      ].join(', ');

      const gwLimits = getGwLimits(
        groundWaterZonesData as mapboxgl.MapboxGeoJSONFeature[]
      );

      setAppState({
        whaitua,
        flowLimitBoundary,

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
      });
    },
    [setAppState]
  );

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
  mergeUnit?: boolean;
  mergeSubUnit?: boolean;
}

function getSwLimit(
  whaituaId?: number,
  surfaceWaterMgmtUnitLimit?: string,
  surfaceWaterMgmtSubUnitLimit?: string
): SWLimit {
  const stat = {
    unitLimit: surfaceWaterMgmtUnitLimit,
    subUnitLimit: surfaceWaterMgmtSubUnitLimit,

    useDefaultRuleForUnit: !surfaceWaterMgmtUnitLimit,

    // Ruamahanga (Whaitua '4') uses 2 levels of surface water units. So in areas
    // where there is no value at the Subunit and there is a management unit,
    // limit P121 applies.
    useDefaultRuleForSubUnit:
      !surfaceWaterMgmtSubUnitLimit &&
      whaituaId === 4 &&
      Boolean(surfaceWaterMgmtUnitLimit),
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
  parentSWUnitId?: number;
  parentSWSubUnitId?: number;
  unitAllocated?: {
    amount?: string;
    percentage?: number;
  };
  subUnitAllocated?: {
    amount?: string;
    percentage?: number;
  };
  mergeUnit?: boolean;
  mergeSubUnit?: boolean;
  groundwaterAllocationAmountId?: number;
}

function getGwLimits(activeFeatures: mapboxgl.MapboxGeoJSONFeature[]) {
  const rows: GWLimit[] = [];
  if (activeFeatures.length === 0) {
    rows.push({
      depth: 'All',
      useDefaultRuleForSubUnit: false,
      useDefaultRuleForUnit: true,
    });
    return rows;
  }

  activeFeatures
    .filter((feature) => feature.properties?.category === 'Category A')
    .forEach((feature) => {
      if (
        !feature.properties?.surface_water_unit_allocation_amount &&
        !feature.properties?.surface_water_sub_unit_allocation_amount
      ) {
        rows.push({
          depth: feature.properties?.depth,
          category: 'A',
          useDefaultRuleForSubUnit: true,
          useDefaultRuleForUnit: true,
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
          unitAllocated: allocatedProps(
            feature.properties?.surface_water_unit_allocation_amount,
            feature.properties?.surface_water_unit_allocated_amount,
            feature.properties?.surface_water_unit_allocation_amount_unit
          ),
          subUnitAllocated: allocatedProps(
            feature.properties?.surface_water_sub_unit_allocation_amount,
            feature.properties?.surface_water_sub_unit_allocated_amount,
            feature.properties?.surface_water_sub_unit_allocation_amount_unit
          ),
          parentSWUnitId:
            feature.properties?.surface_water_unit_allocation_amount_id,
          parentSWSubUnitId:
            feature.properties?.surface_water_sub_unit_allocation_amount_id,
          groundwaterAllocationAmountId:
            feature.properties?.groundwater_allocation_amount_id,
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
        useDefaultRuleForSubUnit: false,
        unitAllocated: allocatedProps(
          feature.properties?.groundwater_allocation_amount,
          feature.properties?.groundwater_allocated_amount,
          feature.properties?.groundwater_allocation_amount_unit
        ),
        parentSWUnitId:
          feature.properties?.surface_water_unit_allocation_amount_id,
        parentSWSubUnitId:
          feature.properties?.surface_water_sub_unit_allocation_amount_id,
        groundwaterAllocationAmountId:
          feature.properties?.groundwater_allocation_amount_id,
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
        unitLimit: limit,
        useDefaultRuleForSubUnit: false,
        useDefaultRuleForUnit: false,
        unitAllocated: allocatedProps(
          feature.properties?.groundwater_allocation_amount,
          feature.properties?.groundwater_allocated_amount,
          feature.properties?.groundwater_allocation_amount_unit
        ),
        parentSWUnitId:
          feature.properties?.surface_water_unit_allocation_amount_id,
        parentSWSubUnitId:
          feature.properties?.surface_water_sub_unit_allocation_amount_id,
        groundwaterAllocationAmountId:
          feature.properties?.groundwater_allocation_amount_id,
      });
    });

  return rows;
}

function allocatedProps(
  limitAmount: string,
  allocatedAmount: string,
  unit: string
) {
  let amount;
  let percentage;
  if (allocatedAmount && unit) {
    amount = formatWaterQuantity(Math.round(Number(allocatedAmount)), unit);
    if (limitAmount) {
      percentage = Math.round(
        (Number(allocatedAmount) / Number(limitAmount)) * 100
      );
    }
  }
  return { amount, percentage };
}
