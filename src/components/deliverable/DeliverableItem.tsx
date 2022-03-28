import React from 'react';
import { DeliverableState } from '../../modules/deliverable';
import DocumentCheckIcon from '../common/DocumentCheckIcon';

interface Props {
  deliverable: DeliverableState;
  index: number;
  thisWeek?: boolean;
}
const DeliverableItem = ({ deliverable, index, thisWeek }: Props) => {
  return (
    <div className='flex items-center w-full'>
      <span className='text-white font-bold pr-2'>{index + 1 + ' :'}</span>
      <span className='text-white font-bold pr-2 truncate'>{deliverable.deliverable}</span>
    </div>
  );
};

export default DeliverableItem;
