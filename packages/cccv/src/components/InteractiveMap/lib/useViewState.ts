import { useState } from 'react';
import { ViewState, ViewStateChangeEvent } from 'react-map-gl';
import { debounce } from 'lodash';

const DEFAULT_ZOOM = 8;

export const useViewState = (initialLocation: ViewState) => {
  const [viewState, setViewState] = useState<ViewState>({
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    zoom: initialLocation.zoom || DEFAULT_ZOOM,
    bearing: 0,
    pitch: 30,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  const handleMove = debounce((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  }, 0.5);

  return {
    viewState,
    handleMove,
  };
};