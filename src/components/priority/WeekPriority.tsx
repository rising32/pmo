import React from 'react';
import { getWeek } from 'date-fns';
import { PriorityState } from '../../modules/weekPriority';
import CheckImage from '../common/CheckImage';

interface Props {
  priorities: PriorityState[];
  week: number;
  selectedPriority: PriorityState | null;
  onSelect: (priority: PriorityState) => void;
}
const WeekPriority = ({ priorities, selectedPriority, week, onSelect }: Props) => {
  return (
    <div className='flex flex-col w-full'>
      {priorities.map((priority, index) => (
        <div
          key={priority.wp_id}
          className={`flex flex-row text-xl font-bold ${selectedPriority?.wp_id === priority.wp_id ? 'text-rouge-blue' : 'text-white'}`}
          onClick={() => onSelect(priority)}
        >
          {week === getWeek(new Date()) && (
            <CheckImage isSelected={selectedPriority?.wp_id === priority.wp_id} isChecked={priority.is_completed} />
          )}
          <div className='flex items-center w-4'>{index + 1}</div>
          <div className='pr-2'>{':'}</div>
          <div>{priority.priority}</div>
        </div>
      ))}
    </div>
  );
};

export default WeekPriority;
