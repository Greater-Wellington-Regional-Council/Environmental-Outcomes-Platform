import React from 'react';
import maplibregl from 'maplibre-gl';
import Map, {
  Layer,
  MapRef,
  Marker,
  NavigationControl,
  ScaleControl,
  Source,
  ViewState,
} from 'react-map-gl';

import { councils } from '../../mock-data/councils';
import { rivers } from '../../mock-data/rivers';
import { whaitua } from '../../mock-data/whaitua';
import { sites } from '../../mock-data/sites';
import { groundWater } from '../../mock-data/ground-water';
import { surfaceWater } from '../../mock-data/surface-water';
import { allocation } from '../../mock-data/allocation';

import 'maplibre-gl/dist/maplibre-gl.css';
import LayerControl from '../../components/map/LayerControl';
import { MouseState } from './index';
import mapboxgl from 'mapbox-gl';
import { PinnedLocation } from './locationString';
import Button from '../../components/Button';
import { WaterTakeFilter } from './index2';

import marker from '../../images/marker_flow.svg';

const publicLinzApiKey = import.meta.env.VITE_LINZ_API_KEY;

export default function LimitsMap({
  mouseState,
  setMouseState,
  viewState,
  setViewState,
  initialPinnedLocation,
  setCurrentPinnedLocation,
  waterTakeFilter,
}: {
  mouseState: MouseState;
  setMouseState: React.Dispatch<React.SetStateAction<MouseState>>;
  viewState: ViewState;
  setViewState: (value: ViewState) => void;
  initialPinnedLocation?: PinnedLocation;
  setCurrentPinnedLocation: (value?: PinnedLocation) => void;
  waterTakeFilter: WaterTakeFilter;
}) {
  const [mapRenderCount, setMapRenderCount] = React.useState(0);
  const [showImagery, setShowImagery] = React.useState(true);

  const [pinnedLocation, storePinnedLocation] = React.useState(
    initialPinnedLocation
  );

  const [highlightLocation, setHighlightLocation] = React.useState<
    PinnedLocation | undefined
  >(initialPinnedLocation);

  const riversToShow = {
    ...rivers,
    features: rivers.features.filter(
      (river) => river.properties['stream_order'] >= 3
    ),
  };

  const changesCallback = React.useCallback(
    (map: MapRef | null) => {
      if (highlightLocation && map) {
        const result = map.queryRenderedFeatures(
          map.project([highlightLocation.longitude, highlightLocation.latitude])
        );
        const findFeature = (
          features: mapboxgl.MapboxGeoJSONFeature[],
          layer: string,
          prop: string
        ) =>
          features.find((feat) => feat.layer.id === layer)?.properties?.[
            prop
          ] as string | undefined;

        const council = findFeature(result, 'councils', 'REGC2022_V1_00_NAME');
        const whaitua = findFeature(result, 'whaitua', 'Name');
        const whaituaId = findFeature(result, 'whaitua', 'OBJECTID') || 'NONE';
        const gw00 = findFeature(result, 'groundWater', 'category00');
        const gw20 = findFeature(result, 'groundWater', 'category20');
        const gw30 = findFeature(result, 'groundWater', 'category30');
        const groundWaterId =
          findFeature(result, 'groundWater', 'OBJECTID') || 'NONE';
        const groundWaterZone = findFeature(result, 'groundWater', 'Zone');
        const site = findFeature(result, 'flowSites', 'Name');
        const river = findFeature(result, 'rivers', 'name');
        const surfaceWater = findFeature(result, 'surfaceWater', 'Name');
        const surfaceWaterId =
          findFeature(result, 'surfaceWater', 'Id') || 'NONE';
        const flowRestrictionsLevel = findFeature(
          result,
          'surfaceWater',
          'flowRestrictionsLevel'
        );
        const flowRestrictionsManagementSiteName = findFeature(
          result,
          'surfaceWater',
          'flowRestrictionsManagementSiteName'
        );
        const flowRestrictionsManagementSiteId =
          findFeature(
            result,
            'surfaceWater',
            'flowRestrictionsManagementSiteId'
          ) || '0';
        const allocationLimit = findFeature(
          result,
          'allocationLimits',
          'allocationLimit'
        );
        const allocationLimitId =
          findFeature(result, 'allocationLimits', 'Id') || 'NONE';

        setMouseState({
          ...mouseState,
          position: {
            lng: highlightLocation.longitude,
            lat: highlightLocation.latitude,
          },
          council,
          whaitua,
          whaituaId,
          gw00,
          gw20,
          gw30,
          groundWaterId,
          groundWaterZone,
          site,
          river,
          surfaceWater,
          surfaceWaterId,
          allocationLimit,
          allocationLimitId,
          flowRestrictionsLevel,
          flowRestrictionsManagementSiteName,
          flowRestrictionsManagementSiteId,
        });
      }

      if (map) {
        if (!map.hasImage('marker_flow')) {
          const img = new Image(20, 20);
          img.onload = () => map.addImage('marker_flow', img);
          img.src = marker;
        }
      }
    },
    [highlightLocation, mapRenderCount, waterTakeFilter]
  );

  return (
    <main className="flex-1 overflow-y-auto">
      <Map
        ref={changesCallback}
        reuseMaps={true}
        mapLib={maplibregl}
        style={{ width: '100%', height: '100vh' }}
        mapStyle={`https://basemaps.linz.govt.nz/v1/tiles/topographic/EPSG:3857/style/topographic.json?api=${publicLinzApiKey}`}
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
        interactiveLayerIds={[
          'councils',
          'whaitua',
          'rivers',
          'allocationLimits',
          'groundWater',
          'surfaceWater',
        ]}
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

        <Source type="geojson" data={councils}>
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
              'line-color': 'pink',
              'line-width': 2,
            }}
          />
        </Source>

        <Source type="geojson" data={whaitua}>
          <Layer
            id="whaitua"
            type="fill"
            paint={{
              'fill-opacity': 0,
            }}
          />
          <Layer
            id="whaitua-highlight"
            filter={['in', 'OBJECTID', mouseState.whaituaId]}
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

        <Source type="geojson" data={groundWater}>
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
              filter={['in', 'OBJECTID', mouseState.groundWaterId]}
              paint={{
                'fill-outline-color': '#484896',
                'fill-color': '#33ff99',
                'fill-opacity': 0.5,
              }}
            />
          )}
        </Source>

        <Source type="geojson" data={surfaceWater}>
          <Layer
            id="surfaceWater"
            type="fill"
            paint={{
              'fill-opacity': 0,
            }}
          />
          {['Surface', 'Combined'].includes(waterTakeFilter) && (
            <Layer
              id="surfaceWater-highlight"
              type="fill"
              filter={['in', 'Id', mouseState.surfaceWaterId]}
              paint={{
                'fill-outline-color': '#484896',
                'fill-color': '#6e599f',
                'fill-opacity': 0.5,
              }}
            />
          )}
        </Source>

        <Source type="geojson" data={allocation}>
          <Layer
            id="allocationLimits"
            type="fill"
            paint={{
              'fill-opacity': 0,
            }}
          />
          {['Surface', 'Combined'].includes(waterTakeFilter) && (
            <Layer
              id="allocationLimits-highlight"
              type="fill"
              filter={['in', 'Id', mouseState.allocationLimitId]}
              paint={{
                'fill-outline-color': '#484896',
                'fill-color': '#6e599f',
                'fill-opacity': 0.3,
              }}
            />
          )}
        </Source>

        <Source type="geojson" data={riversToShow}>
          <Layer
            id="rivers"
            type="line"
            paint={{
              'line-width': ['+', 0, ['get', 'stream_order']],
              'line-color': [
                'match',
                ['get', 'stream_order'],
                1,
                '#9bc4e2',
                2,
                '#9bc4e2',
                3,
                '#9bc4e2',
                4,
                '#17569B',
                5,
                '#17569B',
                6,
                '#17569B',
                7,
                '#17569B',
                8,
                '#17569B',
                '#17569B',
              ],
            }}
          />
        </Source>

        <Source type="geojson" data={sites}>
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
                  ['get', 'SITE_ID'],
                  mouseState.flowRestrictionsManagementSiteId,
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
              `https://basemaps.linz.govt.nz/v1/tiles/aerial/WebMercatorQuad/{z}/{x}/{y}.webp?api=${publicLinzApiKey}`,
            ]}
          >
            <Layer beforeId="councils" type={'raster'} />
          </Source>
        )}
      </Map>
    </main>
  );
}
