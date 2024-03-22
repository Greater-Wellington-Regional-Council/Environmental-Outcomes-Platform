import InteractiveMap from "@components/InteractiveMap";
import {useLoaderData} from "react-router-dom";

export default function MapPage() {
  return (
    <div className="flex" role={"application"}>
      <h1>Farm management</h1>
      <h2>Catchment, context, challenges and values (CCCV)</h2>
      <main className="flex-1">
        <InteractiveMap startLocation={useLoaderData() as ViewLocation}/>
      </main>
    </div>
  )
}
