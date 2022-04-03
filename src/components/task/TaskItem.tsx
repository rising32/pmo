import React from 'react';
import { TaskState } from '../../modules/task';
import DocumentCheckIcon from '../common/DocumentCheckIcon';
import { useAuth } from '../../lib/context/AuthProvider';

interface Props {
  task: TaskState;
  //   onSelect: (task: TaskState) => void;
}
const TaskItem = ({ task }: Props) => {
  const { account } = useAuth();
  return (
    <div className='flex flex-row items-center w-full mb-2'>
      <DocumentCheckIcon />
      <div className='pl-2 text-lg font-bold text-white flex flex-1 truncate'>
        {account?.user.display_name + '- W17 : ' + task.task_name}
      </div>
    </div>
  );
};

export default TaskItem;
