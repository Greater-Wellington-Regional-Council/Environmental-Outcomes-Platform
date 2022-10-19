import Map from './map';
import Sidebar from './sidebar';
import React from 'react';
import { ViewState } from 'react-map-gl';
import useLocalStorage from '../../lib/useLocalStorage';

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
  river?: string | null;
  surfaceWater?: string | null;
  surfaceWaterId: string;
  flowRestrictionsLevel?: string | null;
  flowRestrictionsManagementSiteName?: string | null;
  flowRestrictionsManagementSiteId: string;
  allocationLimit?: string | null;
  allocationLimitId: string;
};

export default function Dashboard() {
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
    river: null,
    surfaceWater: null,
    surfaceWaterId: 'NONE',
    flowRestrictionsLevel: null,
    flowRestrictionsManagementSiteName: null,
    flowRestrictionsManagementSiteId: 'NONE',
    allocationLimit: null,
    allocationLimitId: 'NONE',
  });

  const [viewState, setViewState] = useLocalStorage<ViewState>('map-state', {
    longitude: 175.35,
    latitude: -41,
    bearing: 0,
    zoom: 8,
    pitch: 30,
    padding: {
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
    },
  });

  return (
    <>
      <Map
        mouseState={mouseState}
        setMouseState={setMouseState}
        viewState={viewState}
        setViewState={setViewState}
      />
      <Sidebar mouseState={mouseState} />
    </>
  );
}
