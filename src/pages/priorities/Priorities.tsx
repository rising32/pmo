import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { plusThumbnail } from '../../assets/images';
import { accountState, AccountState } from '../../modules/user';
import useRequest from '../../lib/hooks/useRequest';
import { sendPriorityByBeforeWeek, sendPriorityByWeek } from '../../lib/api/auth';
import PrioritiesCalender from '../../components/task/PrioritiesCalender';
import { prioritiesFakeData, prioritiesNotAchievedFakeData, PriorityState } from '../../modules/weekPriority';
import PriorityItem from '../../components/priority/PriorityItem';
import Tag from '../../components/common/Tag';
import { getWeek } from 'date-fns';
import PastPriorityView from '../../containers/priority/PastPriorityView';
import { PrioritiesTab } from '../../modules/tab';

const thisWeek = getWeek(new Date());
function Priorities(): JSX.Element {
  const [selectedWeek, setSelectedWeek] = useState(thisWeek);
  const [weeklyPriorities, setWeeklyPriorities] = useState<PriorityState[]>([]);
  const [beforeWeeklyPriorities, setBeforWeeklyPriorities] = useState<PriorityState[]>([]);

  const account = useRecoilValue<AccountState | null>(accountState);

  const [_sendPriorityByWeek, , sendPriorityByWeekRes] = useRequest(sendPriorityByWeek);
  const [_sendPriorityByBeforeWeek, , sendPriorityByBeforeWeekRes] = useRequest(sendPriorityByBeforeWeek);

  React.useEffect(() => {
    requestWeelyPriorities(selectedWeek);
  }, []);
  React.useEffect(() => {
    if (sendPriorityByWeekRes) {
      // console.log('---', sendPriorityByWeekRes);
      setWeeklyPriorities(sendPriorityByWeekRes.priority);
    }
  }, [sendPriorityByWeekRes]);
  React.useEffect(() => {
    if (sendPriorityByBeforeWeekRes) {
      console.log('---', sendPriorityByBeforeWeekRes);
      setBeforWeeklyPriorities(sendPriorityByBeforeWeekRes.priority);
    }
  }, [sendPriorityByBeforeWeekRes]);
  const requestWeelyPriorities = (week: number) => {
    const user_id = account?.user.user_id;
    // console.log('+++++', user_id, week);
    _sendPriorityByWeek(user_id, week);
    _sendPriorityByBeforeWeek(user_id, week);
  };
  const onSelectWeek = (currentWeek: number) => {
    setSelectedWeek(currentWeek);
    requestWeelyPriorities(currentWeek);
  };

  return (
    <div className='items-center flex flex-col flex-1 px-4 pt-4 pb-32'>
      <PrioritiesCalender selectedWeek={selectedWeek} onSelectWeek={onSelectWeek} />
      <div className='flex justify-center items-center px-4 pt-4 pb-2 w-full'>
        <span className='text-white font-bold truncate'>Weekly priorities</span>
      </div>
      <div className='mx-4 p-4 bg-card-gray shadow-xl w-full rounded-md'>
        {weeklyPriorities.map((item, index) => (
          <PriorityItem key={index} index={index} priority={item} />
        ))}
      </div>
      <div className='flex justify-center items-center p-2 mt-4 w-full'>
        <span className='text-white font-bold text-center'>Priority achieved this week with clear goal defined</span>
      </div>
      <div className='mx-4 px-4 pt-4 pb-14 bg-card-gray w-full border-rouge-blue border-4 relative'>
        <div className='flex flex-row items-center'>
          <div className='text-xl font-bold text-white'>Priority :</div>
          <div className='ml-4'>
            <Tag text={thisWeek > selectedWeek ? '2' : '1'} />
          </div>
        </div>
        <div className='flex flex-row items-center'>
          <div className='text-xl font-bold text-white'>Goal :</div>
          <div className='ml-4'>
            <Tag text='Q T Y' />
          </div>
        </div>
        <div className='absolute bottom-6 right-2'>
          <div className='flex items-center justify-end bg-white rounded-full p-2 outline outline-1 shadow-xl'>
            <img src={plusThumbnail} className='h-5 w-auto' />
          </div>
        </div>
        <div className='absolute -bottom-1 left-0 w-full flex flex-row justify-evenly items-center'>
          {PrioritiesTab.map(item => (
            <div key={item.key} className='bg-menu-back rounded-t-md px-2'>
              <span className='text-white text-sm'>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='flex justify-center items-center px-4 pt-6 pb-2 w-full'>
        <span className='text-white font-bold truncate'>Past priorities not achieved</span>
      </div>
      <div className='mx-4 p-4 bg-card-gray shadow-xl w-full rounded-md'>
        <PastPriorityView priorities={beforeWeeklyPriorities} />
      </div>
    </div>
  );
}

export default Priorities;
