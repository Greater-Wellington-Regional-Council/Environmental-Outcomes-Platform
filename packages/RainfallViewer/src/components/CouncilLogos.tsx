import CouncilData from '../lib/councilData';
import { createLocationString } from '../lib/locationString';

type Props = {
  highlightCouncil: (councilId: number) => void;
};
export default function CouncilLogos({ highlightCouncil }: Props) {
  return (
    <div className="mb-6">
      <h3 className="mb-4 text-sm">
        Showing data from the following councils:
      </h3>
      <div className="grid grid-cols-3 gap-y-6 gap-x-4">
        {CouncilData.map((council) => (
          <div className="flex items-center justify-center" key={council.id}>
            <a
              onClick={() => highlightCouncil(council.id)}
              href={`#${createLocationString(council.defaultViewLocation)}`}
            >
              <img
                className="w-full"
                src={council.logo}
                alt={`${council.name} Logo`}
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
