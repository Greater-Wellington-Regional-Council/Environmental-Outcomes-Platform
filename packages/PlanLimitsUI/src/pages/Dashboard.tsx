import React from 'react';
import maplibregl from 'maplibre-gl';
import Map, {
  Layer,
  NavigationControl,
  ScaleControl,
  Source,
} from 'react-map-gl';

import { councils } from '../mock-data/councils';
import { data } from '../mock-data/boundaries';
import { rivers } from '../mock-data/rivers';

import 'maplibre-gl/dist/maplibre-gl.css';
import LayerControl from '../components/map/LayerControl';
import { FeatureCollection } from 'geojson';

const publicLinzApiKey = import.meta.env.VITE_LINZ_API_KEY;

type MouseState = {
  position: {
    lng: number;
    lat: number;
  };
  council: string | null;
  whaitua: string | null;
  gw00: string | null;
  gw20: string | null;
  gw30: string | null;
  site: string | null;
  river: string | null;
};

export default function Dashboard() {
  const [showImagery, setShowImagery] = React.useState(true);

  const [viewState, setViewState] = React.useState({
    longitude: 175.35,
    latitude: -41,
    bearing: 0,
    zoom: 8,
    pitch: 30,
  });

  const [mouseState, setMouseState] = React.useState<MouseState>({
    position: {
      lng: 0,
      lat: 0,
    },
    council: null,
    whaitua: null,
    gw00: null,
    gw20: null,
    gw30: null,
    site: null,
    river: null,
  });

  const typedCouncils = councils as FeatureCollection;

  const riversToShow = {
    ...rivers,
    features: rivers.features.filter(
      (river) => river.properties['stream_order'] >= 1
    ),
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto">
        <section
          aria-labelledby="primary-heading"
          className="flex h-full min-w-0 flex-1 flex-col lg:order-last"
        >
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
              if (evt.features) {
                const council = evt.features.find(
                  (feat) => feat.layer.id === 'councils'
                )?.properties['REGC2022_V1_00_NAME'] as string;

                const whaitua = evt.features.find(
                  (feat) => feat.layer.id === 'whaitua'
                )?.properties['Name'] as string;

                const gw00 = evt.features.find(
                  (feat) => feat.layer.id === 'gw00'
                )?.properties['Dpth_Name'] as string;

                const gw20 = evt.features.find(
                  (feat) => feat.layer.id === 'gw20'
                )?.properties['Dpth_Name'] as string;

                const gw30 = evt.features.find(
                  (feat) => feat.layer.id === 'gw30'
                )?.properties['Dpth_Name'] as string;

                const site = evt.features.find(
                  (feat) => feat.layer.id === 'flowSites'
                )?.properties['Name'] as string;

                const river = evt.features.find(
                  (feat) => feat.layer.id === 'rivers'
                )?.properties['name'] as string;

                setMouseState({
                  ...mouseState,
                  position: evt.lngLat,
                  council,
                  whaitua,
                  gw00,
                  gw20,
                  gw30,
                  site,
                  river,
                });
              }
            }}
            interactiveLayerIds={[
              'councils',
              'whaitua',
              'gw00',
              'gw20',
              'gw30',
              'flowSites',
              'rivers',
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
                Toggle Layers
              </button>
            </LayerControl>
            {showImagery && (
              <Source
                type={'raster'}
                tiles={[
                  `https://basemaps.linz.govt.nz/v1/tiles/aerial/WebMercatorQuad/{z}/{x}/{y}.webp?api=${publicLinzApiKey}`,
                ]}
              >
                <Layer beforeId={'councils'} type={'raster'} />
              </Source>
            )}
            <Source type="geojson" data={typedCouncils}>
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
                  'line-width': 4,
                }}
              />
            </Source>

            <Source type="geojson" data={data.whaitua as FeatureCollection}>
              <Layer
                id="whaitua"
                type="fill"
                paint={{
                  'fill-opacity': 0,
                }}
              />
              <Layer
                type="line"
                paint={{
                  'line-color': 'green',
                  'line-width': 4,
                }}
              />
            </Source>

            <Source type="geojson" data={data.groundWater30}>
              <Layer
                id="gw30"
                type="fill"
                paint={{
                  'fill-opacity': 0,
                }}
              />
            </Source>

            <Source type="geojson" data={data.groundWater20}>
              <Layer
                id="gw20"
                type="fill"
                paint={{
                  'fill-opacity': 0,
                }}
              />
            </Source>

            <Source type="geojson" data={data.groundWater10}>
              <Layer
                id="gw00"
                type="fill"
                paint={{
                  'fill-opacity': 0,
                }}
              />
              <Layer
                type="line"
                paint={{
                  'line-color': 'purple',
                  'line-width': 5,
                }}
              />
            </Source>

            <Source type="geojson" data={riversToShow}>
              <Layer
                id="rivers"
                type="line"
                paint={{
                  'line-color': 'blue',
                  'line-width': 3,
                }}
              />
            </Source>

            <Source type="geojson" data={data.sites}>
              <Layer
                id="flowSites"
                type="circle"
                paint={{
                  'circle-color': 'magenta',
                }}
              />
            </Source>
          </Map>
        </section>
      </main>

      <aside className="w-96 overflow-y-auto border-l border-gray-200 bg-white">
        DEBUG:
        <br />
        View Latitude: {viewState.latitude}
        <br />
        View Longitude: {viewState.longitude}
        <br />
        View Zoom: {viewState.zoom}
        <br />
        View Bearing: {viewState.bearing}
        <br />
        View Pitch: {viewState.pitch}
        <br />
        <br />
        Mouse Latitude: {mouseState.position.lat}
        <br />
        Mouse Longitude: {mouseState.position.lng}
        <br />
        Council: {mouseState.council ? mouseState.council : 'None'}
        <br />
        Whaitua: {mouseState.whaitua ? mouseState.whaitua : 'None'}
        <br />
        Ground Water 0-20m: {mouseState.gw00 ? mouseState.gw00 : 'None'}
        <br />
        Ground Water 20m-30m: {mouseState.gw20 ? mouseState.gw20 : 'None'}
        <br />
        Ground Water Over 30m: {mouseState.gw30 ? mouseState.gw30 : 'None'}
        <br />
        Site: {mouseState.site ? mouseState.site : 'None'}
        <br />
        River: {mouseState.river ? mouseState.river : 'None'}
      </aside>
    </>
  );
}
