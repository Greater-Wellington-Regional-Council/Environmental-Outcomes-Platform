import Map from './map';
import Sidebar from './sidebar';
import React, { useState } from 'react';
import { ViewState } from 'react-map-gl';

import { PinnedLocation, ViewLocation } from './locationString';
import { GeoJSON } from 'geojson';
import { MouseState } from './index';
import { QueriesResults, UseQueryResult } from '@tanstack/react-query';

export type WaterTakeFilter = 'Surface' | 'Ground' | 'Combined';

type Props = {
  initialLocation: ViewLocation;
  setCurrentViewLocation: (viewLocation: ViewLocation) => void;
  initialPinnedLocation?: PinnedLocation;
  setCurrentPinnedLocation: (pinnedLocation?: PinnedLocation) => void;
  queries: [
    UseQueryResult<GeoJSON>,
    UseQueryResult<GeoJSON>,
    UseQueryResult<GeoJSON>,
    UseQueryResult<GeoJSON>,
    UseQueryResult<GeoJSON>
  ];
};

export default function Limitszz({
  initialLocation,
  setCurrentViewLocation,
  initialPinnedLocation,
  setCurrentPinnedLocation,
  queries,
}: Props) {
  const [waterTakeFilter, setWaterTakeFilter] =
    React.useState<WaterTakeFilter>('Combined');

  const [mouseState, setMouseState] = React.useState<MouseState>({
    position: {
      lng: 0,
      lat: 0,
    },
    council: null,
    whaitua: null,
    whaituaId: 'NONE',
    gw00: null,
    gw20: null,
    gw30: null,
    groundWaterZone: null,
    groundWaterId: 'NONE',
    site: null,
    surfaceWaterMgmtUnitId: 'NONE',
    surfaceWaterMgmtUnitDescription: null,
    surfaceWaterMgmtSubUnitId: 'NONE',
    surfaceWaterMgmtSubUnitDescription: null,
    flowRestrictionsLevel: null,
    flowRestrictionsManagementSiteName: null,
    flowRestrictionsManagementSiteId: '0',
    allocationLimit: null,
  });

  const [viewState, storeViewState] = useState<ViewState>({
    ...initialLocation,
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
        setCurrentPinnedLocation={setCurrentPinnedLocation}
        waterTakeFilter={waterTakeFilter}
        queries={queries}
      />
      <Sidebar
        mouseState={mouseState}
        waterTakeFilter={waterTakeFilter}
        setWaterTakeFilter={setWaterTakeFilter}
      />
    </>
  );
}
