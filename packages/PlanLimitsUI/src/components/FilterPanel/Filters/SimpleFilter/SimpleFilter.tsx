import React from 'react';
import Dropdown from '@components/Dropdown/Dropdown';
import { FilterProps, SELECT_ALL } from '@components/FilterPanel/FilterPanel';

export const SimpleFilter: React.FC<FilterProps> = ({ filter, currentValue, onChange }) => {
  const onSelection = (value: string) => onChange?.(filter, value);

  return (
    <Dropdown
      options={[SELECT_ALL, ...(filter.options || [])]}
      onChange={onSelection}
      value={currentValue as string}
      placeholder={filter.placeholder || SELECT_ALL}
      dataTestid={`dropdown-${filter.name}`}
      className={`bg-transparent p-4 w-[250px] ${filter.className}`}
      controlClassName={'p-2'}
    />
  );
};
