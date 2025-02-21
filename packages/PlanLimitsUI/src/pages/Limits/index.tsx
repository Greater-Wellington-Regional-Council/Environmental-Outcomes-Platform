import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useDebounceValue } from 'usehooks-ts';
import type { ViewState } from 'react-map-gl/maplibre';
import { useAtom } from 'jotai';
import {
  councilAtom,
  viewLocationUrlPath,
  pinnedLocationUrlParam, } from '@lib/loader';
import { useAppState } from '@lib/useAppState';
import { usePlanLimitsData } from '@src/api';
import Map from './map';
import Sidebar from './Sidebar';

import GWHeader from '@components/GWHeader/GWHeader';
import SlidingPanel from '@components/SlidingPanel/SlidingPanel';
import Navigation from '@components/Navigation/Navigation';


export default function Limits() {
  const [council] = useAtom(councilAtom);

  const navigate = useNavigate();

  const {
    locationString: initialViewLocation,
    pinnedLocation: initialPinnedLocation,
  } = useLoaderData() as { locationString: ViewLocation; pinnedLocation: ViewLocation };

  const [pinnedLocation, setPinnedLocation] = useState<PinnedLocation | null>(initialPinnedLocation);
  const [viewLocation, setViewLocation] = useState(initialViewLocation);

  const [ debouncedValue, updateValue ] = useDebounceValue<ViewLocation>(viewLocation, 500);
  useEffect(() => {
    const updatedLocation = {
      pathname: viewLocationUrlPath(council.slug, debouncedValue),
      search: pinnedLocation
        ? pinnedLocationUrlParam(pinnedLocation!)
        : undefined,
    };

    navigate(updatedLocation, { replace: true });
  }, [debouncedValue, pinnedLocation, navigate, council.slug]);

  useEffect(() => {
    updateValue(viewLocation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewLocation]);

  const [waterTakeFilter, setWaterTakeFilter] =
    useState<WaterTakeFilter>('Combined');

  const [viewState, storeViewState] = useState<ViewState>({
    ...initialViewLocation,
    bearing: 0,
    pitch: 0,
    padding: {
      left: 0,
      top: 200,
      bottom: 0,
      right: 450,
    },
    zoom: 8
  });

  const setViewState = (value: ViewState) => {
    setViewLocation(value);
    storeViewState(value);
  };

  const planLimitsData = usePlanLimitsData(council.id);
  const [appState, setAppState] = useAppState(council);

  const [ showPanel, setShowPanel ] = useState(true)

  return (
    <div className={"base-page"}>
      <GWHeader
        title="Natural Resource Plan"
        subtitle="Water Allocations and Usage"
        council={council}
      />

      <nav className="mb-4">
        <Navigation />
      </nav>

      <main role="application">
        <div className="map-panel relative h-full">
          {planLimitsData.isLoaded && (
            <Map
              appState={appState}
              setAppState={setAppState}
              viewState={viewState}
              setViewState={setViewState}
              pinnedLocation={pinnedLocation}
              setPinnedLocation={setPinnedLocation}
              waterTakeFilter={waterTakeFilter}
              planLimitsData={planLimitsData}
            />
          )}

          <SlidingPanel showPanel={showPanel} contentChanged={false} onClose={() => setShowPanel(false)}>
            <Sidebar
              appState={appState}
              waterTakeFilter={waterTakeFilter}
              setWaterTakeFilter={setWaterTakeFilter}
            />
          </SlidingPanel>
        </div>
      </main>
    </div>
  );
}
