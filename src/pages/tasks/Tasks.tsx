import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { controlThumbnail, documentThumbnail, minusThumbnail, plusThumbnail } from '../../assets/images';
import ReactModal from 'react-modal';
import { accountState, AccountState, UserState } from '../../modules/user';
import useRequest from '../../lib/hooks/useRequest';
import { getUserAll, getUserTasks, ResponseUCTP, sendGetMyClients, sendMyProject, sendUCTP } from '../../lib/api';
import ClientItem from '../../components/task/ClientItem';
import TaskCalender from '../../components/task/TaskCalender';
import { ClientState } from '../../modules/client';
import { PriorityTaskState, TaskState } from '../../modules/task';
import TaskModalItem from '../../components/task/TaskModalItem';
import UserItem from '../../components/task/UserItem';
import CustomCalender from '../../components/common/CustomCalender';
import { Moment } from 'moment';
import { ProjectState } from '../../modules/project';
import ProjectModalItem from '../../components/task/ProjectModalItem';
import TaskItem from '../../components/task/TaskItem';
import { getWeek } from 'date-fns';

ReactModal.setAppElement('#root');

const initValue: PriorityTaskState[] = [
  {
    client_id: 2,
    client_name: 'Amazon co',
    task: [
      {
        task_id: 14,
        task_name: 'fasdfsdf',
        creator_id: 3,
        project_id: 2,
        priority: 1,
        description: 'dfsdfsd',
        planned_start_date: null,
        planned_end_date: null,
        actual_start_date: null,
        actual_end_date: null,
        hourly_rate: 323,
        is_add_all: false,
        is_active: false,
      },
      {
        task_id: 15,
        task_name: 'fasdfsdfsddfsdf',
        creator_id: 3,
        project_id: 2,
        priority: 1,
        description: 'dfsdfsd',
        planned_start_date: null,
        planned_end_date: null,
        actual_start_date: null,
        actual_end_date: null,
        hourly_rate: 323,
        is_add_all: false,
        is_active: false,
      },
    ],
  },
];

function Tasks(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [type, setType] = useState('');
  const [clientList, setClientList] = useState<ClientState[]>([]);
  const [projectList, setProjectList] = useState<ProjectState[]>([]);
  const [taskList, setTaskList] = useState<TaskState[]>([]);
  const [users, getUsers] = React.useState<UserState[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientState | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectState | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskState | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserState | null>(null);
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [weekTasks, setWeekTask] = useState<ResponseUCTP[]>([]);

  const account = useRecoilValue<AccountState | null>(accountState);

  const [_sendGetMyClients, , getMyClientsRes] = useRequest(sendGetMyClients);
  const [_getUserTasks, , getUserTasksRes] = useRequest(getUserTasks);
  const [_getUserAll, , getUserAllRes] = useRequest(getUserAll);
  const [_sendMyProject, , sendMyProjectRes] = useRequest(sendMyProject);
  const [_sendUCTP, , sendUCTPRes, sendUCTPErr] = useRequest(sendUCTP);

  React.useEffect(() => {
    _sendUCTP();
    const user_id = account?.user.user_id;
    user_id && _sendGetMyClients(user_id);

    const creator_id = account?.user.user_id;
    creator_id && _getUserTasks(creator_id);
    creator_id && _sendMyProject(creator_id);

    _getUserAll();
  }, []);
  React.useEffect(() => {
    console.log('&&&&&&&&&&&&&&&', sendUCTPRes);
    if (sendUCTPRes) {
      setWeekTask(sendUCTPRes);
    }
  }, [sendUCTPRes]);
  React.useEffect(() => {
    console.log('&&&&&&&&&&&&&&&', sendUCTPErr);
    if (sendUCTPErr) {
      setWeekTask([]);
    }
  }, [sendUCTPErr]);
  React.useEffect(() => {
    console.log('getMyClientsRes=', getMyClientsRes);
    if (getMyClientsRes) {
      setClientList(getMyClientsRes.clients);
    }
  }, [getMyClientsRes]);
  React.useEffect(() => {
    if (sendMyProjectRes) {
      setProjectList(sendMyProjectRes.res);
    }
  }, [sendMyProjectRes]);
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
    setSelectedDate(cloneDay);
  };
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

  const openClients = () => {
    setType('client');
    setShowModal(!showModal);
  };
  const openProjects = () => {
    setType('project');
    setShowModal(!showModal);
  };
  const openTasks = () => {
    setType('task');
    setShowModal(!showModal);
  };
  const openCalendar = () => {
    setType('calendar');
    setShowCalendar(!showCalendar);
  };
  const openUsers = () => {
    setType('user');
    setShowModal(!showModal);
  };
  const onSelectClient = (client: ClientState) => {
    setSelectedClient(preSelectedClient => (preSelectedClient?.client_id === client?.client_id ? null : client));
    setShowModal(false);
  };
  const onSelectProject = (project: ProjectState) => {
    setSelectedProject(preSelectedProject => (preSelectedProject?.project_id === project?.project_id ? null : project));
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
  const onSelectDate = (moment: Moment) => {
    setSelectedMoment(moment);
    setType('');
    setShowCalendar(false);
  };
  const onTaskSearch = () => {
    const params = {
      member_id: null,
      client_id: selectedClient?.client_id,
      project_id: selectedProject?.project_id,
      planned_end_date: selectedDate,
    };
    console.log(params);
    _sendUCTP(params);
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
          <div className='border-dashed text-rouge-blue px-2'>{selectedProject?.project_name}</div>
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openProjects}>
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
          <div className='border-dashed text-rouge-blue px-2'>{selectedMoment?.format('YYYY-MM-DD')}</div>
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openCalendar}>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        {type === 'calendar' && showCalendar && (
          <div className='flex justify-between items-center mb-2 bg-white'>
            <CustomCalender onSelect={onSelectDate} selectedMoment={selectedMoment} />
          </div>
        )}
        <div className='flex items-center justify-end'>
          <div className='flex items-center justify-end bg-white rounded-full p-2 outline outline-1 shadow-xl' onClick={onTaskSearch}>
            <img src={plusThumbnail} className='h-5 w-auto' />
          </div>
        </div>
      </div>
      <div className='flex justify-center items-center p-2 mt-4 w-full'>
        <span className='text-white font-bold'>{account?.user.display_name + ' tasks week ' + getWeek(selectedDate)}</span>
      </div>
      <div className='mx-4 px-4 pt-4 pb-10 bg-card-gray rounded-md w-full relative'>
        {weekTasks.map(item => (
          <div key={item.client_id} className='flex flex-col justify-center items-center mb-3'>
            <span className='text-white font-bold mb-2'>{item.client_name}</span>
            {item.task.map(task => (
              <TaskItem key={task.task_id} task={task} />
            ))}
          </div>
        ))}
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
        {type === 'project' && <div className='text-lg font-bold'>Projects</div>}
        {type === 'task' && <div className='text-lg font-bold'>Tasks</div>}
        {type === 'user' && <div className='text-lg font-bold'>Users</div>}
        {type === 'client' &&
          clientList.map((client, index) => (
            <ClientItem key={index} client={client} selectedClient={selectedClient} onSelect={onSelectClient} />
          ))}
        {type === 'project' &&
          projectList.map((project, index) => (
            <ProjectModalItem key={index} project={project} selectedProject={selectedProject} onSelect={onSelectProject} />
          ))}
        {type === 'task' &&
          taskList.map((task, index) => <TaskModalItem key={index} task={task} selectedTask={selectedTask} onSelect={onSelectTask} />)}
        {type === 'user' &&
          users.map((user, index) => <UserItem key={index} user={user} selectedUser={selectedUser} onSelect={onSelectUser} />)}
      </ReactModal>
    </div>
  );
}

export default Tasks;
