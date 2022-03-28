import React from 'react';
import { PriorityState } from '../../modules/weekPriority';
import DocumentCheckIcon from '../common/DocumentCheckIcon';

interface Props {
  priority: PriorityState;
  index: number;
  thisWeek?: boolean;
}
const PriorityItem = ({ priority, index, thisWeek }: Props) => {
  return (
    <div className='flex items-center w-full'>
      {!thisWeek && <DocumentCheckIcon isCompleted={priority.is_completed} />}
      <span className='text-white font-bold pr-2'>{index + 1 + ' :'}</span>
      <span className='text-white font-bold pr-2 truncate'>{priority.deliverable}</span>
    </div>
  );
};

export default PriorityItem;
