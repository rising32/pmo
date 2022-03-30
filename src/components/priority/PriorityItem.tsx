import React from 'react';
import { PriorityState } from '../../modules/weekPriority';
import DocumentCheckIcon from '../common/DocumentCheckIcon';

interface Props {
  priority: PriorityState;
  index: number;
  thisWeek?: boolean;
  selectedPriority: PriorityState | null;
  onSelect: (priority: PriorityState) => void;
}
const PriorityItem = ({ priority, index, selectedPriority, thisWeek, onSelect }: Props) => {
  return (
    <div className='flex items-center w-full' onClick={() => onSelect(priority)}>
      {!thisWeek && <DocumentCheckIcon isCompleted={priority.is_completed} />}
      {priority.wp_id === selectedPriority?.wp_id ? (
        <span className='text-rouge-blue font-bold pr-2'>{index + 1 + ' :'}</span>
      ) : (
        <span className='text-white font-bold pr-2'>{index + 1 + ' :'}</span>
      )}
      {priority.wp_id === selectedPriority?.wp_id ? (
        <span className='text-rouge-blue font-bold pr-2 truncate'>{priority.deliverable}</span>
      ) : (
        <span className='text-white font-bold pr-2 truncate'>{priority.deliverable}</span>
      )}
    </div>
  );
};

export default PriorityItem;
