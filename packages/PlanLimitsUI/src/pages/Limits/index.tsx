import React, { useEffect, useState } from 'react';
import {
  LoaderFunction,
  redirect,
  useLoaderData,
  useNavigate,
} from 'react-router-dom';
import { AppState, useAppState } from './useAppState';
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

  const [appState, setAppState] = useAppState();

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
    <div className="flex">
      <main className="flex-1">
        <Map
          appState={appState}
          setAppState={setAppState}
          viewState={viewState}
          setViewState={setViewState}
          initialPinnedLocation={initialPinnedLocation}
          setCurrentPinnedLocation={setPinnedLocation}
          waterTakeFilter={waterTakeFilter}
          queries={geoJsonQueries}
        />
      </main>
      <aside className="w-[36rem] h-screen overflow-y-scroll border-l border-gray-200">
        <Sidebar
          appState={appState}
          waterTakeFilter={waterTakeFilter}
          setWaterTakeFilter={setWaterTakeFilter}
          queries={geoJsonQueries}
        />
      </aside>
    </div>
  );
}
