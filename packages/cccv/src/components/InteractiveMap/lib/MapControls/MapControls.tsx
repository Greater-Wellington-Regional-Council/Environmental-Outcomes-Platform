import React from 'react';
import { NavigationControl, ScaleControl } from 'react-map-gl';

const MapControls: React.FC = () => (
  <>
    <ScaleControl />
    <NavigationControl position="top-left" visualizePitch={true} />
  </>
);

export default MapControls;