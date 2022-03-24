import React, { useState } from 'react';
import { format, subMonths, addMonths, startOfWeek, addDays, isSameDay, lastDayOfWeek, getWeek, addWeeks, subWeeks } from 'date-fns';
import { nextThumbnail, previewThumbnail } from '../../assets/images';
import { CalenderSvg } from '../../assets/svg';

interface Props {
  selectedWeek: number;
  onSelectWeek: (currentWeek: number) => void;
}
const PrioritiesCalender = ({ selectedWeek, onSelectWeek }: Props) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getWeek(currentMonth));

  React.useEffect(() => {
    onSelectWeek(currentWeek);
  }, [currentWeek]);
  const changeWeekHandle = (btnType: string) => {
    if (btnType === 'prev') {
      setCurrentMonth(subWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(subWeeks(currentMonth, 1)));
    }
    if (btnType === 'next') {
      setCurrentMonth(addWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(addWeeks(currentMonth, 1)));
    }
  };
  return (
    <div className='w-full flex flex-row justify-between items-center bg-white py-3 px-4'>
      <div className='flex items-center justify-center' onClick={() => changeWeekHandle('prev')}>
        <img src={previewThumbnail} className='h-4 w-auto' />
        <div className='text-lg font-bold text-rouge-blue pl-2'>{currentWeek - 1}</div>
      </div>
      <div className='flex flex-1 flex-row items-center justify-between pr-2'>
        <div />
        <div className='text-lg font-bold'>{'Week priorities ' + currentWeek}</div>
        <CalenderSvg />
      </div>
      <div className='flex items-center justify-center' onClick={() => changeWeekHandle('next')}>
        <div className='text-lg font-bold text-rouge-blue pr-2'>{currentWeek + 1}</div>
        <img src={nextThumbnail} className='h-4 w-auto' />
      </div>
    </div>
  );
};

export default PrioritiesCalender;
