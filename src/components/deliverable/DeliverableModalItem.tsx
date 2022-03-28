import React from 'react';
import { ClientState } from '../../modules/client';
import { DeliverableState } from '../../modules/deliverable';
import CheckIcon from '../task/CheckIcon';

interface Props {
  deliverable: DeliverableState;
  selectedDeliverable: DeliverableState | null;
  onSelect: (deliverable: DeliverableState) => void;
}
const DeliverableModalItem = ({ deliverable, selectedDeliverable, onSelect }: Props) => {
  return (
    <div className='flex flex-row items-center w-full mb-2' onClick={() => onSelect(deliverable)}>
      {selectedDeliverable !== null ? (
        <CheckIcon checked={selectedDeliverable.wp_id === deliverable.wp_id} />
      ) : (
        <CheckIcon checked={false} />
      )}
      <div className='pl-2 text-lg font-bold flex flex-1 truncate'>{deliverable.deliverable}</div>
    </div>
  );
};

export default DeliverableModalItem;
