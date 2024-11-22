import {determineBackendUri, get} from "@lib/api.tsx"
import {announceError} from "@components/ErrorContext/announceError.ts"
import {ErrorLevel} from "@components/ErrorContext/ErrorFlagAndOrMessage.ts"

export enum SystemValueNames {
    PARKVALE_CULTURAL_OVERVIEW = "cccv.culturalOverview.parkvaleStream",
    RUAMAHANGA_WHAITUA_OVERVIEW = "cccv.whaituaOverview.ruamahanga"
}

export interface SystemValues {
    culturalOverview?: string,
    whaituaOverview?: string,
    [key: string]: unknown
}

const systemValueService = {
    getSystemValue: async (
        valueName: string,
        councilId: number | null
    ) => {
        const backendUri = determineBackendUri(window.location.hostname)
        const url = councilId !== null
            ? `${backendUri}/system-values/${councilId}/${valueName}`
            : `${backendUri}/system-values/${valueName}`

        try {
            const response = await get(url)
            if (!response) {
                announceError(`No response getting system value ${valueName}`, ErrorLevel.WARNING)
            }
            return response.value
        } catch {
            announceError(`Error getting system value ${valueName}`, ErrorLevel.WARNING)
            return null
        }
    }
}

export const getSystemValueForCouncil = async (
    valueName: SystemValueNames,
    councilId: number = 9
): Promise<string | undefined>  => {
    return await systemValueService.getSystemValue(valueName, councilId)
}

export default systemValueService