import { FeatureCollection, Geometry } from 'geojson';
import React from 'react';

import formatWaterQuantity from './formatWaterQuantity';
import { useAtom } from 'jotai';
import {
  groundwaterZoneBoundariesDataAtom,
  groundwaterZoneNameAtom,
} from './atoms';

type Props = {
  activeZonesIds: Array<number>;
};

export default function GroundwaterLimits({ activeZonesIds }: Props) {
  const [groundwaterZoneBoundaries] = useAtom(
    groundwaterZoneBoundariesDataAtom
  );

  const activeFeatures = groundwaterZoneBoundaries.features.filter((item) =>
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
