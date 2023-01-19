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

import 'maplibre-gl/dist/maplibre-gl.css';
import LayerControl from '../../components/map/LayerControl';
import { MouseState, WaterTakeFilter } from './index';
import mapboxgl from 'mapbox-gl';
import { PinnedLocation } from './locationString';
import Button from '../../components/Button';

import flowMarkerImage from '../../images/marker_flow.svg';
import { GeoJsonQueries } from '../../api';
import formatWaterQuantity from './formatWaterQuantity';

const publicLinzApiKey = import.meta.env.VITE_LINZ_API_KEY;
const EMPTY_GEO_JSON_DATA = {
  type: 'FeatureCollection' as 'FeatureCollection',
  features: [],
};

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
  queries: GeoJsonQueries;
}) {
  const [mapRenderCount, setMapRenderCount] = React.useState(0);
  const [showImagery, setShowImagery] = React.useState(false);

  const [pinnedLocation, storePinnedLocation] = React.useState(
    initialPinnedLocation
  );

  const [highlightLocation, setHighlightLocation] = React.useState<
    PinnedLocation | undefined
  >(initialPinnedLocation);

  const [flowMarkerImageAdded, setFlowMarkerImageAdded] = React.useState(false);
  const [flowMarkerImageLoading, setFlowMarkerImageLoading] =
    React.useState(false);

  // TODO simplify me
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
        const whaituaId = findFeatureId(result, 'whaitua') || 'NONE';

        const surfaceWaterMgmtUnitId =
          findFeatureId(result, 'surfaceWaterMgmtUnits') || 'NONE';
        const surfaceWaterMgmtUnitDescription = findFeature(
          result,
          'surfaceWaterMgmtUnits',
          'name'
        );

        const surfaceWaterMgmtSubUnitId =
          findFeatureId(result, 'surfaceWaterMgmtSubUnits') || 'NONE';
        const surfaceWaterMgmtSubUnitDescription = findFeature(
          result,
          'surfaceWaterMgmtSubUnits',
          'name'
        );

        const groundWaterId = findFeatureId(result, 'groundWater') || 'NONE';
        const groundWaterZoneName = findFeature(result, 'groundWater', 'name');
        const groundWaterZones = result
          .filter((value) => value.layer.id === 'groundWater')
          .map((item) => item.id as number);

        const site = findFeature(result, 'flowSites', 'Name');

        const minimumFlowLimitId =
          findFeatureId(result, 'minimumFlowLimitBoundaries') || 'NONE';

        const flowRestrictionsManagementSiteId =
          findFeature(result, 'minimumFlowLimitBoundaries', 'site_id') ||
          'NONE';
        const flowRestrictionsManagementSiteName = findFeature(
          result,
          'minimumFlowLimitBoundaries',
          'name'
        );

        const flowRestrictionsAmount = findFeature(
          result,
          'minimumFlowLimitBoundaries',
          'plan_minimum_flow_value'
        );

        const flowRestrictionsUnit = findFeature(
          result,
          'minimumFlowLimitBoundaries',
          'plan_minimum_flow_unit'
        );

        const flowRestrictionsLevel = flowRestrictionsAmount
          ? formatWaterQuantity(
              Number(flowRestrictionsAmount),
              flowRestrictionsUnit as string
            )
          : undefined;

        const allocationAmount =
          surfaceWaterMgmtSubUnitId === 'NONE'
            ? findFeature(result, 'surfaceWaterMgmtUnits', 'allocation_amount')
            : findFeature(
                result,
                'surfaceWaterMgmtSubUnits',
                'allocation_amount'
              );

        const allocationUnits =
          surfaceWaterMgmtSubUnitId === 'NONE'
            ? findFeature(
                result,
                'surfaceWaterMgmtUnits',
                'allocation_amount_unit'
              )
            : findFeature(
                result,
                'surfaceWaterMgmtSubUnits',
                'allocation_amount_unit'
              );

        const surfaceWaterMgmtUnitLimit = formatWaterQuantity(
          Number(
            findFeature(result, 'surfaceWaterMgmtUnits', 'allocation_amount')
          ),
          findFeature(
            result,
            'surfaceWaterMgmtUnits',
            'allocation_amount_unit'
          ) as string
        );

        const allocationLimit = allocationAmount
          ? formatWaterQuantity(
              Number(allocationAmount),
              allocationUnits as string
            )
          : undefined;

        setMouseState({
          ...mouseState,
          position: {
            lng: highlightLocation.longitude,
            lat: highlightLocation.latitude,
          },
          council,
          whaitua,
          whaituaId,
          groundWaterId,
          groundWaterZoneName,
          groundWaterZones,
          site,
          surfaceWaterMgmtUnitId,
          surfaceWaterMgmtUnitDescription,
          surfaceWaterMgmtSubUnitId,
          surfaceWaterMgmtSubUnitDescription,
          minimumFlowLimitId,
          allocationLimit,
          flowRestrictionsLevel,
          flowRestrictionsManagementSiteName,
          flowRestrictionsManagementSiteId,
          surfaceWaterMgmtUnitLimit,
        });
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
    riversGeoJson,
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

      <Source
        id="riversGeoJson"
        type="geojson"
        data={riversGeoJson.data || EMPTY_GEO_JSON_DATA}
      >
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
            filter={['==', ['id'], mouseState.groundWaterId]}
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
            filter={['==', ['id'], mouseState.surfaceWaterMgmtUnitId]}
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
            filter={['==', ['id'], mouseState.surfaceWaterMgmtSubUnitId]}
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
            filter={['==', ['id'], mouseState.minimumFlowLimitId]}
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
              ['==', ['id'], mouseState.flowRestrictionsManagementSiteId],
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
