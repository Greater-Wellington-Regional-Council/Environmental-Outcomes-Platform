// Server data types
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
  name: string;
  planRegionId: number;
  allocationLimit: number;
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
  swLimit?: SWLimit;
  gwLimits?: GWLimit[];
}

interface GroundwaterZoneBoundariesProperties {
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
}

interface SWLimit {
  unitLimit?: string;
  subUnitLimit?: string;
  useDefaultRuleForUnit: boolean;
  useDefaultRuleForSubUnit: boolean;
  mergeUnit?: boolean;
  mergeSubUnit?: boolean;
}
