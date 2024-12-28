import React from 'react';
import { FilterProps } from '@components/FilterPanel/FilterPanel';
import MonthYearPicker from '@components/MonthYearPicker';

export const MonthYearFilter: React.FC<FilterProps> = ({ filter, currentValue, onChange }) => {
  const onSelection = (v: unknown) => {
    filter.onChange?.(v);
    onChange?.(filter, v);
  };

  return (
    <MonthYearPicker
      onChange={onSelection}
      dataTestid={`dropdown-months-${filter.name}`}
      current={currentValue as Date}
      className={`bg-transparent p-4 w-[250px] ${filter.className}`}
    />
  );
};
