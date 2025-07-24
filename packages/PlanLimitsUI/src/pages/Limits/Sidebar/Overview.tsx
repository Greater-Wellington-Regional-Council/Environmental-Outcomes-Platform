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

export default function Overview({
  council,
  appState,
  waterTakeFilter,
}: {
  council: Council;
  appState: AppState;
  waterTakeFilter: WaterTakeFilter;
}) {
  const regionOverrides = council.regionOverrides.find(
    (ro) => ro.sourceId === appState.planRegion?.sourceId,
  );

  return (
    <>
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
              text={
                regionOverrides?.swCMU ??
                appState.surfaceWaterUnitLimit?.name ??
                'None'
              }
            />
            {/* <span>ID: {appState.surfaceWaterUnitLimit?.id}</span> */}

            <LimitsListItem
              title={council.labels.surfaceWaterChildLimit}
              text={
                regionOverrides?.swCMSU ??
                appState.surfaceWaterSubUnitLimit?.name ??
                'None'
              }
            />
            {/* <span>ID: {appState.surfaceWaterSubUnitLimit?.id}</span> */}
          </>
        )}
        {['Ground', 'Combined'].includes(waterTakeFilter) && (
          <>
            <LimitsListItem
              title={council.labels.groundwaterLimit}
              text={
                regionOverrides?.gwCMU ?? appState.groundWaterZoneName ?? 'None'
              }
            />
            {/* <span>
              IDS:{' '}
                {appState.groundWaterLimits.map((limit) => limit.id).join(', ')}
            </span>*/}
          </>
        )}
        <LimitsListItem
          title={'Flow Management Site'}
          text={
            regionOverrides?.flowManagementSite
              ? regionOverrides?.flowManagementSite
              : appState.flowLimit
                ? appState.flowSite?.name
                : appState.planRegion
                  ? appState.planRegion.defaultFlowManagementLimit
                  : 'None'
          }
        />
        <LimitsListItem
          title={'Minimum Flow or Restriction Flow'}
          text={
            regionOverrides?.flowLimit
              ? regionOverrides?.flowLimit
              : appState.flowLimit
                ? formatWaterQuantity(
                    appState.flowLimit.minimumFlow,
                    council.unitTypes.flow,
                  )
                : appState.planRegion
                  ? appState.planRegion.defaultFlowManagementLimit
                  : 'None'
          }
        />
      </dl>
    </>
  );
}
