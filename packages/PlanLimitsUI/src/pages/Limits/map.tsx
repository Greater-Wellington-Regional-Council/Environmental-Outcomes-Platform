import { useState, useEffect, useRef } from 'react';
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
  type ViewStateChangeEvent,
  type MapboxEvent,
  type MapLayerMouseEvent,
} from 'react-map-gl';
import type { PlanLimitsData } from '../../api';
import LayerControl from '../../components/map/LayerControl';
import Button from '../../components/Button';
import RiverTilesSource from './RiverTilesSource';
import flowMarkerImage from '../../images/marker_flow.svg';

const LINZ_API_KEY = import.meta.env.VITE_LINZ_API_KEY;
const EMPTY_GEO_JSON_DATA = {
  type: 'FeatureCollection' as const,
  features: [],
};

type Props = {
  appState: AppState;
  setAppState: (result: mapboxgl.MapboxGeoJSONFeature[]) => void;
  viewState: ViewState;
  setViewState: (value: ViewState) => void;
  pinnedLocation: PinnedLocation | null;
  setPinnedLocation: (
    updateFn: (prevValue: PinnedLocation | null) => PinnedLocation | null
  ) => void;
  waterTakeFilter: WaterTakeFilter;
  planLimitsData: PlanLimitsData;
};

export default function LimitsMap({
  appState,
  setAppState,
  viewState,
  setViewState,
  pinnedLocation,
  setPinnedLocation,
  waterTakeFilter,
  planLimitsData,
}: Props) {
  const mapRef = useRef<MapRef | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [flowMarkerImageAdded, setFlowMarkerImageAdded] = useState(false);
  const [showImagery, setShowImagery] = useState(false);

  const councils = planLimitsData.councils.data;
  const councilRegions = planLimitsData.councilsRegions.data;
  const surfaceWaterLimits = planLimitsData.surfaceWaterLimits.data;
  const groundWaterLimits = planLimitsData.GroundWaterLimits.data;
  const flowLimits = planLimitsData.flowLimits.data;
  const flowSites = planLimitsData.councilsRegions.data;

  const allDataLoaded =
    councils &&
    councilRegions &&
    surfaceWaterLimits &&
    groundWaterLimits &&
    flowLimits &&
    flowSites;

  useEffect(() => {
    if (mapLoaded && mapRef.current && allDataLoaded && pinnedLocation) {
      const activeFeatures = mapRef.current.queryRenderedFeatures(
        mapRef.current.project([
          pinnedLocation.longitude,
          pinnedLocation.latitude,
        ])
      );
      setAppState(activeFeatures);
    }
  }, [mapLoaded, allDataLoaded, pinnedLocation, setAppState]);

  const handleLoad = (evt: MapboxEvent) => {
    setMapLoaded(true);

    const img = new Image(20, 20);
    img.onload = () => {
      evt.target.addImage('marker_flow', img);
      setFlowMarkerImageAdded(true);
    };
    img.src = flowMarkerImage;
  };

  const handleMove = (evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  };

  const handleMouseMove = (evt: MapLayerMouseEvent) => {
    if (pinnedLocation) return;

    const result = evt.target.queryRenderedFeatures(evt.point);
    setAppState(result);
  };

  const handleClick = (evt: MapLayerMouseEvent) => {
    setPinnedLocation((prevValue) =>
      prevValue
        ? null
        : {
            latitude: evt.lngLat.lat,
            longitude: evt.lngLat.lng,
          }
    );
  };

  return (
    <Map
      ref={mapRef}
      reuseMaps={true}
      mapLib={maplibregl}
      style={{ width: '100%', height: '100vh' }}
      mapStyle={`https://basemaps.linz.govt.nz/v1/tiles/topographic/EPSG:4326/style/topographic.json?api=${LINZ_API_KEY}`}
      minZoom={5}
      maxBounds={[
        [160, -60],
        [-160, -20],
      ]}
      onMove={handleMove}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onLoad={handleLoad}
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
        id="councils"
        type="geojson"
        data={(councils && councils.features) || EMPTY_GEO_JSON_DATA}
      >
        <Layer
          id="councils"
          type="fill"
          paint={{
            'fill-opacity': 0,
          }}
        />
        <Layer
          id="councilsOutline"
          type="line"
          paint={{
            'line-color': 'green',
            'line-width': 2,
          }}
        />
      </Source>

      <Source
        id="councilRegions"
        type="geojson"
        data={
          (councilRegions && councilRegions.features) || EMPTY_GEO_JSON_DATA
        }
      >
        <Layer
          id="councilRegions"
          type="fill"
          paint={{
            'fill-opacity': 0,
          }}
        />
        <Layer
          id="councilRegionsHighlight"
          filter={['==', ['id'], appState.whaitua && appState.whaitua.id]}
          type="fill"
          paint={{
            'fill-outline-color': '#484896',
            'fill-color': '#6e599f',
            'fill-opacity': 0.1,
          }}
        />
        <Layer
          id="councilRegionsOutline"
          type="line"
          paint={{
            'line-color': 'green',
            'line-width': 2,
          }}
        />
      </Source>

      <RiverTilesSource zoom={viewState.zoom} />

      <Source
        id="groundWater"
        type="geojson"
        data={
          (groundWaterLimits && groundWaterLimits.features) ||
          EMPTY_GEO_JSON_DATA
        }
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
            id="groundWaterHighlight"
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
        id="surfaceWater"
        type="geojson"
        data={
          (surfaceWaterLimits && surfaceWaterLimits.features) ||
          EMPTY_GEO_JSON_DATA
        }
      >
        <Layer
          id="surfaceWater"
          type="fill"
          paint={{
            'fill-opacity': 0,
          }}
        />
        {['Surface', 'Combined'].includes(waterTakeFilter) && (
          <Layer
            id="surfaceWaterHighlight"
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
        id="flowLimits"
        type="geojson"
        data={(flowLimits && flowLimits.features) || EMPTY_GEO_JSON_DATA}
      >
        <Layer
          id="flowLimits"
          type="fill"
          paint={{
            'fill-outline-color': 'black',
            'fill-color': '#FFFFFF',
            'fill-opacity': 0.0,
          }}
        />
        {['Surface', 'Combined'].includes(waterTakeFilter) && (
          <Layer
            id="flowLimitsHighlight"
            type="fill"
            filter={[
              '==',
              ['id'],
              appState.flowLimitBoundary && appState.flowLimitBoundary.id,
            ]}
            paint={{
              'fill-outline-color': '#484896',
              'fill-color': '#6e599f',
              'fill-opacity': 0.3,
            }}
          />
        )}
      </Source>

      <Source
        id="flowSites"
        type="geojson"
        data={
          flowSites && flowMarkerImageAdded
            ? flowSites.features
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
              [
                '==',
                ['id'],
                appState.flowLimitBoundary && appState.flowLimitBoundary.siteId,
              ],
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
            `https://basemaps.linz.govt.nz/v1/tiles/aerial/WebMercatorQuad/{z}/{x}/{y}.webp?api=${LINZ_API_KEY}`,
          ]}
        >
          <Layer beforeId="councils" type={'raster'} />
        </Source>
      )}
    </Map>
  );
}
