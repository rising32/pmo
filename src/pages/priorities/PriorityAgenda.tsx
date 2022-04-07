import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { agendaThumbnail, menuThumbnail, searchThumbnail } from '../../assets/images';
import DayScheduler from '../../components/calendar/DayScheduler';
import WeekCalendarAgenda from '../../components/calendar/WeekCalendarAgenda';
import MainResponsive from '../../containers/main/MainResponsive';
import { useAuth } from '../../lib/context/AuthProvider';

function PriorityAgenda(): JSX.Element {
  const [shortName, setShortName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { account } = useAuth();
  const params = useParams();

  useEffect(() => {
    console.log(params);
    if (account !== null && account.user.display_name) {
      const name = account.user.display_name || 'Default';
      const short = name
        .split(' ')
        .map(x => x[0])
        .join('');
      setShortName(short);
    }
  }, [account]);
  const onSelectDate = (cloneDay: Date) => {
    setSelectedDate(cloneDay);
  };

  return (
    <MainResponsive>
      <div className='w-full flex flex-row justify-between items-center bg-white rounded-md py-3 px-4'>
        <div className='flex items-center'>
          <img src={menuThumbnail} className='h-4 w-auto' />
          <span className='text-2xl font-bold capitalize ml-2'>{new Date().toLocaleDateString('fr', { month: 'long' })}</span>
        </div>
        <div className='flex flex-row items-center justify-between'>
          <img src={searchThumbnail} className='h-5 w-auto' />
          <img src={agendaThumbnail} className='h-5 w-auto mx-2' />
          <div className='bg-[#3F414E] w-10 h-10 rounded-full flex items-center justify-center text-white text-xl '>{shortName}</div>
        </div>
      </div>
      <div className='m-4 bg-card-gray shadow-xl w-full rounded-md pt-4'>
        <WeekCalendarAgenda selectedDate={selectedDate} onSelectDate={onSelectDate} />
        <DayScheduler selectedDate={selectedDate} />
      </div>
    </MainResponsive>
  );
}

export default PriorityAgenda;
