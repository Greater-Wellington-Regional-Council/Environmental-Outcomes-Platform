import { useAtom } from 'jotai';
import { councilAtom } from '@lib/loader';

import GWHeader from '@components/GWHeader/GWHeader';
import Navigation from '@components/Navigation/Navigation';
import DataTable from '@components/WaterAllocationTable/WaterAllocationTable';


export default function Allocation() {
  const [council] = useAtom(councilAtom);

  return (
    <div className={"base-page"}>
      <GWHeader
        title="Natural Resource Plan"
        subtitle="Water Allocations"
        council={council}
        backTo={{ href: `/limits/${council.slug}`, text: 'Back to Water Allocation' }}
      />

      <nav className="mb-4">
        <Navigation />
      </nav>

      <main role="application">
        <div className="map-panel relative">
          <DataTable council={council}/>
        </div>
      </main>
    </div>
  );
}
