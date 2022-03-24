import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { controlThumbnail, documentThumbnail, minusThumbnail, plusThumbnail } from '../../assets/images';
import ReactModal from 'react-modal';
import { accountState, AccountState, UserState } from '../../modules/user';
import useRequest from '../../lib/hooks/useRequest';
import { getUserAll, getUserTasks, sendGetMyClients } from '../../lib/api/auth';
import ClientItem from '../../components/task/ClientItem';
import TaskCalender from '../../components/task/TaskCalender';
import { ClientState } from '../../modules/client';
import { TaskState } from '../../modules/task';
import TaskItem from '../../components/task/TaskItem';
import UserItem from '../../components/task/UserItem';

ReactModal.setAppElement('#root');

function Tasks(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState('');
  const [clientList, setClientList] = useState<ClientState[]>([]);
  const [taskList, setTaskList] = useState<TaskState[]>([]);
  const [users, getUsers] = React.useState<UserState[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientState | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskState | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserState | null>(null);

  const account = useRecoilValue<AccountState | null>(accountState);

  const [_sendGetMyClients, , getMyClientsRes] = useRequest(sendGetMyClients);
  const [_getUserTasks, , getUserTasksRes] = useRequest(getUserTasks);
  const [_getUserAll, , getUserAllRes] = useRequest(getUserAll);

  React.useEffect(() => {
    const user_id = account?.user.user_id;
    user_id && _sendGetMyClients(user_id);

    const creator_id = account?.user.user_id;
    creator_id && _getUserTasks(creator_id);

    _getUserAll();
  }, []);
  React.useEffect(() => {
    if (getMyClientsRes) {
      setClientList(getMyClientsRes.clients);
    }
  }, [getMyClientsRes]);

  React.useEffect(() => {
    if (getUserTasksRes) {
      setTaskList(getUserTasksRes.task);
    }
  }, [getUserTasksRes]);
  React.useEffect(() => {
    if (getUserAllRes) {
      getUsers(getUserAllRes);
    }
  }, [getUserAllRes]);

  const onSelectDay = (cloneDay: Date, dayStr: string) => {
    // console.log('clicked!', cloneDay, dayStr);
    setSelectedDate(cloneDay);
  };
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

  const openClients = () => {
    setType('client');
    setShowModal(!showModal);
  };
  const openTasks = () => {
    setType('task');
    setShowModal(!showModal);
  };
  const openUsers = () => {
    setType('user');
    setShowModal(!showModal);
  };
  const onSelectClient = (client: ClientState) => {
    setSelectedClient(preSelectedClient => (preSelectedClient?.client_id === client?.client_id ? null : client));
    setShowModal(false);
  };
  const onSelectTask = (task: TaskState) => {
    setSelectedTask(preSelectedTask => (preSelectedTask?.task_id === task?.task_id ? null : task));
    setShowModal(false);
  };
  const onSelectUser = (user: UserState) => {
    setSelectedUser(preSelectedUser => (preSelectedUser?.user_id === user?.user_id ? null : user));
    setShowModal(false);
  };

  return (
    <div className='items-center flex flex-col flex-1 px-4 pt-4 pb-32'>
      <TaskCalender selectedDate={selectedDate} onSelectDay={onSelectDay} />
      <div className='flex justify-between items-center px-4 pt-4 pb-2 w-full'>
        <span className='text-white font-bold flex-1 truncate'>{new Date(selectedDate).toLocaleDateString(undefined, options)}</span>
        <span className='text-white'>On time: 90%</span>
      </div>
      <div className='mx-4 p-4 border-rouge-blue border-4 bg-card-gray shadow-xl w-full'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-white font-bold pr-2'>Client :</span>
          <div className='border-dashed border-2 border-rouge-blue flex-1' />
          <div className='border-dashed text-rouge-blue px-2'>{selectedClient?.client_name}</div>
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openClients}>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-white font-bold pr-2'>Project :</span>
          <div className='border-dashed border-2 border-rouge-blue flex-1' />
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue'>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-white font-bold pr-2'>Task :</span>
          <div className='border-dashed border-2 border-rouge-blue flex-1' />
          <div className='border-dashed text-rouge-blue px-2'>{selectedTask?.task_name}</div>
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openTasks}>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-white font-bold pr-2'>Deliverable :</span>
          <div className='border-dashed border-2 border-rouge-blue flex-1' />
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue'>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-white font-bold pr-2'>Who :</span>
          <div className='border-dashed border-2 border-rouge-blue flex-1' />
          <div className='border-dashed text-rouge-blue px-2'>{selectedUser?.display_name}</div>
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openUsers}>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-white font-bold pr-2'>When :</span>
          <div className='border-dashed border-2 border-rouge-blue flex-1' />
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue'>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <div className='flex items-center justify-end'>
          <div className='flex items-center justify-end bg-white rounded-full p-2 outline outline-1 shadow-xl'>
            <img src={plusThumbnail} className='h-5 w-auto' />
          </div>
        </div>
      </div>
      <div className='flex justify-center items-center p-2 mt-4 w-full'>
        <span className='text-white font-bold'>JEF tasks week 27</span>
      </div>
      <div className='mx-4 px-4 pt-4 pb-10 bg-card-gray rounded-md w-full relative'>
        <div className='flex flex-col justify-center items-center mb-3'>
          <span className='text-white font-bold mb-2'>Amazon</span>
          <div className='flex items-center w-full'>
            <div className='w-6 h-6 flex items-center justify-center mr-2'>
              <img src={documentThumbnail} className='h-4 w-auto' />
            </div>
            <span className='text-white font-bold pr-2'>JEF - W27 : Define the action plan </span>
          </div>
          <div className='flex items-center w-full'>
            <div className='w-6 h-6 flex items-center justify-center mr-2'>
              <img src={documentThumbnail} className='h-4 w-auto' />
            </div>
            <span className='text-white font-bold pr-2'>JEF - W27 : Recruit a new PMO </span>
          </div>
        </div>
        <div className='flex flex-col justify-center items-center mb-3'>
          <span className='text-white font-bold mb-2'>Coty</span>
          <div className='flex items-center w-full'>
            <div className='w-6 h-6 flex items-center justify-center mr-2'>
              <img src={documentThumbnail} className='h-4 w-auto' />
            </div>
            <span className='text-white font-bold pr-2'>JEF - W27 : Analyze the results</span>
          </div>
          <div className='flex items-center w-full'>
            <div className='w-6 h-6 flex items-center justify-center mr-2'>
              <img src={documentThumbnail} className='h-4 w-auto' />
            </div>
            <span className='text-white font-bold pr-2'>JEF - W27 : Communicate the goal</span>
          </div>
          <div className='flex items-center w-full'>
            <div className='w-6 h-6 flex items-center justify-center mr-2'>
              <img src={documentThumbnail} className='h-4 w-auto' />
            </div>
            <span className='text-white font-bold pr-2'>JEF - W27 : Check the origins</span>
          </div>
        </div>
        <div className='flex flex-col justify-center items-center mb-3'>
          <span className='text-white font-bold mb-2'>Ikea</span>
          <div className='flex items-center w-full'>
            <div className='w-6 h-6 flex items-center justify-center mr-2'>
              <img src={documentThumbnail} className='h-4 w-auto' />
            </div>
            <span className='text-white font-bold pr-2'>JEF - W27 : Provide the training</span>
          </div>
        </div>
        <div className='absolute bottom-4 right-4'>
          <div className='flex items-center justify-center bg-white rounded-full w-8 h-8 outline outline-1 shadow-xl'>
            <img src={minusThumbnail} className='h-auto w-4' />
          </div>
        </div>
      </div>

      <ReactModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        id={type}
        className='w-4/5 max-h-96 bg-white p-4 overflow-auto rounded-sm flex flex-col items-center justify-center'
        style={{
          overlay: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        {type === 'client' && <div className='text-lg font-bold'>Clients</div>}
        {type === 'task' && <div className='text-lg font-bold'>Tasks</div>}
        {type === 'user' && <div className='text-lg font-bold'>Users</div>}
        {type === 'client' &&
          clientList.map((client, index) => (
            <ClientItem key={index} client={client} selectedClient={selectedClient} onSelect={onSelectClient} />
          ))}
        {type === 'task' &&
          taskList.map((task, index) => <TaskItem key={index} task={task} selectedTask={selectedTask} onSelect={onSelectTask} />)}
        {type === 'user' &&
          users.map((user, index) => <UserItem key={index} user={user} selectedUser={selectedUser} onSelect={onSelectUser} />)}
      </ReactModal>
    </div>
  );
}

export default Tasks;
