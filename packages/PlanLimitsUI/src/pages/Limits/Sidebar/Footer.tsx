import { useAtom } from 'jotai';
import { showDisclaimerAtom } from '../../../components/Disclaimer';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

export default function Footer({ council }: { council: Council }) {
  const [, setShowDisclaimer] = useAtom(showDisclaimerAtom);

  return (
    <footer className="px-6 py-4 border-t flex items-start">
      <div className="flex-1">
        {council.footerLinks.map((link) => (
          <a
            key={link.text}
            href={link.url}
            className="text-sm underline block mb-2"
            target="_blank"
            rel="noreferrer"
          >
            {link.text}
            <ArrowTopRightOnSquareIcon className="h-4 inline pl-1 align-text-bottom" />
          </a>
        ))}
      </div>
      <button
        onClick={() => setShowDisclaimer(true)}
        className="text-sm underline"
      >
        Conditions of use
      </button>
    </footer>
  );
}
