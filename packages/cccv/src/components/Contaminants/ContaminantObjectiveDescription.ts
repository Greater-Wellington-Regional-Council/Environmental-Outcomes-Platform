import {Contaminant} from "@components/FreshwaterManagementUnit/utils.ts";
import _ from "lodash";

export const OBJECTIVE_DESCRIPTION: { [key: string]: { [key: string]: string } } = {
  Phytoplankton: {
    A: "Lake ecological communities are healthy and resilient, similar to natural reference conditions.",
    B: "Lake ecological communities are slightly impacted by additional algal and/or plant growth arising from nutrient levels that are elevated above natural reference conditions.",
    C: "Lake ecological communities are moderately impacted by additional algal and plant growth arising from nutrient levels that are elevated well above natural reference conditions. Reduced water clarity is likely to affect habitat available for native macrophytes.",
    D: "Lake ecological communities have undergone or are at high risk of a regime shift to a persistent, degraded state (without native macrophyte/seagrass cover), due to impacts of elevated nutrients leading to excessive algal and/or plant growth, as well as from losing oxygen in bottom waters of deep lakes.",
    E: "N/A"
  },
  Periphyton: {
    A: "Rare blooms reflecting negligible nutrient enrichment and/or alteration of the natural flow regime or habitat.",
    B: "Occasional blooms reflecting low nutrient enrichment and/or alteration of the natural flow regime or habitat.",
    C: "Periodic short-duration nuisance blooms reflecting moderate nutrient enrichment and/or moderate alteration of the natural flow regime or habitat.",
    D: "Regular and/or extended-duration nuisance blooms reflecting high nutrient enrichment and/or significant alteration of the natural flow regime or habitat.",
    E: "N/A"
  },
  Nitrogen: {
    A: "Lake ecological communities are healthy and resilient, similar to natural reference conditions.",
    B: "Lake ecological communities are slightly impacted by additional algal and/or plant growth arising from nutrient levels that are elevated above natural reference conditions.",
    C: "Lake ecological communities are moderately impacted by additional algal and plant growth arising from nutrient levels that are elevated well above natural reference conditions.",
    D: "Lake ecological communities have undergone or are at high risk of a regime shift to a persistent, degraded state, due to impacts of elevated nutrients leading to excessive algal and/or plant growth, as well as from losing oxygen in bottom waters of deep lakes.",
    E: "N/A"
  },
  Phosphorus: {
    A: "Lake ecological communities are healthy and resilient, similar to natural reference conditions.",
    B: "Lake ecological communities are slightly impacted by additional algal and/or plant growth arising from nutrient levels that are elevated above natural reference conditions.",
    C: "Lake ecological communities are moderately impacted by additional algal and plant growth arising from nutrient levels that are elevated well above natural reference conditions.",
    D: "Lake ecological communities have undergone or are at high risk of a regime shift to a persistent, degraded state, due to impacts of elevated nutrients leading to excessive algal and/or plant growth, as well as from losing oxygen in bottom waters of deep lakes.",
    E: "N/A"
  },
  Ammonia: {
    A: "99% species protection level: No observed effect on any species tested.",
    B: "95% species protection level: Starts impacting occasionally on the 5% most sensitive species.",
    C: "80% species protection level: Starts impacting regularly on the 20% most sensitive species (reduced survival of most sensitive species).",
    D: "Starts approaching acute impact level (that is, risk of death) for sensitive species.",
    E: "N/A"
  },
  Nitrate: {
    A: "High conservation value system. Unlikely to be effects even on sensitive species.",
    B: "Some growth effect on up to 5% of species.",
    C: "Growth effects on up to 20% of species (mainly sensitive species such as fish). No acute effects.",
    D: "Impacts on growth of multiple species, and starts approaching acute impact level (that is, risk of death) for sensitive species at higher concentrations (>20 mg/L).",
    E: "N/A"
  },
  Oxygen: {
    A: "No stress caused by low dissolved oxygen on any aquatic organisms that are present at a matched reference (near-pristine) sites.",
    B: "Occasional minor stress on sensitive species caused by short periods (a few hours each day) of lower dissolved oxygen. Risk of reduced abundance of sensitive fish and macroinvertebrate species.",
    C: "Moderate stress on a number of aquatic organisms caused by dissolved oxygen levels exceeding preference levels for periods of several hours each day. Risk of sensitive fish and macroinvertebrate species being lost.",
    D: "Significant, persistent stress on a range of aquatic organisms caused by dissolved oxygen exceeding tolerance levels. Likelihood of local extinctions of keystone species and loss of ecological integrity.",
    E: "N/A"
  },
  Sediment: {
    A: "Minimal impact of suspended sediment on instream biota. Ecological communities are similar to those observed in natural reference conditions.",
    B: "Low to moderate impact of suspended sediment on instream biota. Abundance of sensitive fish species may be reduced.",
    C: "Moderate to high impact of suspended sediment on instream biota. Sensitive fish species may be lost.",
    D: "Significant impact of suspended sediment on instream biota. Ecological communities are significantly altered and sensitive fish and macroinvertebrate species are lost or at high risk of being lost.",
    E: "N/A"
  },
  E_Coli: {
    A: "For at least half the time, the estimated risk of Campylobacter infection is <1 in 1,000 (0.1% risk). The predicted average infection risk is 1%.",
    B: "For at least half the time, the estimated risk of Campylobacter infection is <1 in 1,000 (0.1% risk).  The predicted average infection risk is 2%.",
    C: "For at least half the time, the estimated risk of Campylobacter infection is <1 in 1,000 (0.1% risk). The predicted average infection risk is 3%.",
    D: "For 20-30% of the time, the estimated risk of Campylobacter infection is ≥50 in 1,000 (>5% risk). The predicted average infection risk is 7%.",
    E: "For more than 30% of the time, the estimated risk of Campylobacter infection is ≥50 in 1,000 (>5% risk). The predicted average infection risk is 7%."
  },
  Cyanobacteria: {
    A: "Risk exposure from cyanobacteria is no different to that in natural conditions (from any contact with freshwater).",
    B: "Low risk of health effects from exposure to cyanobacteria (from any contact with freshwater).",
    C: "Moderate risk of health effects from exposure to cyanobacteria (from any contact with freshwater).",
    D: "High health risks (for example, respiratory, irritation and allergy symptoms) exist from exposure to cyanobacteria (from any contact with freshwater).",
    E: "N/A"
  }
};

export const CONTAMINANT_NAME: { [key: string]: string } = {
  Phytoplankton: "Phytoplankton",
  Periphyton: "Periphyton",
  Nitrogen: "MCI",
  Phosphorus: "Phosphorus",
  Ammonia: "Ammonia toxicity",
  Nitrate: "Nitrate toxicity",
  Oxygen: "Oxygen",
  Sediment: "Sediment",
  E_Coli: "E. Coli",
  Cyanobacteria: "Cyanobacteria"
};

export const contaminantTitle = (contaminant: Contaminant) => _.get(CONTAMINANT_NAME, contaminant.title, contaminant.title);

export function getObjectiveDescription(contaminant: Contaminant, contaminant_level?: string) {
  if (!contaminant_level?.trim().length) return '-';

  const codes = level_codes(contaminant_level) || [];

  const desc = _.map(codes, (level) => {
    return _.get(OBJECTIVE_DESCRIPTION[contaminant.title], level, '-');
  });

  if (desc.length == 0)
    return null;
  else if (desc.length == 1)
    return desc[0];
  else
    return desc.map((_, index) => `${codes[index]}=${desc[index]}`).join("<br><br>");
}

export const level_codes = (level: string | undefined) => (level ?? '').trim().match(/\b[A-E]\b/g)?.sort();

export const byWhen = (contaminant: Contaminant) => {
  console.log(contaminant.byWhen);
  const mciYear  = Array.from((contaminant.byWhen ?? '').matchAll(/([0-9]+) for MCI/g), match => match[1]);

  if (contaminantTitle(contaminant).includes('MCI') && mciYear?.length)
    return `by ${mciYear[0]}`;

  const other = (contaminant.byWhen ?? '').split('(')[0].trim();

  return (other.match(/^[0-9]+$/)) ? `by ${other}` : other;
}