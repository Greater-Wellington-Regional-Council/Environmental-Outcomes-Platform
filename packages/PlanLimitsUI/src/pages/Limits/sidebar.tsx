import React from 'react';
import { useAtom } from 'jotai';
import { MouseState, WaterTakeFilter } from './index';
import Button from '../../components/Button';
import LimitsTable from './LimitsTable';
import { GeoJsonQueries } from '../../api';
import gwrcLogo from '../../images/gwrc-logo-header.svg';
import { showDisclaimerAtom } from '../../components/Disclaimer';

const LimitsListItem = ({ title, text }: { title: string; text: string }) => (
  <div className="col-span-2">
    <dt className="font-medium text-gray-500">{title}</dt>
    <dd className="mt-1 text-gray-900">{text}</dd>
  </div>
);

export default function Sidebar({
  mouseState,
  waterTakeFilter,
  setWaterTakeFilter,
  queries,
}: {
  mouseState: MouseState;
  waterTakeFilter: WaterTakeFilter;
  setWaterTakeFilter: (value: WaterTakeFilter) => void;
  queries: GeoJsonQueries;
}) {
  const [, setShowDisclaimer] = useAtom(showDisclaimerAtom);
  return (
    <>
      <header className="flex items-center px-6 py-4">
        <div className="flex-1">
          <h2 className="text-xl font-light uppercase tracking-wide">
            Natural Resource Plan Limits
          </h2>
          <h3>Water Quantity Limits</h3>
        </div>
        <img
          className="h-12"
          alt="Greater Wellington Regional Council - logo"
          src={gwrcLogo}
        ></img>
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

        <h3 className="font-semibold pb-2">Area</h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4 pb-4">
          <LimitsListItem
            title="What Whaitua am I in?"
            text={mouseState.whaitua ? mouseState.whaitua : 'None'}
          />
          {['Surface', 'Combined'].includes(waterTakeFilter) && (
            <>
              <LimitsListItem
                title={
                  'What spatial surface water catchment management unit am I in?'
                }
                text={
                  mouseState.surfaceWaterMgmtUnitDescription
                    ? mouseState.surfaceWaterMgmtUnitDescription
                    : 'None'
                }
              />
              <LimitsListItem
                title={
                  'What spatial surface water catchment management sub-unit am I in?'
                }
                text={
                  mouseState.surfaceWaterMgmtSubUnitDescription
                    ? mouseState.surfaceWaterMgmtSubUnitDescription
                    : 'None'
                }
              />
            </>
          )}
          {['Ground', 'Combined'].includes(waterTakeFilter) && (
            <LimitsListItem
              title={
                'What spatial groundwater catchment management unit am I in?'
              }
              text={
                mouseState.groundWaterZoneName
                  ? mouseState.groundWaterZoneName
                  : 'None'
              }
            />
          )}
          <LimitsListItem
            title={'What flow management site applies to me?'}
            text={
              mouseState.flowRestrictionsManagementSiteName
                ? mouseState.flowRestrictionsManagementSiteName
                : 'None'
            }
          />
          <LimitsListItem
            title={
              'What (if any) minimum flow or restriction flow applies to me?'
            }
            text={
              mouseState.flowRestrictionsLevel
                ? mouseState.flowRestrictionsLevel
                : 'None'
            }
          />
        </dl>
        <h3 className="font-semibold pb-2">Limits</h3>
        {mouseState.surfaceWaterMgmtUnitLimit && queries[6].data && (
          <LimitsTable
            waterTakeFilter={waterTakeFilter}
            surfaceWaterMgmtUnitId={Number(mouseState.surfaceWaterMgmtUnitId)}
            surfaceWaterMgmtUnitLimit={mouseState.surfaceWaterMgmtUnitLimit}
            surfaceWaterMgmtSubUnitLimit={
              mouseState.surfaceWaterMgmtSubUnitLimit
            }
            activeZonesIds={mouseState.groundWaterZones}
            groundWaterZoneGeoJson={queries[6].data}
          />
        )}
      </div>

      <footer className="px-6 py-4 border-t flex">
        <a
          href="https://pnrp.gw.govt.nz/home/pnrp-final-appeals-version-2022"
          className="text-sm flex-1 underline"
        >
          Natural Resource Plan Limits
        </a>
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
