import { useEffect, useState } from 'react';
import Dropdown, { DropdownValueType } from '@components/Dropdown/Dropdown';

const MonthYearPicker = ({
                           current,
                           onChange,
                           limitToLastMonths = 24,
                           className,
                           dataTestid,
                           label,
                           multiSelect,
                           useModifierKeys,
                           dateFilter,
                         }: {
  className?: string;
  controlClassName?: string;
  onChange: (date: Date | Date[]) => void;
  current?: Date[];
  limitToLastMonths?: number;
  dataTestid?: string;
  label?: string;
  multiSelect?: boolean;
  useModifierKeys?: boolean;
  dateFilter?: (d: Date) => boolean;
}) => {
  const now = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - limitToLastMonths + 1);

  const years = Array.from({ length: now.getFullYear() - startDate.getFullYear() + 1 }, (_, i) =>
    startDate.getFullYear() + i,
  );

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
        value: `${month.value}-${year}`,
      }))
      .filter((option) => {
        const optionDate = new Date(option.year, option.month, 1);
        return optionDate >= startDate && optionDate <= now && (!dateFilter || dateFilter(optionDate));
      }),
  );

  const [selectedOption, setSelectedOption] = useState<Array<{ month: number; year: number }> | null>(
    current ? current.map((d: Date) => ({ month: d.getMonth(), year: d.getFullYear() })) : null,
  );

  useEffect(() => {
    setSelectedOption(current ? current.map((d: Date) => ({ month: d.getMonth(), year: d.getFullYear() })) : null);
  }, [current]);

  const handleSelection = (value: DropdownValueType | DropdownValueType[]) => {
    const selected = !value ? [] : [value].flat().map((v: DropdownValueType) => {
      const [month, year] = (v as string).split('-').map(Number);
      return { month, year };
    }) || [];
    setSelectedOption(selected);
    onChange?.(selected.map(v => new Date(v.year, v.month, 1)));
  };

  return (
    <div className={`space-x-4 items-center ${className}`}>
      <Dropdown
        options={options.reverse()}
        placeholder="Select Month and Year"
        value={selectedOption ? selectedOption.map(my => `${my.month}-${my.year}`) : null}
        onChange={handleSelection}
        dataTestid={dataTestid || 'dropdown-months'}
        multiSelect={multiSelect}
        useModifierKeys={useModifierKeys}
        label={label}
      />
    </div>
  );
};

export default MonthYearPicker;
