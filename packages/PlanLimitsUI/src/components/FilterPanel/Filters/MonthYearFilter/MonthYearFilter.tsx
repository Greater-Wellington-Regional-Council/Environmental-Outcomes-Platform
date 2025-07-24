import React from 'react';
import { FilterDescriptor } from '@components/FilterPanel/FilterPanel';
import MonthYearPicker from '@components/MonthYearPicker';

export const MonthYearFilter: React.FC<FilterDescriptor> = (filter) => {
  return (
    <MonthYearPicker
      onChange={(v) => filter.onChange?.(v as Date)}
      dataTestid={`dropdown-months-${filter.name}`}
      current={filter.currentValue as Date[]}
      className={`bg-transparent p-4 ${filter.className}`}
      label={filter.label}
      multiSelect={filter.multiSelect}
      useModifierKeys={filter.useModifierKeys}
      showLastDayForCurrentMonth={true}
    />
  );
};
