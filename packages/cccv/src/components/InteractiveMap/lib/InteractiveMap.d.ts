import React, {Dispatch, SetStateAction} from "react";
import {MapRef} from "react-map-gl";
import mapboxgl from "mapbox-gl";
import {Feature} from "geojson";

interface InteractiveMapProps {
  startLocation: ViewLocation;
  selected?: ViewLocation | null;
  select?: Dispatch<SetStateAction<ViewLocation | null>>;
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