import React from 'react';
import _, { filter } from 'lodash';
import XToClose from '@components/XToClose/XToClose';
import { DataValueType } from '@components/DataTable/DataTable';

export type SubOptions = {
  name: string;
  options: DataValueType[];
}[];

export interface FilterDescriptor {
  name: string;
  type: React.FC<FilterDescriptor>;
  currentValue?: unknown;
  key?: string;
  columns?: string[];
  valueMatchesFilter?: (value: unknown, filterValue: unknown) => boolean;
  options?:  SubOptions | unknown[];
  placeholder?: string;
  className?: string;
  onChange?: (v: unknown) => void;
  defaultValue?: DataValueType[];
}

export type FilterValues = {
  [key: string]: unknown;
}

export const SELECT_ALL = '(All)';

export const FilterPanel: React.FC<{
  className?: string;
  filters: FilterDescriptor[];
  filterValues: FilterValues;
  setFilterValues: (value: FilterValues) => void;
  onClose: () => void;
  children?: React.ReactNode;
}> = ({ filters, filterValues, setFilterValues, className, onClose, children }) => {
  const handleFilterChange = (filter: FilterDescriptor, value: unknown) => {
    setFilterValues({ ...filterValues, [filter.name]: value });
    filter.onChange?.(value);
  };

  return (
    <div className={`flex space-x-2 ${className}`}>
      {/* Dynamically render each filter */}
      {filters.map((filter: FilterDescriptor, index) =>
        React.createElement(filter.type, { ...filter,
          onChange: (e) => handleFilterChange(filter, e),
          currentValue: _.get(filterValues, filter.name),
          key: `${filter.name}-${index}`,
        } as FilterDescriptor),
      )}

      {/* Close button */}
      {filters?.length ? <XToClose onClick={onClose} /> : <></>}

      <div className="direct-filters">{children}</div>
    </div>
  );
};
