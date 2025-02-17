import type { FeatureCollection, Geometry } from 'geojson';
import { useQuery } from '@tanstack/react-query';
import { camelCase, mapKeys } from 'lodash';
import { DataValueType } from '@components/DataTable/DataTable';

const REVIEW_HOST_REGEX = /.*\.amplifyapp\.com$/;
const DEV_HOST_REGEX = /.*\.gw-eop-dev\.tech$/;
const STAGE_HOST_REGEX = /.*\.gw-eop-stage\.tech$/;
const PROD_HOSTNAME = 'plan-limits.eop.gw.govt.nz';
const determineBackendUri = (hostname: string) => {
  if (PROD_HOSTNAME === hostname) {
    return 'https://data.eop.gw.govt.nz';
  }

  if (STAGE_HOST_REGEX.test(hostname)) {
    return 'https://data.gw-eop-stage.tech';
  }

  if (DEV_HOST_REGEX.test(hostname) || REVIEW_HOST_REGEX.test(hostname)) {
    return 'https://data.gw-eop-dev.tech';
  }

  return 'http://localhost:8080';
};

const defaultRequestInit: RequestInit = {
  mode: 'cors',
};

const apiBasePath = determineBackendUri(window.location.hostname);

async function fetchFromAPI<T>(path: string): Promise<T> {
  const result = await fetch(`${apiBasePath}${path}`, defaultRequestInit);
  if (result.status !== 200) {
    throw `Error fetching ${path}`;
  }
  return await result.json();
}

function mapFeatureCollectionPropsToType<T>(
  featureCollection: FeatureCollection,
) {
  featureCollection.features = featureCollection.features.map((feature) => {
    return {
      ...feature,
      properties: {
        id: feature.id,
        ...mapKeys(feature.properties, (_value, key) => camelCase(key)),
      },
    };
  });

  return featureCollection as FeatureCollection<Geometry, T>;
}

async function fetchFeatures<T>(path: string, councilId: number, hash: string) {
  const features = await fetchFromAPI<FeatureCollection>(
    `${path}?councilId=${councilId}&v=${hash}`,
  );
  return mapFeatureCollectionPropsToType<T>(features);
}

function useFeatureQuery<T>(
  path: string,
  manifest: { [key: string]: string } | undefined,
  councilId: number,
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

function splitSurfaceWaterLimits(
  sw: FeatureCollection<Geometry, SurfaceWaterLimit>,
) {
  return {
    surfaceWaterUnitLimits: {
      ...sw,
      features: sw.features.filter(
        (feature) => feature.properties.parentSurfaceWaterLimitId === null,
      ),
    } as FeatureCollection<Geometry, SurfaceWaterLimit>,
    surfaceWaterSubUnitLimits: {
      ...sw,
      features: sw.features.filter(
        (feature) => feature.properties.parentSurfaceWaterLimitId !== null,
      ),
    } as FeatureCollection<Geometry, SurfaceWaterLimit>,
  };
}

const manifestURL = '/plan-limits/manifest';

export function usePlanLimitsData(councilId: number) {
  const { data: manifest } = useQuery({
    queryKey: [manifestURL, councilId],
    refetchOnWindowFocus: false,
    queryFn: () =>
      fetchFromAPI<{ [key: string]: string }>(
        `${manifestURL}?councilId=${councilId}`,
      ),
  });

  function useFeatureQueryWith<T>(path: string) {
    return useFeatureQuery<T>(path, manifest, councilId);
  }

  const councils = useFeatureQueryWith<Council>('/plan-limits/councils');
  const planRegions = useFeatureQueryWith<PlanRegion>(
    '/plan-limits/plan-regions',
  );
  const surfaceWaterLimits = useFeatureQueryWith<SurfaceWaterLimit>(
    '/plan-limits/surface-water-limits',
  );
  const groundWaterLimits = useFeatureQueryWith<GroundWaterLimit>(
    '/plan-limits/ground-water-limits',
  );
  const flowMeasurementSites = useFeatureQueryWith<FlowMeasurementSite>(
    '/plan-limits/flow-measurement-sites',
  );
  const flowLimits = useFeatureQueryWith<FlowLimit>('/plan-limits/flow-limits');

  // TODO: can we re-use useFeatureQueryWith here?
  const plan = useQuery<Plan>({
    enabled: Boolean(manifest),
    queryKey: ['/plan-limits/plan', councilId, manifest],
    refetchOnWindowFocus: false,
    queryFn: () =>
      fetchFromAPI<Plan>(
        `/plan-limits/plan?councilId=${councilId}&v=${
          // We use ! here since we know manifest will be populated when this executes because of the enabled check
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          manifest!['/plan-limits/plan']
        }`,
      ),
  });

  // Simplify the data transformation here, and potentially combine with
  // mapFeatureCollectionPropsToType
  const isLoaded =
    councils.isSuccess &&
    planRegions.isSuccess &&
    surfaceWaterLimits.isSuccess &&
    groundWaterLimits.isSuccess &&
    flowMeasurementSites.isSuccess &&
    flowLimits.isSuccess &&
    plan.isSuccess;

  const features = isLoaded
    ? {
        councils: councils.data,
        planRegions: planRegions.data,
        ...splitSurfaceWaterLimits(surfaceWaterLimits.data),
        groundWaterLimits: groundWaterLimits.data,
        flowMeasurementSites: flowMeasurementSites.data,
        flowLimits: flowLimits.data,
        plan: plan.data as Plan | Dictionary<string | null>,
      }
    : undefined;

  const data = features
    ? {
        councils: features.councils.features.map((f) => f.properties),
        plan: mapKeys(features.plan, (_value, key) => camelCase(key)),
        planRegions: features.planRegions.features.map((f) => f.properties),
        surfaceWaterUnitLimits: features.surfaceWaterUnitLimits.features.map(
          (f) => f.properties,
        ),
        surfaceWaterSubUnitLimits:
          features.surfaceWaterSubUnitLimits.features.map((f) => f.properties),
        groundWaterLimits: features.groundWaterLimits.features.map(
          (feature) => feature.properties,
        ),
        flowLimits: features.flowLimits.features.map(
          (feature) => feature.properties,
        ),
        flowMeasurementSites: features.flowMeasurementSites.features.map(
          (feature) => feature.properties,
        ),
      }
    : undefined;

  return {
    isLoaded,
    features,
    data,
  };
}

export type PlanLimitsData = ReturnType<typeof usePlanLimitsData>;

const startOfMonth = (date_in_month: Date | null | undefined) => {
  const firstDayOfCurrentMonthDate = date_in_month || new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
  const nzFormatter = new Intl.DateTimeFormat('en-NZ', {
    timeZone: 'Pacific/Auckland',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const parts = nzFormatter.formatToParts(firstDayOfCurrentMonthDate);
  const year = parts!.find(part => part!.type === 'year')!.value;
  const month = parts!.find(part => part!.type === 'month')!.value;
  const day = parts!.find(part => part!.type === 'day')!.value;

  return `${year}-${month}-${day}`;
}

export type WaterType = 'surface' | 'ground';

export function useWaterUseQuery(councilId: number, from: string, to: string) {
  return useQuery({
    queryKey: ['/plan-limits/water-usage', councilId, from, to],
    // These settings prevent a refetch within in the same browser session
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    queryFn: () =>
      fetchFromAPI<Usage[]>(
        `/plan-limits/water-usage?councilId=${councilId}&from=${from}&to=${to}`,
      ),
  });
}

export function useWaterAllocationQuery(councilId: number, waterType: WaterType, start_month?: Array<Date> | null) {
  const formattedDate = start_month?.map(d => startOfMonth(d))?.join(",") || startOfMonth(new Date());
  const endpoint = `/plan-limits/${waterType}-water-pnrp`;

  return useQuery({
    queryKey: [endpoint, councilId, formattedDate],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    queryFn: () =>
      fetchFromAPI<Record<string, DataValueType>[]>(`${endpoint}?councilId=${councilId}&dates=${formattedDate}`),
  });
}
