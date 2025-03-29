import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dropdown, { simpleStringOptions } from './Dropdown';


const options = simpleStringOptions(['Apple', 'Banana', 'Cherry']);

describe('Dropdown Component', () => {
  it('renders a dropdown with the given list', () => {
    render(<Dropdown options={options} onChange={v => console.log(v)} />);
    fireEvent.click(screen.getByRole('combobox'));
    options.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('includes selectAll as a label and option when provided', () => {
    render(<Dropdown options={options} selectAll="Select All" onChange={v => console.log(v)} />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Select All')).toBeInTheDocument();
  });

  it('initialises with the given value', () => {
    render(<Dropdown options={options} value={"Banana"} onChange={v => console.log(v)} />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByTestId('selected-Banana')).toBeInTheDocument();
  });

  it('calls onChange when a selection is made', () => {
    const onChange = vi.fn();
    render(<Dropdown options={options} onChange={onChange} />);

    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByTestId('option-Cherry'));
    expect(onChange).toHaveBeenCalledWith('Cherry');
  });

  it('includes a free text field when allowFreeText is true', () => {
    render(<Dropdown options={options} allowFreeText onChange={v => console.log(v)} />);

    fireEvent.click(screen.getByRole('combobox'));
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renders the label and associates it via aria-labelledby', () => {
    render(
      <>
        <Dropdown options={options} label="dropdownLabel" onChange={v => console.log(v)} />
      </>
    );

    const label = screen.getByText('dropdownLabel');
    const dropdown = screen.getByTestId('dropdown-div');

    expect(dropdown).toHaveAttribute('aria-labelledby', label.id);
  });

  it('suppresses select all if suppressSelectAll is true', () => {
    render(<Dropdown options={options} selectAll="Select All" suppressSelectAll onChange={v => console.log(v)} />);
    expect(screen.queryByText('Select All')).not.toBeInTheDocument();
  });

  it('calls onChange with just the last selection when multiSelect is false (default)', () => {
    const onChange = vi.fn();
    render(<Dropdown options={options} onChange={onChange} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByTestId('option-Apple'));
    expect(onChange).toHaveBeenCalledWith('Apple');
  });

  it('calls onChange with all selected values when multiSelect is true', () => {
    const onChange = vi.fn();
    render(<Dropdown options={options} multiSelect onChange={onChange} value={["Apple"]} />);

    // Simulate ctrl-click or similar multiple selection
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByTestId('option-Banana'));
    expect(onChange).toHaveBeenCalledWith(['Apple', 'Banana']);
  });

  //TODO: Uncomment and fix this test
  //
  // it('selects multiple items with ctrl-click', async () => {
  //   const onChange = vi.fn();
  //   const user = userEvent.setup();
  //
  //   render(
  //     <Dropdown
  //       options={['Apple', 'Banana']}
  //       multiSelect
  //       useModifierKeys
  //       onChange={onChange}
  //     />
  //   );
  //
  //   await user.click(screen.getByRole('combobox'));
  //   user.pointer({ keys: '[Control]', target: screen.getByTestId('option-Apple') });
  //   user.pointer({ keys: '[Control]', target: screen.getByTestId('option-Banana') });
  //
  //   expect(onChange).toHaveBeenNthCalledWith(1, 'Apple');
  //   expect(onChange).toHaveBeenNthCalledWith(2, ['Apple', 'Banana']);
  // });
});
