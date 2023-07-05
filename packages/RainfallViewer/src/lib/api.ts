import useSWR, { SWRConfiguration } from 'swr';
import type { FeatureCollection, Point } from 'geojson';

const determineBackendUri = (hostname: string) => {
  switch (hostname) {
    case 'interrain.gw-eop-dev.tech':
      return 'https://data.gw-eop-dev.tech';
    case 'interrain.gw-eop-stage.tech':
      return 'https://data.gw-eop-stage.tech';
    case 'interrain.eop.gw.govt.nz':
      return 'https://data.eop.gw.govt.nz';
    default:
      return 'http://localhost:8080';
  }
};

const SWR_CONFIG: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: false,
};

// SWR docs reccommend the fetcher fn below, but this doesn't throw errors.
// const fetcher = (...args) => fetch(...args).then((res) => res.json());
async function fetcher(url: string): Promise<RainfallObservationFeatures> {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Failed to fetch rainfall data: ${response.status}`);

  return await response.json();
}

export function useRainfallData(viewParams: ViewParams) {
  const apiBasePath = determineBackendUri(window.location.hostname);
  const from = viewParams.from.toISOString();
  const to = viewParams.to.toISOString();

  const path = viewParams.showAccumulation
    ? 'rainfall-accumulation'
    : 'rainfall';
  const rainfallUrl = `${apiBasePath}/${path}?from=${from}&to=${to}`;

  const {
    data: rainfall,
    isLoading: rainfallDataIsLoading,
    error: rainfallDataError,
  } = useSWR<RainfallObservationFeatures>(rainfallUrl, fetcher, SWR_CONFIG);

  const councilsUrl = `${apiBasePath}/plan-limits/councils`;
  const {
    data: councils,
    isLoading: councilDataIsLoading,
    error: councilDataError,
  } = useSWR<FeatureCollection>(councilsUrl, fetcher, SWR_CONFIG);

  return {
    rainfall,
    councils,
    isLoading: rainfallDataIsLoading || councilDataIsLoading,
    hasError: Boolean(rainfallDataError || councilDataError),
  };
}

export interface RainfallObservationFeatures
  extends FeatureCollection<Point, RainfallObservation> {}
