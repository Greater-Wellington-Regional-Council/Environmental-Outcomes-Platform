import {determineBackendUri, get, post} from "@lib/api.tsx"
import FreshwaterManagementUnit, {FmuFullDetails} from "@services/models/FreshwaterManagementUnit.ts"
import {IMViewLocation} from "@shared/types/global"
import {Feature, FeatureCollection} from "geojson"
import {
    getSystemValueForCouncil,
    SystemValueNames,
    SystemValues
} from "@services/SystemValueService/SystemValueService.ts"
import {announceError} from "@components/ErrorContext/announceError.ts"
import {ErrorLevel} from "@components/ErrorContext/ErrorFlagAndOrMessage.ts"

enum PreferredLocationSearchType {
    POINT = "POINT",
    SHAPE = "SHAPE"
}

function forceFeatureCollection(featuresInFocus: Feature | FeatureCollection | undefined) {
    if (!featuresInFocus) {
        return null
    }

    if (featuresInFocus.type === "Feature") {
        return {
            type: "FeatureCollection",
            features: [featuresInFocus]
        }
    }

    return featuresInFocus
}

const service = {
    getById: async (id: number): Promise<FmuFullDetails> => {
        await service.checkServiceHealth()
        const response = await get(`${determineBackendUri(window.location.hostname)}/freshwater-management-units/${id}`)

        if (!response)
            announceError(`fmuService.getById returned no response for id ${id}.`, ErrorLevel.WARNING)

        return await service.augmentRecord(response) as FmuFullDetails
    },

    getByLocation: async ({
                              longitude = undefined,
                              latitude = undefined,
                              featuresInFocus = undefined,
                              srid = null
                          }: IMViewLocation, options?: { preferType?: PreferredLocationSearchType }): Promise<FmuFullDetails[] | null> => {

        if (!longitude && !latitude && !featuresInFocus) {
            announceError("No location was provided to API call to fmuService.getByLocation()", ErrorLevel.WARNING)
            return null
        }

        await service.checkServiceHealth()

        if (featuresInFocus && options?.preferType !== PreferredLocationSearchType.POINT)
            return await service.postSearchByShape(JSON.stringify(forceFeatureCollection(featuresInFocus)))

        const response = await get(`${determineBackendUri(window.location.hostname)}/freshwater-management-units/by-lng-and-lat?lng=${longitude}&lat=${latitude}${srid ? "&srid=" + srid : ""}`)

        if (!response) return []

        return await Promise.all([response as FreshwaterManagementUnit].flat().map(async fc => await service.augmentRecord(fc))) as FmuFullDetails[]
    },

    postSearchByShape: async (shape: string): Promise<FmuFullDetails[]> => {
        await service.checkServiceHealth()

        const response = await post(`${determineBackendUri(window.location.hostname)}/freshwater-management-units/search-for-freshwater-managements-intersecting`, shape, {timeout: 10000, rawPayload: true})

        if (!response) return []

        return await Promise.all(
            [response as FreshwaterManagementUnit].flat().map(fc => service.augmentRecord(fc))
        ) as FmuFullDetails[]
    },

    urlToGetFmuBoundaries: (): string => `${determineBackendUri(window.location.hostname)}/freshwater-management-units?includeTangataWhenuaSites=false&format=features`,

    isUp: async () => {
        const response = await get(`${determineBackendUri(window.location.hostname)}/health`)
        return response?.status === "UP"
    },

    checkServiceHealth: async () => {
        const response = await service.isUp()
        if (!response) {
            announceError("The data API may be unavailable.  Please check and retry or refresh this page", ErrorLevel.ERROR)
        }
    },

    augmentRecord: async (record: FreshwaterManagementUnit): Promise<FmuFullDetails | null> => {
        if (!record)
            return null

        const systemValues: SystemValues = {}

        systemValues.whaituaOverview = await getSystemValueForCouncil(SystemValueNames.RUAMAHANGA_WHAITUA_OVERVIEW)

        return {
            freshwaterManagementUnit: record,
            tangataWhenuaSites: record.tangataWhenuaSites,
            systemValues: systemValues
        }
    }
}

export default service