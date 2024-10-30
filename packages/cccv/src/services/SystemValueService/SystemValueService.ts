import { ErrorFlag, ErrorLevel } from "@components/ErrorContext/ErrorContext.ts"
import { determineBackendUri, get } from "@lib/api.tsx"

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
        councilId: number | null,
        setError: (error: Error | null) => void = (error) => console.error(error),
        message: string | null = null
    ) => {
        const backendUri = determineBackendUri(window.location.hostname)
        const url = councilId !== null
            ? `${backendUri}/system-values/${councilId}/${valueName}`
            : `${backendUri}/system-values/${valueName}`

        try {
            const response = await get(url)
            if (!response) {
                throw new Error("No response from System Value API")
            }
            return response.value
        } catch (error) {
            setError(new ErrorFlag(message || "System Value API is unavailable", ErrorLevel.WARNING))
            return null
        }
    }
}

export const getSystemValueForCouncil = async (
    valueName: SystemValueNames,
    councilId: number = 9,
    setError: (error: Error | null) => void = (error) => console.error(error),
    message: string | null = null
): Promise<string | undefined>  => {
    return await systemValueService.getSystemValue(valueName, councilId, setError, message)
}

export default systemValueService