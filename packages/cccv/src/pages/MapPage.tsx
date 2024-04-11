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

  function useFetchFmu(setSelectedFmu: (fmu: FarmManagementUnitProps | null) => void, setError: (error: Error | null) => void) {
    useEffect(() => {
      const fetchFmu = async () => {
        if (!pinnedLocation) return;
        const fmu = await farmManagementService.getByLngAndLat(pinnedLocation.longitude, pinnedLocation.latitude);
        setSelectedFmu(fmu);
        console.log(selectedFmu)
        if (fmu) {
          console.log("show panel")
          setShowPanel(true);
        } else {
          setShowPanel(false);
        }
      };

      fetchFmu().then()
    }, [setSelectedFmu, setError]);
  }

  useFetchFmu(setSelectedFmu, setError);

  useEscapeKey(() => setShowPanel(false))

  return (
    <div className="mappage flex flex-col bg-gray-50">
      <header className={"headers flex-2 font-medium m-4 mt-4 my-0 rounded-xl p-4 pt-0 bg-cyan-800 text-blue-50 font-sans"}>
        <h1
          className={"mb-4 text-4xl text-bo leading-none tracking-tight md:text-5xl lg:text-6xl mx-auto my-4"}>Farm
          management</h1>
        <h2 className={"text-2xl dark:text-white"}>Catchment, context, challenges and values (CCCV)</h2>
      </header>

      <main className="mappage flex m-0 rounded shadow inset-4" role="application">
        <div className={`flex-grow flex-2 m-4 rounded`}>
          <InteractiveMap location={location} pinLocation={setPinnedLocation}  />
        </div>
        {showPanel && <div
          className="info-panel bg-gray-700 text-white font-mono flex-grow flex-1 shadow-black rounded m-4 ml-0 transition ease-in-out delay-150">
          <FarmManagementUnit {...selectedFmu!} />
        </div>}
      </main>
    </div>
  )
}