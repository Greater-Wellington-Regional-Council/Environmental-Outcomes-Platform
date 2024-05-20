import {determineBackendUri, get} from "@lib/api.tsx";
import {FmuFullDetails} from "@models/FreshwaterManagementUnit.ts";

const service = {
  getByLngAndLat: async (lng: number, lat: number, setError: null | ((error: Error | null) => void) = null): Promise<FmuFullDetails> => {
    setError && await service.checkServiceHealth(setError);
    const response = await get(`${determineBackendUri(window.location.hostname)}/freshwater-management-units?lng=${lng}&lat=${lat}&srid=4326`);
    setError && !response &&
      setError(new ErrorFlag("No Freshwater Management Unit was not found at that location, or there was an error fetching the data. Please try again.", ErrorLevel.WARNING));
    return response as FmuFullDetails;
  },
  urlToGetFmuBoundaries: (): string => `${determineBackendUri(window.location.hostname)}/freshwater-management-units/as-features`,
  isUp: async () => {
    const response = await get(`${determineBackendUri(window.location.hostname)}/health`);
    return response?.status === "UP";
  },
  checkServiceHealth: async (setError: (error: Error | null) => void, message: string | null = null) => {
    const response = await service.isUp();
    if (!response) {
      setError(new Error(message || "Freshwater Management Units API is unavailable"));
    }
  }
}

export default service;