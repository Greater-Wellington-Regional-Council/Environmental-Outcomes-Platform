// Server data types
interface Dictionary<T> {
  [index: string]: T;
}

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

interface Plan {
  id: number;
  councilId: number;
  defaultSurfaceWaterLimit: string;
  defaultGroundwaterLimit: string;
  defaultFlowManagementSite: string;
  defaultFlowManagementLimit: string;
}

interface CouncilRegion {
  id: number;
  name: string;
  defaultSurfaceWaterLimit: string;
  defaultGroundwaterLimit: string;
  defaultFlowManagementSite: string;
  defaultFlowManagementLimit: string;
}

interface SurfaceWaterLimit {
  id: number;
  name: string;
  planRegionId: number;
  parentSurfaceWaterLimit: number;
  allocationLimit: number;
}

interface GroundWaterLimit {
  id: number;
  limitId: number;
  name: string;
  planRegionId: number;
  allocationLimit: number;
  depth: string;
  category: string;
  depletionLimitId: number;
}

interface FlowMeasurementSite {
  id: number;
  name: string;
}

interface FlowLimit {
  id: number;
  minimumFlow: number;
  measuredAtSiteId: number;
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

interface AllPlanData {
  councils: Council[];
  councilRegions: CouncilRegion[];
  surfaceWaterUnitLimits: SurfaceWaterLimit[];
  surfaceWaterSubUnitLimits: SurfaceWaterLimit[];
  groundWaterLimits: GroundWaterLimit[];
  flowLimits: FlowLimit[];
  flowMeasurementSites: FlowMeasurementSite[];
}

interface ActiveLimits {
  councilRegion: CouncilRegion | null;
  flowLimit: FlowLimit | null;
  surfaceWaterUnitLimit: SurfaceWaterLimit | null;
  surfaceWaterSubUnitLimit: SurfaceWaterLimit | null;
  groundWaterLimits: GroundWaterLimit[];
}

interface AppState extends ActiveLimits {
  flowSite: FlowMeasurementSite | null;
  groundWaterZones: Array<number>;
  groundWaterZoneName?: string;
  surfaceWaterLimitView?: SurfaceWaterLimitView;
  catAGroundWaterLimitsView?: Dictionary<GroundwaterLimitView[]>;
  catBGroundWaterLimitsView?: Dictionary<GroundwaterLimitView[]>;
  catCGroundWaterLimitsView?: Dictionary<GroundwaterLimitView[]>;
}

interface SurfaceWaterLimitView {
  unitLimitToDisplay?: string;
  subUnitLimitToDisplay?: string;
}

interface GroundwaterLimitView {
  groundWaterLimit: GroundWaterLimit;
  depletesFromUnitLimit?: SurfaceWaterLimit;
  depletesFromSubunitLimit?: SurfaceWaterLimit;
  unitLimitToDisplay?: string;
  subUnitLimitToDisplay?: string;
}
