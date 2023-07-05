'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useDebounce } from 'usehooks-ts';
import RainfallMap from '@/components/RainfallMap';
import TimePeriodSelector from '@/components/TimePeriodSelector';
import { LoadingIndicator, ErrorIndicator } from '@/components/Indicators';
import CouncilLogos from '@/components/CouncilLogos';
import { useRainfallData, type RainfallObservationFeatures } from '../lib/api';
import { parseViewParams, serializeViewParams } from '../lib/viewParams';
import { formatDate } from '../lib/dateHelpers';
import {
  parseLocationString,
  createLocationString,
} from '../lib/locationString';
import eopLogo from '../../public/eop-logo.svg';
import clsx from 'clsx';

const DefaultMapView = {
  longitude: 172.079,
  latitude: -41.123,
  zoom: 5,
};

function SiteSummary({ rainfall }: { rainfall: RainfallObservationFeatures }) {
  const allSitesCount = rainfall.features.length;
  const sitesWithDataCount = rainfall.features.filter((feauture) => {
    return feauture.properties.amount !== null;
  }).length;

  const percentage = (sitesWithDataCount / allSitesCount) * 100;

  return (
    <div className="text-sm italic">
      {allSitesCount > 0 && (
        <>
          <strong>{Math.round(percentage)}%</strong> ({sitesWithDataCount} of{' '}
          {allSitesCount}) of sites have data for this period.
        </>
      )}
      {allSitesCount === 0 && (
        <strong>No data available for this period</strong>
      )}
    </div>
  );
}

const EMPTY_GEO_JSON_DATA = {
  type: 'FeatureCollection' as const,
  features: [],
};

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const viewParams = parseViewParams(searchParams);
  const { rainfall, councils, isLoading, hasError } =
    useRainfallData(viewParams);

  // TODO: Integrate all of these options
  const updateViewParams = (updatedViewParams: Partial<ViewParams>) => {
    const newUrl = serializeViewParams({
      ...viewParams,
      ...updatedViewParams,
    });
    router.replace(newUrl);
  };

  const [accumOffset, setAccumOffset] = useState(0);
  if (accumOffset > viewParams.hours) {
    setAccumOffset(viewParams.hours);
  }

  const resetMapView = () => {
    setMapView(DefaultMapView);
  };

  const [mapView, setMapView] = useState<MapView>(DefaultMapView);
  const debouncedValue = useDebounce<MapView>(mapView, 500);
  useEffect(() => {
    const locationString = createLocationString(debouncedValue);
    window.location.hash = `#${locationString}`;
  }, [debouncedValue]);

  useEffect(() => {
    const onHashChanged = () => {
      const location = parseLocationString(window.location.hash);
      if (location) {
        setMapView(location);
      }
    };
    window.addEventListener('hashchange', onHashChanged);
    return () => {
      window.removeEventListener('hashchange', onHashChanged);
    };
  }, []);

  const [councilHighlight, setCouncilHighlight] = useState<number | null>(null);
  const highlightCouncil = (councilId: number) => {
    setCouncilHighlight(councilId);
    setTimeout(() => {
      setCouncilHighlight(null);
    }, 3000);
  };

  return (
    <div className="h-screen flex bg-white">
      <main className="flex-1 relative">
        <RainfallMap
          councils={councils ?? EMPTY_GEO_JSON_DATA}
          rainfall={rainfall ?? EMPTY_GEO_JSON_DATA}
          councilHighlight={councilHighlight}
          mapView={mapView}
          setMapView={setMapView}
          viewParams={viewParams}
          accumOffset={accumOffset}
        />
      </main>
      <aside className="w-[24rem] overflow-y-scroll p-4 flex flex-col">
        <header className="border-b flex items-end mb-6">
          <h1 className="grow font-heading font-semibold text-2xl uppercase tracking-wide">
            Rainfall Viewer
          </h1>
          <div className="text-right pb-1">
            {isLoading && <LoadingIndicator />}
            {hasError && <ErrorIndicator />}
          </div>
        </header>

        <div
          className={clsx(
            'mb-4 prose relative transition-all',
            isLoading && 'bg-gray-100 opacity-50'
          )}
        >
          <div className="pb-8">
            Showing rainfall total between{' '}
            <strong className="whitespace-nowrap">
              {formatDate(viewParams.from)}
            </strong>
            &ndash;
            <strong className="whitespace-nowrap">
              {formatDate(viewParams.to)}
            </strong>
            {!isLoading && rainfall && (
              <div className="absolute bottom-0">
                <SiteSummary rainfall={rainfall} />
              </div>
            )}
          </div>
        </div>

        <div className="mb-6 grow">
          <TimePeriodSelector
            viewParams={viewParams}
            updateViewParams={updateViewParams}
            resetMapView={resetMapView}
            accumOffset={accumOffset}
            setAccumOffset={setAccumOffset}
          />
        </div>

        <div className="justify-self-end">
          <CouncilLogos highlightCouncil={highlightCouncil} />
        </div>

        <footer className="flex items-center border-t pt-2 justify-self-end">
          <div className="font-heading font-bold text-3xl mr-2 text-davy-gray grow text-right">
            EOP
          </div>
          <Image
            className="m-0"
            src={eopLogo.src}
            alt="EOP Logo"
            height={28}
            width={28}
          />
        </footer>
      </aside>
    </div>
  );
}
