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
import { useDebounce } from 'usehooks-ts';
import { useGeoJsonQueries } from '../../api';
import { ViewState } from 'react-map-gl';
import Map from './map';
import Sidebar from './sidebar';

export const defaultViewLocation = {
  latitude: -41,
  longitude: 175.35,
  zoom: 8,
};

export type WaterTakeFilter = 'Surface' | 'Ground' | 'Combined';

export type MouseState = {
  position: {
    lng: number;
    lat: number;
  };
  council?: string | null;
  whaitua?: string | null;
  whaituaId: string;
  groundWaterId: string;
  groundWaterZoneName?: string;
  groundWaterZones: Array<number>;
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

  const geoJsonQueries = useGeoJsonQueries();

  const [waterTakeFilter, setWaterTakeFilter] =
    React.useState<WaterTakeFilter>('Combined');

  const [mouseState, setMouseState] = React.useState<MouseState>({
    position: {
      lng: 0,
      lat: 0,
    },
    council: null,
    whaituaId: 'NONE',
    groundWaterId: 'NONE',
    groundWaterZones: [],
    surfaceWaterMgmtUnitId: 'NONE',
    surfaceWaterMgmtSubUnitId: 'NONE',
    minimumFlowLimitId: 'NONE',
    flowRestrictionsManagementSiteId: 'NONE',

    whaitua: null,
    site: null,
    surfaceWaterMgmtUnitDescription: null,
    surfaceWaterMgmtSubUnitDescription: null,
    flowRestrictionsLevel: null,
    flowRestrictionsManagementSiteName: null,
    allocationLimit: null,
  });

  const [viewState, storeViewState] = useState<ViewState>({
    ...initialViewLocation,
    bearing: 0,
    pitch: 30,
    padding: {
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
    },
  });

  const setViewState = (value: ViewState) => {
    setCurrentViewLocation(value);
    storeViewState(value);
  };

  return (
    <>
      <Map
        mouseState={mouseState}
        setMouseState={setMouseState}
        viewState={viewState}
        setViewState={setViewState}
        initialPinnedLocation={initialPinnedLocation}
        setCurrentPinnedLocation={setPinnedLocation}
        waterTakeFilter={waterTakeFilter}
        queries={geoJsonQueries}
      />
      <Sidebar
        mouseState={mouseState}
        waterTakeFilter={waterTakeFilter}
        setWaterTakeFilter={setWaterTakeFilter}
        queries={geoJsonQueries}
      />
    </>
  );
}
