import {Feature, FeatureCollection} from "geojson"
import {Address} from "../../../services/AddressesService/AddressesService"

interface Dictionary<T> {
    [index: string]: T;
}

interface link {
    title: string;
    url: string;
}

interface links {
    text: string;
    url: string;
}

interface Council {
    id: number;
    slug: string;
    name: string;
    url: string;
    logo: string;
    defaultViewLocation: IMViewLocation;
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
    usageDisplayGroups: UsageDisplayGroup[];
    [key: string]: unknown;
}

interface UsageDisplayGroup {
    name: string;
    hideLabel: boolean;
    showLegend: boolean;
    areaIds: string[];
}

interface Usage {
    date: string;
    areaId: string;
    allocationPlan: number | null;
    allocationDaily: number | null;
    allocationDailyUsed: number | null;
    dailyUsage: number | null;
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

interface IMViewLocation extends ViewLocation {
    longitude?: number;
    latitude?: number;
    zoom?: number;
    srid?: number | null;
    description?: string;
    featuresInFocus?: Feature | FeatureCollection;
    highlight?: { fillColor: string, outlineColor: string, fillOpacity: number };
    address?: Address;
}

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

interface HeatmapData {
    id: string;
    data: HeatmapDataItem[];
}

interface HeatmapDataItem {
    x: string;
    y: number | null;
}

interface WeeklyUsageHeatmapDataItem extends HeatmapDataItem {
    endOfWeek: Date;
    dailyData: ParsedUsage[];
}

interface PopulatedDailyUsageHeatmapDataItem extends HeatmapDataItem {
    date: Date;
    usage: number;
    allocation: number;
}

interface MissingDailyUsageHeatmapDataItem {
    date: Date;
    usage: number | null;
    allocation: number | null;
    x: string;
    y: number | null;
}

type DailyUsageHeatmapDataItem =
    | PopulatedDailyUsageHeatmapDataItem
    | EmptyDailyUsageHeatmapDataItem;