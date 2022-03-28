import React from 'react';
import { PriorityState } from '../../modules/weekPriority';
import DocumentCheckIcon from '../common/DocumentCheckIcon';

interface Props {
  priority: PriorityState;
  thisWeek?: boolean;
}
const DeliverableWeelyPriority = ({ priority, thisWeek }: Props) => {
  return (
    <div className='flex items-center w-full'>
      {!thisWeek && <DocumentCheckIcon isCompleted={priority.is_completed} />}
      <span className='text-white font-bold pr-2'>{'W' + priority.week + ' :'}</span>
      <span className='text-white font-bold pr-2 truncate'>{priority.deliverable}</span>
    </div>
  );
};

export default DeliverableWeelyPriority;
