import React, { useState } from 'react';
import { FilterDescriptor } from '@components/FilterPanel/FilterPanel';
import { DropdownOption, DropdownValueType } from '@components/Dropdown/Dropdown';
import CompoundFilter from '@components/FilterPanel/Filters/CompoundFilter/CompoundFilter';
import { DataValueType, ColumnDescriptor } from './DataTable';
import { uniq } from 'lodash';
import { Row } from './types';

interface FieldDetails {
  fieldName: string;
  conditions: DropdownOption[];
  values: DropdownValueType[];
}

enum ComparisonOperator {
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
  return Object.values(ComparisonOperator).map(operator => ({
    label: operatorLongNames[operator],
    value: operator,
  }));
}

export const ComplexFilter: React.FC<FilterDescriptor> = (props) => {
  const [filterValues, setFilterValues] = useState<DataValueType[]>(props.currentValue as DataValueType[]);
  const [fieldDetails, setFieldDetails] = useState<FieldDetails | undefined>(undefined);

  const handleNewField = (name: string) => {
    if (name) {
      setFieldDetails(getFieldDetails(name, props.data as Row[]));
      setFilterValues(props.defaultValue || [name, ComparisonOperator.EqualTo, '']);
    }
  };

  const handleSubmit = (values: DataValueType[]) => {
    if (!values[0] || !values[1]) return;
    setFilterValues(values);
    props.onChange?.(values);
  };

  const getFieldDetails = (fieldName: string, data: Row[]) => {
    const fieldData = data.map((row) => row[fieldName]);
    const uniqueValues = uniq(fieldData);
    const conditions = getOperatorOptions();
    return { fieldName, conditions, values: uniqueValues };
  };

  const getCandidateValues = (fieldDetails: FieldDetails) => {
    const values = fieldDetails?.values || [];
    const selectedCondition = filterValues[1] as string;
    const selectedValue = filterValues[2] as DataValueType;
    return ((selectedCondition === '!=')
      ? values.filter((v) => v !== selectedValue)
      : values as DataValueType[]).sort();
  };

  return (
    <div className={`complex-filter ${props.className}`}>
      <CompoundFilter
        filter={{ name: 'complexFilter' }}
        options={[
          {
            name: 'Field Name',
            options: props.columns?.map(c => {
              const cd = c as ColumnDescriptor;
              return { label: cd.heading, value: cd.name } as DropdownOption;
            }) || [],
            allowFreeText: false,
            onSelect: ((fieldName) => handleNewField(fieldName as string)),
            className: 'w-[250px]',
            placeholder: 'Column',
          },
          {
            name: 'Condition',
            options: fieldDetails?.conditions || [],
            allowFreeText: false,
            className: 'w-[200px]',
            placeholder: `eg. ${operatorLongNames[ComparisonOperator.EqualTo]}`,
            onSelect: (v) => setFilterValues([fieldDetails?.fieldName as DataValueType, v, filterValues[2]]),
            label: 'is',
          },
          {
            name: 'Field Value',
            options: (fieldDetails ? getCandidateValues(fieldDetails) : []).map(v => ({ label: v, value: v } as DropdownOption)),
            allowFreeText: true,
            className: 'w-[250px]',
            placeholder: 'Value',
            onSelect: (v) => handleSubmit([fieldDetails?.fieldName as DataValueType, filterValues[1], v]),
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
