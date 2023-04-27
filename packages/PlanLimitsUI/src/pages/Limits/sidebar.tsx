import { useAtom } from 'jotai';
import type { FeatureCollection, Geometry } from 'geojson';
import type {
  GeoJsonQueries,
  GroundwaterZoneBoundariesProperties,
} from '../../api';
import { showDisclaimerAtom } from '../../components/Disclaimer';
import LimitsTable from './LimitsTable';
import Button from '../../components/Button';
import gwrcLogo from '../../images/gwrc-logo-header.svg';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const LimitsListItem = ({
  title,
  text,
}: {
  title: string;
  text: string | JSX.Element;
}) => (
  <div className="mb-4">
    <dt className="font-semibold">{title}</dt>
    <dd>{text}</dd>
  </div>
);

export default function Sidebar({
  appState,
  waterTakeFilter,
  setWaterTakeFilter,
  queries,
}: {
  appState: AppState;
  waterTakeFilter: WaterTakeFilter;
  setWaterTakeFilter: (value: WaterTakeFilter) => void;
  queries: GeoJsonQueries;
}) {
  const [, setShowDisclaimer] = useAtom(showDisclaimerAtom);
  return (
    <>
      <header className="flex items-center px-6 py-4">
        <div className="flex-1">
          <h1 className="text-xl font-light">
            Proposed Natural Resource Plan Limits
          </h1>
          <h2>Water Quantity Limits</h2>
        </div>
        <a
          href="https://www.gw.govt.nz/"
          title="Go to the Greater Wellington website"
        >
          <img
            className="h-10"
            alt="Greater Wellington Logo"
            src={gwrcLogo}
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
            title="Whaitua"
            text={appState.whaitua?.name ?? 'None'}
          />
          {['Surface', 'Combined'].includes(waterTakeFilter) && (
            <>
              <LimitsListItem
                title={'Surface Water Catchment Unit'}
                text={
                  appState.surfaceWaterMgmtUnitDescription
                    ? appState.surfaceWaterMgmtUnitDescription
                    : 'None'
                }
              />
              <LimitsListItem
                title={'Surface Water Catchment Sub-unit'}
                text={
                  appState.surfaceWaterMgmtSubUnitDescription
                    ? appState.surfaceWaterMgmtSubUnitDescription
                    : 'None'
                }
              />
            </>
          )}
          {['Ground', 'Combined'].includes(waterTakeFilter) && (
            <LimitsListItem
              title={'Groundwater Catchment Unit'}
              text={
                appState.groundWaterZoneName
                  ? appState.groundWaterZoneName
                  : 'None'
              }
            />
          )}
          <LimitsListItem
            title={'Flow Management Site'}
            text={
              appState.flowLimitBoundary
                ? appState.flowLimitBoundary.name
                : appState.whaitua
                ? appState.whaitua.defaultFlowLimitAndSite
                : 'None'
            }
          />
          <LimitsListItem
            title={'Minimum Flow or Restriction Flow'}
            text={
              appState.flowLimitBoundary
                ? appState.flowLimitBoundary.flowRestriction
                : appState.whaitua
                ? appState.whaitua.defaultFlowLimitAndSite
                : 'None'
            }
          />
        </dl>
        {appState.whaitua && queries[6].data && (
          <LimitsTable
            waterTakeFilter={waterTakeFilter}
            appState={appState}
            groundWaterZoneGeoJson={
              queries[6].data as FeatureCollection<
                Geometry,
                GroundwaterZoneBoundariesProperties
              >
            }
          />
        )}
      </div>

      <footer className="px-6 py-4 border-t flex items-start">
        <div className="flex-1">
          <a
            href="https://pnrp.gw.govt.nz/home/pnrp-final-appeals-version-2022"
            className="text-sm underline"
            target="_blank"
            rel="noreferrer"
          >
            Proposed Natural Resource Plan
            <ArrowTopRightOnSquareIcon className="h-4 inline pl-1 align-text-bottom" />
          </a>
          <br />
          <a
            href="http://pnrp.gw.govt.nz/assets/Uploads/Chapter-5.5-Rules-Water-Allocation-Appeal-version-2022.pdf"
            className="text-sm underline"
            target="_blank"
            rel="noreferrer"
          >
            Water allocation rules
            <ArrowTopRightOnSquareIcon className="h-4 inline pl-1 align-text-bottom" />
          </a>
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
