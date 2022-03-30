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
import MainResponsive from '../../containers/main/MainResponsive';
import GroupItemView from '../../containers/main/GroupItemView';
import { useSpring, animated } from 'react-spring';
import useResizeObserver from 'use-resize-observer';
import AnimatedDropView from '../../components/common/AnimatedDropView';

ReactModal.setAppElement('#root');

function Tasks(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showClient, setShowClient] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

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

  const { ref, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>();

  React.useEffect(() => {
    onTaskSearch();
    const user_id = account?.user.user_id;
    user_id && _sendGetMyClients(user_id);

    const creator_id = account?.user.user_id;
    creator_id && _getUserTasks(creator_id);
    creator_id && _sendMyProject(creator_id);

    _getUserAll();
  }, []);
  React.useEffect(() => {
    console.log('+++++', sendUCTPRes);
    if (sendUCTPRes) {
      setWeekTask(sendUCTPRes);
    }
  }, [sendUCTPRes]);
  React.useEffect(() => {
    if (sendUCTPErr) {
      setWeekTask([]);
    }
  }, [sendUCTPErr]);
  React.useEffect(() => {
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
    setShowClient(!showClient);
  };
  const openProjects = () => {
    setShowProject(!showProject);
  };
  const openTasks = () => {
    setShowTask(!showTask);
  };
  const openCalendar = () => {
    setShowCalendar(!showCalendar);
  };
  const openUsers = () => {
    setShowUser(!showUser);
  };
  const onSelectClient = (client: ClientState) => {
    setSelectedClient(preSelectedClient => (preSelectedClient?.client_id === client?.client_id ? null : client));
    setShowClient(false);
  };
  const onSelectProject = (project: ProjectState) => {
    setSelectedProject(preSelectedProject => (preSelectedProject?.project_id === project?.project_id ? null : project));
    setShowProject(false);
  };
  const onSelectTask = (task: TaskState) => {
    setSelectedTask(preSelectedTask => (preSelectedTask?.task_id === task?.task_id ? null : task));
    setShowTask(false);
  };
  const onSelectUser = (user: UserState) => {
    setSelectedUser(preSelectedUser => (preSelectedUser?.user_id === user?.user_id ? null : user));
    setShowUser(false);
  };
  const onSelectDate = (moment: Moment) => {
    setSelectedMoment(moment);
    setShowCalendar(false);
  };
  const onTaskSearch = () => {
    const params = {
      user_id: account?.user.user_id,
      member_id: null,
      client_id: selectedClient?.client_id,
      project_id: selectedProject?.project_id,
      planned_end_date: selectedDate,
    };
    console.log('------', params);
    _sendUCTP(params);
  };
  const clientProps = useSpring({
    height: showClient ? height : 0,
  });
  const projectProps = useSpring({
    height: showProject ? height : 0,
  });
  const taskProps = useSpring({
    height: showTask ? height : 0,
  });
  const userProps = useSpring({
    height: showUser ? height : 0,
  });

  return (
    <MainResponsive>
      <TaskCalender selectedDate={selectedDate} onSelectDay={onSelectDay} />
      <div className='flex justify-between items-center px-4 pt-4 pb-2 w-full'>
        <span className='text-white font-bold flex-1 truncate'>{new Date(selectedDate).toLocaleDateString(undefined, options)}</span>
        <span className='text-white'>On time: 90%</span>
      </div>
      <GroupItemView className='mx-4 p-4 border-rouge-blue border-4 bg-card-gray'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-white text-lg font-bold pr-2'>Client :</span>
          <div className='border-dotted border-b-4 border-white flex-1 self-end' />
          <div className='text-rouge-blue text-lg font-bold px-2'>{selectedClient?.client_name}</div>
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openClients}>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <AnimatedDropView show={showClient}>
          {clientList.map((client, index) => (
            <ClientItem key={index} client={client} selectedClient={selectedClient} onSelect={onSelectClient} />
          ))}
        </AnimatedDropView>

        <div className='flex justify-between items-center mb-2'>
          <span className='text-white text-lg font-bold pr-2'>Project :</span>
          <div className='border-dotted border-b-4 border-white flex-1 self-end' />
          <div className='text-rouge-blue text-lg font-bold px-2'>{selectedProject?.project_name}</div>
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openProjects}>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <AnimatedDropView show={showProject}>
          {projectList.map((project, index) => (
            <ProjectModalItem key={index} project={project} selectedProject={selectedProject} onSelect={onSelectProject} />
          ))}
        </AnimatedDropView>

        <div className='flex justify-between items-center mb-2'>
          <span className='text-white text-lg font-bold pr-2'>Task :</span>
          <div className='border-dotted border-b-4 border-white flex-1 self-end' />
          <div className='text-rouge-blue text-lg font-bold px-2'>{selectedTask?.task_name}</div>
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openTasks}>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <AnimatedDropView show={showTask}>
          {taskList.map((task, index) => (
            <TaskModalItem key={index} task={task} selectedTask={selectedTask} onSelect={onSelectTask} />
          ))}
        </AnimatedDropView>

        <div className='flex justify-between items-center mb-2'>
          <span className='text-white text-lg font-bold pr-2'>Deliverable :</span>
          <div className='border-dotted border-b-4 border-white flex-1 self-end' />
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue'>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-white text-lg font-bold pr-2'>Who :</span>
          <div className='border-dotted border-b-4 border-white flex-1 self-end' />
          <div className='text-rouge-blue text-lg font-bold px-2'>{selectedUser?.display_name}</div>
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openUsers}>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <AnimatedDropView show={showUser}>
          {users.map((user, index) => (
            <UserItem key={index} user={user} selectedUser={selectedUser} onSelect={onSelectUser} />
          ))}
        </AnimatedDropView>

        <div className='flex justify-between items-center mb-2'>
          <span className='text-white text-lg font-bold pr-2'>When :</span>
          <div className='border-dotted border-b-4 border-white flex-1 self-end' />
          <div className='text-rouge-blue text-lg font-bold px-2'>{selectedMoment?.format('YYYY-MM-DD')}</div>
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openCalendar}>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        {showCalendar && (
          <div className='flex justify-between items-center mb-2 bg-white'>
            <CustomCalender onSelect={onSelectDate} selectedMoment={selectedMoment} />
          </div>
        )}
        <div className='flex items-center justify-end'>
          <div className='flex items-center justify-end bg-white rounded-full p-2 outline outline-1 shadow-xl' onClick={onTaskSearch}>
            <img src={plusThumbnail} className='h-5 w-auto' />
          </div>
        </div>
      </GroupItemView>
      <div className='flex justify-center items-center p-2 mt-4 w-full'>
        <span className='text-white font-bold'>{account?.user.display_name + ' tasks week ' + getWeek(selectedDate)}</span>
      </div>
      <GroupItemView className='mx-4 px-4 pt-4 pb-10 rounded-md relative'>
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
      </GroupItemView>
    </MainResponsive>
  );
}

export default Tasks;
