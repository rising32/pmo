import React from 'react';
import { TaskState } from '../../modules/task';
import { CheckSvg } from '../../assets/svg';

interface Props {
  task: TaskState;
  selectedTask: TaskState | null;
  onSelect: (client: TaskState) => void;
}
const TaskNameItem = ({ task, selectedTask, onSelect }: Props) => {
  return (
    <div className='flex flex-row items-center w-full mb-2' onClick={() => onSelect(task)}>
      <div className='w-6 h-6 bg-dark-gray rounded-full outline outline-1 outline-rouge-blue flex items-center justify-center'>
        <span>{selectedTask && selectedTask.task_id === task.task_id ? <CheckSvg stroke='red' strokeWidth={4} /> : null}</span>
      </div>
      <div className='pl-2 text-lg font-bold flex flex-1 truncate' style={{ color: task.project_id ? 'red' : 'black' }}>
        {task.task_name}
      </div>
    </div>
  );
};

export default TaskNameItem;
