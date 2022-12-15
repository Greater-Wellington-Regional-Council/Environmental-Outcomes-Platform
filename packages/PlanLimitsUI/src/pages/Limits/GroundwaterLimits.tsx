import { FeatureCollection, Geometry } from 'geojson';
import React from 'react';

import { GroundwaterZoneBoundariesProperties } from '../../api';

type Props = {
  activeZonesIds: Array<number>;
  groundWaterZoneGeoJson: FeatureCollection<
    Geometry,
    GroundwaterZoneBoundariesProperties
  >;
};

export default function GroundwaterLimits({
  activeZonesIds,
  groundWaterZoneGeoJson,
}: Props) {
  const activeFeatures = groundWaterZoneGeoJson.features.filter((item) =>
    activeZonesIds.includes(Number(item.id as string))
  );

  return (
    <>
      {activeFeatures.map(function (feature) {
        switch (feature.properties.category) {
          case 'Category A':
            return (
              <>
                <span className={'font-medium'}>
                  If taking groundwater from a bore (screen{' '}
                  {feature.properties.depth} deep):&nbsp;
                </span>
                <span>
                  {feature.properties.surface_water_allocation_amount}{' '}
                  {feature.properties.surface_water_allocation_amount_unit}
                </span>
                <br />
              </>
            );
          case 'Category B':
            return (
              <>
                <span className={'font-medium'}>
                  If taking groundwater from a bore (screen{' '}
                  {feature.properties.depth} deep, stream depleting):&nbsp;
                </span>
                <span>
                  {feature.properties.surface_water_allocation_amount}{' '}
                  {feature.properties.surface_water_allocation_amount_unit}
                </span>
                <br />
                <span className={'font-medium'}>
                  If taking groundwater from a bore (screen{' '}
                  {feature.properties.depth} deep):&nbsp;
                </span>
                <span>
                  {feature.properties.groundwater_allocation_amount}{' '}
                  {feature.properties.groundwater_allocation_amount_unit}
                </span>
                <br />
              </>
            );
          case 'Category C':
            return (
              <>
                <span className={'font-medium'}>
                  If taking groundwater from a bore (screen{' '}
                  {feature.properties.depth} deep):&nbsp;
                </span>
                <span>
                  {feature.properties.groundwater_allocation_amount}{' '}
                  {feature.properties.groundwater_allocation_amount_unit}
                </span>
                <br />
              </>
            );
        }
      })}
    </>
  );
}
