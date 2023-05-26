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
      if (activeLimits.flowLimit) {
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

      const defaultGroundWaterLimit =
        activeLimits.planRegion?.defaultGroundwaterLimit ||
        allPlanData.plan.defaultGroundwaterLimit;

      const defaultSurfaceWaterLimit =
        activeLimits.planRegion?.defaultSurfaceWaterLimit ||
        allPlanData.plan.defaultSurfaceWaterLimit;

      const surfaceWaterLimitView = buildSurfaceWaterLimitView(
        activeLimits.surfaceWaterUnitLimit,
        activeLimits.surfaceWaterSubUnitLimit,
        defaultSurfaceWaterLimit,
        activeLimits.planRegion?.id
      );

      const groundWaterLimitViews = buildGroundWaterLimitView(
        activeLimits.groundWaterLimits,
        allPlanData.surfaceWaterUnitLimits,
        allPlanData.surfaceWaterSubUnitLimits
      );

      // TODO: Extract this!
      const gwLimitViews =
        groundWaterLimitViews.length === 0
          ? {
              catAGroundWaterLimitsView: defaultCatAGroundWaterLimit(
                defaultGroundWaterLimit
              ),
            }
          : {
              catAGroundWaterLimitsView: filterGroupAndSort(
                groundWaterLimitViews,
                'A'
              ),
              catBGroundWaterLimitsView: filterGroupAndSort(
                groundWaterLimitViews,
                'B'
              ),
              catCGroundWaterLimitsView: filterGroupAndSort(
                groundWaterLimitViews,
                'C'
              ),
            };

      setAppState({
        ...activeLimits,
        flowSite,
        groundWaterZoneName,
        groundWaterZones,
        surfaceWaterLimitView,
        ...gwLimitViews,
      });
    },
    [setAppState]
  );

  return [appState, setAppStateFromResult];
}

function defaultCatAGroundWaterLimit(
  defaultLimit: string
): GroupedGroundwaterLimitViews {
  return {
    all: [
      {
        groundWaterLimit: {
          category: 'A',
          depth: 'All',
        } as GroundWaterLimit,
        unitLimitView: {
          limitToDiplay: defaultLimit,
        },
        subUnitLimitView: {},
      },
    ],
  };
}

function buildSurfaceWaterLimitView(
  surfaceWaterUnitLimit: SurfaceWaterLimit | null,
  surfaceWaterSubUnitLimit: SurfaceWaterLimit | null,
  defaultSurfaceWaterLimit: string,
  planRegionId?: number
): SurfaceWaterLimitView {
  const unitLimitView: LimitView = {
    limit: surfaceWaterUnitLimit?.allocationLimit,
    overrideText: surfaceWaterUnitLimit?.allocationLimit
      ? undefined
      : defaultSurfaceWaterLimit,
    allocated: surfaceWaterUnitLimit?.allocationAmount,
  };

  const subUnitLimitView: LimitView = {
    limit: surfaceWaterSubUnitLimit?.allocationLimit,
    allocated: surfaceWaterSubUnitLimit?.allocationAmount,
  };
  // Ruamahanga (Whaitua '4') uses 2 levels of surface water units. So in areas
  // where there is no value at the Subunit and there is a management unit,
  // limit P121 applies.
  if (
    !subUnitLimitView.limit &&
    planRegionId === 4 &&
    Boolean(unitLimitView.limit)
  ) {
    subUnitLimitView.overrideText = defaultSurfaceWaterLimit;
  }

  return {
    unitLimitView: formatLimitView(unitLimitView),
    subUnitLimitView: formatLimitView(subUnitLimitView),
  };
}

function buildGroundWaterLimitView(
  groundwaterLimits: GroundWaterLimit[],
  surfaceWaterUnitLimits: SurfaceWaterLimit[],
  surfaceWaterSubUnitLimits: SurfaceWaterLimit[],
  defaultGroundWaterLimit: string
) {
  return groundwaterLimits.map((groundWaterLimit) => {
    const depletesFrom = mapDepletesFrom(
      groundWaterLimit,
      surfaceWaterUnitLimits,
      surfaceWaterSubUnitLimits
    );

    const limitsToDisplay = unitLimitsToDisplay(
      groundWaterLimit,
      defaultGroundWaterLimit,
      depletesFrom.depletesFromUnitLimit,
      depletesFrom.depletesFromSubunitLimit
    );
    limitsToDisplay.subUnitLimitView = formatLimitView(
      limitsToDisplay.subUnitLimitView
    );
    limitsToDisplay.unitLimitView = formatLimitView(
      limitsToDisplay.unitLimitView
    );

    return {
      groundWaterLimit,
      ...depletesFrom,
      ...limitsToDisplay,
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
  defaultGroundWaterLimit: string,
  depletesFromUnitLimit?: SurfaceWaterLimit,
  depletesFromSubunitLimit?: SurfaceWaterLimit
): { unitLimitView: LimitView; subUnitLimitView: LimitView } {
  switch (groundWaterLimit.category) {
    case 'A':
      if (!groundWaterLimit.depletionLimitId) {
        return {
          unitLimitView: {
            overrideText: defaultGroundWaterLimit,
          },
          subUnitLimitView: {
            overrideText: defaultGroundWaterLimit,
          },
        };
      }
      return {
        unitLimitView: {
          limit: depletesFromUnitLimit?.allocationLimit,
          allocated: depletesFromUnitLimit?.allocationAmount,
        },
        subUnitLimitView: {
          limit: depletesFromSubunitLimit?.allocationLimit,
          allocated: depletesFromSubunitLimit?.allocationAmount,
        },
      };
    case 'B':
      return {
        unitLimitView: {
          overrideText: defaultGroundWaterLimit,
          limit: groundWaterLimit.allocationLimit,
          allocated: groundWaterLimit.allocationAmount,
        },
        subUnitLimitView: {},
      };
    case 'C':
      return {
        unitLimitView: {
          limit: groundWaterLimit.allocationLimit,
          allocated: groundWaterLimit.allocationAmount,
        },
        subUnitLimitView: {},
      };
    default:
      throw new Error('Unknown category');
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

function formatLimitView(limitView: LimitView) {
  if (limitView.overrideText) {
    limitView.limitToDiplay = limitView.overrideText;
  } else if (limitView.limit) {
    limitView.limitToDiplay == formatWaterQuantity(limitView.limit, 'L/s');
  }

  if (limitView.allocated) {
    limitView.allocatedToDiplay = formatWaterQuantity(
      limitView.allocated,
      'L/s'
    );
  }

  if (limitView.limit && limitView.allocated) {
    limitView.allocatedPercent = Math.round(
      (limitView.allocated / limitView.limit) * 100
    );
  }
  return limitView;
}
