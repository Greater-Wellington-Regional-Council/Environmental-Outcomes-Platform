import { useAtom } from 'jotai';
import { councilAtom } from '../../lib/loader';
import useDetailedWaterUseData, {
  type DetailedWaterUseQuery,
} from '../../lib/useDetailedWaterUseData';
import WeeklyResults from './WeeklyResults';
import DailyResults from './DailyResults';
import Header from '../../pages/Limits/Sidebar/Header';
import { ErrorIndicator, LoadingIndicator } from '../../components/Indicators';

export default function Usage() {
  const [council] = useAtom(councilAtom);
  const waterUseData = useDetailedWaterUseData(
    council.id,
    council.usageDisplayGroups,
  );

  return (
    <>
      <div className="flex justify-between items-end border-b">
        <div className="px-4 py-2">
          <a href={`/limits/${council.slug}`} className="text-xs underline">
            Back to allocations viewer
          </a>
          <h1 className="text-xl font-light uppercase mt-2">
            Detailed Water Usage
          </h1>
        </div>
        <div className="w-[36rem]">
          <Header council={council} />
        </div>
      </div>
      <main className="p-4">
        <p className="mb-2">
          The data below <strong>is not all Water Use data</strong> supplied to
          Greater Wellington. It only includes data provided using timely
          automated telemetered systems.
        </p>
        <Results waterUseData={waterUseData} />
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
  );
}
