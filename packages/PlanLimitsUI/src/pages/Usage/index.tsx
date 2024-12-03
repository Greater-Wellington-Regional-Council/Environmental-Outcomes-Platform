import { useAtom } from 'jotai';
import { councilAtom } from '@lib/loader';
import useDetailedWaterUseData, {
  type DetailedWaterUseQuery,
} from '../../lib/useDetailedWaterUseData';
import WeeklyResults from './WeeklyResults';
import DailyResults from './DailyResults';
import { ErrorIndicator, LoadingIndicator } from '@components/Indicators';
import GWHeader from '@components/GWHeader/GWHeader';
import Navigation from '@components/Navigation/Navigation';

export default function Usage() {
  const [council] = useAtom(councilAtom);
  const waterUseData = useDetailedWaterUseData(
    council.id,
    council.usageDisplayGroups,
  );

  return (
    <>
      <GWHeader
        title={`Water Allocations and Usage`}
        subtitle="Detailed Water Usage"
        council={council}
        backTo={{ href: `/limits/${council.slug}`, text: 'Back to Water Allocation' }}
      />

      <nav className="mb-4">
        <Navigation />
      </nav>

      <main role="application">
        <div className="p-4 map-panel">
          <p className="mb-2">
            The data below <strong>is not all Water Use data</strong> supplied to
            Greater Wellington. It only includes data provided using timely
            automated telemetered systems.
          </p>
          <Results waterUseData={waterUseData} />
        </div>
      </main>
    </>
  );
}

function Results({ waterUseData }: { waterUseData: DetailedWaterUseQuery }) {

  if (waterUseData.isLoading) {
    return <LoadingIndicator>Loading data</LoadingIndicator>;
  }

  if (waterUseData.isError || !waterUseData.data || !waterUseData.data.usage) {
    return <ErrorIndicator>Error loading data</ErrorIndicator>;
  }

  return (
    <>
      <div className="mb-4 italic text-sm">
        No data for: {waterUseData.data.usage.allMissingAreas.join(', ')}
      </div>

      <WeeklyResults data={waterUseData.data.usage} />
      <DailyResults
        data={waterUseData.data.usage}
        from={waterUseData.data.formattedFrom}
        to={waterUseData.data.formattedTo}
      />
    </>
  )
    ;
}

