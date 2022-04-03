import React, { useState } from 'react';
import { controlThumbnail, minusThumbnail, plusThumbnail } from '../../assets/images';
import ReactModal from 'react-modal';
import { UserState } from '../../modules/user';
import useRequest from '../../lib/hooks/useRequest';
import {
  getTeamMembers,
  getUserTasks,
  ResponseUCTP,
  sendGetMyClients,
  sendMyProject,
  sendPriorityByWeek,
  sendProjectWithClientId,
  sendSetClient,
  sendTaskWithProjectId,
  sendUCTP,
  updateByTask,
} from '../../lib/api';
import { ClientState } from '../../modules/client';
import { TaskState } from '../../modules/task';
import { ProjectState } from '../../modules/project';
import TaskItem from '../../components/task/TaskItem';
import { getWeek } from 'date-fns';
import MainResponsive from '../../containers/main/MainResponsive';
import GroupItemView from '../../containers/main/GroupItemView';
import AnimatedDropView from '../../components/common/AnimatedDropView';
import { PriorityState } from '../../modules/weekPriority';
import ClientNameItem from '../../components/items/ClientNameItem';
import ProjectNameItem from '../../components/items/ProjectNameItem';
import TaskNameItem from '../../components/items/TaskNameItem';
import DeliverableNameItem from '../../components/items/DeliverableNameItem';
import UserNameItem from '../../components/items/UserNameItem';
import FullCalendar from '../../components/calendar/FullCalendar';
import WeekCalendar from '../../components/calendar/WeekCalendar';
import { useAuth } from '../../lib/context/AuthProvider';

ReactModal.setAppElement('#root');

function Tasks(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showClient, setShowClient] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [showDeliverable, setShowDeliverable] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [clientList, setClientList] = useState<ClientState[]>([]);
  const [projectList, setProjectList] = useState<ProjectState[]>([]);
  const [taskList, setTaskList] = useState<TaskState[]>([]);
  const [weeklyPriorities, setWeeklyPriorities] = useState<PriorityState[]>([]);
  const [users, getUsers] = React.useState<UserState[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientState | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectState | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskState | null>(null);
  const [selectedDeliverable, setSelectedDeliverable] = useState<PriorityState | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserState | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [weekTasks, setWeekTask] = useState<ResponseUCTP[]>([]);

  const { account } = useAuth();

  const [_sendGetMyClients, , getMyClientsRes] = useRequest(sendGetMyClients);
  const [_getUserTasks, , getUserTasksRes] = useRequest(getUserTasks);
  const [_sendTaskWithProjectId, , sendTaskWithProjectIdRes] = useRequest(sendTaskWithProjectId);
  const [_sendMyProject, , sendMyProjectRes] = useRequest(sendMyProject);
  const [_sendProjectWithClientId, , sendProjectWithClientIdRes] = useRequest(sendProjectWithClientId);
  const [_sendUCTP, , sendUCTPRes, sendUCTPErr] = useRequest(sendUCTP);
  const [_sendPriorityByWeek, , sendPriorityByWeekRes] = useRequest(sendPriorityByWeek);
  const [_getTeamMembers, , getTeamMembersRes] = useRequest(getTeamMembers);
  const [_sendSetClient, , sendSetClientRes] = useRequest(sendSetClient);
  const [_updateByTask, , updateByTaskRes, , resetUpdateByTask] = useRequest(updateByTask);

  React.useEffect(() => {
    const user_id = account?.user.user_id;
    user_id && _sendGetMyClients(user_id);

    const creator_id = account?.user.user_id;
    creator_id && _getUserTasks(creator_id);
    creator_id && _sendMyProject(creator_id);

    const week = getWeek(selectedDate);
    _sendPriorityByWeek(user_id, week);

    const owner_id = account?.user.user_id;
    owner_id && _getTeamMembers(owner_id);
  }, []);
  React.useEffect(() => {
    onTaskSearch();
  }, [getWeek(selectedDate)]);
  React.useEffect(() => {
    if (sendUCTPRes) {
      setWeekTask(sendUCTPRes);
      resetSelectedValues();
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
      setProjectList(sendMyProjectRes.project);
    }
    if (sendProjectWithClientIdRes) {
      setProjectList(sendProjectWithClientIdRes.project);
    }
  }, [sendMyProjectRes, sendProjectWithClientIdRes]);
  React.useEffect(() => {
    if (getUserTasksRes) {
      setTaskList(getUserTasksRes.task);
    }
    if (sendTaskWithProjectIdRes) {
      setTaskList(sendTaskWithProjectIdRes.task);
    }
  }, [getUserTasksRes, sendTaskWithProjectIdRes]);
  React.useEffect(() => {
    if (sendPriorityByWeekRes) {
      setWeeklyPriorities(sendPriorityByWeekRes.priority);
    }
  }, [sendPriorityByWeekRes]);
  React.useEffect(() => {
    if (getTeamMembersRes) {
      getUsers(getTeamMembersRes.member);
    }
  }, [getTeamMembersRes]);
  const resetSelectedValues = () => {
    setSelectedClient(null);
    setSelectedProject(null);
    setSelectedTask(null);
    setSelectedDeliverable(null);
    setSelectedUser(null);
    setSelectedDay(null);
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
  const openDeliverable = () => {
    setShowDeliverable(!showDeliverable);
  };
  const openCalendar = () => {
    setShowCalendar(!showCalendar);
  };
  const openUsers = () => {
    setShowUser(!showUser);
  };
  const onSelectClient = (client: ClientState) => {
    setSelectedClient(preSelectedClient => (preSelectedClient?.client_id === client?.client_id ? null : client));

    const creator_id = account?.user.user_id;
    const client_id = client.client_id;
    _sendProjectWithClientId(creator_id, client_id);

    setShowClient(false);
  };
  const onSelectProject = (project: ProjectState) => {
    setSelectedProject(project);

    if (!project.client_id) {
      setShowProjectModal(true);
      return;
    }

    const creator_id = account?.user.user_id;
    const project_id = project.project_id;
    _sendTaskWithProjectId(creator_id, project_id);

    setShowProject(false);
  };
  const onSelectTask = (task: TaskState) => {
    setSelectedTask(task);
    if (!task.project_id) {
      setShowTaskModal(true);
      return;
    }

    setShowTask(false);
  };
  const onSelectDeliverable = (priority: PriorityState) => {
    setSelectedDeliverable(preSelectedTask => (preSelectedTask?.wp_id === priority?.wp_id ? null : priority));
    setShowDeliverable(false);
  };
  const onSelectUser = (user: UserState) => {
    setSelectedUser(preSelectedUser => (preSelectedUser?.user_id === user?.user_id ? null : user));
    setShowUser(false);
  };
  const onSelectDate = (date: Date) => {
    setSelectedDate(date);
  };
  const onSelectDay = (date: Date) => {
    setSelectedDay(date);
    setShowCalendar(false);
  };
  const onTaskSearch = () => {
    const params = {
      user_id: account?.user.user_id,
      member_id: null,
      client_id: selectedClient?.client_id,
      project_id: selectedProject?.project_id,
      planned_end_date: selectedDay || selectedDate,
    };
    _sendUCTP(params);
  };
  const onCancelProjectWithClient = () => {
    setSelectedProject(null);
    setShowProjectModal(false);
  };
  const onLinkProjectWithClient = () => {
    const client_id = selectedClient?.client_id;
    const project_id = selectedProject?.project_id;
    _sendSetClient(client_id, project_id);
  };
  React.useEffect(() => {
    if (sendSetClientRes) {
      const newProjectList = projectList.map(project => {
        if (project.project_id === sendSetClientRes.project_id) {
          project.client_id = sendSetClientRes.client_id;
        }
        return project;
      });
      setProjectList(newProjectList);
      setShowProject(false);
    }
  }, [sendSetClientRes]);
  const onCancelTaskWithProject = () => {
    setSelectedTask(null);
    setShowTaskModal(false);
  };
  const onLinkTaskWithProject = () => {
    if (!selectedTask || !selectedProject?.project_id) return;
    const newTask: TaskState = {
      task_id: selectedTask.task_id,
      creator_id: selectedTask.creator_id,
      project_id: selectedProject?.project_id,
      task_name: selectedTask.task_name,
      priority: selectedTask.priority,
      deliverable: selectedTask.deliverable,
      description: selectedTask.description,
      planned_start_date: null,
      planned_end_date: null,
      actual_start_date: null,
      actual_end_date: null,
      hourly_rate: selectedTask.hourly_rate,
      is_add_all: selectedTask.is_add_all,
      is_active: selectedTask.is_active,
    };
    _updateByTask(newTask);
  };
  React.useEffect(() => {
    if (updateByTaskRes) {
      setShowTaskModal(false);
      const newTaskList = taskList.map(task => {
        if (task.task_id === updateByTaskRes.task_id) {
          return updateByTaskRes;
        }
        return task;
      });
      setTaskList(newTaskList);
    }
  }, [updateByTaskRes]);

  return (
    <MainResponsive>
      <WeekCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
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
            <ClientNameItem key={index} client={client} selectedClient={selectedClient} onSelect={onSelectClient} />
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
            <ProjectNameItem key={index} project={project} selectedProject={selectedProject} onSelect={onSelectProject} />
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
            <TaskNameItem key={index} task={task} selectedTask={selectedTask} onSelect={onSelectTask} />
          ))}
        </AnimatedDropView>

        <div className='flex justify-between items-center mb-2'>
          <span className='text-white text-lg font-bold pr-2'>Deliverable :</span>
          <div className='border-dotted border-b-4 border-white flex-1 self-end' />
          <div className='text-rouge-blue text-lg font-bold px-2'>{selectedDeliverable?.deliverable}</div>
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openDeliverable}>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <AnimatedDropView show={showDeliverable}>
          {weeklyPriorities.map((priority, index) => (
            <DeliverableNameItem key={index} priority={priority} selectedPriority={selectedDeliverable} onSelect={onSelectDeliverable} />
          ))}
        </AnimatedDropView>

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
            <UserNameItem key={index} user={user} selectedUser={selectedUser} onSelect={onSelectUser} />
          ))}
        </AnimatedDropView>

        <div className='flex justify-between items-center mb-2'>
          <span className='text-white text-lg font-bold pr-2'>When :</span>
          <div className='border-dotted border-b-4 border-white flex-1 self-end' />
          <div className='text-rouge-blue text-lg font-bold px-2'>{selectedDay?.toDateString()}</div>
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openCalendar}>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        {showCalendar && (
          <div className='flex justify-between items-center mb-2 bg-white'>
            <FullCalendar selectedDate={selectedDay || new Date()} onSelectDate={onSelectDay} />
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

      <ReactModal
        isOpen={showProjectModal}
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
        <div className='text-center'>Do you want to link this project with client</div>
        <div className='flex flex-row'>
          <div className='font-bold pr-2'>Client:</div>
          <div className='font-bold'>{selectedClient?.client_name}</div>
        </div>
        <div className='flex flex-row'>
          <div className='font-bold pr-2'>Project:</div>
          <div className='font-bold'>{selectedProject?.project_name}</div>
        </div>
        <div className='flex flex-row items-start justify-between w-full px-8 pt-4'>
          <div className='text-lg font-bold' onClick={onCancelProjectWithClient}>
            No
          </div>
          <div className='text-lg font-bold text-rouge-blue' onClick={onLinkProjectWithClient}>
            Yes
          </div>
        </div>
      </ReactModal>
      <ReactModal
        isOpen={showTaskModal}
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
        <div className='text-center'>Do you want to link this task with project</div>
        <div className='flex flex-row'>
          <div className='font-bold pr-2'>Project:</div>
          <div className='font-bold'>{selectedProject?.project_name}</div>
        </div>
        <div className='flex flex-row'>
          <div className='font-bold pr-2'>Task:</div>
          <div className='font-bold'>{selectedTask?.task_name}</div>
        </div>
        <div className='flex flex-row items-start justify-between w-full px-8 pt-4'>
          <div className='text-lg font-bold' onClick={onCancelTaskWithProject}>
            No
          </div>
          <div className='text-lg font-bold text-rouge-blue' onClick={onLinkTaskWithProject}>
            Yes
          </div>
        </div>
      </ReactModal>
    </MainResponsive>
  );
}

export default Tasks;
