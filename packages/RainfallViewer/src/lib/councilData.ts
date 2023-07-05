import northlandLogo from '../../public/councils-logos/northland.webp';
import gisborneLogo from '../../public/councils-logos/gisborne.svg';
import horizonsLogo from '../../public/councils-logos/horizons.png';
import wellingtonLogo from '../../public/councils-logos/wellington.svg';
import westCoastLogo from '../../public/councils-logos/west-coast.svg';
import otagoLogo from '../../public/councils-logos/otago.svg';
import southlandLogo from '../../public/councils-logos/southland.svg';
import tasmanLogo from '../../public/councils-logos/tasman.png';
import marlboroughLogo from '../../public/councils-logos/malbororough.svg';

const Councils: Council[] = [
  {
    id: 1,
    name: 'Northland Regional Council',
    url: 'https://www.nrc.govt.nz/',
    logo: northlandLogo.src,
    defaultViewLocation: {
      latitude: -35.261,
      longitude: 173.42,
      zoom: 7,
    },
  },
  {
    id: 5,
    name: 'Gisborne District Council',
    url: 'https://www.gdc.govt.nz/',
    logo: gisborneLogo.src,
    defaultViewLocation: {
      latitude: -38.293,
      longitude: 177.836,
      zoom: 7,
    },
  },
  {
    id: 8,
    name: 'Horizons Regional Council',
    logo: horizonsLogo.src,
    url: 'https://www.horizons.govt.nz/',
    defaultViewLocation: {
      latitude: -39.709,
      longitude: 175.412,
      zoom: 7,
    },
  },
  {
    id: 9,
    name: 'Geater Wellington',
    url: 'https://www.gw.govt.nz/',
    logo: wellingtonLogo.src,
    defaultViewLocation: {
      latitude: -41.139,
      longitude: 175.421,
      zoom: 8,
    },
  },
  {
    id: 10,
    name: 'The West Coast Regional Council',
    url: 'https://www.wcrc.govt.nz/',
    logo: westCoastLogo.src,
    defaultViewLocation: {
      latitude: -42.381,
      longitude: 169.914,
      zoom: 6,
    },
  },
  {
    id: 12,
    name: 'Otago Regionall Council',
    url: 'https://www.orc.govt.nz/',
    logo: otagoLogo.src,
    defaultViewLocation: {
      latitude: -45.315,
      longitude: 169.216,
      zoom: 7,
    },
  },
  {
    id: 13,
    name: 'Environment Southland Regional Council',
    url: 'https://www.es.govt.nz/',
    logo: southlandLogo.src,
    defaultViewLocation: {
      latitude: -45.865,
      longitude: 167.467,
      zoom: 6,
    },
  },
  {
    id: 14,
    name: 'Tasman District Council',
    url: 'https://www.tasman.govt.nz/',
    logo: tasmanLogo.src,
    defaultViewLocation: {
      latitude: -41.324,
      longitude: 172.293,
      zoom: 7,
    },
  },
  {
    id: 16,
    name: 'Marlborough District Council',
    url: 'https://www.marlborough.govt.nz/',
    logo: marlboroughLogo.src,
    defaultViewLocation: {
      latitude: -41.398,
      longitude: 173.425,
      zoom: 8,
    },
  },
];

export default Councils;
