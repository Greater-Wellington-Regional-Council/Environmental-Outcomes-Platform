import React, { useState } from 'react';
import { FilterDescriptor } from '@components/FilterPanel/FilterPanel';
import {
  DropdownOption,
  DropdownValueType,
} from '@components/Dropdown/Dropdown';
import CompoundFilter from '@components/FilterPanel/Filters/CompoundFilter/CompoundFilter';
import { DataValueType, ColumnDescriptor } from './DataTable';
import { uniq } from 'lodash';
import { Row } from './types';
import { isNumber } from '@lib/numValue';

interface FieldDetails {
  fieldName: string;
  conditions: DropdownOption[];
  values: DropdownValueType[];
}

export enum ComparisonOperator {
  EqualTo = '=',
  NotEqualTo = '!=',
  GreaterThan = '>',
  LessThan = '<',
  GreaterThanOrEqualTo = '>=',
  LessThanOrEqualTo = '<=',
}

const operatorLongNames: { [key in ComparisonOperator]: string } = {
  [ComparisonOperator.EqualTo]: 'Equal to',
  [ComparisonOperator.NotEqualTo]: 'Not equal to',
  [ComparisonOperator.GreaterThan]: 'Greater than',
  [ComparisonOperator.LessThan]: 'Less than',
  [ComparisonOperator.GreaterThanOrEqualTo]: 'Greater than or equal to',
  [ComparisonOperator.LessThanOrEqualTo]: 'Less than or equal to',
};

function getOperatorOptions() {
  return Object.values(ComparisonOperator).map((operator) => ({
    label: operatorLongNames[operator],
    value: operator,
  }));
}

export const ComplexFilter: React.FC<FilterDescriptor> = (props) => {
  const [filterValues, setFilterValues] = useState<DataValueType[] | undefined>(
    props.currentValue as DataValueType[],
  );
  const [fieldDetails, setFieldDetails] = useState<FieldDetails | undefined>(
    undefined,
  );

  const fieldSupportsOperator = (
    operator: ComparisonOperator,
    fieldName: string,
    fieldData: DataValueType[],
  ): boolean =>
    typeof props.fieldSupportsOperator === 'function'
      ? props.fieldSupportsOperator(operator, fieldName, fieldData)
      : true;

  const handleNewField = (name: string | undefined) => {
    if (name) {
      setFieldDetails(getFieldDetails(name, props.data as Row[]));
      props.onChange?.(undefined);
    }
  };

  const handleSubmit = (values: DataValueType[] | undefined) => {
    setFilterValues(values);
    if (values && !values?.every((v) => v !== undefined)) return;
    props.onChange?.(values);
  };

  const getFieldDetails = (fieldName: string, data: Row[]) => {
    const fieldData = data.map((row) => row[fieldName]);
    const conditions = getOperatorOptions().filter((condition) =>
      fieldSupportsOperator(condition.value, fieldName, fieldData),
    );
    const uniqueValues = uniq(fieldData);
    return { fieldName, conditions, values: uniqueValues };
  };

  const getCandidateValues = (fieldDetails: FieldDetails) => {
    const values = fieldDetails?.values || [];
    const selectedCondition = filterValues
      ? (filterValues[1] as string)
      : undefined;
    const selectedValue = filterValues
      ? (filterValues[2] as DataValueType)
      : undefined;
    return (
      selectedCondition === '!='
        ? values.filter((v) => v !== selectedValue)
        : (values as DataValueType[])
    ).sort();
  };

  return (
    <div className={`complex-filter ${props.className}`}>
      <CompoundFilter
        filter={{ name: 'complexFilter' }}
        options={[
          {
            name: 'Field Name',
            options:
              props.columns?.map((c) => {
                const cd = c as ColumnDescriptor;
                return { label: cd.heading, value: cd.name } as DropdownOption;
              }) || [],
            allowFreeText: false,
            onSelect: (fieldName) => handleNewField(fieldName as string),
            className: 'min-w-[250px]',
            placeholder: 'Column',
          },
          {
            name: 'Condition',
            options: fieldDetails?.conditions || [],
            allowFreeText: false,
            className: 'w-[200px]',
            placeholder: `eg. ${operatorLongNames[ComparisonOperator.EqualTo]}`,
            onSelect: (v) =>
              handleSubmit([
                fieldDetails?.fieldName as DataValueType,
                v,
                filterValues ? filterValues[2] : undefined,
              ]),
            label: 'is',
          },
          {
            name: 'Field Value',
            options: (fieldDetails ? getCandidateValues(fieldDetails) : []).map(
              (v) =>
                ({
                  label: isNumber(v)
                    ? v?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : v,
                  value: v,
                }) as DropdownOption,
            ),
            allowFreeText: true,
            className: 'min-w-[100px]',
            placeholder: 'Value',
            onSelect: (v) =>
              handleSubmit([
                fieldDetails?.fieldName as DataValueType,
                filterValues ? filterValues[1] : undefined,
                v,
              ]),
            multiSelect:
              filterValues &&
              [
                ComparisonOperator.EqualTo,
                ComparisonOperator.NotEqualTo,
              ].includes(filterValues[1] as ComparisonOperator),
            useModifierKeys: true,
          },
        ]}
        currentValue={filterValues}
        defaultValues={props.defaultValue as DataValueType[]}
        onSelect={handleSubmit}
        clearOn={['Field Name']}
        hideSubmitButton={true}
      />
    </div>
  );
};

export default ComplexFilter;
