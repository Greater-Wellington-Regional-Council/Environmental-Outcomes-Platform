import { useState } from 'react'
import { ViewState, ViewStateChangeEvent } from 'react-map-gl'
import { debounce } from 'lodash'

export const DEFAULT_ZOOM = 8
export const DEFAULT_PITCH = 0
export const DEFAULT_PADDING = { top: 0, right: 0, bottom: 0, left: 0 }
export const DEFAULT_BEARING = 0
export const DETAILED_ZOOM = 10

export const useViewState = (initialLocation: Partial<ViewState>) => {
  const [viewState, setViewState] = useState<ViewState>({
    latitude: initialLocation.latitude ?? 0,
    longitude: initialLocation.longitude ?? 0,
    zoom: initialLocation.zoom || DEFAULT_ZOOM,
    bearing: initialLocation.bearing || DEFAULT_BEARING,
    pitch: initialLocation.pitch || DEFAULT_PITCH,
    padding: initialLocation.padding || DEFAULT_PADDING,
  })

  const handleMove = debounce((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState)
  }, 0.5)

  return {
    viewState,
    handleMove,
  }
}