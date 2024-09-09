import React, {Dispatch, SetStateAction} from "react"
import {MapRef} from "react-map-gl"
import mapboxgl from "mapbox-gl"
import {Feature} from "geojson"

interface MapProps {
  startLocation: ViewLocation;
  locationInFocus?: ViewLocation | null;
}

interface InteractiveMapProps extends MapProps {
  setLocationInFocus?: Dispatch<SetStateAction<ViewLocation | null>>;
  setPrintSnapshot?: Dispatch<SetStateAction<string | null>>;
  children?: React.ReactNode;
}

interface BoundaryLinesLayerProps {
  id: string;
  source: string;
  mapStyle: string;
  fillColor?: string;
  fillLayer: string;
}

type CombinedMapRef = MapRef & mapboxgl.Map;

interface FeatureHighlightProps {
  highlightedFeature: Feature;
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