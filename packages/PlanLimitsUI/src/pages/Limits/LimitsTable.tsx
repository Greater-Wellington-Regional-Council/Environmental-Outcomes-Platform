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

type Props = {
  waterTakeFilter: WaterTakeFilter;
  appState: AppState;
};

function AllocatedAmount({
  amount,
  percentage,
}: {
  amount?: string;
  percentage?: number;
}) {
  if (!amount) return <>{BLANK_CELL_CHAR}</>;
  return (
    <>
      {amount}
      <br />
      <span
        className={
          percentage && percentage < 100 ? 'text-green-700' : 'text-red-700'
        }
      >
        {percentage}%
      </span>
    </>
  );
}

export default function LimitsTable({ waterTakeFilter, appState }: Props) {
  if (!appState.swLimit && appState.gwLimits?.length === 0) return <></>;

  const showFootnote =
    appState.swLimit?.useDefaultRuleForSubUnit ||
    appState.swLimit?.useDefaultRuleForUnit ||
    appState.gwLimits?.some(
      (gwLimit) =>
        gwLimit.useDefaultRuleForSubUnit || gwLimit.useDefaultRuleForUnit
    );

  let swAndGWCatASubUnitRowSpan = 1;
  let swAndGWCatAUnitRowSpan = 1;

  let gwCatBSubUnitRowSpan = 1;
  let gwCatBAllocationAmountId: number;
  let gwCatCSubUnitRowSpan = 1;
  let gwCatCAllocationAmountId: number;

  appState.gwLimits?.forEach((gwLimit) => {
    if (gwLimit.category === 'A') {
      if (
        ['Combined'].includes(waterTakeFilter) &&
        gwLimit.parentSWSubUnitId &&
        gwLimit.parentSWSubUnitId.toString() ===
          appState?.surfaceWaterMgmtSubUnitId?.toString()
      ) {
        swAndGWCatASubUnitRowSpan += 1;
        // This depends on consecutive Cat A GW limits having the parent SW sub unit.
        gwLimit.mergeSubUnit = true;
      }
      if (
        ['Combined'].includes(waterTakeFilter) &&
        gwLimit.parentSWUnitId &&
        gwLimit.parentSWUnitId.toString() ===
          appState?.surfaceWaterMgmtUnitId?.toString()
      ) {
        swAndGWCatAUnitRowSpan += 1;
        // This depends on consecutive Cat A GW limits having the parent SW sub unit.
        gwLimit.mergeUnit = true;
      }
    }

    if (gwLimit.category === 'B') {
      if (!gwCatBAllocationAmountId && gwLimit.groundwaterAllocationAmountId) {
        gwCatBAllocationAmountId = gwLimit.groundwaterAllocationAmountId;
      } else {
        if (
          gwCatBAllocationAmountId &&
          gwCatBAllocationAmountId === gwLimit.groundwaterAllocationAmountId
        ) {
          // This depends on consecutive Cat B GW limits having the parent SW sub unit.
          gwCatBSubUnitRowSpan += 1;
          gwLimit.mergeSubUnit = true;
          gwLimit.mergeUnit = true;
        }
      }
    }

    if (gwLimit.category === 'C') {
      if (!gwCatCAllocationAmountId && gwLimit.groundwaterAllocationAmountId) {
        gwCatCAllocationAmountId = gwLimit.groundwaterAllocationAmountId;
      } else {
        if (
          gwCatCAllocationAmountId &&
          gwCatCAllocationAmountId == gwLimit.groundwaterAllocationAmountId
        ) {
          // This depends on consecutive Cat C GW limits having the parent SW sub unit.
          gwCatCSubUnitRowSpan += 1;
          gwLimit.mergeSubUnit = true;
          gwLimit.mergeUnit = true;
        }
      }
    }
  });

  return (
    <>
      <h3 className="text-lg uppercase mb-2 tracking-wider">Limits</h3>
      <table className="border-collapse border">
        <thead>
          <tr>
            <th
              rowSpan={2}
              className="border p-2 text-left text-sm font-normal bg-gray-100"
            >
              Type
            </th>
            <th
              rowSpan={2}
              className="border p-2 text-left text-sm font-normal bg-gray-100"
            >
              Depth
            </th>
            <th
              rowSpan={2}
              className="border p-2 text-left text-sm font-normal bg-gray-100"
            >
              Category
            </th>
            <th
              colSpan={2}
              className="border p-2 text-center text-sm font-normal bg-gray-100"
            >
              Sub-unit
            </th>

            <th
              colSpan={2}
              className="border p-2 text-center text-sm font-normal bg-gray-100"
            >
              Unit
            </th>
          </tr>
          <tr>
            <th className="border p-1 text-left text-sm font-normal bg-gray-100">
              Limit
            </th>
            <th className="border p-1 text-left text-sm font-normal bg-gray-100">
              Allocated
            </th>
            <th className="border p-1 text-left text-sm font-normal bg-gray-100">
              Limit
            </th>
            <th className="border p-1 text-left text-sm font-normal bg-gray-100">
              Allocated
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Surface water */}
          {['Combined', 'Surface'].includes(waterTakeFilter) && (
            <>
              <tr>
                <td className="border p-2 text-left text-sm">Surface</td>
                <td className="border p-2 text-left text-sm">
                  {BLANK_CELL_CHAR}
                </td>
                <td className="border p-2 text-left text-sm">
                  {BLANK_CELL_CHAR}
                </td>
                <td
                  rowSpan={swAndGWCatASubUnitRowSpan}
                  className="border p-2 text-left text-sm"
                >
                  {appState.swLimit?.useDefaultRuleForSubUnit
                    ? DEFAULT_RULE
                    : appState.swLimit?.subUnitLimit || BLANK_CELL_CHAR}
                </td>
                <td
                  rowSpan={swAndGWCatASubUnitRowSpan}
                  className="border p-2 text-left text-sm"
                >
                  <AllocatedAmount
                    amount={appState.surfaceWaterMgmtSubUnitAllocated}
                    percentage={
                      appState.surfaceWaterMgmtSubUnitAllocatedPercentage
                    }
                  />
                </td>
                <td
                  rowSpan={swAndGWCatAUnitRowSpan}
                  className="border p-2 text-left text-sm"
                >
                  {appState.swLimit?.useDefaultRuleForUnit
                    ? DEFAULT_RULE
                    : appState.swLimit?.unitLimit || BLANK_CELL_CHAR}
                </td>
                <td
                  rowSpan={swAndGWCatAUnitRowSpan}
                  className="border p-2 text-left text-sm"
                >
                  <AllocatedAmount
                    amount={appState.surfaceWaterMgmtUnitAllocated}
                    percentage={
                      appState.surfaceWaterMgmtUnitAllocatedPercentage
                    }
                  />
                </td>
              </tr>
            </>
          )}
          {['Combined', 'Ground'].includes(waterTakeFilter) && (
            <>
              {appState.gwLimits?.map((gwLimit, index) => (
                <tr key={index}>
                  <td className="border p-2 text-left text-sm">Ground</td>
                  <td className="border p-2 text-left text-sm">
                    {gwLimit.depth}
                  </td>
                  <td className="border p-2 text-left text-sm">
                    {gwLimit.category || BLANK_CELL_CHAR}
                  </td>
                  {!gwLimit.mergeSubUnit && (
                    <>
                      <td
                        rowSpan={
                          gwLimit.category === 'B'
                            ? gwCatBSubUnitRowSpan
                            : gwLimit.category === 'C'
                            ? gwCatCSubUnitRowSpan
                            : 1
                        }
                        className="border p-2 text-left text-sm"
                      >
                        {gwLimit.useDefaultRuleForSubUnit
                          ? gwLimit.category === 'B'
                            ? GROUNDWATER_CATEGORY_B_RULE
                            : DEFAULT_RULE
                          : gwLimit.subUnitLimit || BLANK_CELL_CHAR}
                      </td>
                      <td
                        rowSpan={
                          gwLimit.category === 'B'
                            ? gwCatBSubUnitRowSpan
                            : gwLimit.category === 'C'
                            ? gwCatCSubUnitRowSpan
                            : 1
                        }
                        className="border p-2 text-left text-sm"
                      >
                        <AllocatedAmount {...gwLimit.subUnitAllocated} />
                      </td>
                    </>
                  )}
                  {!gwLimit.mergeUnit && (
                    <>
                      <td
                        rowSpan={
                          gwLimit.category === 'B'
                            ? gwCatBSubUnitRowSpan
                            : gwLimit.category === 'C'
                            ? gwCatCSubUnitRowSpan
                            : 1
                        }
                        className="border p-2 text-left text-sm"
                      >
                        {gwLimit.useDefaultRuleForUnit
                          ? gwLimit.category === 'B'
                            ? GROUNDWATER_CATEGORY_B_RULE
                            : DEFAULT_RULE
                          : gwLimit.unitLimit || BLANK_CELL_CHAR}
                      </td>
                      <td
                        rowSpan={
                          gwLimit.category === 'B'
                            ? gwCatBSubUnitRowSpan
                            : gwLimit.category === 'C'
                            ? gwCatCSubUnitRowSpan
                            : 1
                        }
                        className="border p-2 text-left text-sm"
                      >
                        <AllocatedAmount {...gwLimit.unitAllocated} />
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </>
          )}
        </tbody>
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
