import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { controlThumbnail, plusThumbnail } from '../../assets/images';
import { accountState, AccountState } from '../../modules/user';
import ReactModal from 'react-modal';
import useRequest from '../../lib/hooks/useRequest';
import {
  getUserTasks,
  sendGetMyClients,
  sendMyProject,
  sendPriorityByBeforeWeek,
  sendPriorityByWeek,
  sendUpdatePriority,
} from '../../lib/api';
import PriorityItem from '../../components/priority/PriorityItem';
import Tag from '../../components/common/Tag';
import { getWeek, isEqual, isSameDay, parseISO } from 'date-fns';
import PastPriorityView from '../../containers/priority/PastPriorityView';
import TaskCalender from '../../components/task/TaskCalender';
import { DeliverablesTab } from '../../modules/tab';
import { PriorityState } from '../../modules/weekPriority';
import { DeliverableState } from '../../modules/deliverable';
import { ClientState } from '../../modules/client';
import { ProjectState } from '../../modules/project';
import { TaskState } from '../../modules/task';
import ClientItem from '../../components/task/ClientItem';
import ProjectModalItem from '../../components/task/ProjectModalItem';
import TaskModalItem from '../../components/task/TaskModalItem';
import DeliverableItem from '../../components/deliverable/DeliverableItem';
import DeliverableWeelyPriority from '../../components/deliverable/DeliverableWeelyPriority';
import axios from 'axios';
import DeliverableModalItem from '../../components/deliverable/DeliverableModalItem';
import { toast } from 'react-toastify';

const thisWeek = getWeek(new Date());
function Deliverables(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDeliverableTab, setSelectedDeliverableTab] = useState('default');
  const [rememberWeeklyPriorities, setRememberWeeklyPriorities] = useState<PriorityState[]>([]);
  const [todayDeliverables, setTodayDeliverables] = useState<DeliverableState[]>([]);
  const [weekDeliverables, setWeekDeliverables] = useState<PriorityState[]>([]);
  const [type, setType] = useState('');
  const [clientList, setClientList] = useState<ClientState[]>([]);
  const [projectList, setProjectList] = useState<ProjectState[]>([]);
  const [taskList, setTaskList] = useState<TaskState[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientState | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectState | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskState | null>(null);
  const [selectedDeliverable, setSelectedDeliverable] = useState<PriorityState | null>(null);
  const [showModal, setShowModal] = useState(false);

  const account = useRecoilValue<AccountState | null>(accountState);

  const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  const [_sendPriorityByWeek, , sendPriorityByWeekRes] = useRequest(sendPriorityByWeek);
  const [_sendPriorityByBeforeWeek, , sendPriorityByBeforeWeekRes] = useRequest(sendPriorityByBeforeWeek);
  const [_sendGetMyClients, , getMyClientsRes] = useRequest(sendGetMyClients);
  const [_getUserTasks, , getUserTasksRes] = useRequest(getUserTasks);
  const [_sendMyProject, , sendMyProjectRes] = useRequest(sendMyProject);
  const [_sendUpdatePriority, , sendUpdatePriorityRes] = useRequest(sendUpdatePriority);

  React.useEffect(() => {
    const user_id = account?.user.user_id;
    user_id && _sendGetMyClients(user_id);

    const creator_id = account?.user.user_id;
    creator_id && _getUserTasks(creator_id);
    creator_id && _sendMyProject(creator_id);
  }, []);
  React.useEffect(() => {
    if (!account) {
      return;
    }
    const newTodayDeliverables: DeliverableState[] = todayDeliverables;
    rememberWeeklyPriorities.map(item => {
      if (!item.end_date) return;

      if (isSameDay(parseISO(item.end_date.toLocaleString()), selectedDate)) {
        const completePriority: DeliverableState = {
          wp_id: item.wp_id,
          user_id: item.user_id,
          week: item.week,
          priority_num: item.priority_num,
          goal: item.deliverable,
          deliverable: item.deliverable,
          detail: item.detail || null,
          is_completed: item.is_completed,
          is_weekly: item.is_weekly,
          end_date: item.end_date,
        };
        newTodayDeliverables.push(completePriority);
      }
    });
    setTodayDeliverables(newTodayDeliverables);
  }, [rememberWeeklyPriorities]);
  React.useEffect(() => {
    const user_id = account?.user.user_id;
    const week = getWeek(selectedDate);
    _sendPriorityByWeek(user_id, week);
  }, [getWeek(selectedDate)]);
  React.useEffect(() => {
    if (sendPriorityByWeekRes) {
      setRememberWeeklyPriorities(sendPriorityByWeekRes.priority);
      setWeekDeliverables(sendPriorityByWeekRes.priority);
      const user_id = account?.user.user_id;
      const week = getWeek(selectedDate);
      _sendPriorityByBeforeWeek(user_id, week);
    }
  }, [sendPriorityByWeekRes]);
  React.useEffect(() => {
    if (sendPriorityByBeforeWeekRes) {
      const oldWeelyPriorities = rememberWeeklyPriorities;
      sendPriorityByBeforeWeekRes.priority.map(item => oldWeelyPriorities.push(item));
      setRememberWeeklyPriorities(oldWeelyPriorities);
    }
  }, [sendPriorityByBeforeWeekRes]);
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
  const onSelectDay = (cloneDay: Date, dayStr: string) => {
    setSelectedDate(cloneDay);
  };
  const onSelectDeliverableTab = (key: string) => {
    setSelectedDeliverableTab(preSelectedProject => (preSelectedProject === key ? 'default' : key));
  };
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
  const openDeliverables = () => {
    setType('deliverable');
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
  const onSelectDeliverable = (deliverable: PriorityState) => {
    setSelectedDeliverable(deliverable);
    setShowModal(false);
  };
  const onAddDeliverable = () => {
    if (!selectedDeliverable) {
      toast.error('select deliverable!');
      return;
    }
    if (account) {
      const deliverable: DeliverableState = {
        wp_id: selectedDeliverable?.wp_id,
        user_id: account?.user.user_id,
        week: getWeek(selectedDate),
        priority_num: 1,
        goal: selectedDeliverable.deliverable,
        deliverable: selectedDeliverable?.deliverable,
        detail: selectedDeliverable?.detail || null,
        is_completed: 1,
        is_weekly: null,
        end_date: selectedDate,
      };
      _sendUpdatePriority(deliverable);
    }
  };
  React.useEffect(() => {
    if (sendUpdatePriorityRes) {
      const newDeliverables = todayDeliverables;
      newDeliverables.push(sendUpdatePriorityRes);
      setTodayDeliverables(newDeliverables);
      setSelectedClient(null);
      setSelectedProject(null);
      setSelectedTask(null);
      setSelectedDeliverableTab('default');
    }
  }, [sendUpdatePriorityRes]);

  return (
    <div className='items-center flex flex-col flex-1 px-4 pt-4 pb-32'>
      <TaskCalender selectedDate={selectedDate} onSelectDay={onSelectDay} />
      <div className='flex justify-between items-center px-4 pt-4 pb-2 w-full'>
        <span className='text-white font-bold flex-1 truncate'>{new Date(selectedDate).toLocaleDateString(undefined, options)}</span>
        <span className='text-white'>{todayDeliverables.length * 50 + '%'}</span>
      </div>
      <div className='mx-4 p-4 bg-card-gray shadow-xl w-full rounded-md'>
        {todayDeliverables.map((item, index) => (
          <DeliverableItem key={index} index={index} deliverable={item} />
        ))}
      </div>
      <div className='flex justify-center items-center p-2 mt-4 w-full'>
        <span className='text-white font-bold text-center'>At least 2 deliverable per day</span>
      </div>
      <div className='mx-4 px-4 pt-4 pb-14 bg-card-gray w-full border-rouge-blue border-4 relative'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-white font-bold pr-2'>Client :</span>
          <div className='border-dashed border-2 border-white flex-1' />
          <div className='border-dashed text-rouge-blue px-2'>{selectedClient?.client_name}</div>
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openClients}>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-white font-bold pr-2'>Project :</span>
          <div className='border-dashed border-2 border-white flex-1' />
          <div className='border-dashed text-rouge-blue px-2'>{selectedProject?.project_name}</div>
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openProjects}>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-white font-bold pr-2'>Task :</span>
          <div className='border-dashed border-2 border-white flex-1' />
          <div className='border-dashed text-rouge-blue px-2'>{selectedTask?.task_name}</div>
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openTasks}>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-white font-bold pr-2 truncate'>Deliverable :</span>
          <div className='border-dashed border-2 border-white flex-1' />
          <div className='border-dashed text-rouge-blue px-2 truncate'>{selectedDeliverable?.deliverable}</div>
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openDeliverables}>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <div className='absolute -bottom-1 left-0 w-full flex flex-row justify-evenly items-center'>
          {DeliverablesTab.map(item => (
            <div
              key={item.key}
              className='bg-menu-back rounded-t-md px-2'
              onClick={() => onSelectDeliverableTab(item.key)}
              style={{ background: selectedDeliverableTab === item.key ? 'white' : '#365B9D' }}
            >
              <span className='text-sm' style={{ color: selectedDeliverableTab === item.key ? '#DD0000' : 'white' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <div className='absolute bottom-6 right-2'>
          <div className='flex items-center justify-end bg-white rounded-full p-2 outline outline-1 shadow-xl' onClick={onAddDeliverable}>
            <img src={plusThumbnail} className='h-5 w-auto' />
          </div>
        </div>
      </div>
      <div className='flex justify-center items-center px-4 pt-6 pb-2 w-full'>
        <span className='text-white font-bold truncate'>Remember your weekly priorities</span>
      </div>
      <div className='mx-4 p-4 bg-card-gray shadow-xl w-full rounded-md'>
        {rememberWeeklyPriorities.map((item, index) => (
          <DeliverableWeelyPriority key={index} priority={item} />
        ))}
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
        {type === 'deliverable' && <div className='text-lg font-bold'>Deliverables</div>}
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
        {type === 'deliverable' &&
          weekDeliverables.map((deliverable, index) => (
            <DeliverableModalItem
              key={index}
              deliverable={deliverable}
              selectedDeliverable={selectedDeliverable}
              onSelect={onSelectDeliverable}
            />
          ))}
      </ReactModal>
    </div>
  );
}

export default Deliverables;
