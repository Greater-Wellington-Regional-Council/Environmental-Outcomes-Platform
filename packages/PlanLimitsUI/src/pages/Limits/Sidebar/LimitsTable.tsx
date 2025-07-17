import { twMerge } from 'tailwind-merge';
import { pick } from 'lodash';

const BLANK_CELL_CHAR = '-';

const footNoteTexts = [
  {
    number: 1,
    id: 'PNRP41',
    text: 'Refer to Table 4.1 of NRP',
    href: 'https://www.gw.govt.nz/assets/Documents/2023/07/Chapter-4.pdf#page=50',
    footNoteText: 'Table 4.1 of the Natural Resources Plan',
  },
  {
    number: 2,
    id: 'PNRP121',
    text: 'Refer to Policy P121 of NRP',
    href: 'https://www.gw.govt.nz/assets/Documents/2023/07/Chapter-4.pdf#page=57',
    footNoteText: 'Policy P121 of the Natural Resources Plan',
  },
];

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
        className,
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
  hideCategory?: boolean;
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
  hideCategory = false,
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
      {!hideCategory && <FormattedTD>{category}</FormattedTD>}
      {!hideSubUnitLimit && (
        <>
          <FormattedTD rowSpan={subUnitLimitRowSpan}>
            <LimitAmount limitView={subUnitLimitView} />
          </FormattedTD>
          <FormattedTD rowSpan={subUnitLimitRowSpan}>
            <AllocatedAmount limitView={subUnitLimitView} />
          </FormattedTD>
        </>
      )}
      {!hideUnitLimit && (
        <>
          <FormattedTD rowSpan={unitLimitRowSpan}>
            <LimitAmount limitView={unitLimitView} />
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
      {limitView.allocatedToDisplay}
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

function LimitAmount({ limitView }: { limitView: LimitView }) {
  const footNoteItem = footNoteTexts.find(
    (item) => item.text === limitView.limitToDisplay,
  );

  if (footNoteItem) {
    return (
      <span>
        {limitView.limitToDisplay}
        <sup>
          <a href={`#${footNoteItem.id}`}>{footNoteItem.number}</a>
        </sup>
      </span>
    );
  }

  return limitView.limitToDisplay ? (
    <>{limitView.limitToDisplay}</>
  ) : (
    <>{BLANK_CELL_CHAR}</>
  );
}

type Props = {
  waterTakeFilter: WaterTakeFilter;
  appState: AppState;
  council: Council;
};
export default function LimitsTable({
  waterTakeFilter,
  appState,
  council,
}: Props) {
  if (
    !appState.surfaceWaterLimitView &&
    !appState.catAGroundWaterLimitsView &&
    !appState.catBGroundWaterLimitsView &&
    !appState.catCGroundWaterLimitsView
  )
    return <></>;

  const showSurfaceWaterLimits = ['Combined', 'Surface'].includes(
    waterTakeFilter,
  );
  const showGroundWaterLimits = ['Combined', 'Ground'].includes(
    waterTakeFilter,
  );

  const showFootnote = true;

  // TODO: Comment and extract this logic
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
            appState.surfaceWaterUnitLimit?.id,
      ).length + 1;

    surfaceAndGroundCatASubUnitRowSpan =
      catALimits.filter(
        (gwLimitView) =>
          appState.surfaceWaterSubUnitLimit &&
          gwLimitView.depletesFromSubunitLimit?.id ===
            appState.surfaceWaterSubUnitLimit?.id,
      ).length + 1;
  }

  const regionOverrides = council.regionOverrides.find(
    (ro) => ro.sourceId === appState.planRegion?.sourceId,
  );

  return (
    <>
      <h3 className="text-lg uppercase mb-2 tracking-wider">Allocations</h3>
      <table className="border-collapse border">
        <thead>
          <tr>
            <FormattedTH rowSpan={2}>Type</FormattedTH>
            <FormattedTH rowSpan={2}>Depth</FormattedTH>
            {council.hasGroundwaterCategories && (
              <FormattedTH rowSpan={2}>Category</FormattedTH>
            )}
            <FormattedTH colSpan={2} className="text-center">
              {council.labels.surfaceWaterChild}
            </FormattedTH>
            <FormattedTH colSpan={2} className="text-center">
              {council.labels.surfaceWaterParent}
            </FormattedTH>
          </tr>
          <tr>
            <FormattedTH>Allocation Amount</FormattedTH>
            <FormattedTH>Consented Core Allocation</FormattedTH>
            <FormattedTH>Allocation Amount</FormattedTH>
            <FormattedTH>Consented Core Allocation</FormattedTH>
          </tr>
        </thead>
        <tbody>
          {showSurfaceWaterLimits && appState.surfaceWaterLimitView && (
            <LimitRow
              type="Surface"
              {...appState.surfaceWaterLimitView}
              hideCategory={!council.hasGroundwaterCategories}
              subUnitLimitRowSpan={surfaceAndGroundCatASubUnitRowSpan}
              unitLimitRowSpan={surfaceAndGroundCatAUnitRowSpan}
            ></LimitRow>
          )}
          {showGroundWaterLimits &&
            appState.catAGroundWaterLimitsView &&
            Object.keys(appState.catAGroundWaterLimitsView).map((key) =>
              appState.catAGroundWaterLimitsView![key].map((gwLimit, index) => (
                <LimitRow
                  key={`A-${key}-${index}`}
                  type="Ground"
                  depth={gwLimit.groundWaterLimit.depth}
                  category={gwLimit.groundWaterLimit.category}
                  hideCategory={!council.hasGroundwaterCategories}
                  {...pick(gwLimit, 'subUnitLimitView', 'unitLimitView')}
                  hideSubUnitLimit={
                    showSurfaceWaterLimits &&
                    index + 1 < surfaceAndGroundCatASubUnitRowSpan
                  }
                  hideUnitLimit={
                    showSurfaceWaterLimits &&
                    index + 1 < surfaceAndGroundCatAUnitRowSpan
                  }
                />
              )),
            )}
        </tbody>
        {showGroundWaterLimits &&
          appState.catBGroundWaterLimitsView &&
          Object.keys(appState.catBGroundWaterLimitsView).map((key) => (
            <tbody key={key}>
              {appState.catBGroundWaterLimitsView![key].map(
                (gwLimit, index) => (
                  <LimitRow
                    key={`B-${key}-${index}`}
                    type="Ground"
                    category={gwLimit.groundWaterLimit.category}
                    depth={gwLimit.groundWaterLimit.depth}
                    hideCategory={!council.hasGroundwaterCategories}
                    {...pick(gwLimit, 'subUnitLimitView', 'unitLimitView')}
                    subUnitLimitRowSpan={
                      appState.catBGroundWaterLimitsView![key].length > 1
                        ? 0
                        : 1
                    }
                    hideSubUnitLimit={index > 0}
                    unitLimitRowSpan={
                      appState.catBGroundWaterLimitsView![key].length > 1
                        ? 0
                        : 1
                    }
                    hideUnitLimit={index > 0}
                  />
                ),
              )}
            </tbody>
          ))}
        {showGroundWaterLimits &&
          appState.catCGroundWaterLimitsView &&
          Object.keys(appState.catCGroundWaterLimitsView).map((key) => (
            <tbody key={key}>
              {appState.catCGroundWaterLimitsView![key].map(
                (gwLimit, index) => (
                  <LimitRow
                    key={`C-${key}-${index}`}
                    type="Ground"
                    depth={gwLimit.groundWaterLimit.depth}
                    category={gwLimit.groundWaterLimit.category}
                    hideCategory={!council.hasGroundwaterCategories}
                    {...pick(gwLimit, 'subUnitLimitView', 'unitLimitView')}
                    subUnitLimitRowSpan={
                      appState.catCGroundWaterLimitsView![key].length > 1
                        ? 0
                        : 1
                    }
                    hideSubUnitLimit={index > 0}
                    unitLimitRowSpan={
                      appState.catCGroundWaterLimitsView![key].length > 1
                        ? 0
                        : 1
                    }
                    hideUnitLimit={index > 0}
                  />
                ),
              )}
            </tbody>
          ))}
      </table>
      {showFootnote && council.id === 9 && (
        <>
          {regionOverrides?.limitsTableFooter && (
            <div className="mt-4 text-sm">
              {regionOverrides?.limitsTableFooter}
            </div>
          )}
          {!regionOverrides?.limitsTableFooter &&
            footNoteTexts.map(({ number, id, href, footNoteText }, index) => (
              <div key={number} className={index === 0 ? 'mt-4' : ''}>
                <span id={id} className="underline">
                  <sup>{number}</sup>
                </span>
                <a
                  href={href}
                  className="text-sm flex-1 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {footNoteText}
                </a>
              </div>
            ))}
        </>
      )}
    </>
  );
}
