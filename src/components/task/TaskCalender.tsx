import React, { useState } from 'react';
import { format, subMonths, addMonths, startOfWeek, addDays, isSameDay, lastDayOfWeek, getWeek, addWeeks, subWeeks } from 'date-fns';
import { nextThumbnail, previewThumbnail } from '../../assets/images';

interface Props {
  selectedDate: Date;
  onSelectDay: (cloneDay: Date, dayStr: string) => void;
}
const TaskCalender = ({ selectedDate, onSelectDay }: Props) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const changeWeekHandle = (btnType: string) => {
    if (btnType === 'prev') {
      setCurrentMonth(subWeeks(currentMonth, 1));
    }
    if (btnType === 'next') {
      setCurrentMonth(addWeeks(currentMonth, 1));
    }
  };
  const renderCells = () => {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });
    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';
    let formattedLetter = '';
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        switch (i) {
          case 0:
            formattedLetter = 'L';
            break;
          case 1:
            formattedLetter = 'M';
            break;
          case 2:
            formattedLetter = 'W';
            break;
          case 3:
            formattedLetter = 'J';
            break;
          case 4:
            formattedLetter = 'V';
            break;
          case 5:
            formattedLetter = 'S';
            break;
          case 6:
            formattedLetter = 'D';
            break;
        }
        const cloneDay = day;
        days.push(
          <div
            className='flex flex-col flex-1 items-center justify-center'
            key={day.toDateString()}
            onClick={() => {
              const dayStr = format(cloneDay, 'd');
              onSelectDay(cloneDay, dayStr);
            }}
          >
            <span style={isSameDay(selectedDate, cloneDay) ? { color: 'red', fontWeight: 700 } : { color: 'black' }}>
              {formattedLetter}
            </span>
            <span style={isSameDay(selectedDate, cloneDay) ? { color: 'red', fontWeight: 700 } : { color: 'black' }}>{formattedDate}</span>
          </div>,
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div className='flex flex-row justify-between items-center bg-white py-2' key={day.toDateString()}>
          <div className='flex-1 flex items-center justify-center' onClick={() => changeWeekHandle('prev')}>
            <img src={previewThumbnail} className='h-4 w-auto' />
          </div>
          {days}
          <div className='flex-1 flex items-center justify-center' onClick={() => changeWeekHandle('next')}>
            <img src={nextThumbnail} className='h-4 w-auto' />
          </div>
        </div>,
      );
      days = [];
    }
    return <div className='body'>{rows}</div>;
  };
  return <div className=' w-full'>{renderCells()}</div>;
};

export default TaskCalender;
