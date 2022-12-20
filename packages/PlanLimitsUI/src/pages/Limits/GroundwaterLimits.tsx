import { FeatureCollection, Geometry } from 'geojson';
import React from 'react';

import { GroundwaterZoneBoundariesProperties } from '../../api';
import formatWaterQuantity from './formatWaterQuantity';

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
      {activeFeatures.map((feature, index) => {
        const {
          groundwater_allocation_amount: gwAllocationAmount,
          groundwater_allocation_amount_unit: gwAllocationUnit,
          depth,
          category,
          surface_water_allocation_amount_unit: swAllocationUnit,
          surface_water_allocation_amount: swAllocationAmount,
        } = feature.properties;

        switch (category) {
          case 'Category A':
            return (
              <React.Fragment key={index}>
                <span className={'font-medium'}>
                  If taking groundwater from a bore (screen {depth} deep):&nbsp;
                </span>
                <span>
                  {formatWaterQuantity(swAllocationAmount, swAllocationUnit)}
                </span>
                <br />
              </React.Fragment>
            );
          case 'Category B':
            return (
              <React.Fragment key={index}>
                <span className={'font-medium'}>
                  If taking groundwater from a bore (screen {depth} deep, stream
                  depleting):&nbsp;
                </span>
                <span>
                  {formatWaterQuantity(swAllocationAmount, swAllocationUnit)}
                </span>
                <br />
                <span className={'font-medium'}>
                  If taking groundwater from a bore (screen {depth} deep):&nbsp;
                </span>
                <span>
                  {formatWaterQuantity(gwAllocationAmount, gwAllocationUnit)}
                </span>
                <br />
              </React.Fragment>
            );
          case 'Category C':
            return (
              <React.Fragment key={index}>
                <span className={'font-medium'}>
                  If taking groundwater from a bore (screen {depth} deep):&nbsp;
                </span>
                <span>
                  {formatWaterQuantity(gwAllocationAmount, gwAllocationUnit)}
                </span>
                <br />
              </React.Fragment>
            );
        }
      })}
    </>
  );
}
