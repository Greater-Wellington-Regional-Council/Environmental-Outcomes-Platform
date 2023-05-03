interface Council {
  id: number;
  slug: string;
  name: string;
  headingText: string;
  defaultViewLocation: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
}

interface PinnedLocation {
  longitude: number;
  latitude: number;
}

interface ViewLocation {
  longitude: number;
  latitude: number;
  zoom: number;
}

type WaterTakeFilter = 'Surface' | 'Ground' | 'Combined';

interface Whaitua {
  id: number;
  name: string;
  defaultFlowLimitAndSite: JSX.Element;
}

interface FlowLimitBoundary {
  id: number;
  name: string;
  siteId: number;
  flowRestriction: string;
}

interface AppState {
  whaitua: Whaitua | null;
  flowLimitBoundary: FlowLimitBoundary | null;

  surfaceWaterMgmtUnitId: string | null;
  surfaceWaterMgmtUnitDescription?: string | null;
  surfaceWaterMgmtUnitLimit?: string;
  surfaceWaterMgmtUnitAllocated?: string;
  surfaceWaterMgmtUnitAllocatedPercentage?: number;

  surfaceWaterMgmtSubUnitId: string | null;
  surfaceWaterMgmtSubUnitDescription?: string | null;
  surfaceWaterMgmtSubUnitLimit?: string;
  surfaceWaterMgmtSubUnitAllocated?: string;
  surfaceWaterMgmtSubUnitAllocatedPercentage?: number;
  swLimit?: SWLimit;

  gwLimits?: GWLimit[];
  groundWaterZones: Array<number>;
  groundWaterZoneName?: string;
}
