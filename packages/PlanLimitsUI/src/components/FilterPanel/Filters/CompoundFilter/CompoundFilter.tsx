import React, { useState } from 'react';
import Dropdown, { DropdownOption, DropdownValueType } from '@components/Dropdown/Dropdown';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { DataValueType } from '@components/DataTable/DataTable';

interface DropdownConfig {
  name: string;
  options: DropdownOption[] | string[];
  allowFreeText: boolean;
  onSelect?: (value: DataValueType) => void;
  className?: string;
  controlClassName?: string;
  placeholder?: string;
}

interface CompoundFilterProps {
  options: DropdownConfig[];
  currentValue?: DataValueType[];
  onSelect?: (values: DataValueType[]) => void;
  filter?: { name: string; placeholder?: string; className?: string };
  defaultValues?: DataValueType[];
  clearOn?: string[];
}

export const CompoundFilter: React.FC<CompoundFilterProps> = ({
                                                                options,
                                                                currentValue = [],
                                                                onSelect,
                                                                filter,
                                                                defaultValues,
                                                                clearOn = [],
                                                              }) => {
  const [values, setValues] = useState<DataValueType[]>(currentValue);

  const handleSelection = (name: string, value: DropdownValueType) => {
    const updatedValues = (clearOn.includes(name)) ?
      defaultValues || Array(options.length).fill(undefined)
      : [...values];

    const index = options.findIndex((option) => option.name === name);

    updatedValues[index] = value as DataValueType;
    setValues(updatedValues);

    options[index].onSelect?.(value as DataValueType);
  };

  const handleClear = () => {
    const clearedValues = defaultValues || Array(options.length).fill(undefined);
    setValues(clearedValues);
  };

  const handleSubmit = () => {
    if (values.filter((value) => value !== undefined).length == options.length)
      onSelect?.(values);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex space-x-4">
        {options.map((dropdownConfig, index) => (
          <Dropdown
            key={dropdownConfig.name}
            options={dropdownConfig.options}
            onChange={(value) => handleSelection(dropdownConfig.name, value)}
            value={values[index] as string | null}
            placeholder={dropdownConfig?.placeholder || filter?.placeholder || `Select ${dropdownConfig.name}`}
            allowFreeText={dropdownConfig.allowFreeText}
            dataTestid={`dropdown-${dropdownConfig.name}`}
            className={`bg-transparent p-4 ${dropdownConfig?.className}`}
            controlClassName="p-2 ${dropdownConfig?.controlClassName}"
          />
        ))}
      </div>
      <button
        type="button"
        onClick={handleClear}
        className="text-gray-500 hover:text-red-500 focus:outline-none border-none p-0"
        data-testid="clear-button"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={values.filter((value) => value !== undefined).length !== options.length}
        className="text-gray-500 hover:text-green-500 focus:outline-none border-none p-0"
        data-testid="submit-button"
      >
        <CheckIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CompoundFilter;
