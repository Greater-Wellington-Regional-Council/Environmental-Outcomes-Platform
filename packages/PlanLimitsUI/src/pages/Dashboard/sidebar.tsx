import React from 'react';
import { MouseState } from './index';

const LimitsListItem = ({ title, text }: { title: string; text: string }) => (
  <div className="col-span-2">
    <dt className="font-medium text-gray-500">{title}</dt>
    <dd className="mt-1 text-gray-900">{text}</dd>
  </div>
);

export default function Sidebar({ mouseState }: { mouseState: MouseState }) {
  return (
    <aside className="w-[48rem] overflow-y-auto border-l border-gray-200 bg-white">
      <div>
        <div className="px-6 py-5">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Limits Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            What plan limits apply here?
          </p>
        </div>
        <div className="border-t border-gray-200 px-6 py-5">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
            <LimitsListItem
              title={
                'What spatial surface water catchment management unit am I in?'
              }
              text={mouseState.surfaceWater ? 'Mangatarere' : 'None'}
            />
            <LimitsListItem
              title={
                'What spatial surface water catchment management sub-unit am I in?'
              }
              text={mouseState.surfaceWater ? mouseState.surfaceWater : 'None'}
            />
            <LimitsListItem
              title={
                'What spatial groundwater catchment management unit am I in?'
              }
              text={
                mouseState.groundWaterZone ? mouseState.groundWaterZone : 'None'
              }
            />
            <LimitsListItem
              title={'What flow management site applies to me?'}
              text={
                mouseState.flowRestrictionsManagementSiteName
                  ? mouseState.flowRestrictionsManagementSiteName
                  : 'None'
              }
            />
            <div className="col-span-2">
              <dt className="font-medium text-gray-500">
                What allocation limit applies to me?
              </dt>
              <dd className="mt-1 text-gray-900">
                {mouseState.allocationLimit ? (
                  <>
                    <span className={'font-medium'}>Surface Water:</span>
                    <span>{mouseState.allocationLimit}</span>
                    {mouseState.gw00 && mouseState.gw00 === 'A' ? (
                      <>
                        <br />
                        <span className={'font-medium'}>
                          Ground Water 0-20m:
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
                              Ground Water 00-20m (Stream Depletion):
                            </span>
                            <span>{mouseState.allocationLimit}</span>
                            <br />
                            <span className={'font-medium'}>
                              Ground Water 00-20m:
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
                          Ground Water 20-30m:
                        </span>
                        <span>2,300,000 (m3/year)</span>
                      </>
                    ) : (
                      mouseState.gw20 === 'B' && (
                        <>
                          <br />
                          <span className={'font-medium'}>
                            Ground Water 20-30m (Stream Depletion):
                          </span>
                          <span>{mouseState.allocationLimit}</span>
                          <br />
                          <span className={'font-medium'}>
                            Ground Water 20-30m:
                          </span>
                          <span>2,300,000 (m3/year)</span>
                        </>
                      )
                    )}

                    {mouseState.gw30 && (
                      <>
                        <br />
                        <span className={'font-medium'}>
                          Ground Water Over 30m:
                        </span>
                        <span>2,300,000 (m3/year)</span>
                      </>
                    )}
                  </>
                ) : (
                  'None'
                )}
              </dd>
            </div>
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
        </div>
      </div>
    </aside>
  );
}
