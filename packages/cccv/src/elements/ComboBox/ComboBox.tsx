import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import _ from 'lodash';
import {MagnifyingGlassIcon} from "@heroicons/react/16/solid";

export interface ComboBoxProps {
  initialValue?: string;
  label?: string;
  placeholder?: string;
  options: OptionsFunction | OptionsArray | string[];
  onSelect: (value: string) => void;
  className?: string;
  buttonStyle?: CSSProperties | undefined;
  directionUp?: boolean; // New prop for direction
}

export type OptionsFunction = (query: string) => Promise<LabelAndValue[]>;

export type OptionsArray = LabelAndValue[];

export interface LabelAndValue { label: string; value: unknown }

const ComboBox: React.FC<ComboBoxProps> = ({ initialValue = null, label = "Select item", placeholder= "Select item", options, onSelect, className = null, buttonStyle = null, directionUp = false }) => {
  const [query, setQuery] = useState(initialValue || '');
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (options instanceof Function) {
      if (query.length === 0) {
        setFilteredOptions([]);
      } else if (query.length < 3) {
        options(query).then((options) => setFilteredOptions(options.map(option => option.label.toLowerCase())));
      } else {
        setFilteredOptions(filteredOptions.filter(option => option.toLowerCase().includes(query.toLowerCase())));
      }
  } else {
      if(query.length === 0) {
        setFilteredOptions([]);
      } else if (query.length < 2) {
        setFilteredOptions((options as never[]).filter(option =>
          (_.get(option, "label", option) as string).toLowerCase().includes(query.toLowerCase())));
      } else {
        setFilteredOptions(filteredOptions.filter(option => option.toLowerCase().includes(query.toLowerCase())));
      }
    }
  }, [query, options]);

  return (
    <div className={`relative aria-label=${label} ${className}`}>
      <div ref={inputContainerRef} className="flex">
        <input
          className={_.join([`mt-1 block text-nui w-48 py-2 px-3 border-nui border-[2.3px] border-r-0 bg-white shadow-sm focus:outline-none focus:ring-nui-500 focus:border-nui sm:text-sm`, className])}
          type="search"
          placeholder={placeholder}
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, borderBottomLeftRadius: "6px", borderTopLeftRadius: "6px", borderRight: 'none' }}
        />
        <button
          type="button"
          className="flex bg-white items-center mt-1 py-2 px-3 hover:text-white border-[2.3px]"
          onClick={() => onSelect(query)}
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: 'none', ...buttonStyle }}
        >
          <MagnifyingGlassIcon className="h-6 border-none ml-2 mr-2 text-nui hover:text-white" />
        </button>
      </div>
      {filteredOptions.length > 0 && (
        <div
          id="options_list"
          className={`absolute bg-white border-none z-10 ${directionUp ? 'bottom-full' : 'top-full'} w-auto`}
          style={{ minWidth: inputContainerRef.current ? inputContainerRef.current.offsetWidth : 'auto' }}
        >
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => {
                onSelect(option);
                setQuery(option);
                setFilteredOptions([]);
              }}
              className={`cursor-pointer p-2 bg-nui text-white border-b-2 border-white hover:bg-kaitoke hover:text-white ${option.toLowerCase() === query.toLowerCase() ? 'bg-kapiti' : ''}`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComboBox;
