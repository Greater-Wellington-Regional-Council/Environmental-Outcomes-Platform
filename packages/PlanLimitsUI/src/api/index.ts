import { FeatureCollection, Geometry } from 'geojson';

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

export const fetchCouncilsGeoJson = (): Promise<FeatureCollection> =>
  fetch(`${apiBasePath}/layers/councils`, defaultRequestInit).then((result) =>
    result.json()
  );

export const fetchWhaituaGeoJson = (): Promise<FeatureCollection> =>
  fetch(`${apiBasePath}/layers/whaitua`, defaultRequestInit).then((result) =>
    result.json()
  );

export const fetchRiversGeoJson = (): Promise<FeatureCollection> =>
  fetch(`${apiBasePath}/layers/rivers`, defaultRequestInit).then((result) =>
    result.json()
  );

export const fetchSurfaceWaterManagementUnitsGeoJson =
  (): Promise<FeatureCollection> =>
    fetch(`${apiBasePath}/layers/surface_water_mgmt`, defaultRequestInit).then(
      (result) => result.json()
    );

export const fetchSurfaceWaterManagementSubUnitsGeoJson =
  (): Promise<FeatureCollection> =>
    fetch(
      `${apiBasePath}/layers/surface_water_mgmt_sub`,
      defaultRequestInit
    ).then((result) => result.json());

export const fetchFlowManagementSites = (): Promise<FeatureCollection> =>
  fetch(`${apiBasePath}/layers/flow_management_sites`, defaultRequestInit).then(
    (result) => result.json()
  );

export const fetchMinimumFlowLimitBoundaries = (): Promise<FeatureCollection> =>
  fetch(
    `${apiBasePath}/layers/minimum_flow_limit_boundaries`,
    defaultRequestInit
  ).then((result) => result.json());

export type GroundwaterZoneBoundariesProperties = {
  category: 'Category A' | 'Category B' | 'Category C';
  depth: string;
  surface_water_allocation_amount: string;
  surface_water_allocation_amount_unit: string;
  groundwater_allocation_amount: string;
  groundwater_allocation_amount_unit: string;
};

export const fetchGroundwaterZoneBoundaries = (): Promise<
  FeatureCollection<Geometry, GroundwaterZoneBoundariesProperties>
> =>
  fetch(
    `${apiBasePath}/layers/groundwater_zone_boundaries`,
    defaultRequestInit
  ).then((result) => result.json());
