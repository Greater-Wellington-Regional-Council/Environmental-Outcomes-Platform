import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const defaultFlowLimitsAndSites = [
  {
    whaituaId: '1',
    text: 'Refer to Policy K.P1',
    link: 'https://pnrp.gw.govt.nz/assets/Uploads/Chapter-10-Kapiti-Coast-Whaitua-Appeal-version-2023.pdf',
  },
  {
    whaituaId: '2',
    text: 'Refer to Policy P.P1',
    link: 'https://pnrp.gw.govt.nz/assets/Uploads/Chapter-9-Te-Awarua-o-Porirua-Whaitua-Appeal-version-2023.pdf',
  },
  {
    whaituaId: '3',
    text: 'Refer to Policy TW.P1',
    link: 'https://pnrp.gw.govt.nz/assets/Uploads/Chapter-8-Wellington-Harbour-and-Hutt-Valley-Whaitua-Appeal-version-2023.pdf',
  },
  {
    whaituaId: '4',
    text: 'Refer to Policy R.P1',
    link: 'https://pnrp.gw.govt.nz/assets/Uploads/Chapter-7-Ruamahanga-Whaitua-Appeal-version-2023.pdf',
  },
  {
    whaituaId: '5',
    text: 'Refer to Policy WC.P1',
    link: 'https://pnrp.gw.govt.nz/assets/Uploads/Chapter-11-Wairarapa-Coast-Whaitua-Appeal-version-2023.pdf',
  },
];

export default function defaultFlowLimit(whaituaId: number | string) {
  const limit = defaultFlowLimitsAndSites.find(
    (l) => l.whaituaId === whaituaId.toString()
  );

  if (!limit) return <>None</>;

  return formatFlowLimit(limit.text, limit.link);
}

function formatFlowLimit(text: string, link: string) {
  return (
    <a className="underline" href={link} target="_blank" rel="noreferrer">
      {text}{' '}
      <ArrowTopRightOnSquareIcon className="h-4 inline pl-1 align-text-bottom" />
    </a>
  );
}
