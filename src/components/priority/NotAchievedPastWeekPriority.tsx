import React from 'react';
import { PriorityState } from '../../modules/weekPriority';

interface Props {
  priorities: PriorityState[];
  selectedPriority: PriorityState | null;
  onSelect: (priority: PriorityState) => void;
}
const NotAchievedPastWeekPriority = ({ priorities, selectedPriority, onSelect }: Props) => {
  return (
    <div className='flex flex-col w-full'>
      {priorities.map((priority, index) => (
        <div
          key={priority.wp_id}
          className={`flex flex-row text-xl font-bold ${selectedPriority?.wp_id === priority.wp_id ? 'text-rouge-blue' : 'text-white'}`}
          onClick={() => onSelect(priority)}
        >
          <div className='flex items-center'>{priority.week + 'W'}</div>
          <div className='px-2'>{':'}</div>
          <div>{priority.priority}</div>
        </div>
      ))}
    </div>
  );
};

export default NotAchievedPastWeekPriority;
