import gwrcLogo from '../images/gwrc-logo-header.svg';
import horizonsLogo from '../images/horizons-logo-header.png';

export const Councils: Council[] = [
  {
    id: 9,

    slug: 'gw',
    name: 'Geater Wellington',
    url: 'https://www.gw.govt.nz/',
    logo: gwrcLogo,
    defaultViewLocation: {
      latitude: -41,
      longitude: 175.35,
      zoom: 8,
    },
    hasGroundwaterCategories: true,
    unitTypes: {
      flow: 'L/s',
      surface: 'L/s',
      ground: 'm³/year',
    },
    footerLinks: [
      {
        text: 'Natural Resource Plan',
        url: 'https://pnrp.gw.govt.nz/',
      },
      {
        text: 'Water allocation rules',
        url: 'https://www.gw.govt.nz/assets/Documents/2023/07/Natural-Resources-Plan-Appeals-Version.pdf#page=276',
      },
    ],
    labels: {
      headingText: 'Natural Resources Plan Water Allocations',
      region: 'Whaitua',
      surfaceWaterParent: 'Catchment Management Unit',
      surfaceWaterChild: 'Catchment Management Sub-unit',
      surfaceWaterParentLimit: 'Surface Water Catchment Management Unit',
      surfaceWaterChildLimit: 'Surface Water Catchment Management Sub-unit',
      groundwaterLimit: 'Groundwater Catchment Management Unit',
    },
  },
  {
    id: 8,
    slug: 'horizons',
    name: 'Horizons',
    logo: horizonsLogo,
    url: 'https://www.horizons.govt.nz/',
    defaultViewLocation: {
      latitude: -40,
      longitude: 175.45,
      zoom: 8,
    },
    hasGroundwaterCategories: false,
    unitTypes: {
      flow: 'm³/s',
      surface: 'm³/day',
      ground: 'm³/year',
    },
    footerLinks: [
      {
        text: 'One Plan',
        url: 'https://www.horizons.govt.nz/CMSPages/GetFile.aspx?guid=ad4efdf3-9447-45a3-93ca-951136c7f3b3',
      },
    ],
    labels: {
      headingText: 'One Plan',
      region: 'Region',
      surfaceWaterParent: 'Management Zone',
      surfaceWaterChild: 'Sub Zone',
      surfaceWaterParentLimit: 'Surface Water Management Zone',
      surfaceWaterChildLimit: 'Surface Water Management Sub Zone',
      groundwaterLimit: 'Ground Water Management Zone',
    },
  },
];

export const DefaultCouncil = Councils[0];
