import React, { useState } from 'react';
import { format, subMonths, addMonths, startOfWeek, addDays, isSameDay, lastDayOfWeek, getWeek, addWeeks, subWeeks } from 'date-fns';
import { nextThumbnail, previewThumbnail } from '../../assets/images';

interface Props {
  selectedDate: Date;
  onSelectDay: (cloneDay: Date) => void;
}
const WeeklyCalendar = ({ selectedDate, onSelectDay }: Props) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const renderCells = () => {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });
    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className='flex flex-col flex-1 items-center justify-center'
            key={day.toDateString()}
            onClick={() => {
              onSelectDay(cloneDay);
            }}
          >
            <span
              style={isSameDay(selectedDate, cloneDay) ? { color: '#365B9D', fontWeight: 700 } : { color: 'black' }}
              className='capitalize'
            >
              {new Date(cloneDay).toLocaleDateString('fr', { weekday: 'short' }).charAt(0)}
            </span>
            <div
              className='text-black w-8 h-8 rounded-full flex items-center justify-center'
              style={isSameDay(selectedDate, cloneDay) ? { background: '#166DE1', fontWeight: 700 } : {}}
            >
              {formattedDate}
            </div>
          </div>,
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div className='flex flex-row justify-between items-center py-2' key={day.toDateString()}>
          {days}
        </div>,
      );
      days = [];
    }
    return <div className='body'>{rows}</div>;
  };
  return <div className=' w-full'>{renderCells()}</div>;
};

export default WeeklyCalendar;
