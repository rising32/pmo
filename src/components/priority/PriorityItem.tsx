import React from 'react';
import { PriorityState } from '../../modules/weekPriority';
import DocumentCheckIcon from '../common/DocumentCheckIcon';

interface Props {
  priority: PriorityState;
  index: number;
}
const PriorityItem = ({ priority, index }: Props) => {
  return (
    <div className='flex items-center w-full'>
      <DocumentCheckIcon isCompleted={priority.is_completed} />
      <span className='text-white font-bold pr-2'>{index + 1 + ' :'}</span>
      <span className='text-white font-bold pr-2 truncate'>{priority.description}</span>
    </div>
  );
};

export default PriorityItem;
