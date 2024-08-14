import gwrcLogo from '@images/gwrc-logo-header.svg'
import horizonsLogo from '@images/horizons-logo-header.png'

const Councils: Council[] = [
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
    footerLinks: [
      {
        title: 'Natural Resources Plan',
        url: 'https://www.gw.govt.nz/your-region/plans-policies-and-bylaws/plans-and-reports/environmental-plans/natural-resources-plan/in-depth-on-the-natural-resources-plan/',
      },
      {
        title: 'Water allocation rules',
        url: 'https://www.gw.govt.nz/assets/Documents/2023/07/Chapter-5.pdf#page=121',
      },
    ],
    labels: {
      headingText: '',
      surfaceWaterParent: '',
      surfaceWaterChild: '',
      region: '',
      surfaceWaterParentLimit: '',
      surfaceWaterChildLimit: '',
      groundwaterLimit: ''
    },
    hasGroundwaterCategories: false,
    unitTypes: {
      flow: '',
      surface: '',
      ground: ''
    },
    regionOverrides: [],
    usageDisplayGroups: []
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
    footerLinks: [
      {
        title: 'One Plan',
        url: 'https://www.horizons.govt.nz/CMSPages/GetFile.aspx?guid=ad4efdf3-9447-45a3-93ca-951136c7f3b3',
      },
    ],
    labels: {
      headingText: '',
      surfaceWaterParent: '',
      surfaceWaterChild: '',
      region: '',
      surfaceWaterParentLimit: '',
      surfaceWaterChildLimit: '',
      groundwaterLimit: ''
    },
    hasGroundwaterCategories: false,
    unitTypes: {
      flow: '',
      surface: '',
      ground: ''
    },
    regionOverrides: [],
    usageDisplayGroups: []
  },
]

export default Councils

export const DefaultCouncil = Councils[0]
