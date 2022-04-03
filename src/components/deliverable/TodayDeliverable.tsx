import React from 'react';
import { getWeek } from 'date-fns';
import { PriorityState } from '../../modules/weekPriority';
import CheckImage from '../common/CheckImage';
import { DeliverableState } from '../../modules/deliverable';

interface Props {
  deliverables: DeliverableState[];
  selectedDeliverable: DeliverableState | null;
  onSelect: (deliverable: DeliverableState) => void;
}
const TodayDeliverable = ({ deliverables, selectedDeliverable, onSelect }: Props) => {
  return (
    <div className='flex flex-col w-full'>
      {deliverables.map((deliverable, index) => (
        <div
          key={deliverable.deliverable_id}
          className={`flex flex-row text-xl font-bold ${
            selectedDeliverable?.deliverable_id === deliverable.deliverable_id ? 'text-rouge-blue' : 'text-white'
          }`}
          onClick={() => onSelect(deliverable)}
        >
          <div className='flex items-center w-4'>{index + 1}</div>
          <div className='pr-2'>{':'}</div>
          <div className='flex flex-1 truncate'>{deliverable.deliverable_name}</div>
          <div className='ml-2 text-white text-base font-normal'>50%</div>
        </div>
      ))}
    </div>
  );
};

export default TodayDeliverable;
