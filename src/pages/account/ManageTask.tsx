import React from 'react';
import { rightArrowThumbnail } from '../../assets/images';
import BottomUpAnimatedView from '../../components/common/BottomUpAnimatedView';
import { getUserTasks, sendCreateTask, sendUpdateTask } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { toast } from 'react-toastify';
import CheckBox from '../../components/common/CheckBox';
import { TaskState } from '../../modules/task';
import MainResponsive from '../../containers/main/MainResponsive';
import { useAuth } from '../../lib/context/AuthProvider';

const ManageTask = () => {
  const [isEdit, setIsEdit] = React.useState(false);
  const [created, setCreated] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<TaskState | null>(null);
  const [dataList, getDataList] = React.useState<TaskState[]>([] as TaskState[]);
  const [name, setName] = React.useState('');
  const [rate, setRate] = React.useState('');
  const [addAll, setAddAll] = React.useState(true);
  const [title, setTitle] = React.useState('Create Client');

  const { account } = useAuth();

  const [_sendCreateTask, , createTaskRes] = useRequest(sendCreateTask);
  const [_getUserTasks, , getUserTasksRes] = useRequest(getUserTasks);
  const [_sendUpdateTask, , sendUpdateTaskRes] = useRequest(sendUpdateTask);

  React.useEffect(() => {
    const creator_id = account?.user.user_id;
    creator_id && _getUserTasks(creator_id);
  }, []);
  React.useEffect(() => {
    if (getUserTasksRes) {
      getDataList(getUserTasksRes.task);
    }
  }, [getUserTasksRes]);
  React.useEffect(() => {
    setIsEdit(false);
    if (createTaskRes) {
      const updateTask: TaskState = {
        task_id: createTaskRes.task.task_id,
        creator_id: createTaskRes.task.creator_id,
        project_id: createTaskRes.task.project_id,
        task_name: createTaskRes.task.task_name,
        description: createTaskRes.task.description,
        planned_start_date: createTaskRes.task.planned_start_date,
        planned_end_date: createTaskRes.task.planned_end_date,
        actual_start_date: createTaskRes.task.actual_start_date,
        actual_end_date: createTaskRes.task.actual_end_date,
        hourly_rate: createTaskRes.task.hourly_rate,
        is_add_all: createTaskRes.task.is_add_all,
        is_active: createTaskRes.task.is_active,
        is_deleted: 0,
      };
      const newDataList = dataList;
      newDataList.unshift(updateTask);
      getDataList(newDataList);
      toast.success('task created successfully');
    }
  }, [createTaskRes]);
  React.useEffect(() => {
    setIsEdit(false);
    if (sendUpdateTaskRes) {
      const updateTask: TaskState = {
        task_id: sendUpdateTaskRes.task_id,
        creator_id: sendUpdateTaskRes.creator_id,
        project_id: sendUpdateTaskRes.project_id,
        task_name: sendUpdateTaskRes.task_name,
        description: sendUpdateTaskRes.description,
        planned_start_date: sendUpdateTaskRes.planned_start_date,
        planned_end_date: sendUpdateTaskRes.planned_end_date,
        actual_start_date: sendUpdateTaskRes.actual_start_date,
        actual_end_date: sendUpdateTaskRes.actual_end_date,
        hourly_rate: sendUpdateTaskRes.hourly_rate,
        is_add_all: sendUpdateTaskRes.is_add_all,
        is_active: sendUpdateTaskRes.is_active,
        is_deleted: 0,
      };
      const newDataList = dataList.map(item => {
        if (item.project_id === updateTask.project_id) {
          return updateTask;
        } else {
          return item;
        }
      });
      getDataList(newDataList);
      toast.success('task updated successfully');
    }
  }, [sendUpdateTaskRes]);

  const onCreateUpdateClient = () => {
    if (!name) {
      toast.error('task name is not null!');
      return;
    }
    if (!rate) {
      toast.error('rate is not null!');
      return;
    }
    if (created && account) {
      const newTask: TaskState = {
        task_id: null,
        creator_id: account?.user.user_id,
        project_id: null,
        task_name: name,
        description: 'test task',
        planned_start_date: null,
        planned_end_date: null,
        actual_start_date: null,
        actual_end_date: null,
        hourly_rate: parseInt(rate),
        is_add_all: false,
        is_active: true,
        is_deleted: 0,
      };
      _sendCreateTask(newTask);
    } else if (selectedItem && account) {
      const newTask: TaskState = {
        task_id: selectedItem.task_id,
        creator_id: account?.user.user_id,
        project_id: selectedItem.project_id,
        task_name: name,
        description: selectedItem.description,
        planned_start_date: selectedItem.planned_start_date,
        planned_end_date: selectedItem.planned_end_date,
        actual_start_date: selectedItem.actual_start_date,
        actual_end_date: selectedItem.actual_end_date,
        hourly_rate: parseInt(rate),
        is_add_all: addAll,
        is_active: selectedItem.is_active,
        is_deleted: 0,
      };
      _sendUpdateTask(newTask);
    }
  };
  const onCreateAndEdit = (task: TaskState | null) => {
    setSelectedItem(task);
    setTitle(task ? 'Edit Task' : 'Create Task');
    setCreated(task ? false : true);
    setName(task?.task_name || '');
    setRate(task?.hourly_rate.toString() || '');
    setIsEdit(true);
  };
  const handleClientNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };
  const handleRateChange = (event: React.FormEvent<HTMLInputElement>) => {
    setRate(event.currentTarget.value);
  };

  return (
    <MainResponsive>
      <div
        className='flex flex-row items-center w-full justify-between py-6 px-4 bg-light-gray'
        // onClick={() => user?.member.isAdmin && navigate('/account/company-profile')}
      >
        <div />
        <div className='text-lg text-black font-bold'>Manager task templates</div>
        <div className='text-sm text-blue font-normal' onClick={() => onCreateAndEdit(null)}>
          Create
        </div>
      </div>
      <div className='flex flex-1 flex-col w-full h-full relative'>
        <div className='flex flex-1 flex-col w-full p-1 bg-white'>
          <div className='flex flex-row px-4 pb-2 items-center'>
            <div className='text-base text-black font-bold mt-4'>Task templates</div>
          </div>
          {dataList.map((task, index) => (
            <div
              key={index}
              className='flex flex-row p-4 mb-2 items-center justify-between bg-light-gray'
              onClick={() => onCreateAndEdit(task)}
            >
              <div className='text-sm text-black font-normal pr-3 flex-1'>{task.task_name}</div>
              <div className='flex-row flex items-center'>
                <div className='text-sm text-black font-normal pr-3'>Active</div>
                <img src={rightArrowThumbnail} className='h-4 w-auto' />
              </div>
            </div>
          ))}
        </div>
        <BottomUpAnimatedView
          title={title}
          actionTitle={name ? 'Save' : 'Create'}
          isOpen={isEdit}
          onClose={() => setIsEdit(false)}
          onSave={onCreateUpdateClient}
        >
          <div className='px-4 my-4'>
            <div className='text-base text-black font-normal px-2'>NAME</div>
            <div className='flex flex-row mb-2 rounded-md items-center bg-light-gray relative'>
              <input
                className='w-full p-2 text-left text-black bg-transparent'
                placeholder='Enter New Task Name'
                value={name}
                onChange={handleClientNameChange}
              />
            </div>
            <div className='flex flex-row items-center justify-between px-2 w-full'>
              <div className='text-base text-black font-normal'>HOURLY RATE</div>
              <div className='text-xs text-black font-normal'>Changes will not apply to past logs</div>
            </div>
            <div className='flex flex-row mb-2 rounded-md items-center bg-light-gray relative'>
              <input
                className='w-full p-2 text-left text-black bg-transparent'
                placeholder='Enter Hourly Rate'
                value={rate}
                onChange={handleRateChange}
              />
            </div>
            <div className='my-2 px-2'>
              <CheckBox text='ADD TO ALL NEWS PROJETS' activeColor='#DD0000' isChecked={addAll} unCheck={() => setAddAll(!addAll)} />
            </div>
          </div>
        </BottomUpAnimatedView>
      </div>
    </MainResponsive>
  );
};

export default ManageTask;
