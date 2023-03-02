import { FeatureCollection } from 'geojson';
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

export type GroundwaterZoneBoundariesProperties = {
  category: 'Category A' | 'Category B' | 'Category C';
  depth: string;
  surface_water_unit_allocation_amount: number;
  surface_water_unit_allocation_amount_unit: string;
  surface_water_sub_unit_allocation_amount: number;
  surface_water_sub_unit_allocation_amount_unit: string;
  groundwater_allocation_amount: number;
  groundwater_allocation_amount_unit: string;
};

export function useGeoJsonQueries() {
  const { data: manifest } = useQuery(['manifest'], () =>
    fetchFromAPI<{ [key: string]: string }>('/manifest')
  );

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
      queryKey: [path],
      // We use ! here since we know manifest will be populated when this executes
      queryFn: () =>
        fetchFromAPI<FeatureCollection>(`${path}?v=${manifest![path]}`),
    };
  });

  return useQueries({ queries });
}

export type GeoJsonQueries = ReturnType<typeof useGeoJsonQueries>;
