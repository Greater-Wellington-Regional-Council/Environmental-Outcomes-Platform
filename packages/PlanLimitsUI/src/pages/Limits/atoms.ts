import { atomsWithQuery } from 'jotai-tanstack-query';

import { fetchGroundwaterZoneBoundaries } from '../../api';
import { atom } from 'jotai';
import { FeatureCollection } from 'geojson';

const findFeatureById = (id: string | number, geoJson: FeatureCollection) =>
  geoJson.features.find((f) => f.id == id);

export const groundwaterIdAtom = atom<string | null>(null);

export const [
  groundwaterZoneBoundariesDataAtom,
  groundwaterZoneBoundariesStatusAtom,
] = atomsWithQuery((get) => {
  return {
    queryKey: ['groundwater_zone_boundaries'],
    queryFn: fetchGroundwaterZoneBoundaries,
  };
});

export const groundwaterZoneNameAtom = atom((get) => {
  const id = get(groundwaterIdAtom);
  const geoJson = get(groundwaterZoneBoundariesStatusAtom);

  if (!id || !geoJson.data) {
    return 'None';
  }

  return findFeatureById(id, geoJson.data)?.properties?.name ?? 'None';
});
