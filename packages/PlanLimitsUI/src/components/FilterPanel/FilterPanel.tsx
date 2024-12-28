import React from 'react';
import _ from 'lodash';
import XToClose from '@components/XToClose/XToClose';

export type FilterDescriptor = {
  name: string;
  type: React.FC<{
    filter: FilterDescriptor;
    currentValue: unknown;
    onChange: (filter: FilterDescriptor, value: unknown) => void;
  }>;
  initialValue?: unknown;
  key?: string;
  columns?: string[];
  valueMatchesFilter?: (value: unknown, filterValue: unknown) => boolean;
  options?: unknown[];
  placeholder?: string;
  className?: string;
  onChange?: (v: unknown) => void;
};

export type FilterValues = {
  [key: string]: unknown;
}

export type FilterProps = {
  filter: FilterDescriptor;
  currentValue: unknown;
  onChange: (filter: FilterDescriptor, value: unknown) => void;
};

export const SELECT_ALL = '(All)';

export const FilterPanel: React.FC<{
  className?: string;
  filters: FilterDescriptor[];
  filterValues: FilterValues;
  setFilterValues: (value: FilterValues) => void;
  onClose: () => void;
}> = ({ filters, filterValues, setFilterValues, className, onClose }) => {
  const handleFilterChange = (filter: FilterDescriptor, value: unknown) => {
    setFilterValues({ ...filterValues, [filter.name]: value });
  };

  return (
    <div className={`flex space-x-2 ${className}`}>
      {/* Dynamically render each filter */}
      {filters.map((filter: FilterDescriptor, index) =>
        React.createElement(filter.type, {
          filter,
          onChange: handleFilterChange,
          currentValue: _.get(filterValues, filter.name),
          key: `${filter.name}-${index}`,
        }),
      )}

      {/* Close button */}
      <XToClose onClick={onClose} />
    </div>
  );
};
