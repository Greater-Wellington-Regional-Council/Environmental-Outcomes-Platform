import React, { FC, useState, useEffect, useRef } from 'react';
import { isArray, isObject } from 'lodash';
import arrowSvg from '@images/icon_chevronDown.svg';
import { DataValueType } from '@components/DataTable/DataTable';
import randomString from '@lib/randomeString';
import hyphenCase from '@lib/hyphenCase';

export type DropdownValueType =
  | string
  | number
  | null
  | undefined
  | DataValueType;

export type DropdownOption = {
  label: string;
  value: DropdownValueType;
};

interface DropdownProps {
  options: unknown[];
  selectAll?: string;
  placeholder?: string | React.ReactNode;
  value?: DropdownValueType | DropdownValueType[];
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
  /**
   * When true and multiSelect is also true, selection uses CTRL/SHIFT logic:
   * - SHIFT + click => Select contiguous items from last focus item
   * - CTRL + click => Toggle clicked item in selection
   * - Regular click => Replace selection with clicked item
   */
  useModifierKeys?: boolean;
}

const Dropdown: FC<DropdownProps> = ({
  options,
  selectAll,
  placeholder = 'Select...',
  value = undefined,
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
  useModifierKeys = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<DataValueType>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * For SHIFT-click logic in multiSelect mode with modifier keys:
   * This tracks the last "anchor" (or "focus") index.
   */
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
   * Helper: toggles optionValue in an array of selected values
   */
  const toggleValueInArray = (
    currentArray: DropdownValueType[],
    optionValue: DropdownValueType,
  ) => {
    const index = currentArray.indexOf(optionValue);
    if (index >= 0) {
      // Remove it
      return [
        ...currentArray.slice(0, index),
        ...currentArray.slice(index + 1),
      ];
    } else {
      // Add it
      return [...currentArray, optionValue];
    }
  };

  /**
   * Helper: get new selection by SHIFT-click from focusIndex => newIndex
   */
  const shiftRangeSelection = (
    currentArray: DropdownValueType[],
    focusIdx: number,
    newIdx: number,
  ) => {
    // We assume focusIdx/newIdx are valid array indices
    const start = Math.min(focusIdx, newIdx);
    const end = Math.max(focusIdx, newIdx);
    const rangeValues = selectOptions
      .slice(start, end + 1)
      .map((option) => option.value);

    // Union of currentArray and the new range
    const union = new Set([...currentArray, ...rangeValues]);
    return Array.from(union);
  };

  /**
   * The master click handler for an option, handling shift/ctrl logic if
   * useModifierKeys and multiSelect are both true.
   */
  const handleOptionClick = (
    optionValue: DropdownValueType,
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
  ) => {
    event.preventDefault();

    if (!multiSelect) {
      // Single-select behavior remains the same as original
      onChange(optionValue ?? '');
      setIsOpen(false);
      return;
    }

    // If multiSelect but no useModifierKeys, fallback to original multiSelect toggle
    if (!useModifierKeys) {
      const currentValueArray = Array.isArray(value) ? [...value] : [];
      const newValueArray = toggleValueInArray(currentValueArray, optionValue);
      onChange(newValueArray);
      return;
    }

    // If we get here, multiSelect = true AND useModifierKeys = true
    const { shiftKey, ctrlKey, metaKey } = event; // metaKey is for Mac "command" key
    const currentValueArray = Array.isArray(value) ? [...value] : [];

    // Find the index of the clicked item in selectOptions
    const newIndex = selectOptions.findIndex(
      (opt) => opt.value === optionValue,
    );

    let newSelection: DropdownValueType[];

    if (shiftKey && focusIndex !== null) {
      // SHIFT + click: select contiguous range from focusIndex to newIndex
      newSelection = shiftRangeSelection(
        currentValueArray,
        focusIndex,
        newIndex,
      );
    } else if (shiftKey && focusIndex === null) {
      // SHIFT + click but no focusIndex yet => treat like a single click
      newSelection = [optionValue];
    } else if (ctrlKey || metaKey) {
      // CTRL or CMD + click: toggle
      newSelection = toggleValueInArray(currentValueArray, optionValue);
    } else {
      // No modifier: replace selection with just this item
      newSelection = [optionValue];
      setIsOpen(false);
    }

    // Update selection
    onChange(newSelection);

    // Always update the focusIndex to the newly clicked item
    setFocusIndex(newIndex);
  };

  /**
   * Handle free text submit:
   * In multiSelect mode, appended to array.
   * In single-select mode, it becomes the single value.
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

  const labelId = label
    ? `${label.replace(/\s+/g, '-')}-dropdown-label-${randomString(5)}`
    : undefined;

  return (
    <div
      className={`dropdown relative font-bold bg-transparent inline-flex items-center ${className}`}
    >
      <label
        className={`text-nui font-bold ${label ? 'block max-w-fit' : 'hidden'} pl-0 pr-4`}
        id={labelId}
      >
        {label}
      </label>
      <div
        ref={dropdownRef}
        data-testid="dropdown-div"
        className="dropdown-div relative font-bold bg-transparent w-full"
        aria-labelledby={labelId}
      >
        <div
          className={`dropdown-control flex p-2 top-18 font-bold bg-white rounded-xl border-[2px] border-nui ${controlClassName}`}
          onClick={toggleDropdown}
          role="combobox"
          data-testid={hyphenCase(dataTestid)}
        >
          <div className="dropdown-value flex w-full items-center text-left pr-2">
            {multiSelect ? (
              Array.isArray(value) && value.length > 0 ? (
                <span className="w-full">
                  {
                    // Show the last selected label plus "..."
                    selectOptions
                      .filter((option) => value.includes(option.value))
                      .map((option) => option.label)
                      .at(0) + (value.length > 1 ? '...' : '')
                  }
                </span>
              ) : (
                <span
                  className={`text-nui font-light italic ${placeholderClassName}`}
                >
                  {placeholder}
                </span>
              )
            ) : value ? (
              <span
                className="w-full"
                data-testid={`selected-${value.toString()}`}
              >
                <>
                  {selectOptions.find((option) => option.value === value)
                    ?.label || value}
                </>
              </span>
            ) : (
              <span
                className={`text-nui font-light italic ${placeholderClassName}`}
              >
                {placeholder}
              </span>
            )}
          </div>
          <div>{arrow || <DefaultArrow isOpen={isOpen} />}</div>
        </div>

        {isOpen && (
          <div
            className={`dropdown-list-container max-h-[40rem] overflow-y-scroll absolute indent-0 z-10 pt-1 px-0 m-0 mt-2 rounded border border-nui bg-white ${dropdownClassName}`}
          >
            {/* Free text box */}
            {allowFreeText && (
              <div className="p-2 border-b border-gray-300">
                <input
                  type="text"
                  className="w-full px-2 py-1 border rounded"
                  value={
                    inputValue as
                      | string
                      | number
                      | readonly string[]
                      | undefined
                  }
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFreeTextSubmit()}
                  placeholder="Enter..."
                />
              </div>
            )}

            {/* Options */}
            <div className="option-list-container max-h-200 overflow-y-auto min-w-max">
              <ul
                className="option-list m-0 p-0 w-full"
                data-testid="option-list"
              >
                {selectOptions.map((option) => {
                  const selected = isOptionSelected(option.value);
                  return (
                    <li
                      key={`${option.value}`}
                      className={`option-list-item indent-0 m-0 pl-2 px-4 py-2 hover:bg-black hover:text-white cursor-pointer list-none text-left
                        ${selected ? 'bg-nui text-white' : ''}
                        ${optionClassName}
                      `}
                      onClick={(e) => {
                        // Stop toggleDropdown from re-firing if we only want one click
                        e.stopPropagation();
                        handleOptionClick(option.value, e);
                      }}
                      data-testid={`option-${hyphenCase(option.label)}`}
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

const DefaultArrow: FC<{ isOpen: boolean; className?: string }> = ({
  isOpen,
  className,
}) => (
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
