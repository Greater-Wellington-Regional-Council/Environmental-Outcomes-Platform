import { useAtom } from 'jotai';
import { councilAtom } from '../../../lib/loader';
import LimitsTable from './LimitsTable';
import Button from '../../../components/Button';
import UsageTable from './UsageTable';
import Header from './Header';
import Footer from './Footer';
import Overview from './Overview';

export default function Sidebar({
  appState,
  waterTakeFilter,
  setWaterTakeFilter,
}: {
  appState: AppState;
  waterTakeFilter: WaterTakeFilter;
  setWaterTakeFilter: (value: WaterTakeFilter) => void;
}) {
  const [council] = useAtom(councilAtom);

  return (
    <>
      <Header council={council} />

      <div className=" border-gray-200 px-6 py-4">
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

        <Overview
          appState={appState}
          waterTakeFilter={waterTakeFilter}
          council={council}
        />

        {appState.planRegion && (
          <LimitsTable
            council={council}
            waterTakeFilter={waterTakeFilter}
            appState={appState}
          />
        )}
        <div className="mb-6">
          <UsageTable />
        </div>
      </div>

      <Footer council={council} />
    </>
  );
}
