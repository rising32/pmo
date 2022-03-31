import React from 'react';
import { TaskState } from '../../modules/task';
import CheckIcon from './CheckIcon';

interface Props {
  task: TaskState;
  selectedTask: TaskState | null;
  onSelect: (client: TaskState) => void;
}
const TaskModalItem = ({ task, selectedTask, onSelect }: Props) => {
  return (
    <div className='flex flex-row items-center w-full mb-2' onClick={() => onSelect(task)}>
      {selectedTask !== null ? <CheckIcon checked={selectedTask.task_id === task.task_id} /> : <CheckIcon checked={false} />}
      <div className='pl-2 text-lg font-bold flex flex-1 truncate' style={{ color: task.project_id ? 'red' : 'black' }}>
        {task.task_name}
      </div>
    </div>
  );
};

export default TaskModalItem;
