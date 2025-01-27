import React from 'react';
import Dropdown, { DropdownValueType } from '@components/Dropdown/Dropdown';
import { FilterDescriptor, SELECT_ALL } from '@components/FilterPanel/FilterPanel';

export const SimpleFilter: React.FC<FilterDescriptor> = ({ currentValue, onChange, options, name, className, placeholder }) => {
  const onSelection = (value: DropdownValueType) => onChange?.(value);

  return (
    <Dropdown
      options={[SELECT_ALL, ...(options || [])]}
      onChange={onSelection}
      value={currentValue as string}
      placeholder={placeholder || SELECT_ALL}
      dataTestid={`dropdown-${name}`}
      className={`bg-transparent p-4 w-[250px] ${className}`}
      controlClassName={'p-2'}
    />
  );
};
