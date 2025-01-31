import { useAtom } from 'jotai';
import { councilAtom } from '@lib/loader';
import Footer from './Footer';
import Overview from './Overview';
import LimitsTable from './LimitsTable';
import UsageTable from './UsageTable';
import Button from '../../../components/RoundedButton';

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
      <div className="px-6">
        <div className="pb-4 flex flex-row justify-around">
          <Button
            text="Surface water"
            onClick={() => {
              setWaterTakeFilter('Surface');
            }}
            active={waterTakeFilter === 'Surface'}
          />
          <Button
            text="Groundwater"
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
          council={council}
          appState={appState}
          waterTakeFilter={waterTakeFilter}
        />

        {appState.planRegion && (
          <>
            <LimitsTable
              council={council}
              waterTakeFilter={waterTakeFilter}
              appState={appState}
            />
            <div className="my-8">
              <UsageTable
                council={council}
                appState={appState}
                waterTakeFilter={waterTakeFilter}
              />
            </div>
          </>
        )}
      </div>

      <Footer council={council} />
    </>
  );
}
