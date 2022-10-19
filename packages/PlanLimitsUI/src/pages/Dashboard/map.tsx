import React from 'react';
import maplibregl from 'maplibre-gl';
import Map, {
  Layer,
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

const publicLinzApiKey = import.meta.env.VITE_LINZ_API_KEY;

export default function LimitsMap({
  mouseState,
  setMouseState,
  viewState,
  setViewState,
}: {
  mouseState: MouseState;
  setMouseState: React.Dispatch<React.SetStateAction<MouseState>>;
  viewState: ViewState;
  setViewState: React.Dispatch<React.SetStateAction<ViewState>>;
}) {
  const [showImagery, setShowImagery] = React.useState(true);

  const riversToShow = {
    ...rivers,
    features: rivers.features.filter(
      (river) => river.properties['stream_order'] >= 2
    ),
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <Map
        reuseMaps={true}
        mapLib={maplibregl}
        style={{ width: '100%', height: '100vh' }}
        mapStyle={`https://basemaps.linz.govt.nz/v1/tiles/topographic/EPSG:3857/style/topographic.json?api=${publicLinzApiKey}`}
        minZoom={5}
        maxBounds={[
          [160, -60],
          [-160, -20],
        ]}
        scrollZoom={false}
        onMove={(evt) => setViewState(evt.viewState)}
        onMouseMove={(evt) => {
          const findFeature = (
            evt: mapboxgl.MapLayerMouseEvent,
            layer: string,
            prop: string
          ) =>
            evt.features?.find((feat) => feat.layer.id === layer)?.properties?.[
              prop
            ] as string | undefined;

          const council = findFeature(evt, 'councils', 'REGC2022_V1_00_NAME');
          const whaitua = findFeature(evt, 'whaitua', 'name');
          const whaituaId = findFeature(evt, 'whaitua', 'OBJECTID') || 'NONE';
          const gw00 = findFeature(evt, 'groundWater', 'category00');
          const gw20 = findFeature(evt, 'groundWater', 'category20');
          const gw30 = findFeature(evt, 'groundWater', 'category30');
          const groundWaterId =
            findFeature(evt, 'groundWater', 'OBJECTID') || 'NONE';
          const groundWaterZone = findFeature(evt, 'groundWater', 'Zone');
          const site = findFeature(evt, 'flowSites', 'Name');
          const river = findFeature(evt, 'rivers', 'name');
          const surfaceWater = findFeature(evt, 'surfaceWater', 'Name');
          const surfaceWaterId =
            findFeature(evt, 'surfaceWater', 'Id') || 'NONE';
          const flowRestrictionsLevel = findFeature(
            evt,
            'surfaceWater',
            'flowRestrictionsLevel'
          );
          const flowRestrictionsManagementSiteName = findFeature(
            evt,
            'surfaceWater',
            'flowRestrictionsManagementSiteName'
          );
          const flowRestrictionsManagementSiteId =
            findFeature(
              evt,
              'surfaceWater',
              'flowRestrictionsManagementSiteId'
            ) || 'NONE';
          const allocationLimit = findFeature(
            evt,
            'allocationLimits',
            'allocationLimit'
          );
          const allocationLimitId =
            findFeature(evt, 'allocationLimits', 'Id') || 'NONE';

          setMouseState({
            ...mouseState,
            position: evt.lngLat,
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
        }}
        interactiveLayerIds={[
          'councils',
          'whaitua',
          'flowSites',
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
          <button
            onClick={() => setShowImagery(!showImagery)}
            style={{ pointerEvents: 'all' }}
            type="button"
            className="inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {showImagery ? 'Hide' : 'Show '} aerial imagery
          </button>
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
        </Source>

        <Source type="geojson" data={surfaceWater}>
          <Layer
            id="surfaceWater"
            type="fill"
            paint={{
              'fill-opacity': 0,
            }}
          />
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
        </Source>

        <Source type="geojson" data={allocation}>
          <Layer
            id="allocationLimits"
            type="fill"
            paint={{
              'fill-opacity': 0,
            }}
          />
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
        </Source>

        <Source type="geojson" data={riversToShow}>
          <Layer
            id="rivers"
            type="line"
            paint={{
              'line-color': '#2b8cbe',
              'line-width': 3,
            }}
          />
        </Source>

        <Source type="geojson" data={sites}>
          <Layer id="flowSites" type="circle" />
          <Layer
            id="flowSites-highlight"
            type="circle"
            filter={[
              'in',
              'SITE_ID',
              mouseState.flowRestrictionsManagementSiteId,
            ]}
            paint={{
              'circle-color': 'magenta',
            }}
          />
        </Source>

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
