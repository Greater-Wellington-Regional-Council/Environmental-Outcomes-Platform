import "./ComboBox.scss";
import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import _ from 'lodash';
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

export interface ComboBoxProps {
  initialValue?: string;
  label?: string;
  placeholder?: string;
  options: OptionsFunction | OptionsArray | LabelAndValue[];
  onSelect: (option: LabelAndValue | null) => void;
  className?: string;
  buttonStyle?: CSSProperties | undefined;
  directionUp?: boolean; // New prop for direction
}

export type OptionsFunction = (query: string) => Promise<LabelAndValue[]>;

export type OptionsArray = LabelAndValue[];

export interface LabelAndValue { label: string; value: unknown }

const ComboBox: React.FC<ComboBoxProps> = ({
   initialValue = null,
   label = "Select item",
   placeholder = "Select item",
   options,
   onSelect,
   className = null,
   buttonStyle = null,
   directionUp = false
 }) => {
  const [query, setQuery] = useState(initialValue || '');
  const [filteredOptions, setFilteredOptions] = useState<LabelAndValue[]>([]);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (options instanceof Function) {
      if (query.length === 0) {
        setFilteredOptions([]);
      } else if (query.length > 2) {
        options(query).then((options) => setFilteredOptions(options));
      }
    } else {
      if (query.length < 3) {
        filteredOptions?.length && setFilteredOptions([]);
      } else if (query.length < 5) {
        setFilteredOptions((options as never[]).filter(option =>
          (_.get(option, "label", option) as string).toLowerCase().includes(query.toLowerCase())));
      } else {
        setFilteredOptions(filteredOptions.filter(option => option.label.toLowerCase().includes(query.toLowerCase())));
      }
    }
  }, [query, options]);

  const selectedOption = (o: string | null): LabelAndValue | null =>
     filteredOptions.find(option => option.label.toLowerCase() === o?.toLowerCase()) || null;

  return (
    <div className={`relative ${className}`} aria-label={label} >
      <div ref={inputContainerRef} className="flex">
        <input
          className={`input-field mt-1 block text-nui w-full py-2 px-3 border-nui border-[2.3px] border-r-0 bg-white shadow-sm focus:outline-none focus:ring-nui-500 focus:border-nui sm:text-sm ${className}`}
          type="search"
          placeholder={placeholder}
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, borderBottomLeftRadius: "6px", borderTopLeftRadius: "6px", borderRight: 'none' }}
        />
        <button
          type="button"
          className="flex bg-white items-center mt-1 py-2 px-3 hover:text-textDefault hover:bg-white border-[2.3px]"
          onClick={() => onSelect(selectedOption(query))}
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: 'none', ...buttonStyle }}
        >
          <MagnifyingGlassIcon className="h-6 border-none ml-2 mr-2 text-nui" />
        </button>
      </div>

      {filteredOptions.length > 0 && (
        <div
          id="options_list"
          className={`absolute bg-transparent border-none z-10 ${directionUp ? 'bottom-full' : 'top-full'} w-auto`}
          style={{ minWidth: inputContainerRef.current ? inputContainerRef.current.offsetWidth : 'auto' }}
        >
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => {
                setQuery("");
                onSelect(option);
                setFilteredOptions([option]);
              }}
              className={`cursor-pointer p-2 bg-gray-100 shadow rounded text-textDefault hover:bg-nui hover:text-white ${option.label.toLowerCase() === query.toLowerCase() ? 'bg-nui' : ''}`}
              style={{
                whiteSpace: 'nowrap',
                marginTop: index === 0 ? '0' : '2px',
                marginBottom: index === filteredOptions.length - 1 ? '0' : '2px'
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComboBox;
