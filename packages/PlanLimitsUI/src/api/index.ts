import { GeoJSON } from 'geojson';

const determineBackendUri = (hostname: string) => {
  switch (hostname) {
    case 'plan-limits.gw-eop-dev.tech':
      return 'https://data.gw-eop-dev.tech';
    default:
      return 'http://localhost:8080';
  }
};

const defaultRequestInit: RequestInit = {
  mode: 'cors',
};

const apiBasePath = determineBackendUri(window.location.hostname);

export const fetchCouncilsGeoJson = (): Promise<GeoJSON> =>
  fetch(`${apiBasePath}/layers/councils`, defaultRequestInit).then((result) =>
    result.json()
  );

export const fetchWhaituaGeoJson = (): Promise<GeoJSON> =>
  fetch(`${apiBasePath}/layers/whaitua`, defaultRequestInit).then((result) =>
    result.json()
  );

export const fetchRiversGeoJson = (): Promise<GeoJSON> =>
  fetch(`${apiBasePath}/layers/rivers`, defaultRequestInit).then((result) =>
    result.json()
  );

export const fetchSurfaceWaterManagementUnitsGeoJson = (): Promise<GeoJSON> =>
  fetch(`${apiBasePath}/layers/surface_water_mgmt`, defaultRequestInit).then(
    (result) => result.json()
  );

export const fetchSurfaceWaterManagementSubUnitsGeoJson =
  (): Promise<GeoJSON> =>
    fetch(
      `${apiBasePath}/layers/surface_water_mgmt_sub`,
      defaultRequestInit
    ).then((result) => result.json());

export const fetchFlowManagementSites = (): Promise<GeoJSON> =>
  fetch(`${apiBasePath}/layers/flow_management_sites`, defaultRequestInit).then(
    (result) => result.json()
  );

export const fetchMinimumFlowLimitBoundaries = (): Promise<GeoJSON> =>
  fetch(
    `${apiBasePath}/layers/minimum_flow_limit_boundaries`,
    defaultRequestInit
  ).then((result) => result.json());
