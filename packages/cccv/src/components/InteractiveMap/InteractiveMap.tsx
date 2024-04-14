import 'mapbox-gl/dist/mapbox-gl.css';
import './InteractiveMap.scss';
import React, {LegacyRef, useRef, useState} from 'react';
import {Layer, MapMouseEvent, MapRef, Source, ViewState, ViewStateChangeEvent} from "react-map-gl";
import {Map} from 'react-map-gl';
import MapStyleSelector from "@components/MapStyleSelector/MapStyleSelector.tsx";
import {urlDefaultMapStyle} from "@lib/urlsAndPaths.ts";
import {ViewLocation} from "@src/global";
import {determineBackendUri} from "@lib/api.tsx";
import { debounce } from 'lodash';

const LINZ_API_KEY = import.meta.env.VITE_LINZ_API_KEY;
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface BoundaryLinesLayerProps {
  sourceId: string,
  mapRef: MapRef
}

function BoundaryLinesLayer({ mapRef, sourceId }: BoundaryLinesLayerProps) {
  return <Layer
    id="farm-management-units"
    type="line"
    paint={{
      "line-color": `${((mapRef as never) as { mapStyle: string })?.mapStyle?.includes("aerial") ? "yellow" : "blue"}`,
      "line-width": 1,
      "line-dasharray": [2, 2],
    }}
    source={sourceId}/>;
}

export default function InteractiveMap({
                                         location,
                                         pinLocation,
                                          children,
                                       }: {
  location: ViewLocation,
  pinLocation: (location: ViewLocation) => void,
  children?: React.ReactNode,
}) {

  const mapRef = useRef<MapRef | null>(null);

  const [viewState, setViewState] = useState<ViewState>({
    latitude: location.latitude,
    longitude: location.longitude,
    zoom: location.zoom,
    bearing: 0,
    pitch: 30,
    padding: {
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
    },
  });

  const [mapStyle, setMapStyle] = useState(urlDefaultMapStyle(LINZ_API_KEY));

  const handleStyleChange = (newStyle: string) => {
    setMapStyle(newStyle || urlDefaultMapStyle(LINZ_API_KEY));
  };

  const [moving, setMoving] = useState(false);

  const handleMove = debounce((evt: ViewStateChangeEvent) => {
    setMoving(true);
    setViewState(evt.viewState);
  }, 10);

  const handleClick = (e: MapMouseEvent) => {
    if (!moving) {
      pinLocation({
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat,
        zoom: location.zoom,
      });
    }
    setMoving(false);
  }

  const handleMouseUp = () => {
    setMoving(false);
  }

  return (
    <div className={`map-container ${moving ? 'moving' : 'pointing'}`} data-testid={"InteractiveMap"}>
      <MapStyleSelector value={mapStyle} onStyleChange={handleStyleChange} apiKey={LINZ_API_KEY}/>
      <Map
        ref={mapRef as LegacyRef<MapRef>}
        data-Testid="map"
        mapStyle={mapStyle}
        style={{width: '100%', height: '100vh', cursor: moving ? 'move' : 'pointer'}}
        viewState={{...viewState, width: 100, height: 100}}
        mapboxAccessToken={MAPBOX_TOKEN}
        accessToken={LINZ_API_KEY}
        doubleClickZoom={true}
        dragPan={true}
        zoom-={11}
        minZoom={5}
        interactive={true}
        onClick={handleClick}
        onMove={handleMove}
        onMouseUp={handleMouseUp}
        trackResize={true}
        onError={(event: { error: Error; }) => {
          console.error('Map error:', event.error);
        }}>
        {children}
        <Source
          id="farm-management-units"
          type="geojson"
          data={`${determineBackendUri(window.location.hostname)}/farm-management-units/as-features`}>
          <BoundaryLinesLayer mapRef={mapRef.current!} sourceId="farm-management-units"/>
        </Source>
      </Map>
    </div>)
}