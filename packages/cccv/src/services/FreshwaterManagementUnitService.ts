import {determineBackendUri, get} from "@lib/api.tsx"
import {FmuFullDetails} from "@models/FreshwaterManagementUnit.ts"
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
        const response = await get(`${determineBackendUri(window.location.hostname)}/freshwater-management-units?lng=${longitude}&lat=${latitude}${srid ? "&srid=" + srid : ""}`)
        setError && !response &&
        setError(new ErrorFlag("No Freshwater Management Unit was not found at that location, or there was an error fetching the data. Please try again.", ErrorLevel.WARNING))
        return service.augmentRecord(response) as FmuFullDetails
    },

    urlToGetFmuBoundaries: (): string => `${determineBackendUri(window.location.hostname)}/freshwater-management-units/as-features`,

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

    augmentRecord: (record: FmuFullDetails) => {
        if (!record)
            return record

        if (record.freshwaterManagementUnit.fmuName1 == 'Parkvale Stream' && !record.freshwaterManagementUnit.implementationIdeas)
            record.freshwaterManagementUnit.implementationIdeas = '<ul><li>Consider wetlands for water quality treatment before discharges reach the stream</li>\n<li>Setbacks from depressions and waterways should be necessary for intensive land uses including winter grazing and winter cropping</li>\n<li>Riparian planting should be undertaken in strategic spots, including to provide shade to help improve periphytn and macrophyte problems</li>\n<li>Good management of stock access to streambanks and of winter grazing may prove important in this catchment</li></ul>'

        return record
    }
}

export default service