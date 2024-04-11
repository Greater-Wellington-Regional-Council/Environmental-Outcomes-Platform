import {determineBackendUri, get} from "@lib/api.tsx";
import FarmManagementUnit from "@models/FarmManagementUnit.ts";

const service = {
  getByLngAndLat: async (lng: number, lat: number): Promise<FarmManagementUnit> => {
    const response = await get(`${determineBackendUri(window.location.hostname)}/farm-management-units?lng=${lng}&lat=${lat}&srid=4326`);
    return response as FarmManagementUnit;
  }}

export default service;