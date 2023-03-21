import { useState } from 'react';
import { useGeoJsonQueries } from '../../api';
import mapboxgl from 'mapbox-gl';
import formatWaterQuantity from './formatWaterQuantity';
import defaultFlowLimitAndSite from './defaultFlowLimitAndSite';

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
  surfaceWaterMgmtUnitLimit?: string | null;
  surfaceWaterMgmtSubUnitLimit?: string | null;
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
    surfaceWaterMgmtUnitLimit: null,
    surfaceWaterMgmtSubUnitLimit: null,
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

    const groundWaterZonesData = result.filter(
      (value) => value.layer.id === 'groundWater'
    );
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
