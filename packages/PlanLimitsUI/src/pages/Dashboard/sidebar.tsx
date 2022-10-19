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
              title={'What spatial sub-unit am I in?'}
              text="???"
            />
            <LimitsListItem
              title={'What groundwater category am I? (A, B or C)'}
              text={
                mouseState.groundWaterZone
                  ? `00-20m ${mouseState.gw00}, 20-30m ${mouseState.gw20}, Over 30m ${mouseState.gw30}`
                  : 'None'
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
            <LimitsListItem
              title={'What allocation limit applies to me?'}
              text={
                mouseState.allocationLimit ? mouseState.allocationLimit : 'None'
              }
            />
          </dl>
        </div>
      </div>
    </aside>
  );
}
