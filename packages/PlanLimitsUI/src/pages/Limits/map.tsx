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

import { sites } from '../../mock-data/sites';
import { groundWater } from '../../mock-data/ground-water';

import 'maplibre-gl/dist/maplibre-gl.css';
import LayerControl from '../../components/map/LayerControl';
import { MouseState } from './index';
import mapboxgl from 'mapbox-gl';
import { PinnedLocation } from './locationString';
import Button from '../../components/Button';
import { WaterTakeFilter } from './index2';

import marker from '../../images/marker_flow.svg';

import { GeoJSON } from 'geojson';
import { UseQueryResult } from '@tanstack/react-query';

const publicLinzApiKey = import.meta.env.VITE_LINZ_API_KEY;

export default function LimitsMap({
  mouseState,
  setMouseState,
  viewState,
  setViewState,
  initialPinnedLocation,
  setCurrentPinnedLocation,
  waterTakeFilter,
  queries,
}: {
  mouseState: MouseState;
  setMouseState: React.Dispatch<React.SetStateAction<MouseState>>;
  viewState: ViewState;
  setViewState: (value: ViewState) => void;
  initialPinnedLocation?: PinnedLocation;
  setCurrentPinnedLocation: (value?: PinnedLocation) => void;
  waterTakeFilter: WaterTakeFilter;
  queries: [
    UseQueryResult<GeoJSON>,
    UseQueryResult<GeoJSON>,
    UseQueryResult<GeoJSON>,
    UseQueryResult<GeoJSON>,
    UseQueryResult<GeoJSON>,
    UseQueryResult<GeoJSON>
  ];
}) {
  const [mapRenderCount, setMapRenderCount] = React.useState(0);
  const [showImagery, setShowImagery] = React.useState(true);

  const [pinnedLocation, storePinnedLocation] = React.useState(
    initialPinnedLocation
  );

  const [highlightLocation, setHighlightLocation] = React.useState<
    PinnedLocation | undefined
  >(initialPinnedLocation);

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

        const findFeatureId = (
          features: mapboxgl.MapboxGeoJSONFeature[],
          layer: string
        ) => features.find((feat) => feat.layer.id === layer)?.id as string;

        const council = findFeature(result, 'councils', 'name');
        const whaitua = findFeature(result, 'whaitua', 'name');
        const whaituaId = findFeatureId(result, 'whaitua');

        const surfaceWaterMgmtUnitId =
          findFeatureId(result, 'surfaceWaterMgmtUnits') || 'NONE';
        const surfaceWaterMgmtUnitDescription = findFeature(
          result,
          'surfaceWaterMgmtUnits',
          'catchment_management_unit'
        );

        const surfaceWaterMgmtSubUnitId =
          findFeatureId(result, 'surfaceWaterMgmtSubUnits') || 'NONE';
        const surfaceWaterMgmtSubUnitDescription = findFeature(
          result,
          'surfaceWaterMgmtSubUnits',
          'catchment_management_unit'
        );

        const gw00 = findFeature(result, 'groundWater', 'category00');
        const gw20 = findFeature(result, 'groundWater', 'category20');
        const gw30 = findFeature(result, 'groundWater', 'category30');
        const groundWaterId =
          findFeature(result, 'groundWater', 'OBJECTID') || 'NONE';
        const groundWaterZone = findFeature(result, 'groundWater', 'Zone');
        const site = findFeature(result, 'flowSites', 'Name');
        const river = findFeature(result, 'rivers', 'name');
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
        const allocationLimit =
          surfaceWaterMgmtSubUnitId === 'NONE'
            ? findFeature(result, 'surfaceWaterMgmtUnits', 'allocation_amount')
            : findFeature(
                result,
                'surfaceWaterMgmtSubUnits',
                'allocation_amount'
              );

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
          surfaceWaterMgmtUnitId,
          surfaceWaterMgmtUnitDescription,
          surfaceWaterMgmtSubUnitId,
          surfaceWaterMgmtSubUnitDescription,
          allocationLimit,
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

  const [
    councilsGeoJson,
    whaituaGeoJson,
    riversGeoJson,
    surfaceWaterMgmtUnitsGeoJson,
    surfaceWaterMgmtSubUnitsGeoJson,
    flowManagementSitesGeoJson,
  ] = queries;

  return (
    <main className="flex-1 overflow-y-auto">
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
        interactiveLayerIds={['groundWater']}
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

        {councilsGeoJson.data && (
          <Source type="geojson" data={councilsGeoJson.data}>
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
        )}

        {whaituaGeoJson.data && (
          <Source type="geojson" data={whaituaGeoJson.data}>
            <Layer
              id="whaitua"
              type="fill"
              paint={{
                'fill-opacity': 0,
              }}
            />
            <Layer
              id="whaitua-highlight"
              filter={['==', ['id'], mouseState.whaituaId]}
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
        )}

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

        {surfaceWaterMgmtUnitsGeoJson.data && (
          <Source type="geojson" data={surfaceWaterMgmtUnitsGeoJson.data}>
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
                filter={['==', ['id'], mouseState.surfaceWaterMgmtUnitId]}
                paint={{
                  'fill-outline-color': '#484896',
                  'fill-color': '#6e599f',
                  'fill-opacity': 0.2,
                }}
              />
            )}
          </Source>
        )}

        {surfaceWaterMgmtSubUnitsGeoJson.data && (
          <Source type="geojson" data={surfaceWaterMgmtSubUnitsGeoJson.data}>
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
                filter={['==', ['id'], mouseState.surfaceWaterMgmtSubUnitId]}
                paint={{
                  'fill-outline-color': '#484896',
                  'fill-color': '#6e599f',
                  'fill-opacity': 0.5,
                }}
              />
            )}
          </Source>
        )}

        {riversGeoJson.data && (
          <Source type="geojson" data={riversGeoJson.data}>
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
        )}

        {flowManagementSitesGeoJson.data && (
          <Source type="geojson" data={flowManagementSitesGeoJson.data}>
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
        )}

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
