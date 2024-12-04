import './MapStyleSelector.scss'
import {urlAerialMapStyle, urlDefaultMapStyle, urlTopographicMapStyle} from "@lib/urlsAndPaths.ts"
import env from "@src/env.ts"
import {Dispatch, SetStateAction} from "react"


function MapStyleSelector({ onStyleChange, currentStyle }: { onStyleChange: Dispatch<SetStateAction<string>>, currentStyle?: string }) {
  const defaultStyle = currentStyle ?? urlDefaultMapStyle(env.LINZ_API_KEY)

  const styles = [
    { label: 'Topographic', url: urlTopographicMapStyle(env.LINZ_API_KEY) },
    { label: 'Aerial', url: urlAerialMapStyle(env.LINZ_API_KEY) },
  ].sort((a, b) => a.url == defaultStyle ? -1 : b.url == defaultStyle ? 1 : 0)

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