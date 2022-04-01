import React from 'react';
import { PriorityState } from '../../modules/weekPriority';
import { CheckSvg } from '../../assets/svg';

interface Props {
  deliverable: PriorityState;
  selectedDeliverable: PriorityState | null;
  onSelect: (deliverable: PriorityState) => void;
}
const DeliverableModalItem = ({ deliverable, selectedDeliverable, onSelect }: Props) => {
  return (
    <div className='flex flex-row items-center w-full mb-2' onClick={() => onSelect(deliverable)}>
      <div className='w-6 h-6 bg-dark-gray rounded-full outline outline-1 outline-rouge-blue flex items-center justify-center'>
        <span>
          {selectedDeliverable && selectedDeliverable.wp_id === deliverable.wp_id ? <CheckSvg stroke='red' strokeWidth={4} /> : null}
        </span>
      </div>
      <div className='pl-2 text-lg font-bold flex flex-1 truncate'>{deliverable.deliverable}</div>
    </div>
  );
};

export default DeliverableModalItem;
