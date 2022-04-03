import React from 'react';
import { PriorityState } from '../../modules/weekPriority';
import { CheckSvg } from '../../assets/svg';

interface Props {
  priority: PriorityState;
  selectedPriority: PriorityState | null;
  onSelect: (priority: PriorityState) => void;
}
const DeliverableNameItem = ({ priority, selectedPriority, onSelect }: Props) => {
  return (
    <div className='flex flex-row items-center w-full mb-2' onClick={() => onSelect(priority)}>
      <div className='w-6 h-6 bg-dark-gray rounded-full outline outline-1 outline-rouge-blue flex items-center justify-center'>
        <span>{selectedPriority && selectedPriority?.wp_id === priority.wp_id ? <CheckSvg stroke='red' strokeWidth={4} /> : null}</span>
      </div>
      <div className='pl-2 text-lg font-bold flex flex-1 truncate'>{priority.priority}</div>
    </div>
  );
};

export default DeliverableNameItem;
