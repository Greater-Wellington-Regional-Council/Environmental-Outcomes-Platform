import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const defaultFlowLimitsAndSites = [
  {
    whaituaId: 1,
    text: 'Refer to Policy K.P1',
    link: 'https://www.gw.govt.nz/assets/Documents/2023/07/Chapter-10.pdf',
  },
  {
    whaituaId: 2,
    text: 'Refer to Policy P.P1',
    link: 'https://www.gw.govt.nz/assets/Documents/2023/07/Chapter-9.pdf',
  },
  {
    whaituaId: 3,
    text: 'Refer to Policy TW.P1',
    link: 'https://www.gw.govt.nz/assets/Documents/2023/07/Chapter-8.pdf',
  },
  {
    whaituaId: 4,
    text: 'Refer to Policy R.P1',
    link: 'https://www.gw.govt.nz/assets/Documents/2023/07/Chapter-7.pdf',
  },
  {
    whaituaId: 5,
    text: 'Refer to Policy WC.P1',
    link: 'https://www.gw.govt.nz/assets/Documents/2023/07/Chapter-11.pdf',
  },
];

export default function defaultFlowLimit(whaituaId: number) {
  const limit = defaultFlowLimitsAndSites.find(
    (l) => l.whaituaId === whaituaId,
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
