import InteractiveMap from "@components/InteractiveMap/InteractiveMap";
import {useLoaderData} from "react-router-dom";
import './MapPage.scss';
import {ViewLocation} from "@src/global";
import FarmManagementUnitProps from "@models/FarmManagementUnit.ts";
import useEscapeKey from "@lib/useEscapeKey.tsx";
import FarmManagementUnit from "@components/FarmManagementUnit/FarmManagementUnit.tsx";
import {useContext, useEffect, useState} from "react";
import ErrorContext from "@components/ErrorContext/ErrorContext.ts";
import farmManagementService from "@services/FarmManagementUnits.ts";

export default function MapPage() {

  const setError = useContext(ErrorContext).setError;

  const locationDetails = useLoaderData();

  const [location] = useState<ViewLocation>(locationDetails as ViewLocation);
  const [pinnedLocation, setPinnedLocation] = useState<ViewLocation | null>(null);
  const [selectedFmu, setSelectedFmu] = useState<FarmManagementUnitProps | null>(null);

  const [showPanel, setShowPanel] = useState(false);
  const [fmuChanged, setFmuChanged] = useState(false);

  function useFetchFmu(setSelectedFmu: (fmu: FarmManagementUnitProps | null) => void, setError: (error: Error | null) => void) {
    useEffect(() => {
      const fetchFmu = async () => {
        if (!pinnedLocation) return;
        const fmu = await farmManagementService.getByLngAndLat(pinnedLocation.longitude, pinnedLocation.latitude);
        setFmuChanged(selectedFmu != null && fmu != null  && (fmu != selectedFmu));
        setShowPanel(fmu != null)
        setSelectedFmu(fmu)
      };

      fetchFmu().then()
    }, [pinnedLocation, setSelectedFmu, setError]);
  }

  useFetchFmu(setSelectedFmu, setError);

  useEscapeKey(() => setShowPanel(false))

  const revealOrHideInfoPanel = showPanel ? 'animate-slide-in-right' : 'right-[-100%]';
  const signalUpdatedInfoPanel = fmuChanged ? 'pulsate' : '';

  return (
    <div className="map-page bg-white h-">
      <header className={"headers flex-2 font-medium m-4 mt-4 my-0 rounded-xl p-4 pt-1 bg-cyan-800 text-blue-50 font-sans"}>
        <h1
          className={"mb-4 text-4xl text-bo leading-none tracking-tight md:text-5xl lg:text-6xl mx-auto my-4"}>Farm
          management</h1>
        <h2 className={"text-2xl dark:text-white"}>Catchment, context, challenges and values (CCCV)</h2>
      </header>

      <main className="map-page flex hscreen" role="application">
        <div className={`map-panel flex-1 h-full m-4 rounded`}>
          <InteractiveMap location={location} pinLocation={setPinnedLocation}/>
        </div>
        <div
          className={`info-panel border-l-white border-l-8 text-white font-mono shadow-black m-4 absolute w-1/3 h-full ${signalUpdatedInfoPanel} ${revealOrHideInfoPanel} transition-transform`}
          key={`${fmuChanged ? selectedFmu?.fmuNo : ''}`}>
          <FarmManagementUnit {...selectedFmu!} />
        </div>
      </main>
    </div>
  )
}