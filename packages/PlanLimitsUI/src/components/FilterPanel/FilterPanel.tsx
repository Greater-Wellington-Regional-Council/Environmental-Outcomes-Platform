import React from 'react';
import _ from 'lodash';
import XToClose from '@components/XToClose/XToClose';
import { DataValueType } from '@components/DataTable/DataTable';

export type SubOptions = {
  name: string;
  options: DataValueType[];
}[];

const FilterIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 0 1 1.541 1.836v1.044a3 3 0 0 1-.879 2.121l-6.182 6.182a1.5 1.5 0 0 0-.439 1.061v2.927a3 3 0 0 1-1.658 2.684l-1.757.878A.75.75 0 0 1 9.75 21v-5.818a1.5 1.5 0 0 0-.44-1.06L3.13 7.938a3 3 0 0 1-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836Z" clipRule="evenodd" />
  </svg>
)

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
  labelInline?: boolean;
}> = ({ filters, filterValues, setFilterValues, className, onClose, children, label, labelInline = true }) => {
  const handleFilterChange = (filter: FilterDescriptor, value: unknown) => {
    setFilterValues({ ...filterValues, [filter.name]: value });
    filter.onChange?.(value);
  };

  return (
    <div className={className}>
      {label && !labelInline && (
        <label className="block mb-[-0.8rem] font-bold text-lg">
          {label}
        </label>
      )}

      <div className={`flex items-center mb-2 ${!labelInline ? 'justify-start' : ''}`}>
        {label && labelInline && (<span>
          <label className="mr-4 text-lg inline-flex">
            <FilterIcon className="w-5 h-5 mr-4 ml-2" />
            {label}
          </label>
        </span>)}

        {filters.map((filter: FilterDescriptor, index) => {
        const filterElement = React.createElement(filter.type, {
          ...filter,
          onChange: (e) => handleFilterChange(filter, e),
          currentValue: _.get(filterValues, filter.name),
          key: `${filter.name}-${index}`,
          className: `${(index == 0 && !filter.label) ? "pl-0" : ''}`,
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
      </div>
  );
};
