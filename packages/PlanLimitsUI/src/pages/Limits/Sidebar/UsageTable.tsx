import { format, addDays, addWeeks } from 'date-fns';
import { useState } from 'react';
import { useUsageData } from '../../../api';

const MIN_OFFSET = -52;
const MAX_OFFSET = 0;

export default function UsageTable({ council }: { council: Council }) {
  const [weekOffset, setWeekOffset] = useState(0);

  const yesterday = addDays(new Date(), -1);
  const to = addWeeks(yesterday, weekOffset);
  const from = addDays(to, -6);
  const formattedFrom = format(from, 'yyyy-MM-dd');
  const formattedTo = format(to, 'yyyy-MM-dd');

  // TODO: Handle button thrashing for slow queries....
  const handleUpdateDateOffset = (change: number) => {
    const updatedOffet = weekOffset + change;
    if (updatedOffet < MIN_OFFSET || updatedOffet > MAX_OFFSET) return;
    setWeekOffset(updatedOffet);
  };

  const usageData = useUsageData(council.id, formattedFrom, formattedTo);

  return (
    <>
      <h3 className="text-lg uppercase mb-2 tracking-wider">Usage</h3>
      {usageData.isLoading && <>Loading...</>}
      {!usageData.isLoading && usageData.data && (
        <>Loaded! Records: {usageData.data.length}</>
      )}
      {!usageData.isLoading && usageData.error && (
        <>Error loading: {usageData.error}</>
      )}
      <br />
      Week Offset {weekOffset} <br />
      From: {formattedFrom} <br />
      To: {formattedTo} <br />
      <button onClick={() => handleUpdateDateOffset(-1)}>Earlier</button>
      <br />
      <button onClick={() => handleUpdateDateOffset(1)}>Later</button>
      <br />
    </>
  );
}
