import { useAtom } from 'jotai';
import { showDisclaimerAtom } from '../../../components/Disclaimer';
import { councilAtom } from '../../../lib/loader';
import LimitsTable from './LimitsTable';
import Button from '../../../components/Button';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import formatWaterQuantity from '../../../lib/formatWaterQuantity';

const LimitsListItem = ({
  title,
  text,
  reference,
}: {
  title: string;
  text: string | JSX.Element;
  reference?: string;
}) => (
  <div className="mb-4">
    <dt className="font-semibold">{title}</dt>
    <dd>
      {text}
      {reference && (
        <a
          className="text-sm underline block"
          href={reference}
          target="_blank"
          rel="noreferrer"
        >
          Plan details
          <ArrowTopRightOnSquareIcon className="h-4 inline pl-1 align-text-bottom" />
        </a>
      )}
    </dd>
  </div>
);

export default function Sidebar({
  appState,
  waterTakeFilter,
  setWaterTakeFilter,
}: {
  appState: AppState;
  waterTakeFilter: WaterTakeFilter;
  setWaterTakeFilter: (value: WaterTakeFilter) => void;
}) {
  const [, setShowDisclaimer] = useAtom(showDisclaimerAtom);
  const [council] = useAtom(councilAtom);

  return (
    <>
      <header className="flex items-center px-6 py-4">
        <div className="flex-1">
          <h1 className="text-xl font-light">{council.labels.headingText}</h1>
          <h2>Water Quantity</h2>
        </div>
        <a href={council.url} title={`Go to the ${council.name} website`}>
          <img
            className="h-10"
            alt={`${council.name} Logo`}
            src={council.logo}
          ></img>
        </a>
      </header>

      <div className="border-t border-gray-200 px-6 py-4">
        <div className="pb-4 flex flex-row justify-around">
          <Button
            text="Surface water view"
            onClick={() => {
              setWaterTakeFilter('Surface');
            }}
            active={waterTakeFilter === 'Surface'}
          />
          <Button
            text="Groundwater view"
            onClick={() => {
              setWaterTakeFilter('Ground');
            }}
            active={waterTakeFilter === 'Ground'}
          />
          <Button
            text="Combined view"
            onClick={() => {
              setWaterTakeFilter('Combined');
            }}
            active={waterTakeFilter === 'Combined'}
          />
        </div>

        <h3 className="text-lg uppercase mb-2 tracking-wider">Area</h3>
        <dl className="mb-6">
          <LimitsListItem
            title={council.labels.region}
            text={appState.planRegion?.name ?? 'None'}
            reference={appState.planRegion?.referenceUrl}
          />
          {['Surface', 'Combined'].includes(waterTakeFilter) && (
            <>
              <LimitsListItem
                title={council.labels.surfaceWaterParentLimit}
                text={appState.surfaceWaterUnitLimit?.name ?? 'None'}
              />
              {/* <span>ID: {appState.surfaceWaterUnitLimit?.id}</span> */}

              <LimitsListItem
                title={council.labels.surfaceWaterChildLimit}
                text={appState.surfaceWaterSubUnitLimit?.name ?? 'None'}
              />
              {/* <span>ID: {appState.surfaceWaterSubUnitLimit?.id}</span> */}
            </>
          )}
          {['Ground', 'Combined'].includes(waterTakeFilter) && (
            <>
              <LimitsListItem
                title={council.labels.groundwaterLimit}
                text={
                  appState.groundWaterZoneName
                    ? appState.groundWaterZoneName
                    : 'None'
                }
              />
              <span>
                {/* IDS:{' '}
                {appState.groundWaterLimits.map((limit) => limit.id).join(', ')} */}
              </span>
            </>
          )}
          <LimitsListItem
            title={'Flow Management Site'}
            text={
              appState.flowLimit
                ? appState.flowSite?.name
                : appState.planRegion
                ? appState.planRegion.defaultFlowManagementLimit
                : 'None'
            }
          />
          <LimitsListItem
            title={'Minimum Flow or Restriction Flow'}
            text={
              appState.flowLimit
                ? formatWaterQuantity(
                    appState.flowLimit.minimumFlow,
                    council.unitTypes.flow
                  )
                : appState.planRegion
                ? appState.planRegion.defaultFlowManagementLimit
                : 'None'
            }
          />
        </dl>
        {appState.planRegion && (
          <LimitsTable
            council={council}
            waterTakeFilter={waterTakeFilter}
            appState={appState}
          />
        )}
      </div>

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
    </>
  );
}
