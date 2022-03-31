import React from 'react';
import { TaskState } from '../../modules/task';
import { PriorityState } from '../../modules/weekPriority';
import CheckIcon from './CheckIcon';

interface Props {
  priority: PriorityState;
  selectedPriority: PriorityState | null;
  onSelect: (priority: PriorityState) => void;
}
const PriorityModalItem = ({ priority, selectedPriority, onSelect }: Props) => {
  return (
    <div className='flex flex-row items-center w-full mb-2' onClick={() => onSelect(priority)}>
      {selectedPriority !== null ? <CheckIcon checked={selectedPriority?.wp_id === priority.wp_id} /> : <CheckIcon checked={false} />}
      <div className='pl-2 text-lg font-bold flex flex-1 truncate'>{priority.deliverable}</div>
    </div>
  );
};

export default PriorityModalItem;
