import React, { useState, useRef } from 'react';
import { controlThumbnail, minusThumbnail, plusThumbnail } from '../../assets/images';
import ReactModal from 'react-modal';
import { UserState } from '../../modules/user';
import useRequest from '../../lib/hooks/useRequest';
import {
  getTeamMembers,
  getUserTasks,
  ResponseUCTP,
  sendAssignTask,
  sendCreateDeliverable,
  sendCreateTask,
  sendGetMyClients,
  sendMyProject,
  sendPriorityByWeek,
  sendProjectWithClientId,
  sendSetClient,
  sendTaskWithProjectId,
  sendUCTP,
  sendUpdateTask,
} from '../../lib/api';
import { ClientState } from '../../modules/client';
import { TaskAssignState, TaskState } from '../../modules/task';
import { ProjectState } from '../../modules/project';
import TaskItem from '../../components/task/TaskItem';
import { format, getWeek } from 'date-fns';
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
import { toast } from 'react-toastify';
import { DeliverableState } from '../../modules/deliverable';

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
  const [deliverableValue, setDeliverableValue] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserState | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [weekTasks, setWeekTask] = useState<ResponseUCTP[]>([]);
  const [taskValue, setTaskValue] = React.useState('');
  const [hasFocus, setFocus] = useState(false);

  const { account } = useAuth();
  const taskRef = useRef<HTMLInputElement>(null);

  const [_sendGetMyClients, , getMyClientsRes] = useRequest(sendGetMyClients);
  const [_sendTaskWithProjectId, , sendTaskWithProjectIdRes] = useRequest(sendTaskWithProjectId);
  const [_sendMyProject, , sendMyProjectRes] = useRequest(sendMyProject);
  const [_sendProjectWithClientId, , sendProjectWithClientIdRes] = useRequest(sendProjectWithClientId);
  const [_sendPriorityByWeek, , sendPriorityByWeekRes] = useRequest(sendPriorityByWeek);
  const [_getTeamMembers, , getTeamMembersRes] = useRequest(getTeamMembers);
  const [_sendSetClient, , sendSetClientRes] = useRequest(sendSetClient);
  const [_sendUpdateTask, , sendUpdateTaskRes] = useRequest(sendUpdateTask);
  const [_sendCreateTask, , createTaskRes] = useRequest(sendCreateTask);
  const [_sendAssignTask, , sendAssignTaskRes] = useRequest(sendAssignTask);
  const [_sendCreateDeliverable, , sendCreateDeliverableRes] = useRequest(sendCreateDeliverable);
  const [_sendUCTP, , sendUCTPRes] = useRequest(sendUCTP);

  React.useEffect(() => {
    const owner_id = account?.user.user_id;
    owner_id && _getTeamMembers(owner_id);
  }, []);
  React.useEffect(() => {
    const params = {
      user_id: account?.user.user_id,
      member_id: null,
      client_id: selectedClient?.client_id,
      project_id: selectedProject?.project_id,
      planned_end_date: selectedDay || selectedDate,
    };
    _sendUCTP(params);
  }, [getWeek(selectedDate)]);
  React.useEffect(() => {
    if (sendUCTPRes) {
      setWeekTask(sendUCTPRes);
    }
  }, [sendUCTPRes]);
  React.useEffect(() => {
    if (getMyClientsRes) {
      setClientList(getMyClientsRes.clients);
    }
  }, [getMyClientsRes]);
  React.useEffect(() => {
    if (sendMyProjectRes) {
      setProjectList(sendMyProjectRes.project);
    }
  }, [sendMyProjectRes]);
  React.useEffect(() => {
    if (sendProjectWithClientIdRes) {
      setProjectList(sendProjectWithClientIdRes.project);
    }
  }, [sendProjectWithClientIdRes]);
  React.useEffect(() => {
    if (sendTaskWithProjectIdRes) {
      setTaskList(sendTaskWithProjectIdRes.task);
    }
  }, [sendTaskWithProjectIdRes]);
  React.useEffect(() => {
    if (getTeamMembersRes) {
      getUsers(getTeamMembersRes.member);
    }
  }, [getTeamMembersRes]);
  const resetSelectedValues = () => {
    setProjectList([]);
    setTaskList([]);
    setSelectedClient(null);
    setSelectedProject(null);
    setSelectedTask(null);
    setTaskValue('');
    setDeliverableValue('');
    setSelectedUser(null);
    setSelectedDay(null);
  };

  const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

  const openClients = () => {
    if (showClient) {
      setShowClient(false);
    } else {
      setShowClient(true);

      const user_id = account?.user.user_id;
      user_id && _sendGetMyClients(user_id);
    }
  };
  const openProjects = () => {
    if (showProject) {
      setShowProject(false);
    } else {
      setShowProject(true);
    }
  };
  const openCalendar = () => {
    setShowCalendar(!showCalendar);
  };
  const openUsers = () => {
    setShowUser(!showUser);
  };
  const onSelectClient = (client: ClientState) => {
    if (selectedClient?.client_id === client.client_id) {
      setSelectedClient(null);
      resetSelectedValues();
    } else {
      setSelectedClient(client);
      setSelectedProject(null);
      setSelectedTask(null);
      setDeliverableValue('');
      setSelectedUser(null);
      setSelectedDay(null);

      const creator_id = account?.user.user_id;
      const client_id = client.client_id;
      _sendProjectWithClientId(creator_id, client_id);
    }

    setShowClient(false);
  };
  const onSelectProject = (project: ProjectState) => {
    if (selectedProject?.project_id === project.project_id) {
      setSelectedProject(null);
    } else {
      setSelectedProject(project);
    }
    const creator_id = account?.user.user_id;
    const project_id = project.project_id;
    _sendTaskWithProjectId(creator_id, project_id);

    if (!project.client_id) {
      setShowProjectModal(true);
      return;
    }
    setShowProject(false);
  };
  const onSelectTask = (task: TaskState) => {
    setTaskValue(task.task_name);
    setSelectedTask(task);

    if (!task.project_id) {
      setShowTaskModal(true);
      return;
    }

    setFocus(false);
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
  const onAddTask = () => {
    if (!account) return;
    if (!selectedClient) {
      toast.error('select client');
      return;
    }
    if (!selectedProject) {
      toast.error('select project');
      return;
    }
    if (!selectedUser) {
      toast.error('select user');
      return;
    }
    if (!selectedDay) {
      toast.error('select date');
      return;
    }
    if (!taskValue) {
      toast.error('select task');
      return;
    }

    if (selectedTask === null) {
      const newTask: TaskState = {
        task_id: null,
        creator_id: account?.user.user_id,
        project_id: null,
        task_name: taskValue,
        description: 'test task',
        planned_start_date: null,
        planned_end_date: format(selectedDay, 'yyyy-MM-dd'),
        actual_start_date: null,
        actual_end_date: null,
        hourly_rate: 50,
        is_add_all: false,
        is_active: true,
        is_deleted: 0,
      };
      _sendCreateTask(newTask);
    } else {
      if (selectedUser && selectedTask.task_id) {
        const newAssign: TaskAssignState = {
          assign_id: null,
          task_id: selectedTask.task_id,
          member_id: selectedUser?.user_id,
          role_id: 3,
        };
        _sendAssignTask(newAssign);
      }
    }
  };
  React.useEffect(() => {
    if (createTaskRes && createTaskRes.task.task_id) {
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
      const newTaskList = taskList;
      newTaskList.unshift(updateTask);
      setTaskList(newTaskList);

      if (selectedUser) {
        const newAssign: TaskAssignState = {
          assign_id: null,
          task_id: createTaskRes.task.task_id,
          member_id: selectedUser?.user_id,
          role_id: 3,
        };
        _sendAssignTask(newAssign);
      }
    }
  }, [createTaskRes]);
  React.useEffect(() => {
    if (sendAssignTaskRes) {
      if (deliverableValue === '') {
        resetSelectedValues();
        toast.success('new task created successfully');
      } else {
        if (selectedUser && selectedTask?.task_id && selectedDay) {
          const deliverable: DeliverableState = {
            deliverable_id: null,
            deliverable_name: deliverableValue,
            user_id: selectedUser?.user_id,
            task_id: selectedTask?.task_id,
            periority_id: null,
            budget: 50,
            planned_end_date: format(selectedDay, 'yyyy-MM-dd'),
            end_date: null,
            is_completed: 0,
          };
          _sendCreateDeliverable(deliverable);
        }
      }
    }
  }, [sendAssignTaskRes]);
  React.useEffect(() => {
    if (sendCreateDeliverableRes) {
      resetSelectedValues();
      toast.success('new deliverable created successfully');
    }
  }, [sendCreateDeliverableRes]);
  const changeDeliverableValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeliverableValue(event.target.value);
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
      setShowProjectModal(false);
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
      project_id: selectedTask.project_id,
      task_name: selectedTask.task_name,
      description: selectedTask.description,
      planned_start_date: selectedTask.planned_start_date,
      planned_end_date: selectedTask.planned_end_date,
      actual_start_date: selectedTask.actual_start_date,
      actual_end_date: selectedTask.actual_end_date,
      hourly_rate: selectedTask.hourly_rate,
      is_add_all: selectedTask.is_add_all,
      is_active: selectedTask.is_active,
      is_deleted: selectedTask.is_deleted,
    };
    _sendUpdateTask(newTask);
  };
  React.useEffect(() => {
    if (sendUpdateTaskRes) {
      setShowTaskModal(false);
      const newTaskList = taskList.map(task => {
        if (task.task_id === sendUpdateTaskRes.task_id) {
          return sendUpdateTaskRes;
        }
        return task;
      });
      setTaskList(newTaskList);
    }
  }, [sendUpdateTaskRes]);
  const handleTaskChange = (event: React.FormEvent<HTMLInputElement>) => {
    setSelectedTask(null);
    setTaskValue(event.currentTarget.value);
  };
  const filtered = !taskValue ? taskList : taskList.filter(task => task.task_name.toLowerCase().includes(taskValue.toLowerCase()));

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

        <div className='flex justify-between items-center mb-2 text-white font-bold'>
          <span className='text-lg font-bold pr-2'>Task :</span>
          <div className='ml-4 flex flex-1 w-full relative'>
            <input
              ref={taskRef}
              type='text'
              value={taskValue}
              onChange={handleTaskChange}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              className='w-full bg-card-gray focus:outline-none truncate'
            />
          </div>
        </div>
        <AnimatedDropView show={hasFocus}>
          {filtered.map((task, index) => (
            <TaskNameItem key={index} task={task} selectedTask={selectedTask} onSelect={onSelectTask} />
          ))}
        </AnimatedDropView>

        <div className='flex flex-row items-center text-xl font-bold text-white'>
          <div>Deliverable :</div>
          <div className='ml-4 flex flex-1 w-full'>
            <input
              type='text'
              name='textValue'
              className='w-full bg-card-gray focus:outline-none truncate'
              value={deliverableValue}
              onChange={changeDeliverableValue}
            />
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
          <div className='flex items-center justify-end bg-white rounded-full p-2 outline outline-1 shadow-xl' onClick={onAddTask}>
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
