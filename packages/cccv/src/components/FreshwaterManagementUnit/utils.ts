import FreshwaterManagementUnit from "@models/FreshwaterManagementUnit.ts";

export interface contaminant {
  title: string;
  base: string;
  objective: string;
  byWhen: string;
}

export const contaminants = (fmu: FreshwaterManagementUnit): Array<contaminant> => ([
  {
    title: 'E. coli',
    base: `Ecoli base ${fmu.ecoliBase}`,
    objective: `Ecoli objective ${fmu.ecoliObj}`,
    byWhen: `By ${fmu.byWhen}`,
  },
  {
    title: 'Periphyton',
    base: `Base ${fmu.periBase}`,
    objective: `Goal ${fmu.periObj}`,
    byWhen: `By ${fmu.byWhen}`,
  },
  {
    title: 'Ammonia toxicity',
    base: `Base ${fmu.atoxBase}`,
    objective: `Goal ${fmu.atoxObj}`,
    byWhen: `By ${fmu.byWhen}`,
  },
  {
    title: 'Nitrate toxicity',
    base: `Base ${fmu.ntoxBase}`,
    objective: `Goal ${fmu.ntoxObj}`,
    byWhen: `By ${fmu.byWhen}`,
  },
  {
    title: 'MCI',
    base: `Base ${fmu.mciBase}`,
    objective: `Goal ${fmu.mciObj}`,
    byWhen: `By ${fmu.byWhen}`,
  },
]);
