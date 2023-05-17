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

async function fetchFeatures<T>(path: string, councilId: number, hash: string) {
  const features = await fetchFromAPI<FeatureCollection>(
    `${path}?councilId=${councilId}&v=${hash}`
  );
  return {
    features,
    data: mapFeatureCollectionPropsToType<T>(features),
  };
}

function useFeatureQuery<T>(
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
    queryFn: () => fetchFeatures<T>(path, councilId, manifest![path]),
  });
}

const manifestURL = '/plan-limits/manifest';

export function usePlanLimitsData(councilId: number) {
  const { data: manifest } = useQuery({
    queryKey: [manifestURL, councilId],
    refetchOnWindowFocus: false,
    queryFn: () =>
      fetchFromAPI<{ [key: string]: string }>(
        `${manifestURL}?councilId=${councilId}`
      ),
  });

  function useFeatureQueryWith<T>(path: string) {
    return useFeatureQuery<T>(path, manifest, councilId);
  }

  return {
    councils: useFeatureQueryWith<Council>('/plan-limits/councils'),
    councilsRegions: useFeatureQueryWith<CouncilRegion>(
      '/plan-limits/council-regions'
    ),
    surfaceWaterLimits: useFeatureQueryWith<CouncilRegion>(
      '/plan-limits/surface-water-limits'
    ),
    GroundWaterLimits: useFeatureQueryWith<GroundWaterLimit>(
      '/plan-limits/ground-water-limits'
    ),
    flowMeasurementSites: useFeatureQueryWith<FlowMeasurementSite>(
      '/plan-limits/flow-measurement-sites'
    ),
    flowLimits: useFeatureQueryWith<FlowLimit>('/plan-limits/flow-limits'),
    plan: useQuery({
      enabled: Boolean(manifest),
      queryKey: ['/plan-limits/plan', councilId],
      refetchOnWindowFocus: false,
      queryFn: () =>
        fetchFromAPI<Plan>(
          `/plan-limits/plan?councilId=${councilId}&v=${
            manifest!['/plan-limits/plan']
          }`
        ),
    }),
  };
}

const key = 'manifest';

function useGeoJsonQueries() {
  const { data: manifest } = useQuery({
    queryKey: [key],
    refetchOnWindowFocus: false,
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
      refetchOnWindowFocus: false,
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
