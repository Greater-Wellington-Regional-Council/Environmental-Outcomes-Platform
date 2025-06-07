import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CompoundFilter from '@components/FilterPanel/Filters/CompoundFilter/CompoundFilter';

describe('CompoundFilter', () => {
  it('renders all dropdowns and buttons', () => {
    render(
      <CompoundFilter
        options={[
          {
            name: 'Field Name',
            options: ['field_name_1', 'field_name_2'],
            allowFreeText: false,
            onSelect: vi.fn(),
          },
          {
            name: 'Condition',
            options: ['=', '!=', '>', '<'],
            allowFreeText: false,
            onSelect: vi.fn(),
          },
          {
            name: 'Field Value',
            options: ['value_1', 'value_2'],
            allowFreeText: false,
            onSelect: vi.fn(),
          },
        ]}
        currentValue={[]}
      />
    );

    expect(screen.getByText('Select Field Name')).toBeInTheDocument();
    expect(screen.getByText('Select Condition')).toBeInTheDocument();
    expect(screen.getByText('Select Field Value')).toBeInTheDocument();
    expect(screen.getByTestId('clear-button')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('calls onChange for the corresponding dropdown when a value is selected', () => {
    const mockFieldNameChange = vi.fn();
    const mockConditionChange = vi.fn();
    const mockFieldValueChange = vi.fn();

    render(
      <CompoundFilter
        options={[
          {
            name: 'Field Name',
            options: ['field_name_1', 'field_name_2'],
            allowFreeText: false,
            onSelect: mockFieldNameChange,
          },
          {
            name: 'Condition',
            options: ['=', '!=', '>', '<'],
            allowFreeText: false,
            onSelect: mockConditionChange,
          },
          {
            name: 'Field Value',
            options: ['value_1', 'value_2'],
            allowFreeText: false,
            onSelect: mockFieldValueChange,
          },
        ]}
        currentValue={undefined}
      />
    );

    fireEvent.click(screen.getByTestId('dropdown-field-name'));
    fireEvent.click(screen.getByText('field_name_1'));
    expect(mockFieldNameChange).toHaveBeenCalledWith('field_name_1');

    fireEvent.click(screen.getByTestId('dropdown-condition'));
    fireEvent.click(screen.getByText('!='));
    expect(mockConditionChange).toHaveBeenCalledWith('!=');

    fireEvent.click(screen.getByTestId('dropdown-field-value'));
    fireEvent.click(screen.getByText('value_2'));
    expect(mockFieldValueChange).toHaveBeenCalledWith('value_2');
  });

  it('clears all dropdown selections when the clear button is clicked', () => {
    render(
      <CompoundFilter
        options={[
          {
            name: 'Field Name',
            options: ['field_name_1', 'field_name_2'],
            allowFreeText: false,
            onSelect: vi.fn(),
          },
          {
            name: 'Condition',
            options: ['=', '!=', '>', '<'],
            allowFreeText: false,
            onSelect: vi.fn(),
          },
          {
            name: 'Field Value',
            options: ['value_1', 'value_2'],
            allowFreeText: false,
            onSelect: vi.fn(),
          },
        ]}
        currentValue={[]}
        clearOn={['Field Name']}
      />
    );

    fireEvent.click(screen.getByTestId('dropdown-field-name'));
    fireEvent.click(screen.getByText('field_name_1'));

    const fieldNameDropdown = screen.getByText('field_name_1');
    expect(fieldNameDropdown).toBeInTheDocument();

    const clearButton = screen.getByTestId('clear-button');
    fireEvent.click(clearButton);

    expect(screen.getByText('Select Field Name')).toBeInTheDocument();
  });

  it('calls onSelect only whether or not there is a value the submit button is clicked', () => {
    const mockOnSubmit = vi.fn();

    render(
      <CompoundFilter
        options={[
          {
            name: 'Field Name',
            options: ['field_name_1', 'field_name_2'],
            allowFreeText: false,
            onSelect: vi.fn(),
          },
          {
            name: 'Condition',
            options: ['=', '!=', '>', '<'],
            allowFreeText: false,
            onSelect: vi.fn(),
          },
          {
            name: 'Field Value',
            options: ['value_1', 'value_2'],
            allowFreeText: false,
            onSelect: vi.fn(),
          },
        ]}
        currentValue={undefined}
        onSelect={mockOnSubmit}
      />
    );

    const submitButton = screen.getByTestId('submit-button');

    fireEvent.click(submitButton);
    expect(mockOnSubmit).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('dropdown-field-name'));
    fireEvent.click(screen.getByText('field_name_1'));

    fireEvent.click(screen.getByTestId('dropdown-condition'));
    fireEvent.click(screen.getByText('!='));

    fireEvent.click(screen.getByTestId('dropdown-field-value'));
    fireEvent.click(screen.getByText('value_2'));

    fireEvent.click(submitButton);
    expect(mockOnSubmit).toHaveBeenCalledWith(['field_name_1', '!=', 'value_2']);
  });
});
