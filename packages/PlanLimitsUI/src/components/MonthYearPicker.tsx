import React, { useEffect, useState } from 'react';

const MonthYearPicker = ({
                           current,
                           onChange,
                           limitToLastMonths = 24,
                           className,
                           controlClassName,
                         }: {
  className?: string;
  controlClassName?: string;
  onChange: (date: unknown) => void;
  current?: Date;
  limitToLastMonths?: number;
}) => {
  const setSelectedDate = useState<Date | null>(null)[1];

  const now = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - limitToLastMonths + 1);

  const years = Array.from({ length: now.getFullYear() - startDate.getFullYear() + 1 }, (_, i) =>
    startDate.getFullYear() + i,
  );

  useEffect(() => {
    setSelectedOption(current ? { month: current.getMonth(), year: current.getFullYear() } : null)
  }, [current]);

  const months = [
    { label: 'January', value: 0 },
    { label: 'February', value: 1 },
    { label: 'March', value: 2 },
    { label: 'April', value: 3 },
    { label: 'May', value: 4 },
    { label: 'June', value: 5 },
    { label: 'July', value: 6 },
    { label: 'August', value: 7 },
    { label: 'September', value: 8 },
    { label: 'October', value: 9 },
    { label: 'November', value: 10 },
    { label: 'December', value: 11 },
  ];

  const options = years.flatMap((year) =>
    months
      .map((month) => ({
        label: `${month.label} ${year}`,
        year,
        month: month.value,
      }))
      .filter((option) => {
        const optionDate = new Date(option.year, option.month, 1);
        return optionDate >= startDate && optionDate <= now;
      }),
  );

  const [selectedOption, setSelectedOption] = useState<{ year?: number; month?: number } | null>(
    current
      ? {
        year: current?.getFullYear(),
        month: current?.getMonth(),
      }
      : null,
  );

  const handleSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [month, year] = event.target.value.split('-').map(Number);
    const selected = { month, year };
    setSelectedOption(selected);
    const date = new Date(year, month, 1);
    setSelectedDate(date);
    onChange?.(date);
  };

  return (
    <div className={`flex space-x-4 items-center ${className}`}>
      <select
        className={`border-nui border rounded-xl p-2 ${controlClassName} ${selectedOption ? '' : 'text-gray-300'}`}
        value={selectedOption ? `${selectedOption.month}-${selectedOption.year}` : ''}
        onChange={handleSelection}
      >
        <option value="" disabled>
          Select Month and Year
        </option>
        {options.map((option) => (
          <option key={`${option.month}-${option.year}`} value={`${option.month}-${option.year}`}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthYearPicker;
