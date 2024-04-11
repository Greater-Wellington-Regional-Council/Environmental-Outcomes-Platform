import {urlAerialMapStyle, urlTopographicMapStyle} from "@lib/urlsAndPaths.ts";

function MapStyleSelector({ value, onStyleChange, apiKey }: { value: string, onStyleChange: (style: string) => void, apiKey: string}) {
  const styles = [
    { label: 'Aerial', url: urlAerialMapStyle(apiKey) },
    { label: 'Topographic', url: urlTopographicMapStyle(apiKey) },
  ];

  return (
    <select className="map-style-selector border-2 border-1 border-gray-400 text-lg rounded focus:border-0" value={value} onChange={(e) => onStyleChange(e.target.value)}>
      {styles.map((style, index) => (
        <option key={index} value={style.url} className={`text-2xl`}>
          {style.label}
        </option>
      ))}
    </select>
  );
}

export default MapStyleSelector;