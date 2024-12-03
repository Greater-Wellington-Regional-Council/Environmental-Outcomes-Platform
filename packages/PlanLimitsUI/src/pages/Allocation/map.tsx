import { useState, useEffect, useRef } from 'react';
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
  type MapLayerMouseEvent,
} from 'react-map-gl/maplibre';
import type { PlanLimitsData } from '../../api';
import LayerControl from '../../components/map/LayerControl';
import Button from '../../components/RoundedButton';
import RiverTilesSource from './RiverTilesSource';
import flowMarkerImage from '../../images/marker_flow.svg';

const LINZ_API_KEY = import.meta.env.VITE_LINZ_API_KEY;
const EMPTY_GEO_JSON_DATA = {
  type: 'FeatureCollection' as const,
  features: [],
};

type Props = {
  appState: AppState;
  setAppState: (activeLimits: ActiveLimits, allPlanData: AllPlanData) => void;
  viewState: ViewState;
  setViewState: (value: ViewState) => void;
  pinnedLocation: PinnedLocation | null;
  setPinnedLocation: (
    updateFn: (prevValue: PinnedLocation | null) => PinnedLocation | null,
  ) => void;
  waterTakeFilter: WaterTakeFilter;
  planLimitsData: PlanLimitsData;
};

interface Identifyable {
  id: number;
}

function mapFeatureLayers<T extends Identifyable>(
  features: mapboxgl.MapboxGeoJSONFeature[],
  layerName: string,
  collection: T[],
) {
  return features
    .filter((feature) => feature.layer.id === layerName)
    .map((feature) => {
      const item = collection.find((ci) => ci.id === Number(feature.id));
      if (!item)
        throw new Error(
          `Could not find item with feature id ${feature.id} from layer ${layerName} `,
        );
      return item;
    });
}

function mapFeatureLayer<T extends Identifyable>(
  features: mapboxgl.MapboxGeoJSONFeature[],
  layerName: string,
  collection: T[],
) {
  const featureLayers = mapFeatureLayers<T>(features, layerName, collection)
  if (layerName === "surfaceWaterSubUnitLimits") console.log("featureLayers", featureLayers)
  return featureLayers[layerName === "surfaceWaterSubUnitLimits" ? featureLayers.length - 1 : 0];
}

// TODO: Push this into useAppState?
function mapAllFeatures(
  features: mapboxgl.MapboxGeoJSONFeature[],
  appPlanData: AllPlanData,
): ActiveLimits {
  return {
    planRegion:
      mapFeatureLayer<PlanRegion>(
        features,
        'planRegions',
        appPlanData.planRegions,
      ) || null,
    flowLimit:
      mapFeatureLayer<FlowLimit>(
        features,
        'flowLimits',
        appPlanData.flowLimits,
      ) || null,
    surfaceWaterUnitLimit:
      mapFeatureLayer<SurfaceWaterLimit>(
        features,
        'surfaceWaterUnitLimits',
        appPlanData.surfaceWaterUnitLimits,
      ) || null,
    surfaceWaterSubUnitLimit:
      mapFeatureLayer<SurfaceWaterLimit>(
        features,
        'surfaceWaterSubUnitLimits',
        appPlanData.surfaceWaterSubUnitLimits,
      ) || null,
    groundWaterLimits: mapFeatureLayers<GroundWaterLimit>(
      features,
      'groundWaterLimits',
      appPlanData.groundWaterLimits,
    ),
  };
}

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

  const { isLoaded, data: allPlanData, features } = planLimitsData;

  useEffect(() => {
    if (mapLoaded && mapRef.current && isLoaded && pinnedLocation) {
      const activeFeatures = mapRef.current.queryRenderedFeatures(
        mapRef.current.project([
          pinnedLocation.longitude,
          pinnedLocation.latitude,
        ]),
      );
      const activeLimits = mapAllFeatures(activeFeatures, allPlanData!);
      setAppState(activeLimits, allPlanData!);
    }
  }, [mapLoaded, isLoaded, pinnedLocation, setAppState]);

  const handleLoad = (evt) => {
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
    if (pinnedLocation || !allPlanData) return;

    const activeFeatures = evt.target.queryRenderedFeatures(evt.point);
    const activeLimits = mapAllFeatures(activeFeatures, allPlanData);
    setAppState(activeLimits, allPlanData);
  };

  const handleClick = (evt: MapLayerMouseEvent) => {
    setPinnedLocation((prevValue) =>
      prevValue
        ? null
        : {
            latitude: evt.lngLat.lat,
            longitude: evt.lngLat.lng,
          },
    );
  };

  return (
    <Map
      ref={mapRef}
      reuseMaps={true}
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
        data={
          (planLimitsData.isLoaded && features!.councils) || EMPTY_GEO_JSON_DATA
        }
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
        id="planRegions"
        type="geojson"
        data={
          (planLimitsData.isLoaded && features!.planRegions) ||
          EMPTY_GEO_JSON_DATA
        }
      >
        <Layer
          id="planRegions"
          type="fill"
          paint={{
            'fill-opacity': 0,
          }}
        />
        <Layer
          id="planRegionsHighlight"
          filter={['==', ['id'], appState.planRegion && appState.planRegion.id]}
          type="fill"
          paint={{
            'fill-outline-color': '#484896',
            'fill-color': '#6e599f',
            'fill-opacity': 0.1,
          }}
        />
        <Layer
          id="planRegionsOutline"
          type="line"
          paint={{
            'line-color': 'green',
            'line-width': 2,
          }}
        />
      </Source>

      <RiverTilesSource zoom={viewState.zoom} />

      <Source
        id="groundWaterLimits"
        type="geojson"
        data={
          (planLimitsData.isLoaded && features!.groundWaterLimits) ||
          EMPTY_GEO_JSON_DATA
        }
      >
        <Layer
          id="groundWaterLimits"
          type="fill"
          paint={{
            'fill-opacity': 0,
          }}
        />
        {['Ground', 'Combined'].includes(waterTakeFilter) && (
          <Layer
            id="groundWaterLimitsHighlight"
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
        id="surfaceWaterUnitLimits"
        type="geojson"
        data={
          (planLimitsData.isLoaded && features!.surfaceWaterUnitLimits) ||
          EMPTY_GEO_JSON_DATA
        }
      >
        <Layer
          id="surfaceWaterUnitLimits"
          type="fill"
          paint={{
            'fill-opacity': 0,
          }}
        />
        {['Surface', 'Combined'].includes(waterTakeFilter) && (
          <Layer
            id="surfaceWaterUnitLimitHighlight"
            type="fill"
            filter={['==', ['id'], appState.surfaceWaterUnitLimit?.id || null]}
            paint={{
              'fill-outline-color': '#484896',
              'fill-color': '#6e599f',
              'fill-opacity': 0.3,
            }}
          />
        )}
      </Source>

      <Source
        id="surfaceWaterSubUnitLimits"
        type="geojson"
        data={
          (planLimitsData.isLoaded && features!.surfaceWaterSubUnitLimits) ||
          EMPTY_GEO_JSON_DATA
        }
      >
        <Layer
          id="surfaceWaterSubUnitLimits"
          type="fill"
          paint={{
            'fill-opacity': 0,
          }}
        />
        {['Surface', 'Combined'].includes(waterTakeFilter) && (
          <Layer
            id="surfaceWaterSubUnitLimitHighlight"
            type="fill"
            filter={[
              '==',
              ['id'],
              appState.surfaceWaterSubUnitLimit?.id || null,
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
        id="flowLimits"
        type="geojson"
        data={
          (planLimitsData.isLoaded && features!.flowLimits) ||
          EMPTY_GEO_JSON_DATA
        }
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
            filter={['==', ['id'], appState.flowLimit && appState.flowLimit.id]}
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
          planLimitsData.isLoaded && flowMarkerImageAdded
            ? features!.flowMeasurementSites
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
                appState.flowLimit ? appState.flowLimit.measuredAtSiteId : null,
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
