import FreshwaterManagementUnit from "@models/FreshwaterManagementUnit.ts";

export interface Contaminant {
  title: string;
  base?: string;
  objective?: string;
  byWhen?: string;
}

export type ContaminantList = Contaminant[];

export const contaminants = (fmu: FreshwaterManagementUnit): ContaminantList => ([
  {
    title: 'E. coli',
    base: fmu.ecoliBase,
    objective: fmu.ecoliObj,
    byWhen: fmu.byWhen,
  },
  {
    title: 'Periphyton',
    base: fmu.periBase,
    objective: fmu.periObj,
    byWhen: fmu.byWhen,
  },
  {
    title: 'Ammonia toxicity',
    base: fmu.atoxBase,
    objective: fmu.atoxObj,
    byWhen: fmu.byWhen,
  },
  {
    title: 'Nitrate toxicity',
    base: fmu.ntoxBase,
    objective: fmu.ntoxObj,
    byWhen: fmu.byWhen,
  },
  {
    title: 'MCI',
    base: fmu.mciBase,
    objective: fmu.mciObj,
    byWhen: fmu.byWhen,
  },
]);
