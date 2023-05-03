import type { FeatureCollection } from 'geojson';
import { useQueries, useQuery } from '@tanstack/react-query';

const determineBackendUri = (hostname: string) => {
  switch (hostname) {
    case 'plan-limits.gw-eop-dev.tech':
      return 'https://data.gw-eop-dev.tech';
    case 'plan-limits.gw-eop-stage.tech':
      return 'https://data.gw-eop-stage.tech';
    case 'plan-limits.eop.gw.govt.nz':
      return 'https://data.eop.gw.govt.nz';
    default:
      return 'http://localhost:8080';
  }
};

export type GroundwaterZoneBoundariesProperties = {
  category: 'Category A' | 'Category B' | 'Category C';
  depth: string;
  surface_water_unit_allocation_amount_id: number;
  surface_water_unit_allocation_amount: number;
  surface_water_unit_allocation_amount_unit: string;
  surface_water_unit_allocated_amount: number;
  surface_water_sub_unit_allocation_amount_id: number;
  surface_water_sub_unit_allocation_amount: number;
  surface_water_sub_unit_allocation_amount_unit: string;
  surface_water_sub_unit_allocated_amount: number;
  groundwater_allocation_amount_id: number;
  groundwater_allocation_amount: number;
  groundwater_allocation_amount_unit: string;
  groundwater_allocated_amount: number;
};

const defaultRequestInit: RequestInit = {
  mode: 'cors',
};

const apiBasePath = determineBackendUri(window.location.hostname);

async function fetchFromAPI<T>(path: string): Promise<T> {
  const result = await fetch(`${apiBasePath}${path}`, defaultRequestInit);
  return await result.json();
}

function mapFeatureCollectionPropsToType<T>(
  featureCollection: FeatureCollection
) {
  return featureCollection.features.map((feature) => {
    return {
      id: feature.id,
      ...feature.properties,
    } as T;
  });
}

async function fetchFeaturesAndData<T>(
  path: string,
  councilId: number,
  hash: string
) {
  const features = await fetchFromAPI<FeatureCollection>(
    `${path}?councilId=${councilId}&v=${hash}`
  );
  return {
    features,
    data: mapFeatureCollectionPropsToType<T>(features),
  };
}

interface CouncilRegion {
  id: number;
  name: string;
}

function useQ<T>(
  path: string,
  manifest: { [key: string]: string } | undefined,
  councilId: number
) {
  return useQuery({
    enabled: Boolean(manifest),
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [path, councilId],
    refetchOnWindowFocus: false,
    // We use ! here since we know manifest will be populated when this executes
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: () => fetchFeaturesAndData<T>(path, councilId, manifest![path]),
  });
}

export function usePlanLimitsData(councilId: number) {
  const { data: manifest } = useQuery({
    queryKey: ['manifest', councilId],
    refetchOnWindowFocus: false,
    queryFn: () =>
      fetchFromAPI<{ [key: string]: string }>(
        `/plan-limits/manifest?councilId=${councilId}`
      ),
  });

  return {
    councils: useQ<CouncilRegion>('/plan-limits/councils', manifest, councilId),
  };
}

export function useGeoJsonQueries() {
  const { data: manifest } = useQuery({
    queryKey: ['manifest'],
    queryFn: () => fetchFromAPI<{ [key: string]: string }>('/manifest'),
  });

  const queries = [
    '/layers/councils',
    '/layers/whaitua',
    '/layers/surface-water-management-units',
    '/layers/surface-water-management-sub-units',
    '/layers/flow-management-sites',
    '/layers/flow-limits',
    '/layers/groundwater-zones',
  ].map((path) => {
    return {
      // This defers execution until the manifest query has loaded
      enabled: Boolean(manifest),
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: [path],
      queryFn: () =>
        // We use ! here since we know manifest will be populated when this executes
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        fetchFromAPI<FeatureCollection>(`${path}?v=${manifest![path]}`),
    };
  });

  return useQueries({ queries });
}

export type GeoJsonQueries = ReturnType<typeof useGeoJsonQueries>;
export type PlanLimitsData = ReturnType<typeof usePlanLimitsData>;
