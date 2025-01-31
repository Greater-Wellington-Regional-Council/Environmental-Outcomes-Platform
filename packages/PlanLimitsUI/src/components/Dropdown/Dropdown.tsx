import React, { FC, useState, useEffect, useRef } from 'react';
import { isArray, isObject } from 'lodash';
import arrowSvg from '@images/icon_chevronDown.svg';
import { DataValueType } from '@components/DataTable/DataTable';

export type DropdownValueType = string | number | null | undefined | DataValueType;

export type DropdownOption = {
  label: string;
  value: DropdownValueType;
};

interface DropdownProps {
  options: unknown[];
  selectAll?: string;
  placeholder: string | React.ReactNode;
  value: DropdownValueType | DropdownValueType[];
  onChange: (value: DropdownValueType | DropdownValueType[]) => void;
  arrow?: React.ReactNode;
  className?: string;
  controlClassName?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  placeholderClassName?: string;
  dataTestid?: string;
  allowFreeText?: boolean;
  sortOptions?: boolean | undefined;
  label?: string | undefined;
  suppressSelectAll?: boolean;
  multiSelect?: boolean;
}

const Dropdown: FC<DropdownProps> = ({
                                       options,
                                       selectAll,
                                       placeholder,
                                       value,
                                       onChange,
                                       arrow,
                                       className = '',
                                       controlClassName = '',
                                       dropdownClassName = '',
                                       optionClassName = '',
                                       placeholderClassName = '',
                                       dataTestid = 'dropdown-control',
                                       allowFreeText = false,
                                       label,
                                       suppressSelectAll = false,
                                       multiSelect = false,
                                     }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<DataValueType>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const formatOptions = (givenOptions: unknown[]) => {
    if (!givenOptions) return [];
    if (isArray(givenOptions) && !isObject(givenOptions[0])) {
      return simpleStringOptions(givenOptions);
    }
    const baseOptions = givenOptions as DropdownOption[];
    return selectAll && !suppressSelectAll
      ? [{ label: selectAll, value: null }, ...baseOptions]
      : baseOptions;
  };

  const selectOptions = formatOptions(options);

  const toggleDropdown = () => setIsOpen(!isOpen);

  /**
   * Determine if an option is selected (works for single or multi).
   */
  const isOptionSelected = (optionValue: DropdownValueType) => {
    if (!multiSelect) {
      return value === optionValue;
    }
    if (Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return false;
  };

  /**
   * Toggle or select an option depending on multiSelect state.
   */
  const handleOptionClick = (optionValue: DropdownValueType) => {
    if (!multiSelect) {
      onChange(optionValue ?? '');
      setIsOpen(false);
    } else {
      const currentValueArray = Array.isArray(value) ? [...value] : [];
      const index = currentValueArray.indexOf(optionValue);

      if (index >= 0) {
        currentValueArray.splice(index, 1);
      } else {
        currentValueArray.push(optionValue);
      }
      onChange(currentValueArray);
      // For multi-select, we often keep it open:
      // setIsOpen(false);
    }
  };

  /**
   * Handle free text submit:
   * In multiSelect mode, appended to array.
   * In single-select, it becomes the single value.
   */
  const handleFreeTextSubmit = () => {
    if (inputValue !== undefined && inputValue !== '') {
      if (multiSelect) {
        const currentValueArray = Array.isArray(value) ? [...value] : [];
        currentValueArray.push(inputValue);
        onChange(currentValueArray);
      } else {
        onChange(inputValue);
        setIsOpen(false);
      }
      setInputValue('');
    }
  };

  return (
    <div className={`dropdown relative font-bold bg-transparent inline-flex items-center ${className}`}>
      <label className={`text-nui font-bold ${label ? 'block max-w-fit' : 'hidden'} pl-0 pr-4`}>
        {label}
      </label>
      <div ref={dropdownRef} className="relative font-bold bg-transparent w-full">
        <div
          className={`dropdown-control flex p-2 top-18 font-bold bg-white rounded-xl border-[2px] border-nui ${controlClassName}`}
          onClick={toggleDropdown}
          data-testid={dataTestid}
        >
          <div className="dropdown-value flex w-full items-center text-left pr-2">
            {multiSelect ? (
              Array.isArray(value) && value.length > 0 ? (
                <span className="w-full">
                  {selectOptions
                    .filter((option) => value.includes(option.value))
                    .map((option) => option.label)
                    .join(', ')}
                </span>
              ) : (
                <span className={`text-nui font-light italic ${placeholderClassName}`}>
                  {placeholder}
                </span>
              )
            ) : value ? (
              <span className="w-full" data-testid={`selected-${value.toString()}`}>
                <>{selectOptions.find((option) => option.value === value)?.label || value}</>
              </span>
            ) : (
              <span className={`text-nui font-light italic ${placeholderClassName}`}>
                {placeholder}
              </span>
            )}
          </div>
          <div>{arrow || <DefaultArrow isOpen={isOpen} />}</div>
        </div>

        {isOpen && (
          <div
            className={`dropdown-list-container absolute indent-0 z-10 pt-1 px-0 m-0 mt-2 rounded border border-nui bg-white ${dropdownClassName}`}
          >
            {/* Free text box moved to the top */}
            {allowFreeText && (
              <div className="p-2 border-b border-gray-300">
                <input
                  type="text"
                  className="w-full px-2 py-1 border rounded"
                  value={inputValue as string | number | readonly string[] | undefined}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFreeTextSubmit()}
                  placeholder="Enter..."
                />
              </div>
            )}

            {/* Use max-h-64 and overflow-y-auto to avoid scrollbars when not needed */}
            <div className="list-options max-h-200 overflow-y-auto min-w-max">
              <ul className="m-0 p-0 w-full">
                {selectOptions.map((option) => {
                  const selected = isOptionSelected(option.value);
                  return (
                    <li
                      key={`${option.value}`}
                      className={`indent-0 m-0 pl-2 px-4 py-2 hover:bg-nui hover:text-white cursor-pointer list-none text-left
                        ${selected ? 'bg-nui text-white' : ''}
                        ${optionClassName}
                      `}
                      onClick={() => handleOptionClick(option.value)}
                      data-testid={`option-${option.label}`}
                    >
                      {option.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DefaultArrow: FC<{ isOpen: boolean; className?: string }> = ({ isOpen, className }) => (
  <img
    src={arrowSvg}
    alt="Arrow icon"
    style={{
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s ease',
      strokeWidth: 0,
    }}
    className={`mt-1.5 stroke-green-50 ${className ?? ''}`}
  />
);

export const simpleStringOptions = (opts: unknown[]) => {
  return opts.map((opt) => ({
    label: opt?.toString(),
    value: opt?.toString(),
  })) as DropdownOption[];
};

export default Dropdown;
