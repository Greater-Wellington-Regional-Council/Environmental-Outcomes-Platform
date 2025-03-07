import manaWhenuaSiteNames from '@lib/values/manaWhenuaSites.ts';
import { announceError } from '@components/ErrorContext/announceError.ts';
import { ErrorLevel } from '@components/ErrorContext/ErrorFlagAndOrMessage.ts';
import _ from "lodash"


const normalizeString = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

const siteService = {
  // checkServiceHealth: async () => {
  //   return true;
  // },

  getBySiteName: async (
    siteName: string,
  ) => {
    try {
      const normalizedSiteName = normalizeString(siteName);

      const siteDetails = manaWhenuaSiteNames.find(
        (site) =>
          normalizeString(site.siteName) === normalizedSiteName ||
          site.aliases.some(alias => normalizeString(alias) === normalizedSiteName),
      );

      if (!siteDetails) {
        announceError(`Site with name or alias "${siteName}" not found`, ErrorLevel.WARNING);
        return null;
      }

      return siteDetails;
    } catch (error) {
      announceError(`Error ${error} fetching site details`, ErrorLevel.WARNING);
      return null;
    }
  },

  getSiteDescription: async (siteName: string, feature: unknown = undefined): Promise<string | null> =>
    _.get(feature, `properties.[${siteName}]`) || (await siteService.getBySiteName(siteName))?.explanation || null
};

export default siteService;

