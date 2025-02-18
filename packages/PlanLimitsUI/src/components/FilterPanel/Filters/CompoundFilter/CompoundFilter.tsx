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
  label?: string;
  multiSelect?: boolean;
  useModifierKeys?: boolean;
}

interface CompoundFilterProps {
  options: DropdownConfig[];
  currentValue?: DataValueType[];
  onSelect?: (values: DataValueType[] | undefined) => void;
  filter?: { name: string; placeholder?: string; className?: string };
  defaultValues?: DataValueType[];
  clearOn?: string[];
  hideSubmitButton?: boolean;
  multiSelect?: boolean;
}

export const CompoundFilter: React.FC<CompoundFilterProps> = ({
  options,
  currentValue = [],
  onSelect,
  filter,
  defaultValues,
  clearOn = [],
  hideSubmitButton = false,
}) => {
  const [values, setValues] = useState<DataValueType[] | undefined>(currentValue);

  const handleSelection = (name: string, value: DropdownValueType | DropdownValueType[]) => {
    const index = options.findIndex((option) => option.name === name);

    const baseValues = clearOn.includes(name)
      ? defaultValues || []
      : values || defaultValues || []

    baseValues[index] = value as DataValueType;
    setValues(baseValues);

    options[index].onSelect?.(baseValues[index] as DataValueType);
  };

  const handleClear = () => {
    setValues(undefined);
    onSelect?.(undefined);
  };

  const handleSubmit = () => {
    if (values && values.every((v: DataValueType) => v != undefined)) {
      onSelect?.(values);
    }
  };

  return (
    <div className="compound-filter flex items-center">
      <div className="compound-filter-item flex items-center">
        {options.map((dropdownConfig, index) => (
          <Dropdown {...dropdownConfig}
            key={dropdownConfig.name}
            options={dropdownConfig.options}
            onChange={(value) => handleSelection(dropdownConfig.name, value)}
            value={values ? values[index] : undefined}
            placeholder={dropdownConfig?.placeholder || filter?.placeholder || `Select ${dropdownConfig.name}`}
            dataTestid={`dropdown-${dropdownConfig.name}`}
            className={`bg-transparent pr-4 ${dropdownConfig.label && index > 0 ? 'pl-0' : 'pr-4' } ${dropdownConfig?.className}`}
            controlClassName="p-2 ${dropdownConfig?.controlClassName}"
          />
        ))}
      </div>
      <button
        type="button"
        onClick={handleClear}
        className="text-gray-500 hover:text-red-500 hover:bg-transparent focus:outline-none border-none p-0"
        data-testid="clear-button"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
      {hideSubmitButton ? <></> : <button
        type="button"
        onClick={handleSubmit}
        disabled={false}
        className="text-gray-500 hover:text-green-500 focus:outline-none border-none p-0"
        data-testid="submit-button"
      >
        <CheckIcon className="h-5 w-5" />
      </button>}
    </div>
  );
};

export default CompoundFilter;
