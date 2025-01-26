import freshwaterManagementUnitService from "@services/FreshwaterManagementUnitService/FreshwaterManagementUnitService.ts"
import {determineBackendUri, get} from "@lib/api.tsx"
import {announceError} from "@components/ErrorContext/announceError.ts"
import {ErrorLevel} from "@components/ErrorContext/ErrorFlagAndOrMessage.ts"

const service  = {
  checkServiceHealth: freshwaterManagementUnitService.checkServiceHealth,
  getContactDetails: async () => {
    const response = await get(`${determineBackendUri(window.location.hostname)}/org/contact-details`)
    if (!response) {
        announceError("Error fetching contact details.  Please check API is available.", ErrorLevel.ERROR)
      return null
    }
    return response
  }
}

export default service
