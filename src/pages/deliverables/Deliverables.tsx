import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { plusThumbnail } from '../../assets/images';
import { accountState, AccountState } from '../../modules/user';
import useRequest from '../../lib/hooks/useRequest';
import { sendGetMyClients } from '../../lib/api/auth';
import PrioritiesCalender from '../../components/task/PrioritiesCalender';
import { prioritiesFakeData, prioritiesNotAchievedFakeData, prioritiesPastFakeData } from '../../modules/weekPriority';
import PriorityItem from '../../components/priority/PriorityItem';
import Tag from '../../components/common/Tag';
import PastPriorityItem from '../../components/priority/PastPriorityItem';
import { getWeek } from 'date-fns';
import PastPriorityView from '../../containers/priority/PastPriorityView';
import TaskCalender from '../../components/task/TaskCalender';
import { DeliverablesTab } from '../../modules/tab';
import { ClientState } from '../../modules/client';

const thisWeek = getWeek(new Date());
function Deliverables(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [weeklyPriorities, setWeeklyPriorities] = useState(prioritiesFakeData);
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState('');
  const [clientList, setClientList] = useState<ClientState[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientState | null>(null);

  const account = useRecoilValue<AccountState | null>(accountState);
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

  const onSelectDay = (cloneDay: Date, dayStr: string) => {
    // console.log('clicked!', cloneDay, dayStr);
    setSelectedDate(cloneDay);
  };

  return (
    <div className='items-center flex flex-col flex-1 px-4 pt-4 pb-32'>
      <TaskCalender selectedDate={selectedDate} onSelectDay={onSelectDay} />
      <div className='flex justify-between items-center px-4 pt-4 pb-2 w-full'>
        <span className='text-white font-bold flex-1 truncate'>{new Date(selectedDate).toLocaleDateString(undefined, options)}</span>
        <span className='text-white'>90%</span>
      </div>
      <div className='mx-4 p-4 bg-card-gray shadow-xl w-full rounded-md'>
        {weeklyPriorities.map((item, index) => (
          <PriorityItem key={index} index={index} priority={item} />
        ))}
      </div>
      <div className='flex justify-center items-center p-2 mt-4 w-full'>
        <span className='text-white font-bold text-center'>At least 2 deliverable per day</span>
      </div>
      <div className='mx-4 px-4 pt-4 pb-14 bg-card-gray w-full border-rouge-blue border-4 relative'>
        <div className='flex flex-row items-center'>
          <div className='text-xl font-bold text-white'>Priority :</div>
          <div className='ml-4'>
            <Tag text={thisWeek > selectedWeek ? '1' : '1'} />
          </div>
        </div>
        <div className='flex flex-row items-center'>
          <div className='text-xl font-bold text-white'>Goal :</div>
          <div className='ml-4'>
            <Tag text='Q T Y' />
          </div>
        </div>
        <div className='absolute -bottom-1 left-0 w-full flex flex-row justify-evenly items-center'>
          {DeliverablesTab.map(item => (
            <div key={item.key} className='bg-menu-back rounded-t-md px-2'>
              <span className='text-white text-sm'>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='flex justify-center items-center px-4 pt-6 pb-2 w-full'>
        <span className='text-white font-bold truncate'>Remember your weekly priorities</span>
      </div>
      <div className='mx-4 p-4 bg-card-gray shadow-xl w-full rounded-md'>
        <PastPriorityView priorities={weeklyPriorities} selectedWeek={selectedWeek} />
      </div>
    </div>
  );
}

export default Deliverables;
