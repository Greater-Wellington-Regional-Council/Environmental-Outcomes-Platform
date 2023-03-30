import { useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Map, {
  Layer,
  Marker,
  Source,
  NavigationControl,
  ScaleControl,
  type MapRef,
  type ViewState,
} from 'react-map-gl';
import { GeoJsonQueries } from '../../api';
import LayerControl from '../../components/map/LayerControl';
import Button from '../../components/Button';
import { type PinnedLocation } from './locationString';
import RiverTilesSource from './RiverTilesSource';
import { type AppState } from './useAppState';
import { type WaterTakeFilter } from './index';
import flowMarkerImage from '../../images/marker_flow.svg';

const publicLinzApiKey = import.meta.env.VITE_LINZ_API_KEY;
const EMPTY_GEO_JSON_DATA = {
  type: 'FeatureCollection' as const,
  features: [],
};

export default function LimitsMap({
  appState,
  setAppState,
  viewState,
  setViewState,
  initialPinnedLocation,
  setCurrentPinnedLocation,
  waterTakeFilter,
  queries,
}: {
  appState: AppState;
  setAppState: (result: mapboxgl.MapboxGeoJSONFeature[]) => void;
  viewState: ViewState;
  setViewState: (value: ViewState) => void;
  initialPinnedLocation?: PinnedLocation;
  setCurrentPinnedLocation: (value?: PinnedLocation) => void;
  waterTakeFilter: WaterTakeFilter;
  queries: GeoJsonQueries;
}) {
  const [mapRenderCount, setMapRenderCount] = useState(0);
  const [showImagery, setShowImagery] = useState(false);

  const [pinnedLocation, storePinnedLocation] = useState(initialPinnedLocation);

  const [highlightLocation, setHighlightLocation] = useState<
    PinnedLocation | undefined
  >(initialPinnedLocation);

  const [flowMarkerImageAdded, setFlowMarkerImageAdded] = useState(false);
  const [flowMarkerImageLoading, setFlowMarkerImageLoading] = useState(false);

  const changesCallback = useCallback(
    (map: MapRef | null) => {
      if (highlightLocation && map) {
        const result = map.queryRenderedFeatures(
          map.project([highlightLocation.longitude, highlightLocation.latitude])
        );
        setAppState(result);
      }

      // TODO: Move this out of main rendering callback and extract to hook/HOC
      if (map && !map.hasImage('marker_flow') && !flowMarkerImageLoading) {
        setFlowMarkerImageLoading(true);
        const img = new Image(20, 20);
        img.onload = () => {
          map.addImage('marker_flow', img);
          setFlowMarkerImageAdded(true);
        };
        img.src = flowMarkerImage;
      }
    },
    [highlightLocation, mapRenderCount, waterTakeFilter]
  );

  const [
    councilsGeoJson,
    whaituaGeoJson,
    surfaceWaterMgmtUnitsGeoJson,
    surfaceWaterMgmtSubUnitsGeoJson,
    flowManagementSitesGeoJson,
    minimumFlowLimitBoundariesGeoJson,
    groundwaterZoneBoundariesGeoJson,
  ] = queries;

  return (
    <Map
      ref={changesCallback}
      reuseMaps={true}
      mapLib={maplibregl}
      style={{ width: '100%', height: '100vh' }}
      mapStyle={`https://basemaps.linz.govt.nz/v1/tiles/topographic/EPSG:4326/style/topographic.json?api=${publicLinzApiKey}`}
      minZoom={5}
      maxBounds={[
        [160, -60],
        [-160, -20],
      ]}
      onMove={(evt) => setViewState(evt.viewState)}
      onMouseMove={(evt) => {
        if (!pinnedLocation) {
          setHighlightLocation({
            latitude: evt.lngLat.lat,
            longitude: evt.lngLat.lng,
          });
        }
      }}
      onClick={(evt) => {
        const newPinnedLocation = pinnedLocation
          ? undefined
          : {
              latitude: evt.lngLat.lat,
              longitude: evt.lngLat.lng,
            };
        setCurrentPinnedLocation(newPinnedLocation);
        storePinnedLocation(newPinnedLocation);
        setHighlightLocation({
          latitude: evt.lngLat.lat,
          longitude: evt.lngLat.lng,
        });
      }}
      onRender={() => setMapRenderCount(mapRenderCount + 1)}
      {...viewState}
    >
      <NavigationControl position="top-left" visualizePitch={true} />
      <ScaleControl />
      <LayerControl>
        <Button
          onClick={() => setShowImagery(!showImagery)}
          text={`${showImagery ? 'Hide' : 'Show '} aerial imagery`}
        />
      </LayerControl>

      <Source
        id="councilsGeoJson"
        type="geojson"
        data={councilsGeoJson.data || EMPTY_GEO_JSON_DATA}
      >
        <Layer
          id="councils"
          type="fill"
          paint={{
            'fill-opacity': 0,
          }}
        />
        <Layer
          type="line"
          paint={{
            'line-color': 'green',
            'line-width': 2,
          }}
        />
      </Source>

      <Source
        id="whaituaGeoJson"
        type="geojson"
        data={whaituaGeoJson.data || EMPTY_GEO_JSON_DATA}
      >
        <Layer
          id="whaitua"
          type="fill"
          paint={{
            'fill-opacity': 0,
          }}
        />
        <Layer
          id="whaitua-highlight"
          filter={['==', ['id'], appState.whaituaId]}
          type="fill"
          paint={{
            'fill-outline-color': '#484896',
            'fill-color': '#6e599f',
            'fill-opacity': 0.1,
          }}
        />
        <Layer
          type="line"
          paint={{
            'line-color': 'green',
            'line-width': 2,
          }}
        />
      </Source>

      <RiverTilesSource zoom={viewState.zoom} />

      <Source
        id="groundWaterGeoJson"
        type="geojson"
        data={groundwaterZoneBoundariesGeoJson.data || EMPTY_GEO_JSON_DATA}
      >
        <Layer
          id="groundWater"
          type="fill"
          paint={{
            'fill-opacity': 0,
          }}
        />
        {['Ground', 'Combined'].includes(waterTakeFilter) && (
          <Layer
            id="groundWater-highlight"
            type="fill"
            filter={['in', ['id'], ['literal', appState.groundWaterZones]]}
            paint={{
              'fill-outline-color': '#484896',
              'fill-color': '#33ff99',
              'fill-opacity': 0.5,
            }}
          />
        )}
      </Source>

      <Source
        id="surfaceWaterMgmtUnitsGeoJson"
        type="geojson"
        data={surfaceWaterMgmtUnitsGeoJson.data || EMPTY_GEO_JSON_DATA}
      >
        <Layer
          id="surfaceWaterMgmtUnits"
          type="fill"
          paint={{
            'fill-opacity': 0,
          }}
        />
        {['Surface', 'Combined'].includes(waterTakeFilter) && (
          <Layer
            id="surfaceWaterMgmtUnits-highlight"
            type="fill"
            filter={['==', ['id'], appState.surfaceWaterMgmtUnitId]}
            paint={{
              'fill-outline-color': '#484896',
              'fill-color': '#6e599f',
              'fill-opacity': 0.4,
            }}
          />
        )}
      </Source>

      <Source
        id="surfaceWaterMgmtSubUnitsGeoJson"
        type="geojson"
        data={surfaceWaterMgmtSubUnitsGeoJson.data || EMPTY_GEO_JSON_DATA}
      >
        <Layer
          id="surfaceWaterMgmtSubUnits"
          type="fill"
          paint={{
            'fill-opacity': 0,
          }}
        />
        {['Surface', 'Combined'].includes(waterTakeFilter) && (
          <Layer
            id="surfaceWaterMgmtSubUnits-highlight"
            type="fill"
            filter={['==', ['id'], appState.surfaceWaterMgmtSubUnitId]}
            paint={{
              'fill-outline-color': '#484896',
              'fill-color': '#6e599f',
              'fill-opacity': 0.3,
            }}
          />
        )}
      </Source>

      <Source
        id="minimumFlowLimitBoundariesGeoJson"
        type="geojson"
        data={minimumFlowLimitBoundariesGeoJson.data || EMPTY_GEO_JSON_DATA}
      >
        <Layer
          id="minimumFlowLimitBoundaries"
          type="fill"
          paint={{
            'fill-outline-color': 'black',
            'fill-color': '#FFFFFF',
            'fill-opacity': 0.0,
          }}
        />
        {['Surface', 'Combined'].includes(waterTakeFilter) && (
          <Layer
            id="minimumFlowLimitBoundaries-highlight"
            type="fill"
            filter={['==', ['id'], appState.minimumFlowLimitId]}
            paint={{
              'fill-outline-color': '#484896',
              'fill-color': '#6e599f',
              'fill-opacity': 0.3,
            }}
          />
        )}
      </Source>

      <Source
        id="flowManagementSitesGeoJson"
        type="geojson"
        data={
          flowManagementSitesGeoJson.data && flowMarkerImageAdded
            ? flowManagementSitesGeoJson.data
            : EMPTY_GEO_JSON_DATA
        }
      >
        <Layer
          id="flowSites"
          type="symbol"
          layout={{
            'icon-image': 'marker_flow',
          }}
          paint={{
            'icon-opacity': [
              'case',
              ['==', ['id'], appState.flowRestrictionsManagementSiteId],
              1,
              0.5,
            ],
          }}
        />
      </Source>

      {pinnedLocation && (
        <Marker
          longitude={pinnedLocation.longitude}
          latitude={pinnedLocation.latitude}
        />
      )}

      {showImagery && (
        <Source
          type={'raster'}
          tiles={[
            `https://basemaps.linz.govt.nz/v1/tiles/aerial/WebMercatorQuad/{z}/{x}/{y}.webp?api=${publicLinzApiKey}`,
          ]}
        >
          <Layer beforeId="councils" type={'raster'} />
        </Source>
      )}
    </Map>
  );
}
