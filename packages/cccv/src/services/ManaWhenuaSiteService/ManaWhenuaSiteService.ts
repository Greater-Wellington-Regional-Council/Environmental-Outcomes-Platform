import manaWhenuaSiteNames from "@lib/values/manaWhenuaSites.ts"
import { ErrorFlag, ErrorLevel } from "@components/ErrorContext/ErrorContext.ts"

const normalizeString = (str: string) => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
}

const siteService = {
    checkServiceHealth: async () => {
        return true
    },

    getBySiteName: async (
        siteName: string,
        setError?: (error: Error | null) => void,
        message: string | null = null
    ) => {
        try {
            const normalizedSiteName = normalizeString(siteName)

            const siteDetails = manaWhenuaSiteNames.find(
                (site) =>
                    normalizeString(site.siteName) === normalizedSiteName ||
                    site.aliases.some(alias => normalizeString(alias) === normalizedSiteName)
            )

            if (!siteDetails) {
                setError && setError(
                    new ErrorFlag(message || `Site with name or alias "${siteName}" not found`, ErrorLevel.WARNING)
                )
                return null
            }

            return siteDetails
        } catch (error) {
            setError && setError(new ErrorFlag(message || "Error fetching site details", ErrorLevel.ERROR))
            return null
        }
    }
}

export default siteService