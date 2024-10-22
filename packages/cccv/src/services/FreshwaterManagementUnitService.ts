import {determineBackendUri, get, post} from "@lib/api.tsx"
import FreshwaterManagementUnit, {FmuFullDetails} from "@models/FreshwaterManagementUnit.ts"
import {ErrorFlag, ErrorLevel} from "@components/ErrorContext/ErrorContext.ts"
import {IMViewLocation} from "@shared/types/global"

const service = {
    getById: async (id: number, setError: null | ((error: Error | null) => void) = null): Promise<FmuFullDetails> => {
        setError && await service.checkServiceHealth(setError)
        const response = await get(`${determineBackendUri(window.location.hostname)}/freshwater-management-units/${id}`)
        setError && !response &&
        setError(new ErrorFlag("No such Freshwater Management Unit was found.", ErrorLevel.WARNING))
        return service.augmentRecord(response) as FmuFullDetails
    },

    getByLocation: async ({
                              longitude,
                              latitude,
                              srid = null
                          }: IMViewLocation, setError: null | ((error: Error | null) => void) = null): Promise<FmuFullDetails> => {
        setError && await service.checkServiceHealth(setError)
        const response = await get(`${determineBackendUri(window.location.hostname)}/freshwater-management-units/by-lng-and-lat?lng=${longitude}&lat=${latitude}${srid ? "&srid=" + srid : ""}`)
        setError && !response &&
        setError(new ErrorFlag("No Freshwater Management Unit was not found at that location, or there was an error fetching the data. Please try again.", ErrorLevel.WARNING))
        return service.augmentRecord(response as FreshwaterManagementUnit) as FmuFullDetails
    },

    postSearchByShape: async (shape: string, setError: null | ((error: Error | null) => void) = null): Promise<FmuFullDetails[]> => {
        setError && await service.checkServiceHealth(setError)
        const response = await post(`${determineBackendUri(window.location.hostname)}/freshwater-management-units/search-for-freshwater-managements-intersecting`, shape)
        setError && !response &&
        setError(new ErrorFlag("No Freshwater Management Units were found in the selected area, or there was an error fetching the data. Please try again.", ErrorLevel.WARNING))
        return response
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
        if (!record)
            return null

        return {
            freshwaterManagementUnit: record,
            tangataWhenuaSites: record.tangataWhenuaSites
        }
    }
}

export default service