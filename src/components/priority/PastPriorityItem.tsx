import React from 'react';
import { PriorityState } from '../../modules/weekPriority';
import DocumentCheckIcon from '../common/DocumentCheckIcon';

interface Props {
  priority: PriorityState;
}
const PastPriorityItem = ({ priority }: Props) => {
  return (
    <div className='flex items-center w-full'>
      <span className='text-white font-bold pr-2'>{'W' + priority.week + ' :'}</span>
      <span className='text-white font-bold pr-2 truncate'>{priority.deliverable}</span>
    </div>
  );
};

export default PastPriorityItem;
