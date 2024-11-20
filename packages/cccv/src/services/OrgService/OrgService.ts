import freshwaterManagementUnitService from "@services/FreshwaterManagementUnitService/FreshwaterManagementUnitService.ts"
import {ErrorFlag, ErrorLevel} from "@components/ErrorContext/ErrorContext.ts"
import {determineBackendUri, get} from "@lib/api.tsx"

const service  = {
  checkServiceHealth: freshwaterManagementUnitService.checkServiceHealth,
  getContactDetails: async (setError: (error: Error | null) => void, message: string | null = null) => {
    const response = await  get(`${determineBackendUri(window.location.hostname)}/org/contact-details`)
    if (!response) {
      setError(new ErrorFlag(message || "Freshwater Management Units API is unavailable", ErrorLevel.WARNING))
      return null
    }
    return response
  }
}

export default service
