import { twMerge } from 'tailwind-merge';
import { pick } from 'lodash';

const BLANK_CELL_CHAR = '-';
const GROUNDWATER_CATEGORY_B_RULE = (
  <span className="text-xs">
    See 4.1 of PNRP
    <sup>
      <a href="#PNRP41">1</a>
    </sup>
  </span>
);
const DEFAULT_RULE = (
  <span className="text-xs">
    See P121 of PRNP
    <sup>
      <a href="#PRNP121">2</a>
    </sup>
  </span>
);

function FormattedTD(props: {
  children?: React.ReactElement | string;
  rowSpan?: number;
}) {
  const { children, ...otherProps } = props;
  return (
    <td className="border p-2 text-left text-sm" {...otherProps}>
      {children}
    </td>
  );
}

function FormattedTH(props: {
  children?: React.ReactElement | string;
  rowSpan?: number;
  colSpan?: number;
  className?: string;
}) {
  const { children, className, ...otherProps } = props;
  return (
    <th
      className={twMerge(
        'border p-2 text-left text-sm font-normal bg-gray-100',
        className
      )}
      {...otherProps}
    >
      {children}
    </th>
  );
}

interface LimitRow {
  type: 'Surface' | 'Ground';
  depth?: string;
  category?: string;
  subUnitLimitView: LimitView;
  subUnitLimitRowSpan?: number;
  hideSubUnitLimit?: boolean;
  unitLimitView: LimitView;
  unitLimitRowSpan?: number;
  hideUnitLimit?: boolean;
}
function LimitRow({
  type,
  depth = BLANK_CELL_CHAR,
  category = BLANK_CELL_CHAR,
  hideSubUnitLimit = false,
  subUnitLimitView,
  subUnitLimitRowSpan = 1,
  hideUnitLimit = false,
  unitLimitView,
  unitLimitRowSpan = 1,
}: LimitRow) {
  return (
    <tr>
      <FormattedTD>{type}</FormattedTD>
      <FormattedTD>{depth}</FormattedTD>
      <FormattedTD>{category}</FormattedTD>
      {!hideSubUnitLimit && (
        <>
          <FormattedTD rowSpan={subUnitLimitRowSpan}>
            {subUnitLimitView.limitToDiplay || BLANK_CELL_CHAR}
          </FormattedTD>
          <FormattedTD rowSpan={subUnitLimitRowSpan}>
            <AllocatedAmount limitView={subUnitLimitView} />
          </FormattedTD>
        </>
      )}
      {!hideUnitLimit && (
        <>
          <FormattedTD rowSpan={unitLimitRowSpan}>
            {unitLimitView.limitToDiplay || BLANK_CELL_CHAR}
          </FormattedTD>
          <FormattedTD rowSpan={unitLimitRowSpan}>
            <AllocatedAmount limitView={unitLimitView} />
          </FormattedTD>
        </>
      )}
    </tr>
  );
}

function AllocatedAmount({ limitView }: { limitView: LimitView }) {
  if (!limitView.allocated) return <>{BLANK_CELL_CHAR}</>;
  return (
    <>
      {limitView.allocatedToDiplay}
      <br />
      <span
        className={
          limitView.allocatedPercent && limitView.allocatedPercent < 100
            ? 'text-green-700'
            : 'text-red-700'
        }
      >
        {limitView.allocatedPercent}%
      </span>
    </>
  );
}

type Props = {
  waterTakeFilter: WaterTakeFilter;
  appState: AppState;
};
export default function LimitsTable({ waterTakeFilter, appState }: Props) {
  if (
    !appState.surfaceWaterLimitView &&
    !appState.catAGroundWaterLimitsView &&
    !appState.catBGroundWaterLimitsView &&
    !appState.catCGroundWaterLimitsView
  )
    return <></>;

  const showSurfaceWaterLimits = ['Combined', 'Surface'].includes(
    waterTakeFilter
  );
  const showGroundWaterLimits = ['Combined', 'Ground'].includes(
    waterTakeFilter
  );

  const showFootnote = true;
  let surfaceAndGroundCatASubUnitRowSpan = 1;
  let surfaceAndGroundCatAUnitRowSpan = 1;
  if (
    appState.catAGroundWaterLimitsView &&
    Object.values(appState.catAGroundWaterLimitsView).length > 0
  ) {
    const catALimits = Object.values(appState.catAGroundWaterLimitsView)[0];
    surfaceAndGroundCatAUnitRowSpan =
      catALimits.filter(
        (gwLimitView) =>
          appState.surfaceWaterUnitLimit &&
          gwLimitView.depletesFromUnitLimit?.id ===
            appState.surfaceWaterUnitLimit?.id
      ).length + 1;

    surfaceAndGroundCatASubUnitRowSpan =
      catALimits.filter(
        (gwLimitView) =>
          appState.surfaceWaterSubUnitLimit &&
          gwLimitView.depletesFromSubunitLimit?.id ===
            appState.surfaceWaterSubUnitLimit?.id
      ).length + 1;
  }

  return (
    <>
      <h3 className="text-lg uppercase mb-2 tracking-wider">Limits</h3>

      <table className="border-collapse border">
        <thead>
          <tr>
            <FormattedTH rowSpan={2}>Type</FormattedTH>
            <FormattedTH rowSpan={2}>Depth</FormattedTH>
            <FormattedTH rowSpan={2}>Category</FormattedTH>
            <FormattedTH colSpan={2} className="text-center">
              Sub-unit
            </FormattedTH>
            <FormattedTH colSpan={2} className="text-center">
              Unit
            </FormattedTH>
          </tr>
          <tr>
            <FormattedTH>Limit</FormattedTH>
            <FormattedTH>Allocated</FormattedTH>
            <FormattedTH>Limit</FormattedTH>
            <FormattedTH>Allocated</FormattedTH>
          </tr>
        </thead>
        <tbody>
          {showSurfaceWaterLimits && appState.surfaceWaterLimitView && (
            <LimitRow
              type="Surface"
              {...appState.surfaceWaterLimitView}
              subUnitLimitRowSpan={surfaceAndGroundCatASubUnitRowSpan}
              unitLimitRowSpan={surfaceAndGroundCatAUnitRowSpan}
            ></LimitRow>
          )}
          {showGroundWaterLimits &&
            appState.catAGroundWaterLimitsView &&
            Object.keys(appState.catAGroundWaterLimitsView).map((key) =>
              appState.catAGroundWaterLimitsView[key].map((gwLimit, index) => (
                <LimitRow
                  key={`${key}=${index}`}
                  type="Ground"
                  depth={gwLimit.groundWaterLimit.depth}
                  category={gwLimit.groundWaterLimit.category}
                  {...pick(gwLimit, 'subUnitLimitView', 'unitLimitView')}
                  hideSubUnitLimit={
                    showSurfaceWaterLimits &&
                    index + 1 < surfaceAndGroundCatASubUnitRowSpan
                  }
                  hideUnitLimit={
                    showSurfaceWaterLimits &&
                    index + 1 < surfaceAndGroundCatAUnitRowSpan
                  }
                ></LimitRow>
              ))
            )}
        </tbody>
        {showGroundWaterLimits &&
          appState.catBGroundWaterLimitsView &&
          Object.keys(appState.catBGroundWaterLimitsView).map((key) => (
            <tbody key={key}>
              {appState.catBGroundWaterLimitsView[key].map((gwLimit, index) => (
                <LimitRow
                  key={`${key}=${index}`}
                  type="Ground"
                  depth={gwLimit.groundWaterLimit.depth}
                  category={gwLimit.groundWaterLimit.category}
                  {...pick(gwLimit, 'subUnitLimitView', 'unitLimitView')}
                  subUnitLimitRowSpan={0}
                  hideSubUnitLimit={index > 0}
                  unitLimitRowSpan={0}
                  hideUnitLimit={index > 0}
                ></LimitRow>
              ))}
            </tbody>
          ))}
        {showGroundWaterLimits &&
          appState.catCGroundWaterLimitsView &&
          Object.keys(appState.catCGroundWaterLimitsView).map((key) => (
            <tbody key={key}>
              {appState.catCGroundWaterLimitsView[key].map((gwLimit, index) => (
                <LimitRow
                  key={`${key}=${index}`}
                  type="Ground"
                  depth={gwLimit.groundWaterLimit.depth}
                  category={gwLimit.groundWaterLimit.category}
                  {...pick(gwLimit, 'subUnitLimitView', 'unitLimitView')}
                  subUnitLimitRowSpan={0}
                  hideSubUnitLimit={index > 0}
                  unitLimitRowSpan={0}
                  hideUnitLimit={index > 0}
                ></LimitRow>
              ))}
            </tbody>
          ))}
      </table>
      {showFootnote && (
        <>
          <div className="mt-3">
            <span id="PNRP41" className="underline">
              <sup>1</sup>
            </span>
            <a
              href="https://pnrp.gw.govt.nz/assets/Uploads/7-Chapter-4-Policies-Appeal-version-2022-FORMATTED.pdf#page=52"
              className="text-sm flex-1 underline"
              target="_blank"
              rel="noreferrer"
            >
              Table 4.1 of the Proposed Natural Resource Plan Limits
            </a>
          </div>
          <div>
            <span id="PNRP121" className="underline">
              <sup>2</sup>
            </span>
            <a
              href="https://pnrp.gw.govt.nz/assets/Uploads/7-Chapter-4-Policies-Appeal-version-2022-FORMATTED.pdf#page=59"
              className="text-sm flex-1 underline"
              target="_blank"
              rel="noreferrer"
            >
              Policy P121 of the Proposed Natural Resource Plan Limits
            </a>
          </div>
        </>
      )}
    </>
  );
}
