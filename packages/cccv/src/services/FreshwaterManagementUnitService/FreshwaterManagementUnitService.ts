import {determineBackendUri, get, post} from "@lib/api.tsx"
import FreshwaterManagementUnit, {FmuFullDetails} from "@models/FreshwaterManagementUnit.ts"
import {ErrorFlag, ErrorLevel} from "@components/ErrorContext/ErrorContext.ts"
import {IMViewLocation} from "@shared/types/global"
import {Feature, FeatureCollection} from "geojson"

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
    getById: async (id: number, setError: null | ((error: Error | null) => void) = null): Promise<FmuFullDetails> => {
        setError && await service.checkServiceHealth(setError)
        const response = await get(`${determineBackendUri(window.location.hostname)}/freshwater-management-units/${id}`)
        setError && !response &&
        setError(new ErrorFlag("No such Freshwater Management Unit was found.", ErrorLevel.WARNING))
        return service.augmentRecord(response) as FmuFullDetails
    },

    getByLocation: async ({
                              longitude = undefined,
                              latitude = undefined,
                              featuresInFocus = undefined,
                              srid = null
                          }: IMViewLocation, setError: null | ((error: Error | null) => void) = null, options?: { preferType?: PreferredLocationSearchType }): Promise<FmuFullDetails[] | null> => {

        if (!longitude && !latitude && !featuresInFocus) {
            setError && setError(new ErrorFlag("No location was provided to search for Freshwater Management Units.", ErrorLevel.WARNING))
            return null
        }

        setError && await service.checkServiceHealth(setError)

        if (featuresInFocus && options?.preferType !== PreferredLocationSearchType.POINT)
            return await service.postSearchByShape(JSON.stringify(forceFeatureCollection(featuresInFocus)), setError)

        const response = await get(`${determineBackendUri(window.location.hostname)}/freshwater-management-units/by-lng-and-lat?lng=${longitude}&lat=${latitude}${srid ? "&srid=" + srid : ""}`)

        if (!response) return []

        setError && !response &&
        setError(new ErrorFlag("No Freshwater Management Unit was not found at that location, or there was an error fetching the data. Please try again.", ErrorLevel.WARNING))

        return [response as FreshwaterManagementUnit].flat().map(fc => service.augmentRecord(fc)) as FmuFullDetails[]
    },

    postSearchByShape: async (shape: string, setError: null | ((error: Error | null) => void) = null): Promise<FmuFullDetails[]> => {
        setError && await service.checkServiceHealth(setError)

        const response = await post(`${determineBackendUri(window.location.hostname)}/freshwater-management-units/search-for-freshwater-managements-intersecting`, shape, {timeout: 10000, rawPayload: true})

        if (!response) return []

        setError && !response &&
        setError(new ErrorFlag("No Freshwater Management Units were found in the selected area, or there was an error fetching the data. Please try again.", ErrorLevel.WARNING))
        return [response as FreshwaterManagementUnit].flat().map(fc => service.augmentRecord(fc)) as FmuFullDetails[]
    },

    urlToGetFmuBoundaries: (): string => `${determineBackendUri(window.location.hostname)}/freshwater-management-units?format=features`,

    isUp: async () => {
        const response = await get(`${determineBackendUri(window.location.hostname)}/health`)
        return response?.status === "UP"
    },

    checkServiceHealth: async (setError: (error: Error | null) => void, message: string | null = null) => {
        const response = await service.isUp()
        if (!response) {
            setError(new Error(message || "Freshwater Management Units API is unavailable"))
        }
    },

    augmentRecord: (record: FreshwaterManagementUnit): FmuFullDetails | null => {
        console.log('augment', record)

        if (!record)
            return null

        return {
            freshwaterManagementUnit: record,
            tangataWhenuaSites: record.tangataWhenuaSites
        }
    }
}

export default service