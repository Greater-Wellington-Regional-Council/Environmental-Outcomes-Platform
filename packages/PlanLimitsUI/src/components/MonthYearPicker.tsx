import React, { useState } from 'react';

const MonthYearPicker = ({ className, onChange} : { className: string, onChange: (date: unknown) => void } ) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i);
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
    months.map((month) => ({
      label: `${month.label} ${year}`,
      year,
      month: month.value,
    }))
  );

  const [selectedOption, setSelectedOption] = useState<{ year: number; month: number } | null>({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });

  const handleSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [month, year] = event.target.value.split('-').map(Number);
    const selected = { month, year };
    setSelectedOption(selected);
    setSelectedDate(new Date(year, month, 1));
    console.log('Selected Date:', new Date(year, month, 1));
    onChange?.(selectedDate)
  };

  return (
    <div className="flex space-x-4 items-center">
      <select
        className="border rounded border-nui border-2 p-2"
        value={selectedOption ? `${selectedOption.month}-${selectedOption.year}` : ''}
        onChange={handleSelection}
      >
        <option value="" disabled>Select Month and Year</option>
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
