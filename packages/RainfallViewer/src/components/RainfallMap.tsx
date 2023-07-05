'use client';
import { useState, type Dispatch, type SetStateAction } from 'react';
import maplibregl from 'maplibre-gl';
import Map, {
  NavigationControl,
  Source,
  Layer,
  type MapboxEvent,
  type MapLayerMouseEvent,
  type ViewStateChangeEvent,
} from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { flatten } from 'lodash';

import { type RainfallObservationFeatures } from '../lib/api';
import ColorScale from '@/components/ColorScale';
import rainIcon from '../../public/rain.svg';
import siteIcon from '../../public/site.svg';
import { FeatureCollection } from 'geojson';

const LINZ_API_KEY = process.env.NEXT_PUBLIC_LINZ_API_KEY;
const EMPTY_GEO_JSON_DATA = {
  type: 'FeatureCollection' as const,
  features: [],
};

const iconColor = (
  colorScale: Array<[number | null, string]>,
  amountExpression: any
) => {
  // Generate a mapbox case expressions to map rainfall amounts to color.
  // https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/#case
  const caseStatement = colorScale.map((step, index) => {
    const color = step[1];
    switch (index) {
      case 0:
        return [['<', amountExpression, step[0]], color];
      case colorScale.length - 1:
        return [color];
      default:
        return [
          [
            'all',
            ['>=', amountExpression, colorScale[index - 1][0]],
            ['<', amountExpression, step[0]],
          ],
          color,
        ];
    }
  });
  return {
    // @ts-ignore
    'icon-color': ['case', ...flatten(caseStatement)],
  };
};

const determineAmountExpression = (
  viewParams: ViewParams,
  accumOffset: number
) => {
  if (!viewParams.showAccumulation) return ['get', 'amount'];

  return ['get', 'amount', ['at', accumOffset, ['get', 'hourly_data']]];
};

const baseMapPaintProp: mapboxgl.SymbolPaint = {
  'icon-opacity': 1,
  'text-color': '#000000',
};

const baseMapLayoutProp: mapboxgl.SymbolLayout = {
  'icon-image': 'rain-icon',
  'icon-size': 1.2,
  'text-font': ['Open Sans Regular'],
  'text-size': 12,
  'icon-allow-overlap': true,
  'icon-ignore-placement': true,
  'text-allow-overlap': true,
};

const sitesWithNoRainOrDataLayout = {
  'icon-image': 'site-icon',
  'icon-size': 0.5,
  'icon-allow-overlap': true,
  'icon-ignore-placement': true,
  'text-allow-overlap': true,
};

const layerFilterSitesWithRain = (amountExpression: any) => [
  'all',
  ['!=', amountExpression, ['literal', null]],
  ['!=', amountExpression, ['literal', 0]],
];

const layerFilterSitesWithNoRain = [
  'all',
  ['==', ['get', 'amount'], ['literal', 0]],
];

const layerFilterSitesWithNoData = [
  'all',
  ['==', ['get', 'amount'], ['literal', null]],
];

function popupContents(
  observation: RainfallObservation,
  viewParams: ViewParams,
  accumOffset: number
) {
  // HACK: mapbox seems to serialize properties which are objects to JSON. So
  // we need to re-parse
  const amount = viewParams.showAccumulation
    ? JSON.parse(observation.hourly_data)[accumOffset].amount
    : observation.amount;
  return `<p class="text-xs">
    <h2 class="font-bold">${observation.name}</h2>
    <h3 class="italic">${observation.council_name}</h3>
    ${
      amount !== null && amount !== undefined
        ? `${amount}mm`
        : 'No data available'
    }
  </p>
  `;
}

type Props = {
  rainfall: RainfallObservationFeatures;
  councils: FeatureCollection;
  councilHighlight: number | null;
  viewParams: ViewParams;
  mapView: MapView;
  setMapView: Dispatch<SetStateAction<MapView>>;
  accumOffset: number;
};

export default function RainfallMap({
  rainfall,
  councils,
  mapView,
  setMapView,
  viewParams,
  councilHighlight,
  accumOffset,
}: Props) {
  const [rainImageAdded, setRainImageAdded] = useState(false);
  const [siteImageAdded, setSiteImageAdded] = useState(false);

  const handleLoad = (evt: MapboxEvent) => {
    const rainImage = new Image(20, 20);
    rainImage.onload = () => {
      evt.target.addImage('rain-icon', rainImage, { sdf: true });
      setRainImageAdded(true);
    };
    rainImage.src = rainIcon.src;

    const siteImage = new Image(20, 20);
    siteImage.onload = () => {
      evt.target.addImage('site-icon', siteImage, { sdf: true });
      setSiteImageAdded(true);
    };
    siteImage.src = siteIcon.src;
  };

  const handleClick = (evt: MapLayerMouseEvent) => {
    const feature = evt.features && evt.features[0];
    if (feature) {
      // @ts-ignore
      const { coordinates } = feature.geometry;
      const [longitude, latitude] = coordinates;
      const popup = new maplibregl.Popup({ closeButton: false })
        .setLngLat([longitude, latitude])
        .setHTML(
          popupContents(
            feature.properties as RainfallObservation,
            viewParams,
            accumOffset
          )
        )
        // @ts-ignore
        .addTo(evt.target);
      setTimeout(() => popup.remove(), 2000);
    }
  };

  const handleMove = (evt: ViewStateChangeEvent) => {
    setMapView(evt.viewState);
  };

  const amountExpression = determineAmountExpression(viewParams, accumOffset);
  const laterFilter = layerFilterSitesWithRain(amountExpression);

  const paintProp = {
    ...baseMapPaintProp,
    ...iconColor(viewParams.colorScale, amountExpression),
  };
  const layoutProp = {
    ...baseMapLayoutProp,
  };
  if (viewParams.showTotals) {
    // @ts-ignore
    layoutProp['text-field'] = amountExpression;
  }

  return (
    <Map
      onLoad={handleLoad}
      mapLib={maplibregl}
      initialViewState={{
        longitude: 172.079,
        latitude: -41.123,
        zoom: 5,
      }}
      interactiveLayerIds={['sites', 'sitesWithNoData', 'sitesWithNoRain']}
      mapStyle={`https://basemaps.linz.govt.nz/v1/styles/topographic.json?api=${LINZ_API_KEY}`}
      onClick={handleClick}
      onMove={handleMove}
      styleDiffing
      {...mapView}
    >
      <NavigationControl position="top-left" visualizePitch={false} />

      <Source id="councils" type="geojson" data={councils}>
        <Layer
          id="councilsOutline"
          type="line"
          paint={{
            'line-color': [
              'case',
              ['==', ['id'], councilHighlight],
              '#00526e',
              '#6b7280',
            ],
            'line-width': ['case', ['==', ['id'], councilHighlight], 3, 1],
          }}
        />
        <Layer
          id="councilsBackground"
          type="fill"
          paint={{
            'fill-color': '#00526e',
            'fill-opacity': ['case', ['==', ['id'], councilHighlight], 0.1, 0],
            'fill-opacity-transition': {
              duration: 3000,
              delay: 0,
            },
          }}
        />
      </Source>

      <Source
        id="observationSites"
        type="geojson"
        data={rainImageAdded && siteImageAdded ? rainfall : EMPTY_GEO_JSON_DATA}
      >
        <Layer
          id="sites"
          type="symbol"
          layout={layoutProp}
          filter={laterFilter}
          // @ts-ignore
          paint={paintProp}
        />
        {!viewParams.showAccumulation && (
          <>
            <Layer
              id="sitesWithNoRain"
              source="observationSites"
              type="symbol"
              minzoom={6}
              layout={sitesWithNoRainOrDataLayout}
              paint={{
                'icon-opacity': 0.5,
                'icon-color': '#4b5563',
              }}
              filter={layerFilterSitesWithNoRain}
            />
            <Layer
              id="sitesWithNoData"
              source="observationSites"
              type="symbol"
              layout={sitesWithNoRainOrDataLayout}
              paint={{
                'icon-opacity': 0.5,
                'icon-color': '#dc2626',
              }}
              filter={layerFilterSitesWithNoData}
            />
          </>
        )}
      </Source>
      <div className="absolute bottom-10 right-4">
        <ColorScale viewParams={viewParams} />
      </div>
    </Map>
  );
}
