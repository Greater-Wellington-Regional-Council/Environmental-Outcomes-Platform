import { useState } from 'react';
import {
  GroundwaterZoneBoundariesProperties,
  useGeoJsonQueries,
} from '../../api';
import mapboxgl from 'mapbox-gl';
import formatWaterQuantity from './formatWaterQuantity';
import defaultFlowLimitAndSite from './defaultFlowLimitAndSite';
import { Feature, Geometry } from 'geojson';

export type AppState = {
  council?: string | null;
  whaitua?: string | null;
  whaituaId: string;
  groundWaterZoneName?: string;
  groundWaterZones: Array<number>;
  site?: string | null;
  surfaceWaterMgmtUnitId: string;
  surfaceWaterMgmtUnitDescription?: string | null;
  surfaceWaterMgmtSubUnitId: string;
  surfaceWaterMgmtSubUnitDescription?: string | null;
  minimumFlowLimitId: string | null;
  flowRestrictionsLevel?: string | JSX.Element | null;
  flowRestrictionsManagementSiteName?: string | JSX.Element | null;
  flowRestrictionsManagementSiteId?: string | null;

  surfaceWaterMgmtUnitLimit?: string;
  surfaceWaterMgmtSubUnitLimit?: string;
  swLimit?: SWLimit;

  gwLimits?: GWLimit[];

  surfaceWaterUnitAllocatedAmount: string | null;
  surfaceWaterSubUnitAllocatedAmount: string | null;
};

export function useAppState(): [
  AppState,
  (result: mapboxgl.MapboxGeoJSONFeature[]) => void
] {
  const [appState, setAppState] = useState<AppState>({
    council: null,
    whaituaId: 'NONE',
    groundWaterZones: [],
    surfaceWaterMgmtUnitId: 'NONE',
    surfaceWaterMgmtSubUnitId: 'NONE',
    minimumFlowLimitId: 'NONE',
    flowRestrictionsManagementSiteId: 'NONE',
    whaitua: null,
    site: null,
    surfaceWaterMgmtUnitDescription: null,
    surfaceWaterMgmtSubUnitDescription: null,
    flowRestrictionsLevel: null,
    flowRestrictionsManagementSiteName: null,
    surfaceWaterUnitAllocatedAmount: null,
    surfaceWaterSubUnitAllocatedAmount: null,
  });

  const geoJsonQueries = useGeoJsonQueries();
  const [
    councilsGeoJson,
    whaituaGeoJson,
    surfaceWaterMgmtUnitsGeoJson,
    surfaceWaterMgmtSubUnitsGeoJson,
    flowManagementSitesGeoJson,
    minimumFlowLimitBoundariesGeoJson,
    groundwaterZoneBoundariesGeoJson,
  ] = geoJsonQueries;

  const setAppStateFromResult = (result: mapboxgl.MapboxGeoJSONFeature[]) => {
    const council = findFeature(result, 'councils', 'name');
    const whaitua = findFeature(result, 'whaitua', 'name');
    const whaituaId = findFeatureId(result, 'whaitua') || 'NONE';

    const surfaceWaterMgmtUnitId =
      findFeatureId(result, 'surfaceWaterMgmtUnits') || 'NONE';
    const surfaceWaterMgmtUnitDescription = findFeature(
      result,
      'surfaceWaterMgmtUnits',
      'name'
    );

    const surfaceWaterMgmtSubUnitId =
      findFeatureId(result, 'surfaceWaterMgmtSubUnits') || 'NONE';
    const surfaceWaterMgmtSubUnitDescription = findFeature(
      result,
      'surfaceWaterMgmtSubUnits',
      'name'
    );

    const groundWaterZonesData = result
      .filter((value) => value.layer.id === 'groundWater')
      .sort((a, b) => {
        // This specific sorting is ok because the set of values we have for Depths can always be sorted by the first character currently
        const alphabet = '0123456789>';
        const first = a.properties.depth.charAt(0);
        const second = b.properties.depth.charAt(1);
        return alphabet.indexOf(first) - alphabet.indexOf(second);
      });

    const groundWaterZones = groundWaterZonesData.map(
      (item) => item.id as number
    );
    const groundWaterZoneName = [
      // Contructing then destructuring from a Set leaves us with unique values
      ...new Set(groundWaterZonesData.map((item) => item.properties!['name'])),
    ].join(', ');

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

    const surfaceWaterMgmtSubUnitLimit =
      surfaceWaterMgmtSubUnitId === 'NONE'
        ? undefined
        : formatWaterQuantity(
            Number(
              findFeature(
                result,
                'surfaceWaterMgmtSubUnits',
                'allocation_amount'
              )
            ),
            findFeature(
              result,
              'surfaceWaterMgmtSubUnits',
              'allocation_amount_unit'
            ) as string
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

    const swLimit = getSwLimit(
      whaituaId,
      surfaceWaterMgmtUnitLimit,
      surfaceWaterMgmtSubUnitLimit
    );

    const gwLimits = getGwLimits(
      groundWaterZonesData,
      surfaceWaterMgmtSubUnitLimit
    );

    setAppState({
      ...appState,
      council,
      whaitua,
      whaituaId,
      groundWaterZoneName,
      groundWaterZones,
      site,
      surfaceWaterMgmtUnitId,
      surfaceWaterMgmtUnitDescription,
      surfaceWaterMgmtSubUnitId,
      surfaceWaterMgmtSubUnitDescription,
      minimumFlowLimitId,
      flowRestrictionsLevel,
      flowRestrictionsManagementSiteName,
      flowRestrictionsManagementSiteId,
      surfaceWaterMgmtUnitLimit,
      surfaceWaterMgmtSubUnitLimit,
      swLimit,
      gwLimits,
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
}

function getGwLimits(
  activeFeatures: Feature<Geometry, GroundwaterZoneBoundariesProperties>[],
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
    .filter((feature) => feature.properties.category === 'Category A')
    .forEach((feature) => {
      if (
        !feature.properties.surface_water_unit_allocation_amount &&
        !surfaceWaterMgmtUnitLimit
      ) {
        rows.push({
          depth: feature.properties.depth,
          category: 'A',
          useDefaultRuleForSubUnit: true,
          useDefaultRuleForUnit: true,
        });
      } else {
        const unitLimit = feature.properties
          .surface_water_unit_allocation_amount
          ? formatWaterQuantity(
              feature.properties.surface_water_unit_allocation_amount,
              feature.properties.surface_water_unit_allocation_amount_unit
            )
          : undefined;

        const subUnitLimit = feature.properties
          .surface_water_sub_unit_allocation_amount
          ? formatWaterQuantity(
              feature.properties.surface_water_sub_unit_allocation_amount,
              feature.properties.surface_water_sub_unit_allocation_amount_unit
            )
          : undefined;
        rows.push({
          depth: feature.properties.depth,
          category: 'A',
          unitLimit,
          subUnitLimit,
          useDefaultRuleForSubUnit: false,
          useDefaultRuleForUnit: false,
        });
      }
    });

  activeFeatures
    .filter((feature) => feature.properties.category === 'Category B')
    .forEach((feature) => {
      rows.push({
        depth: feature.properties.depth,
        category: 'B',
        useDefaultRuleForUnit: true,
        useDefaultRuleForSubUnit: true,
      });
    });

  activeFeatures
    .filter((feature) => feature.properties.category === 'Category C')
    .forEach((feature) => {
      const limit = formatWaterQuantity(
        feature.properties.groundwater_allocation_amount,
        feature.properties.groundwater_allocation_amount_unit
      );
      rows.push({
        depth: feature.properties.depth,
        category: 'C',
        subUnitLimit: limit,
        useDefaultRuleForSubUnit: false,
        useDefaultRuleForUnit: false,
      });
    });

  return rows;
}
