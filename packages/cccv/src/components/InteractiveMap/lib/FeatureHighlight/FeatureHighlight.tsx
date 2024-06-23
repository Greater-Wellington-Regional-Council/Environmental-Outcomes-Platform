import React from 'react';
import {Layer} from 'react-map-gl';
import {FeatureHighlightProps} from "@components/InteractiveMap/lib/InteractiveMap";

const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
                                                             highlightedFeature,
                                                             id,
                                                             fillColor = 'orange',
                                                             fillOpacity = 0.3,
                                                             filter = ['==', ['id'], highlightedFeature?.feature?.properties?.id || null],
                                                             source,
                                                             tooltip = null
                                                           }) => {

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
      {highlightedFeature && tooltip?.source(highlightedFeature.feature) && (
        <div
          className="tooltip"
          style={{
            left: highlightedFeature?.x,
            top: highlightedFeature?.y,
          }}
        >
          {tooltip?.source(highlightedFeature.feature)}
        </div>
      )}
    </>
  )
}

export default FeatureHighlight;