import {determineBackendUri, get} from "@lib/api.tsx";
import FarmManagementUnit from "@models/FarmManagementUnit.ts";

const service = {
  getByLngAndLat: async (lng: number, lat: number): Promise<FarmManagementUnit> => {
    const response = await get(`${determineBackendUri(window.location.hostname)}/farm-management-units?lng=${lng}&lat=${lat}&srid=4326`);
    return response as FarmManagementUnit;
  },
  urlToGetFmuBoundaries: (): string => `${determineBackendUri(window.location.hostname)}/farm-management-units/as-features`,
  isUp: async () => {
    const response = await get(`${determineBackendUri(window.location.hostname)}/health`);
    return response?.status === "UP";
  },
  checkServiceHealth: async (setError: (error: Error | null) => void, message: string | null = null) => {
    const response = await service.isUp();
    if (!response) {
      setError(new Error(message || "Farm Management Units API is unavailable"));
    } else {
      setError(null);
    }
  }
}

export default service;