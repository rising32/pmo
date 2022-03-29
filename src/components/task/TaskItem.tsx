import React from 'react';
import { TaskState } from '../../modules/task';
import { useRecoilValue } from 'recoil';
import { accountState, AccountState } from '../../modules/user';
import DocumentCheckIcon from '../common/DocumentCheckIcon';

interface Props {
  task: TaskState;
  //   onSelect: (task: TaskState) => void;
}
const TaskItem = ({ task }: Props) => {
  const account = useRecoilValue<AccountState | null>(accountState);
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
