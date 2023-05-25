import { useState, useCallback } from 'react';
import formatWaterQuantity from './formatWaterQuantity';
import { groupBy } from 'lodash';

export function useAppState(): [
  AppState,
  (activeLimits: ActiveLimits, allPlanData: AllPlanData) => void
] {
  const [appState, setAppState] = useState<AppState>({
    planRegion: null,
    flowLimit: null,
    flowSite: null,
    surfaceWaterUnitLimit: null,
    surfaceWaterSubUnitLimit: null,
    groundWaterLimits: [],
    groundWaterZones: [],
  });

  const setAppStateFromResult = useCallback(
    (activeLimits: ActiveLimits, allPlanData: AllPlanData) => {
      let flowSite = null;
      if (activeLimits.flowLimit !== null) {
        flowSite = allPlanData.flowMeasurementSites.find(
          (fs) => fs.id === activeLimits.flowLimit.measuredAtSiteId
        );
        if (!flowSite) throw new Error('Flow site not found');
      }

      const groundWaterZones = activeLimits.groundWaterLimits.map(
        (gl) => gl.id
      );
      const groundWaterZoneName = [
        // Contructing then destructuring from a Set leaves us with unique values
        ...new Set(activeLimits.groundWaterLimits.map((gwl) => gwl.name)),
      ].join(', ');

      const surfaceWaterLimitView = buildSurfaceWaterLimitView(
        activeLimits.surfaceWaterUnitLimit,
        activeLimits.surfaceWaterSubUnitLimit,
        activeLimits.planRegion?.id
      );

      const groundWaterLimitViews = buildGroundWaterLimitView(
        activeLimits.groundWaterLimits,
        allPlanData.surfaceWaterUnitLimits,
        allPlanData.surfaceWaterSubUnitLimits
      );

      // TODO: Handle this fallback properly - should only apply of no limits across all cats
      // if (groundwaterLimits.length === 0) {
      //   rows.push({
      //     depth: 'All',
      //     useDefaultRuleForSubUnit: false,
      //     useDefaultRuleForUnit: true,
      //   });
      //   return rows;
      // }
      const catAGroundWaterLimitsView = filterGroupAndSort(
        groundWaterLimitViews,
        'A'
      );
      if (Object.keys(catAGroundWaterLimitsView).length === 0) {
        catAGroundWaterLimitsView['All'] = [
          {
            groundWaterLimit: {
              category: 'A',
              depth: 'All',
            },
          },
        ];
      }

      setAppState({
        ...activeLimits,
        flowSite,
        groundWaterZoneName,
        groundWaterZones,
        surfaceWaterLimitView,
        catAGroundWaterLimitsView,
        catBGroundWaterLimitsView: filterGroupAndSort(
          groundWaterLimitViews,
          'B'
        ),
        catCGroundWaterLimitsView: filterGroupAndSort(
          groundWaterLimitViews,
          'C'
        ),
      });
    },
    [setAppState]
  );

  return [appState, setAppStateFromResult];
}

function buildSurfaceWaterLimitView(
  surfaceWaterUnitLimit: SurfaceWaterLimit | null,
  surfaceWaterSubUnitLimit: SurfaceWaterLimit | null,
  planRegionId?: number
): SurfaceWaterLimitView {
  const unitLimitToDisplay =
    surfaceWaterUnitLimit?.allocationLimit.toString() ?? 'RULE';

  let subUnitLimitToDisplay =
    surfaceWaterSubUnitLimit?.allocationLimit.toString();
  // Ruamahanga (Whaitua '4') uses 2 levels of surface water units. So in areas
  // where there is no value at the Subunit and there is a management unit,
  // limit P121 applies.
  if (
    !subUnitLimitToDisplay &&
    planRegionId === 4 &&
    Boolean(surfaceWaterUnitLimit)
  ) {
    subUnitLimitToDisplay = 'RULE';
  }

  return {
    unitLimitToDisplay,
    subUnitLimitToDisplay,
    unitAllocatedToDisplay:
      surfaceWaterUnitLimit?.allocationAmount.toString() || '',
    subUnitAllocatedToDisplay:
      surfaceWaterSubUnitLimit?.allocationAmount.toString() || '',
  };
}

function buildGroundWaterLimitView(
  groundwaterLimits: GroundWaterLimit[],
  surfaceWaterUnitLimits: SurfaceWaterLimit[],
  surfaceWaterSubUnitLimits: SurfaceWaterLimit[]
) {
  return groundwaterLimits.map((groundWaterLimit) => {
    const depletesFrom = mapDepletesFrom(
      groundWaterLimit,
      surfaceWaterUnitLimits,
      surfaceWaterSubUnitLimits
    );

    return {
      groundWaterLimit,
      ...depletesFrom,
      ...unitLimitsToDisplay(
        groundWaterLimit,
        depletesFrom.depletesFromUnitLimit,
        depletesFrom.depletesFromSubunitLimit
      ),
    };
  });
}

function mapDepletesFrom(
  limit: GroundWaterLimit,
  surfaceWaterUnitLimits: SurfaceWaterLimit[],
  surfaceWaterSubUnitLimits: SurfaceWaterLimit[]
) {
  let depletesFromUnitLimit;
  let depletesFromSubunitLimit;
  if (limit.depletionLimitId) {
    depletesFromSubunitLimit = surfaceWaterSubUnitLimits.find(
      (sw) => sw.id === limit.depletionLimitId
    );
    let depletesFromUnitLimitId: number | undefined;
    if (
      depletesFromSubunitLimit &&
      depletesFromSubunitLimit.parentSurfaceWaterLimitId
    ) {
      depletesFromUnitLimitId =
        depletesFromSubunitLimit.parentSurfaceWaterLimitId;
    } else if (!depletesFromSubunitLimit) {
      depletesFromUnitLimitId = limit.depletionLimitId;
    }
    if (depletesFromUnitLimitId) {
      depletesFromUnitLimit = surfaceWaterUnitLimits.find(
        (sw) => sw.id === depletesFromUnitLimitId
      );
    }
  }
  return {
    depletesFromUnitLimit,
    depletesFromSubunitLimit,
  };
}

function unitLimitsToDisplay(
  groundWaterLimit: GroundWaterLimit,
  depletesFromUnitLimit?: SurfaceWaterLimit,
  depletesFromSubunitLimit?: SurfaceWaterLimit
) {
  switch (groundWaterLimit.category) {
    case 'A':
      if (!groundWaterLimit.depletionLimitId) {
        return {
          unitLimitToDisplay: 'RULE',
          subUnitLimitToDisplay: 'RULE',
        };
      } else {
        return {
          unitLimitToDisplay: depletesFromUnitLimit?.allocationLimit.toString(),
          unitAllocatedToDisplay:
            depletesFromUnitLimit?.allocationAmount.toString(),
          subUnitLimitToDisplay:
            depletesFromSubunitLimit?.allocationLimit.toString(),
          subUnitAllocatedToDisplay:
            depletesFromSubunitLimit?.allocationAmount.toString(),
        };
      }
    case 'B':
      return {
        unitLimitToDisplay: 'RULE',
        unitAllocatedToDisplay: groundWaterLimit.allocationAmount.toString(),
      };
    case 'C':
      return {
        unitLimitToDisplay: groundWaterLimit.allocationLimit.toString(),
        unitAllocatedToDisplay: groundWaterLimit.allocationAmount.toString(),
      };
  }
}

function filterGroupAndSort(
  limitViews: GroundwaterLimitView[],
  category: string
) {
  const filtered = limitViews.filter(
    (lv) => lv.groundWaterLimit.category === category
  );
  const grouped = groupBy(filtered, (lv) => lv.groundWaterLimit.limitId);

  Object.values(grouped).forEach((group) => {
    sortByDepth(group);
  });

  return grouped;
}

function sortByDepth(groundwaterLimitsView: GroundwaterLimitView[]) {
  return groundwaterLimitsView.sort((a, b) => {
    // This specific sorting is ok because the set of values we have for Depths can always be sorted by the first character currently
    const alphabet = '0123456789>';
    const first = a.groundWaterLimit.depth.charAt(0);
    const second = b.groundWaterLimit.depth.charAt(0);
    return alphabet.indexOf(first) - alphabet.indexOf(second);
  });
}

// function allocatedProps(
//   limitAmount: string,
//   allocatedAmount: string,
//   unit: string
// ) {
//   let amount;
//   let percentage;
//   if (allocatedAmount && unit) {
//     amount = formatWaterQuantity(Math.round(Number(allocatedAmount)), unit);
//     if (limitAmount) {
//       percentage = Math.round(
//         (Number(allocatedAmount) / Number(limitAmount)) * 100
//       );
//     }
//   }
//   return { amount, percentage };
// }
