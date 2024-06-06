import 'mapbox-gl/dist/mapbox-gl.css';
import './InteractiveMap.scss';
import React, {LegacyRef, useContext, useRef, useState} from 'react';
import {
  Layer,
  Map,
  MapboxGeoJSONFeature,
  MapMouseEvent,
  MapRef,
  Marker,
  NavigationControl,
  ScaleControl,
  Source,
  ViewState,
  ViewStateChangeEvent
} from "react-map-gl";
import {Feature, Geometry} from "geojson";
import MapStyleSelector from "@components/MapStyleSelector/MapStyleSelector.tsx";
import {urlDefaultMapStyle} from "@lib/urlsAndPaths.ts";
import {ViewLocation} from "@src/global";
import freshwaterManagementUnitService from "@services/FreshwaterManagementUnitService.ts";
import {debounce} from 'lodash';
import ErrorContext from "@components/ErrorContext/ErrorContext.ts";
import env from "@src/env.ts";

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
  highlightedFeature: Feature<Geometry> | null | undefined,
  id?: string,
  fillColor?: string,
  fillOpacity?: number,
  filter?: (string | string[] | never)[]
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
                                         highlightedFeature,
                                         setHighlightedFeature,
                                         children
                                       }: {
  location: ViewLocation,
  pinLocation: (location: ViewLocation) => void,
  children?: React.ReactNode,
  highlightedFeature?: Feature | null,
  setHighlightedFeature?: (feature: Feature | null) => void
}) {
  const setError = useContext(ErrorContext).setError;

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

  const [mapStyle, setMapStyle] = useState(urlDefaultMapStyle(env.LINZ_API_KEY));

  const handleStyleChange = (newStyle: string) => {
    setMapStyle(newStyle || urlDefaultMapStyle(env.LINZ_API_KEY));
  };

  const [moving, setMoving] = useState(false);

  const [tooltipInfo, setTooltipInfo] = useState<{ feature: MapboxGeoJSONFeature | null, x: number, y: number }>({ feature: null, x: 0, y: 0 });

  const handleMove = debounce((evt: ViewStateChangeEvent) => {
    setMoving(true);
    setViewState(evt.viewState);
  }, 1);

  const [ marker, setMarker ] = useState<[number, number] | null>(null);

  const handleClick = (e: MapMouseEvent) => {
    setError(null);

    if (!moving) {
      pinLocation({
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat,
        zoom: location.zoom,
      });
      setMarker([e.lngLat.lng, e.lngLat.lat])
    }
    setMoving(false);
  }

  const handleMouseUp = () => {
    setMoving(false);
  }

  const handleHover = debounce((e) => {
    const map = mapRef.current;
    if (!map) return;

    const hoveredFeatures = map.queryRenderedFeatures(e.point);

    if (hoveredFeatures.length > 0) {
      setHighlightedFeature && setHighlightedFeature(hoveredFeatures[0]);
      setTooltipInfo({
        feature: hoveredFeatures[0],
        x: e.point.x,
        y: e.point.y
      });
    } else {
      setTooltipInfo({ feature: null, x: 0, y: 0 });
    }
  }, 0.5);

  return (
    <div className={`map-container ${moving ? 'moving' : 'pointing'}`} data-testid={"InteractiveMap"}>
      <MapStyleSelector value={mapStyle} onStyleChange={handleStyleChange} apiKey={env.LINZ_API_KEY}/>
      <Map
        ref={mapRef as LegacyRef<MapRef>}
        data-Testid="map"
        mapStyle={mapStyle}
        style={{width: '100%', height: '100vh', cursor: moving ? 'move' : 'pointer'}}
        viewState={{...viewState, width: 100, height: 100}}
        cursor={moving ? 'move' : 'pointer'}
        mapboxAccessToken={env.MAPBOX_TOKEN}
        accessToken={env.LINZ_API_KEY}
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
          id="freshwater-management-units"
          type="geojson"
          data={freshwaterManagementUnitService.urlToGetFmuBoundaries()}>
          <BoundaryLinesLayer id="freshwater-management-units" mapRef={mapRef.current!} sourceId="freshwater-management-units" mapStyle={mapStyle}/>
          <FeatureHighlight sourceId="freshwater-management-units" highlightedFeature={highlightedFeature}/>
        </Source>
        {marker && <Marker longitude={marker[0]} latitude={marker[1]}></Marker>}
      </Map>
      {tooltipInfo.feature && tooltipInfo.feature.properties?.fmuName1 && (
        <div
          className="tooltip"
          style={{
            left: tooltipInfo.x,
            top: tooltipInfo.y,
          }}
        >
          {tooltipInfo.feature.properties?.fmuName1}
        </div>
      )}
    </div>)
}