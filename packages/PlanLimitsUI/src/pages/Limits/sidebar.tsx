import React from 'react';
import { MouseState } from './index';
import Button from '../../components/Button';
import { WaterTakeFilter } from './index2';

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
}: {
  mouseState: MouseState;
  waterTakeFilter: WaterTakeFilter;
  setWaterTakeFilter: (value: WaterTakeFilter) => void;
}) {
  return (
    <aside className="w-[36rem] overflow-y-auto border-l border-gray-200 bg-white">
      <div>
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Limits Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            What plan limits apply here?
          </p>
        </div>
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
                  mouseState.groundWaterZone
                    ? mouseState.groundWaterZone
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
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 pb-4">
            <div className="col-span-2">
              <dt className="font-medium text-gray-500">
                What allocation limit applies to this unit?
              </dt>
              <dd className="mt-1 text-gray-900">
                {mouseState.allocationLimit ? (
                  <>
                    {['Surface', 'Combined'].includes(waterTakeFilter) && (
                      <>
                        <span className={'font-medium'}>
                          If taking Surface Water:&nbsp;
                        </span>
                        <span>{mouseState.allocationLimit}</span>
                      </>
                    )}
                    {['Ground', 'Combined'].includes(waterTakeFilter) && (
                      <>
                        {mouseState.gw00 && mouseState.gw00 === 'A' ? (
                          <>
                            <br />
                            <span className={'font-medium'}>
                              If taking groundwater from a bore (screen 0-20m
                              deep):&nbsp;
                            </span>
                            <span>{mouseState.allocationLimit}</span>
                          </>
                        ) : (
                          mouseState.gw00 === 'B' && (
                            <>
                              {' '}
                              <>
                                <br />
                                <span className={'font-medium'}>
                                  If taking groundwater from a bore (screen
                                  00-20m deep):&nbsp;
                                </span>
                                <span>{mouseState.allocationLimit}</span>
                                <br />
                                <span className={'font-medium'}>
                                  If taking groundwater from a bore (screen
                                  00-20m deep):&nbsp;
                                </span>
                                <span>2,300,000 (m3/year)</span>
                              </>
                            </>
                          )
                        )}
                        {mouseState.gw20 && mouseState.gw20 === 'C' ? (
                          <>
                            <br />
                            <span className={'font-medium'}>
                              If taking groundwater from a bore (screen 20-30m
                              deep):&nbsp;
                            </span>
                            <span>2,300,000 (m3/year)</span>
                          </>
                        ) : (
                          mouseState.gw20 === 'B' && (
                            <>
                              <br />
                              <span className={'font-medium'}>
                                If taking groundwater from a bore (screen 20-30m
                                deep):&nbsp;
                              </span>
                              <span>{mouseState.allocationLimit}</span>
                              <br />
                              <span className={'font-medium'}>
                                If taking groundwater from a bore (screen 20-30m
                                deep):&nbsp;
                              </span>
                              <span>2,300,000 (m3/year)</span>
                            </>
                          )
                        )}

                        {mouseState.gw30 && (
                          <>
                            <br />
                            <span className={'font-medium'}>
                              If taking groundwater from a bore (screen 30m+
                              deep:&nbsp;
                            </span>
                            <span>2,300,000 (m3/year)</span>
                          </>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  'None'
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </aside>
  );
}
