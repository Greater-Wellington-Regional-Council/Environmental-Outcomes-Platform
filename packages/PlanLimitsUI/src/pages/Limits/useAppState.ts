import { useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import formatWaterQuantity from './formatWaterQuantity';

export function useAppState(
  councilId: number
): [AppState, (activeLimits: ActiveLimits, allPlanData: AllPlanData) => void] {
  const [appState, setAppState] = useState<AppState>({
    councilRegion: null,
    flowLimit: null,
    flowSite: null,
    surfaceWaterUnitLimit: null,
    surfaceWaterSubUnitLimit: null,
    groundWaterLimits: [],
    groundWaterZones: [],
  });

  const setAppStateFromResult = useCallback(
    (activeLimits: ActiveLimits, allPlanData: AllPlanData) => {
      let flowSite = null;
      if (activeLimits.flowLimit) {
        flowSite = allPlanData.flowMeasurementSites.find(
          (fs) => fs.id === activeLimits.flowLimit.measuredAtSiteId
        );
        if (!flowSite) throw new Error('Flow site not found');
      }

      const swLimit = getSwLimit(
        activeLimits.councilRegion?.id,
        activeLimits.surfaceWaterUnitLimit,
        activeLimits.surfaceWaterSubUnitLimit
      );

      const groundWaterZones = activeLimits.groundWaterLimits.map(
        (gl) => gl.id
      );
      const groundWaterZoneName = [
        // Contructing then destructuring from a Set leaves us with unique values
        ...new Set(activeLimits.groundWaterLimits.map((gwl) => gwl.name)),
      ].join(', ');

      // Groundwater
      // const groundWaterZonesData = result
      //   .filter((value) => value.layer.id === 'groundWater')
      //   .sort((a, b) => {
      //     // This specific sorting is ok because the set of values we have for Depths can always be sorted by the first character currently
      //     const alphabet = '0123456789>';
      //     const first = a.properties?.depth.charAt(0);
      //     const second = b.properties?.depth.charAt(0);
      //     return alphabet.indexOf(first) - alphabet.indexOf(second);
      //   });

      // const groundWaterZones = groundWaterZonesData.map(
      //   (item) => item.id as number
      // );
      // const groundWaterZoneName = [
      //   // Contructing then destructuring from a Set leaves us with unique values
      //   ...new Set(
      //     groundWaterZonesData.map((item) => item.properties!['name'])
      //   ),
      // ].join(', ');

      // const gwLimits = getGwLimits(
      //   groundWaterZonesData as mapboxgl.MapboxGeoJSONFeature[]
      // );

      setAppState({
        ...activeLimits,
        flowSite,
        swLimit,
        groundWaterZoneName,
        groundWaterZones,
        // gwLimits,
      });
    },
    [setAppState]
  );

  return [appState, setAppStateFromResult];
}

function getSwLimit(
  councilRegionId?: number,
  surfaceWaterUnitLimit: SurfaceWaterLimit | null,
  surfaceWaterSubUnitLimit: SurfaceWaterLimit | null
): SWLimit {
  const stat = {
    unitLimit: surfaceWaterUnitLimit?.allocationLimit.toString(),
    subUnitLimit: surfaceWaterSubUnitLimit?.allocationLimit.toString(),

    useDefaultRuleForUnit: !surfaceWaterUnitLimit,

    // Ruamahanga (Whaitua '4') uses 2 levels of surface water units. So in areas
    // where there is no value at the Subunit and there is a management unit,
    // limit P121 applies.
    useDefaultRuleForSubUnit:
      !surfaceWaterSubUnitLimit &&
      councilRegionId === 4 &&
      Boolean(surfaceWaterUnitLimit),
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
