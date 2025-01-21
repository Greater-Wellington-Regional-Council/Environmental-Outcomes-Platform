import React from 'react';
import _ from 'lodash';
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
  label?: string;
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
  onClose?: () => void;
  children?: React.ReactNode;
  label?: string;
}> = ({ filters, filterValues, setFilterValues, className, onClose, children, label }) => {
  const handleFilterChange = (filter: FilterDescriptor, value: unknown) => {
    setFilterValues({ ...filterValues, [filter.name]: value });
    filter.onChange?.(value);
  };

  return (
    <div className={`flex items-center ${className}`}>
      <label className="ml-4 text-lg">{label}</label>

      {filters.map((filter: FilterDescriptor, index) => {
        const filterElement = React.createElement(filter.type, {
          ...filter,
          onChange: (e) => handleFilterChange(filter, e),
          currentValue: _.get(filterValues, filter.name),
          key: `${filter.name}-${index}`,
        } as FilterDescriptor);

        if (filter.label) {
          return (
            <label
              key={`label-${filter.name}-${index}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                marginRight: '1rem',
                fontWeight: 'bold',
              }}
            >
              {filter.label}
              {filterElement}
            </label>
          );
        }

        return filterElement;
      })}

      {/* Close button */}
      {filters?.length && onClose ? <XToClose onClick={onClose} /> : null}

      <div className="direct-filters">{children}</div>
    </div>
  );
};
