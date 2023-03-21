import { useState } from 'react';

export type AppState = {
  position: {
    lng: number;
    lat: number;
  };
  council?: string | null;
  whaitua?: string | null;
  whaituaId: string;
  groundWaterZoneName?: string;
  groundWaterZones: Array<number>;
  site?: string | null;
  surfaceWaterMgmtUnitId: string;
  surfaceWaterMgmtUnitDescription?: string | null;
  surfaceWaterMgmtSubUnitId: string;
  surfaceWaterMgmtSubUnitDescription?: string | null;
  minimumFlowLimitId: string | null;
  flowRestrictionsLevel?: string | JSX.Element | null;
  flowRestrictionsManagementSiteName?: string | JSX.Element | null;
  flowRestrictionsManagementSiteId?: string | null;
  surfaceWaterMgmtUnitLimit?: string | null;
  surfaceWaterMgmtSubUnitLimit?: string | null;
  surfaceWaterUnitAllocatedAmount: string | null;
  surfaceWaterSubUnitAllocatedAmount: string | null;
};

export function useAppState(): [
  AppState,
  React.Dispatch<React.SetStateAction<AppState>>
] {
  const [appState, setAppState] = useState<AppState>({
    position: {
      lng: 0,
      lat: 0,
    },
    council: null,
    whaituaId: 'NONE',
    groundWaterZones: [],
    surfaceWaterMgmtUnitId: 'NONE',
    surfaceWaterMgmtSubUnitId: 'NONE',
    minimumFlowLimitId: 'NONE',
    flowRestrictionsManagementSiteId: 'NONE',
    whaitua: null,
    site: null,
    surfaceWaterMgmtUnitDescription: null,
    surfaceWaterMgmtSubUnitDescription: null,
    flowRestrictionsLevel: null,
    flowRestrictionsManagementSiteName: null,
    surfaceWaterMgmtUnitLimit: null,
    surfaceWaterMgmtSubUnitLimit: null,
    surfaceWaterUnitAllocatedAmount: null,
    surfaceWaterSubUnitAllocatedAmount: null,
  });

  return [appState, setAppState];
}
