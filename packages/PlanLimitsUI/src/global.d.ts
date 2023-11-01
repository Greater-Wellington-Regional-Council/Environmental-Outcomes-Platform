// Server data types
interface Dictionary<T> {
  [index: string]: T;
}

interface link {
  title: string;
  url: string;
}

interface Council {
  id: number;
  slug: string;
  name: string;
  url: string;
  logo: string;
  defaultViewLocation: ViewLocation;
  footerLinks: links[];
  hasGroundwaterCategories: boolean;
  unitTypes: {
    flow: string;
    surface: string;
    ground: string;
  };
  labels: {
    headingText: string;
    surfaceWaterParent: string;
    surfaceWaterChild: string;
    region: string;
    surfaceWaterParentLimit: string;
    surfaceWaterChildLimit: string;
    groundwaterLimit: string;
  };
  regionOverrides: {
    sourceId: string;
    swCMU: React.Element | string;
    swCMSU: React.Element | string;
    gwCMU: React.Element | string;
    flowManagementSite: React.Element | string;
    flowLimit: React.Element | string;
    limitsTableFooter: React.Element | string;
    groundwaterLimit: React.Element | string;
    surfaceWaterLimit: React.Element | string;
  }[];
}

interface Usage {
  date: string;
  areaId: string;
  allocation: number;
  meteredDailyAllocation: number;
  meteredYearlyAllocation: number;
  dailyUsage: number;
}

interface Plan {
  id: number;
  councilId: number;
  defaultSurfaceWaterLimit: string;
  defaultGroundwaterLimit: string;
  defaultFlowManagementSite: string;
  defaultFlowManagementLimit: string;
}

interface PlanRegion {
  id: number;
  sourceId: string;
  planId: number;
  name: string;
  referenceUrl?: string;
  defaultSurfaceWaterLimit: string;
  defaultGroundwaterLimit: string;
  defaultFlowManagementSite: string;
  defaultFlowManagementLimit: string;
}

interface SurfaceWaterLimit {
  id: number;
  sourceId: string;
  name: string;
  planRegionId: number;
  parentSurfaceWaterLimitId: number;
  allocationLimit: number;
  allocationAmount: number;
}

interface GroundWaterLimit {
  id: number;
  limitId: number;
  sourceId: string;
  name: string;
  planRegionId: number;
  allocationLimit: number;
  allocationAmount: number;
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
  plan: Plan;
  councils: Council[];
  planRegions: PlanRegion[];
  surfaceWaterUnitLimits: SurfaceWaterLimit[];
  surfaceWaterSubUnitLimits: SurfaceWaterLimit[];
  groundWaterLimits: GroundWaterLimit[];
  flowLimits: FlowLimit[];
  flowMeasurementSites: FlowMeasurementSite[];
}

interface ActiveLimits {
  planRegion: PlanRegion | null;
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
  catAGroundWaterLimitsView?: GroupedGroundwaterLimitViews;
  catBGroundWaterLimitsView?: GroupedGroundwaterLimitViews;
  catCGroundWaterLimitsView?: GroupedGroundwaterLimitViews;
}

type GroupedGroundwaterLimitViews = Dictionary<GroundwaterLimitView[]>;

interface LimitView {
  limit?: number;
  allocated?: number;
  allocatedPercent?: number;
  overrideText?: string;
  limitToDisplay?: string;
  allocatedToDisplay?: string;
}

interface SurfaceWaterLimitView {
  unitLimitView: LimitView;
  subUnitLimitView: LimitView;
}

interface GroundwaterLimitView {
  groundWaterLimit: GroundWaterLimit;
  depletesFromUnitLimit?: SurfaceWaterLimit;
  depletesFromSubunitLimit?: SurfaceWaterLimit;
  unitLimitView: LimitView;
  subUnitLimitView: LimitView;
}

interface HeatmapDataItem {
  usage: number;
  allocation: number;
  x: string;
  y: number;
}

interface HeatmapData {
  id: string;
  data: HeatmapDataItem[];
}

interface WaterUseData {
  from: Date;
  to: Date;
  formattedFrom: string;
  formattedTo: string;
  heatmapData?: SWAndGWHeatmapData;
}
