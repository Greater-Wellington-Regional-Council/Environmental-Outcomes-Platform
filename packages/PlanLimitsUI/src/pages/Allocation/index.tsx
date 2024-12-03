import { useState } from 'react';
import { useAtom } from 'jotai';
import { councilAtom } from '@lib/loader';

import GWHeader from '@components/GWHeader/GWHeader';
import Navigation from '@components/Navigation/Navigation';
import DataTable from '@components/DataTable';


export default function Allocation() {
  const [council] = useAtom(councilAtom);

  return (
    <>
      <GWHeader
        title="Natural Resource Plan"
        subtitle="Water Allocations"
        council={council}
        backTo={{ href: `/limits/${council.slug}`, text: 'Back to Water Allocation' }}
      />

      <nav style={{ zIndex: "9999", height: "50px" }}>
        <Navigation />
      </nav>

      <main role="application">
        <div className="map-panel relative">
          <DataTable />
        </div>
      </main>
    </>
  );
}
