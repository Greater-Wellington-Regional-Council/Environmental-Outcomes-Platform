import { atom } from 'jotai';

export type WaterTakeTypeFilter = 'Surface' | 'Ground' | 'Combined';
export const waterTakeFilterAtom = atom<WaterTakeTypeFilter>('Combined');

export const showSurfaceWaterAtom = atom((get) =>
  ['Surface', 'Combined'].includes(get(waterTakeFilterAtom))
);

export const showGroundwaterAtom = atom((get) =>
  ['Ground', 'Combined'].includes(get(waterTakeFilterAtom))
);
