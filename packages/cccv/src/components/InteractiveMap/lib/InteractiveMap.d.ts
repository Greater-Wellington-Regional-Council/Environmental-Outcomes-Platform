import React, {Dispatch, SetStateAction} from "react";
import {MapRef} from "react-map-gl";
import mapboxgl from "mapbox-gl";
import {Feature} from "geojson";

interface MapProps {
  startLocation: ViewLocation;
  selected?: ViewLocation | null;
}

interface InteractiveMapProps extends MapProps {
  select?: Dispatch<SetStateAction<ViewLocation | null>>;
  setMapSnapshot?: Dispatch<SetStateAction<string | null>>;
  children?: React.ReactNode;
}

interface HighlightedFeature {
  feature: Feature;
  x: number;
  y: number
}

interface BoundaryLinesLayerProps {
  id: string;
  source: string;
  mapStyle: string;
}

type CombinedMapRef = MapRef & mapboxgl.Map;

interface FeatureHighlightProps {
  highlightedFeature: HighlightedFeature | null;
  id?: string;
  mapRef: React.RefObject<CombinedMapRef>;
  fillColor?: string;
  fillOpacity?: number;
  filter?: (string | string[] | never)[];
  source: string;
  tooltip?: {
    source: ((feature: Feature) => string);
  };
}