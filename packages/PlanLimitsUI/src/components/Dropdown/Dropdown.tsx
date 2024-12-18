import React, { FC, ReactNode, useState, useEffect, useRef } from 'react';
import { isArray, isObject } from 'lodash';
import arrowSvg from '@images/icon_chevronDown.svg';

type DropdownOption = {
  label: string;
  value: string | null; // Allow null for selectAll scenario
};

interface DropdownProps {
  options: unknown[];
  selectAll?: string;
  placeholder: string | JSX.Element; // Allows SVG or string
  value: string | null;
  onChange: (value: string) => void;
  arrow?: ReactNode; // Custom down arrow
  className?: string;
  controlClassName?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  placeholderClassNames?: string;
  dataTestid?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
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
                                             placeholderClassNames = '',
                                             dataTestid = 'dropdown-control',
                                           }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const formatOptions = (givenOptions: Array<unknown>) => {
    if (!givenOptions) return [];

    if (isArray(givenOptions) && !isObject(givenOptions[0])) return simpleStringOptions(givenOptions);

    const baseOptions = givenOptions as DropdownOption[];
    return selectAll ? [{ label: selectAll, value: null }, ...baseOptions] : baseOptions;
  };

  const selectOptions = formatOptions(options);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectOption = (optionValue: string | null) => {
    onChange(optionValue ?? '');
    setIsOpen(false);

    const event = new Event('change', { bubbles: true });
    const dropdownElement = document.querySelector(`[data-testid="dropdown-control"]`);

    if (dropdownElement) (dropdownElement as HTMLElement).dispatchEvent(event);
  };

  return (
    <div ref={dropdownRef} className={`relative font-bold bg-transparent ${className}`}>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={`flex p-2 top-18 font-bold bg-white rounded-xl border border-nui ${controlClassName}`}
        onClick={toggleDropdown}
        data-testid={dataTestid}
      >
        <div className="flex min-w-0 items-center text-left w-full space-x-2 pr-2">
          {value ? (
            <span className={'w-full'}
                  data-testid={`selected-${value.toString()}`}>{selectOptions.find((option) => option.value === value)?.label}</span>
          ) : (
            <span className={`w-full text-nui opacity-60 italic ${placeholderClassNames}`}>{placeholder}</span>
          )}
        </div>

        <div>{arrow || <DefaultArrow isOpen={isOpen} />}</div>
      </div>

      {isOpen && (
        <ul
          className={`absolute indent-0 z-10 pt-1 px-0 m-0 mt-2 rounded border border-nui bg-white ${dropdownClassName}`}
        >
          {selectOptions.map((option) => (
            <li
              key={`${option.value}`}
              className={`indent-0 m-0 pl-2 px-4 py-2 hover:bg-nui hover:text-white cursor-pointer list-none text-left ${optionClassName}`}
              onClick={() => selectOption(option.value)}
              data-testid={`option-${option.label}`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const DefaultArrow: FC<{ isOpen: boolean, className?: string }> = ({ isOpen, className }) => (
  <img
    src={arrowSvg}
    alt="Arrow icon"
    style={{
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s ease', strokeWidth: 0,
    }}
    className={`mt-1.5 stroke-green-50 ${className}`}
  />
);

export const simpleStringOptions = (opts: unknown[]) => {
  return opts.map(opt => {
    return { label: opt!.toString(), value: opt!.toString() } as DropdownOption;
  });
};

export default Dropdown;
