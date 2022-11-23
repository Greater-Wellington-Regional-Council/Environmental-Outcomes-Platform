import React, { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { createLocationString, ViewLocation } from './locationString';
import Limitszz from './index2';
import { useDebounce } from 'usehooks-ts';

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
  river?: string | null;
  surfaceWater?: string | null;
  surfaceWaterId: string;
  flowRestrictionsLevel?: string | null;
  flowRestrictionsManagementSiteName?: string | null;
  flowRestrictionsManagementSiteId: string;
  allocationLimit?: string | null;
  allocationLimitId: string;
};

export default function Limits() {
  const navigate = useNavigate();

  const initialViewLocation = useLoaderData() as ViewLocation;

  const [viewLocation, setCurrentViewLocation] = useState(initialViewLocation);
  const debouncedValue = useDebounce<ViewLocation>(viewLocation, 500);

  useEffect(() => {
    navigate(`/limits/${createLocationString(debouncedValue)}`);
  }, [debouncedValue]);

  return (
    <Limitszz
      initialLocation={initialViewLocation}
      setCurrentViewLocation={setCurrentViewLocation}
    />
  );
}
