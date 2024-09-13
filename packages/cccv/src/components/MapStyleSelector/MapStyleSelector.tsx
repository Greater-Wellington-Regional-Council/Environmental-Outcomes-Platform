import './MapStyleSelector.scss'
import {urlAerialMapStyle, urlTopographicMapStyle} from "@lib/urlsAndPaths.ts"
import env from "@src/env.ts"
import {Dispatch, SetStateAction} from "react"


function MapStyleSelector({ onStyleChange }: { onStyleChange: Dispatch<SetStateAction<string>> }) {
  const styles = [
    { label: 'Topographic', url: urlTopographicMapStyle(env.LINZ_API_KEY) },
    { label: 'Aerial', url: urlAerialMapStyle(env.LINZ_API_KEY) },
  ]

  return (
    <select className="map-style-selector focus:outline-none focus:m-0" onChange={(e) => onStyleChange(e.target.value)}>
      {styles.map((style, index) => (
        <option key={index} value={style.url}>
          {style.label}
        </option>
      ))}
    </select>
  )
}

export default MapStyleSelector