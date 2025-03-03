import {Feature, FeatureCollection} from "geojson"
import {SystemValues} from "@services/SystemValueService/SystemValueService.ts"

interface FarmPlanInfo {
    implementationIdeas?: string
    vpo?: string
    culturalOverview?: string
    otherInfo?: string
}

export default interface FreshwaterManagementUnit {
    id?: number | null
    gid?: string
    objectId?: number,
    fmuNo?: number,
    location?: string
    fmuName1?: string
    fmuGroup?: string
    shapeLeng?: number,
    shapeArea?: number,
    byWhen?: string
    fmuIssue?: string
    topFmuGrp?: string
    ecoliBase?: string
    periBase?: string
    periObj?: string
    phytoBase?: string
    phytoObj?: string
    tnBase?: string
    tnObj?: string
    tpBase?: string
    tpObj?: string
    tliBase?: string
    tliObj?: string
    tssBase?: string
    tssObj?: string
    macroBase?: string
    macroObj?: string
    mciBase?: string
    mciObj?: string
    ecoliObj?: string
    atoxBase?: string
    atoxObj?: string
    ntoxBase?: string
    ntoxObj?: string
    farmPlanInfo?: FarmPlanInfo
    catchmentDescription?: string
    tangataWhenuaSites?: FeatureCollection
}

export interface FmuFullDetails extends FreshwaterManagementUnit {
    freshwaterManagementUnit: FreshwaterManagementUnit
    tangataWhenuaSites?: FeatureCollection
    systemValues?: SystemValues
}

export interface FmuFullDetailsWithMap extends FmuFullDetails {
    mapImage?: string | null,
    links?: {
        gotoLink: (f: Feature | FeatureCollection) => void;
        tangataWhenuaSites: string
    },
    showHeader?: boolean
}
