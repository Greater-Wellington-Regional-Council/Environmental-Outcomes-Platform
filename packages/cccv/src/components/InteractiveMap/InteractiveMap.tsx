import 'mapbox-gl/dist/mapbox-gl.css';
import './InteractiveMap.scss';
import React, {LegacyRef, useRef, useState} from 'react';
import {
  Layer,
  MapMouseEvent,
  MapRef,
  NavigationControl,
  ScaleControl,
  Source,
  ViewState,
  ViewStateChangeEvent
} from "react-map-gl";
import {Feature, Geometry} from "geojson";
import {Map} from 'react-map-gl';
import MapStyleSelector from "@components/MapStyleSelector/MapStyleSelector.tsx";
import {urlDefaultMapStyle} from "@lib/urlsAndPaths.ts";
import {ViewLocation} from "@src/global";
import farmManagementUnitService from "@services/FarmManagementUnits.ts";
import { debounce } from 'lodash';

const LINZ_API_KEY = import.meta.env.VITE_LINZ_API_KEY;
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface BoundaryLinesLayerProps {
  id: string,
  sourceId: string,
  mapRef: MapRef,
  mapStyle: string,
}

function BoundaryLinesLayer({id, mapRef, sourceId, mapStyle = "topographical"}: BoundaryLinesLayerProps) {
  return <Layer
    id={id}
    type="line"
    paint={{
      "line-color": `${(((mapRef as never) as { mapStyle: string })?.mapStyle || mapStyle).includes("aerial") ? "yellow" : "blue"}`,
      "line-width": 2,
      "line-dasharray": [2, 2],
    }}
    source={sourceId}/>;
}

interface FeatureHighlightProps {
  highlightedFeature: Feature<Geometry> | null,
  id?: string,
  fillColor?: string,
  fillOpacity?: number,
  filter?: (string | string[] | any)[]
  sourceId: string
}

function FeatureHighlight({
                            highlightedFeature,
                            id,
                            fillColor = "orange",
                            fillOpacity = 0.3,
                            filter = ["==", ["id"], highlightedFeature?.properties?.id || null],
                            sourceId
                          }: FeatureHighlightProps) {
  return <>
    <Layer
      id={id}
      type="fill"
      paint={{
        'fill-color': fillColor,
        'fill-opacity': 0,
      }}
      source={sourceId}
    />
    {highlightedFeature && (<Layer
        id={id}
        type="fill"
        filter={
          filter
        }
        paint={{
          "fill-color": fillColor,
          "fill-opacity": fillOpacity,
        }}
        source={sourceId}
      />
    )}
  </>;
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
  }, 1);

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

  const [featureUnderPointer, setFeatureUnderPointer] = useState<Feature | null>(null);

  const handleHover = debounce((e) => {
    const map = mapRef.current;
    if (!map) return;

    const hoveredFeatures = map.queryRenderedFeatures(e.point);

    if (hoveredFeatures.length > 0) {
      setFeatureUnderPointer(hoveredFeatures[0]);
    }
  }, 0.5);

  return (
    <div className={`map-container ${moving ? 'moving' : 'pointing'}`} data-testid={"InteractiveMap"}>
      <MapStyleSelector value={mapStyle} onStyleChange={handleStyleChange} apiKey={LINZ_API_KEY}/>
      <Map
        ref={mapRef as LegacyRef<MapRef>}
        data-Testid="map"
        mapStyle={mapStyle}
        style={{width: '100%', height: '100vh', cursor: moving ? 'move' : 'pointer'}}
        viewState={{...viewState, width: 100, height: 100}}
        cursor={moving ? 'move' : 'pointer'}
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
        onMouseMove={handleHover}
        trackResize={true}
        onError={(event: { error: Error; }) => {
          console.error('Map error:', event.error);
        }}>
        <ScaleControl/>
        <NavigationControl position="top-left" visualizePitch={true}/>
        {children}
        <Source
          id="farm-management-units"
          type="geojson"
          data={farmManagementUnitService.urlToGetFmuBoundaries()}>
          <BoundaryLinesLayer id="farm-management-units" mapRef={mapRef.current!} sourceId="farm-management-units" mapStyle={mapStyle}/>
          <FeatureHighlight sourceId="farm-management-units" highlightedFeature={featureUnderPointer}/>
        </Source>
      </Map>
    </div>)
}