import React, { useEffect, useState } from 'react';
import {
  LoaderFunction,
  redirect,
  useLoaderData,
  useNavigate,
} from 'react-router-dom';
import {
  createLocationString,
  createPinnedLocationString,
  parseLocationString,
  parsePinnedLocation,
  PinnedLocation,
  ViewLocation,
} from './locationString';
import Limitszz from './index2';
import { useDebounce } from 'usehooks-ts';
import { useQueries, useQuery } from '@tanstack/react-query';
import {
  fetchCouncilsGeoJson,
  fetchFlowManagementSites,
  fetchMinimumFlowLimitBoundaries,
  fetchRiversGeoJson,
  fetchSurfaceWaterManagementSubUnitsGeoJson,
  fetchSurfaceWaterManagementUnitsGeoJson,
  fetchWhaituaGeoJson,
} from '../../api';

export const defaultViewLocation = {
  latitude: -41,
  longitude: 175.35,
  zoom: 8,
};

export type MouseState = {
  position: {
    lng: number;
    lat: number;
  };
  council?: string | null;
  whaitua?: string | null;
  whaituaId: string;
  gw00?: string | null;
  gw20?: string | null;
  gw30?: string | null;
  groundWaterId: string;
  groundWaterZone?: string | null;
  site?: string | null;
  surfaceWaterMgmtUnitId: string;
  surfaceWaterMgmtUnitDescription?: string | null;
  surfaceWaterMgmtSubUnitId: string;
  surfaceWaterMgmtSubUnitDescription?: string | null;
  minimumFlowLimitId: string | null;
  flowRestrictionsLevel?: string | null;
  flowRestrictionsManagementSiteName?: string | null;
  flowRestrictionsManagementSiteId?: string | null;
  allocationLimit?: string | null;
};

export const loader: LoaderFunction = ({ params, request }) => {
  const url = new URL(request.url);
  const pinnedParam = url.searchParams.get('pinned');

  const parsedLocation = parseLocationString(params.location);
  const parsedPinnedLocation = parsePinnedLocation(pinnedParam);
  return parsedLocation
    ? {
        locationString: parsedLocation,
        pinnedLocation: parsedPinnedLocation || undefined,
      }
    : redirect(`/limits/${createLocationString(defaultViewLocation)}`);
};

export default function Limits() {
  const navigate = useNavigate();

  const {
    locationString: initialViewLocation,
    pinnedLocation: initialPinnedLocation,
  } = useLoaderData() as {
    locationString: ViewLocation;
    pinnedLocation?: PinnedLocation;
  };

  const [pinnedLocation, setPinnedLocation] = useState(initialPinnedLocation);
  const [viewLocation, setCurrentViewLocation] = useState(initialViewLocation);

  const debouncedValue = useDebounce<ViewLocation>(viewLocation, 500);
  useEffect(() => {
    if (pinnedLocation) {
      navigate({
        pathname: `/limits/${createLocationString(debouncedValue)}`,
        search: `pinned=${createPinnedLocationString(pinnedLocation)}`,
      });
    } else {
      navigate(`/limits/${createLocationString(debouncedValue)}`);
    }
  }, [debouncedValue, pinnedLocation]);

  const geoJsonQueries = useQueries({
    queries: [
      {
        queryKey: ['councils'],
        queryFn: fetchCouncilsGeoJson,
      },
      {
        queryKey: ['whaitua'],
        queryFn: fetchWhaituaGeoJson,
      },
      {
        queryKey: ['rivers'],
        queryFn: fetchRiversGeoJson,
      },
      {
        queryKey: ['surface_water_management_units'],
        queryFn: fetchSurfaceWaterManagementUnitsGeoJson,
      },
      {
        queryKey: ['surface_water_management_sub_units'],
        queryFn: fetchSurfaceWaterManagementSubUnitsGeoJson,
      },
      {
        queryKey: ['flow_management_sites'],
        queryFn: fetchFlowManagementSites,
      },
      {
        queryKey: ['minimum_flow_limit_boundaries'],
        queryFn: fetchMinimumFlowLimitBoundaries,
      },
    ],
  });

  return (
    <Limitszz
      initialLocation={initialViewLocation}
      setCurrentViewLocation={setCurrentViewLocation}
      initialPinnedLocation={initialPinnedLocation}
      setCurrentPinnedLocation={setPinnedLocation}
      queries={geoJsonQueries}
    />
  );
}
