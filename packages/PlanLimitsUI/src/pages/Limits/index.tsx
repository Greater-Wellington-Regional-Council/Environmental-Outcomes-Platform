import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useDebounce } from 'usehooks-ts';
import type { ViewState } from 'react-map-gl';
import { useAtom } from 'jotai';
import { councilAtom } from '../../lib/loader';
import { useAppState } from './useAppState';
import { usePlanLimitsData } from '../../api';
import Map from './map';
import Sidebar from './sidebar';
import {
  type loader,
  viewLocationUrlPath,
  pinnedLocationUrlParam,
} from '../../lib/loader';

export default function Limits() {
  const [council] = useAtom(councilAtom);

  const navigate = useNavigate();

  const {
    locationString: initialViewLocation,
    pinnedLocation: initialPinnedLocation,
  } = useLoaderData() as ReturnType<typeof loader>;

  const [pinnedLocation, setPinnedLocation] = useState(initialPinnedLocation);
  const [viewLocation, setViewLocation] = useState(initialViewLocation);

  const debouncedValue = useDebounce<ViewLocation>(viewLocation, 500);
  useEffect(() => {
    const updatedLocation = {
      pathname: viewLocationUrlPath(council.slug, debouncedValue),
      search: pinnedLocation
        ? pinnedLocationUrlParam(pinnedLocation)
        : undefined,
    };

    navigate(updatedLocation, { replace: true });
  }, [debouncedValue, pinnedLocation, navigate, council.slug]);

  const [waterTakeFilter, setWaterTakeFilter] =
    useState<WaterTakeFilter>('Combined');

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
    setViewLocation(value);
    storeViewState(value);
  };

  const planLimitsData = usePlanLimitsData(council.id);
  const [appState, setAppState] = useAppState();

  return (
    <div className="flex">
      <main className="flex-1">
        {/* TODO: Temp workaround to ensure limits for pinned locations are displayed on load */}
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
      </main>
      <aside className="w-[36rem] h-screen overflow-y-scroll border-l border-gray-200">
        <Sidebar
          appState={appState}
          waterTakeFilter={waterTakeFilter}
          setWaterTakeFilter={setWaterTakeFilter}
        />
      </aside>
    </div>
  );
}
