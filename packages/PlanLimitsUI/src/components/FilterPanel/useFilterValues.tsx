import { useState } from "react";
import _ from 'lodash';
import { SELECT_ALL } from '@components/FilterPanel/FilterPanel';

export const useFilterValues = <T extends Record<string, unknown>>(initialFilters: T) => {
  const [filterValues, setFilterValues] = useState<T>(initialFilters);

  const updateFilterValue = (key: keyof T, value: T[keyof T] | undefined) => {
    setFilterValues((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  // resetFilters accepts an optional array of keys and resets there values
  const resetFilters = (names: (keyof T)[]) => {
    setFilterValues((prevFilters) => {
      const newFilters = { ...prevFilters };
      names.forEach((name) => {
        delete newFilters[name];
      });
      return newFilters;
    });
  };

  const getFilterValue = (filter: keyof T) => {
    const val = _.get(filterValues, filter);
    return (val === SELECT_ALL) ? undefined : val;
  };

  return { filterValues, setFilterValues, getFilterValue, setFilterValue: updateFilterValue, resetFilters };
};
