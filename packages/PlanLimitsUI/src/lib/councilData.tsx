import gwrcLogo from '../images/gwrc-logo-header.svg';
import horizonsLogo from '../images/horizons-logo-header.png';

const PendingElement = (
  <>
    <sup>1</sup>Pending change
  </>
);

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
        text: 'Natural Resources Plan',
        url: 'https://www.gw.govt.nz/your-region/plans-policies-and-bylaws/plans-and-reports/environmental-plans/natural-resources-plan/in-depth-on-the-natural-resources-plan/',
      },
      {
        text: 'Water allocation rules',
        url: 'https://www.gw.govt.nz/assets/Documents/2023/07/Chapter-5.pdf#page=121',
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
    regionOverrides: [
      {
        sourceId: '0b247e41-d840-4a4e-98c3-0ff6d5c31efd',
        swCMU: PendingElement,
        swCMSU: PendingElement,
        gwCMU: PendingElement,
        flowManagementSite: PendingElement,
        flowLimit: PendingElement,
        limitsTableFooter: (
          <>
            <sup>1</sup>A change to the Natural Resources Plan has been notified
            for this Whaitua, please{' '}
            <a
              target="_blank"
              rel="noreferrer"
              className="underline"
              href="https://www.gw.govt.nz/your-council/contact-us/contact-form/"
            >
              contact Greater Wellington
            </a>{' '}
            for up to date advice.
          </>
        ),
        surfaceWaterLimit: PendingElement,
        groundwaterLimit: PendingElement,
      },
    ],
    usageDisplayGroups: [
      {
        name: 'Kāpiti',
        hideLabel: false,
        showLegend: true,
        areaIds: [
          'WaitohuSW',
          'OtakiSW',
          'MangaoneSW',
          'OtakiGW',
          'OtakiRiverGW',
          'Te HoroGW',
          'WaikanaeSW',
          'WaikanaeRiverGW',
          'WaikanaeGW',
          'RaumatiGW',
        ],
      },
      {
        name: 'Te Whanganui a Tara',
        hideLabel: false,
        showLegend: true,
        areaIds: [
          'HuttSW',
          'Upper HuttGW',
          'Lower HuttGW',
          'WainuiomataSW',
          'OrongorongoSW',
        ],
      },
      {
        name: 'Ruamahanga',
        hideLabel: false,
        showLegend: false,
        areaIds: [
          'RuamahangaTotalSW',
          'Ruamahanga_UpperSW',
          'Upper RuamahangaGW',
          'Te Ore OreGW',
          'KopuarangaSW',
          'WaipouaSW',
          'WaingawaSW',
          'WaingawaGW',
        ],
      },
      {
        name: 'Ruamahanga 2',
        hideLabel: true,
        showLegend: false,
        areaIds: [
          'Ruamahanga_MiddleSW',
          'Middle RuamahangaGW',
          'Fernhill TiffenGW',
          'MangatarereSW',
          'MangatarereGW',
          'BoothsSW',
          'ParkvaleSW',
          'Parkvale_ConfinedGW',
          'WaiohineSW',
          'PapawaiSW',
          'WaiohineGW',
        ],
      },
      {
        name: 'Ruamahanga 3',
        hideLabel: true,
        showLegend: false,
        areaIds: [
          'LakeWairarapaSW',
          'LakeGW',
          'TauherenikauSW',
          'OtukuraSW',
          'TauherenikauGW',
        ],
      },
      {
        name: 'Ruamahanga 4',
        hideLabel: true,
        showLegend: true,
        areaIds: [
          'Ruamahanga_LowerSW',
          'MoikiGW',
          'MartinboroughGW',
          'HuangaruaSW',
          'HuangaruaGW',
          'OnokeGW',
        ],
      },
    ],
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
    regionOverrides: [],
    usageDisplayGroups: [],
  },
];

export const DefaultCouncil = Councils[0];
