import {
  Map,
  MapMouseEvent,
  MapRef,
  Source,
} from "react-map-gl";
import {LegacyRef, useEffect, useRef, useState} from 'react';
import mapboxgl, {Marker, Popup} from "mapbox-gl";
import {debounce} from 'lodash';

import 'mapbox-gl/dist/mapbox-gl.css';
import './InteractiveMap.scss';

import {
  CombinedMapRef,
  HighlightedFeature,
  InteractiveMapProps,
} from "@components/InteractiveMap/lib/InteractiveMap";
import MapStyleSelector from "@components/MapStyleSelector/MapStyleSelector.tsx";
import FmuBoundariesLayer from "@components/InteractiveMap/lib/FmuBoundariesLayer/FmuBoundariesLayer.tsx";
import FeatureHighlight from "@components/InteractiveMap/lib/FeatureHighlight/FeatureHighlight.tsx";
import MapControls from "@components/InteractiveMap/lib/MapControls/MapControls.tsx";
import freshwaterManagementUnitService from "@services/FreshwaterManagementUnitService.ts";
import env from "@src/env.ts";
import {urlDefaultMapStyle} from "@lib/urlsAndPaths.ts";
import {useViewState} from "@components/InteractiveMap/lib/useViewState.ts";

const DEFAULT_ZOOM = 10;
const DEFAULT_VIEW_WIDTH = 100;
const DEFAULT_VIEW_HEIGHT = 150;
const DEFAULT_PITCH = 0;

export default function InteractiveMap({
                                         startLocation,
                                         select,
                                         selected,
                                         children,
                                         setMapSnapshot
                                       }: InteractiveMapProps) {

  const {viewState, handleMove} = useViewState({
    latitude: startLocation.latitude,
    longitude: startLocation.longitude,
    zoom: startLocation.zoom || DEFAULT_ZOOM,
    bearing: 0,
    pitch: DEFAULT_PITCH,
    padding: {
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
    }
  });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<CombinedMapRef | null>(null);

  const [mapStyle, setMapStyle]
    = useState(urlDefaultMapStyle(env.LINZ_API_KEY));

  const [highlightedFeature, highlightFeature]
    = useState<HighlightedFeature | null>(null);

  const [marker, setMarker] = useState<Marker | null>(null);

  const centreOn = (location: ViewLocation) => {
    mapRef?.current?.flyTo({
      center: [location.longitude, location.latitude],
      essential: true,
      zoom: location.zoom || DEFAULT_ZOOM,
      offset: [mapRef?.current?.getContainer().clientHeight * -0.03, mapRef?.current?.getContainer().clientHeight * -0.05],
    });
  }

  useEffect(() => {
    marker && marker.remove();
    if (selected && mapRef?.current) {

      const newMarker = new mapboxgl.Marker()
        .setLngLat([selected.longitude, selected.latitude])
        .addTo(mapRef.current.getMap());

      if (selected.description) {
        const popup = new Popup({closeButton: false})
          .setLngLat([selected.longitude, selected.latitude])
          .setHTML(selected.description)
          .addTo(mapRef.current.getMap());
        newMarker.setPopup(popup);
        centreOn(selected);
      }

      setMarker(newMarker)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    if (marker && mapRef?.current && setMapSnapshot) {
      const snapshot = getSnapshot(mapRef?.current);
      setMapSnapshot(snapshot ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marker]);

  const handleClick = (e: MapMouseEvent) => {
    select && select(null);
    const clickedFeature = mapRef?.current?.queryRenderedFeatures(e.point);
    if (clickedFeature!.filter(f => f?.layer?.id == "highlighted-fmu-candidates").length > 0) {
      const location = {longitude: e.lngLat.lng, latitude: e.lngLat.lat, zoom: mapRef.current!.getZoom()};
      select && select(location);
    }
  }

  const handleHover = debounce((e) => {
    const hoveredFeatures = mapRef?.current?.getMap().queryRenderedFeatures(e.point) || [];
    hoveredFeatures?.length && highlightFeature && highlightFeature({feature: hoveredFeatures[0], x: e.point.x, y: e.point.y});
  }, 0);

  function getSnapshot(mapRef: CombinedMapRef, layersToInclude: string[] = [], layersToExclude: string[] = []) {
    const map = mapRef.getMap(); // Get the map instance

    const originalVisibility: { [key: string]: unknown } = {};
    layersToExclude.forEach((layerId) => {
      originalVisibility[layerId] = map.getLayoutProperty(layerId, 'visibility');
      map.setLayoutProperty(layerId, 'visibility', 'none');
    });

    layersToInclude.forEach((layerId) => {
      originalVisibility[layerId] = map.getLayoutProperty(layerId, 'visibility');
      map.setLayoutProperty(layerId, 'visibility', 'visible');
    });

    const dataUrl = map.getCanvas().toDataURL('image/png');

    Object.keys(originalVisibility).forEach((layerId) => {
      map.setLayoutProperty(layerId, 'visibility', originalVisibility[layerId]);
    });

    return dataUrl;
  }

  return (
    <div className="map-container" data-testid={"InteractiveMap"} ref={mapContainerRef}>
      <MapStyleSelector onStyleChange={setMapStyle}/>
      <Map
        ref={mapRef as LegacyRef<MapRef>}
        data-Testid="map"
        mapStyle={mapStyle}
        style={{ width: '100%', height: '100vh', aspectRatio: '24/9'}}
        viewState={{...viewState, width: DEFAULT_VIEW_WIDTH, height: DEFAULT_VIEW_HEIGHT}}
        mapboxAccessToken={env.MAPBOX_TOKEN}
        accessToken={env.LINZ_API_KEY}
        doubleClickZoom={true}
        cursor={highlightedFeature ? 'pointer' : 'grab'}
        dragPan={true}
        zoom-={DEFAULT_ZOOM}
        minZoom={5}
        interactive={true}
        onClick={handleClick}
        onMove={handleMove}
        onMouseMove={handleHover}
        trackResize={true}
        onError={(event: { error: Error; }) => {
          console.error('Map error:', event.error);
        }}>
        <MapControls/>
        {children}
        <Source
          id="freshwater-management-units"
          type="geojson"
          data={freshwaterManagementUnitService.urlToGetFmuBoundaries()}>

          <FmuBoundariesLayer id="freshwater-management-units"
                              source="freshwater-management-units" mapStyle={mapStyle}/>

          {highlightedFeature && <FeatureHighlight id={"highlighted-fmu"}
                                                   mapRef={mapRef}
                                                   source="freshwater-management-units"
                                                   highlightedFeature={highlightedFeature}
                                                   tooltip={{
                                                     source: (f) => f.properties!.fmuName1,
                                                   }}/>}
        </Source>
      </Map>
    </div>
  );
}