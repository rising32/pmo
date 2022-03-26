import React from 'react';
import PastPriorityItem from '../../components/priority/PastPriorityItem';
import { PriorityState } from '../../modules/weekPriority';

interface Props {
  priorities: PriorityState[];
}
const PastPriorityView = ({ priorities }: Props) => {
  return (
    <>
      {priorities.length > 0 ? (
        priorities.map((item, index) => <PastPriorityItem key={index} priority={item} />)
      ) : (
        <div className='text-white text-base'>There is no past not achieved priorities</div>
      )}
    </>
  );
};

export default PastPriorityView;
