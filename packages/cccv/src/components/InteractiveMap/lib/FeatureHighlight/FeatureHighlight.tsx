import React, {useEffect, useState} from 'react';
import {Layer} from 'react-map-gl';
import {FeatureHighlightProps} from "@components/InteractiveMap/lib/InteractiveMap";
import calculatePolygonCentroid from "@lib/calculatePolygonCentoid.ts";
import { Point, Polygon } from 'geojson';

const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
                                                             highlightedFeature,
                                                             id,
                                                             mapRef,
                                                             fillColor = 'orange',
                                                             fillOpacity = 0.3,
                                                             filter = ['==', ['id'], highlightedFeature?.feature?.properties?.id || null],
                                                             source,
                                                             tooltip = null
                                                           }) => {

  const [tooltipPosition, setTooltipPosition] = useState<{ left: number, top: number } | null>(null);

  const moveToolTip = () => {
    if (highlightedFeature && mapRef?.current) {
      const geometry = highlightedFeature.feature.geometry;

      let coordinates: [number, number] | null = null;

      if (geometry.type === 'Point') {
        coordinates = (geometry as Point).coordinates as [number, number];
      } else if (geometry.type === 'Polygon') {
        const polygon = geometry as Polygon;
        coordinates = calculatePolygonCentroid(polygon);
      }

      if (coordinates) {
        const screenCoords = mapRef.current.project(coordinates);
        setTooltipPosition({ left: screenCoords.x, top: screenCoords.y });
      }
    }
  }

  useEffect(() => {
    moveToolTip();
    if (mapRef?.current) {
      const map = mapRef.current.getMap();
      map.on('mouseup', moveToolTip);
      map.on('drag', moveToolTip);
      map.on('move', moveToolTip);
      return () => {
        map.off('move', moveToolTip);
        map.off('mouseup', moveToolTip);
      }
    }
  }, [highlightedFeature, mapRef]);

  return (
    <>
      <Layer
        id={`${id}-candidates`}
        type="fill"
        paint={{
          'fill-color': fillColor,
          'fill-opacity': 0,
        }}
        source={source}
      />
      {highlightedFeature && (
        <Layer
          id={`${id}-highlight`}
          type="fill"
          filter={filter}
          paint={{
            'fill-color': fillColor,
            'fill-opacity': fillOpacity,
          }}
          source={source}
        />)}
      {highlightedFeature && tooltip?.source(highlightedFeature.feature) && tooltipPosition && (
        <div
          className="tooltip"
          style={{
            left: tooltipPosition.left,
            top: tooltipPosition.top,
          }}
        >
          {tooltip?.source(highlightedFeature.feature)}
        </div>
      )}
    </>
  )
}

export default FeatureHighlight;