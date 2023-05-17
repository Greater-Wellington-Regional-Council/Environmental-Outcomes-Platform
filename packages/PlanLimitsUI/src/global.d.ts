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
  prentSurfaceWaterLimit: number;
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
