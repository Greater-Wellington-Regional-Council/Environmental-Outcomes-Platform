import React, { FC, ReactNode, useState } from 'react';
import { isArray, isObject } from 'lodash';
import arrowSvg from "@images/icon_chevronDown.svg"

type DropdownOption = {
  label: string;
  value: string;
};

interface DropdownProps {
  options: unknown[];
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

  const formatOptions = (givenOptions: Array<unknown>) => {
    if (!givenOptions as unknown as DropdownOption[])
      return [];

    if (isArray(givenOptions) && !isObject(givenOptions[0])) return simpleStringOptions(givenOptions);

    return givenOptions as DropdownOption[];
  };

  const [isOpen, setIsOpen] = useState(false);

  const selectOptions = formatOptions(options);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectOption = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);

    const event = new Event('change', { bubbles: true });
    const dropdownElement = document.querySelector(`[data-testid="dropdown-control"]`);

    if (dropdownElement) (dropdownElement as HTMLElement).dispatchEvent(event);
  };

  return (
    <div className={`relative font-bold ${className}`}>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={`flex p-2 top-18 font-bold rounded-xl border border-nui ${controlClassName}`}
        onClick={toggleDropdown}
        data-testid={dataTestid}
      >
        <div className="flex w-[180px] items-center space-x-2 pr-2">
          {value ? (
            <span
              data-testid={`selected-${value.toString()}`}>{selectOptions.find((option) => option.value === value)?.label}</span>
          ) : (
            <span className={`text-nui opacity-60 italic ${placeholderClassNames}`}>{placeholder}</span>
          )}
        </div>

        <div>{arrow || <DefaultArrow isOpen={isOpen} />}</div>
      </div>

      {isOpen && (
        <ul
          className={`absolute indent-0 z-10 pt-1 px-0 m-0 ml-0 mt-2 rounded border border-nui min-w-[210px] bg-white ${dropdownClassName}`}
        >
          {selectOptions.map((option) => (
            <li
              key={option.value}
              className={`indent-0 ml-0 pl-2 hover:bg-nui hover:text-white cursor-pointer list-none w-[210px] text-left px-4 py-2 ${optionClassName}`}
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
      transition: 'transform 0.3s ease', strokeWidth: 0
    }}
    className={`mt-1.5 stroke-green-50 ${className}`}
  />
);

export const simpleStringOptions = (opts: unknown[]) => {
  return opts.map(opt => {
    return { label: opt!.toString(), value: opt } as DropdownOption;
  });
};

export default Dropdown;
