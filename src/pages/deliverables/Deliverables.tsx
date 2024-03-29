import React, { useState, useEffect } from 'react';
import { controlThumbnail, plusThumbnail } from '../../assets/images';
import useRequest from '../../lib/hooks/useRequest';
import {
  getUserTasks,
  sendCreateDeliverable,
  sendGetMyClients,
  sendMyProject,
  sendPriorityByBeforeWeek,
  sendProjectWithClientId,
  sendSetClient,
  sendTaskWithProjectId,
  sendTodayDeliverable,
  sendUpdateDeliverable,
  sendUpdatePriority,
  sendUpdateTask,
  sendDeliverableInfo,
} from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { DeliverablesTab } from '../../modules/tab';
import { PriorityState } from '../../modules/weekPriority';
import { DeliverableInfoState, deliverablesExpenseKind, DeliverableState } from '../../modules/deliverable';
import { ClientState } from '../../modules/client';
import { ProjectState } from '../../modules/project';
import { TaskState } from '../../modules/task';
import { toast } from 'react-toastify';
import MainResponsive from '../../containers/main/MainResponsive';
import WeekCalendar from '../../components/calendar/WeekCalendar';
import TaskNameItem from '../../components/items/TaskNameItem';
import ProjectNameItem from '../../components/items/ProjectNameItem';
import ClientNameItem from '../../components/items/ClientNameItem';
import GroupItemView from '../../containers/main/GroupItemView';
import { useAuth } from '../../lib/context/AuthProvider';
import BeforeWeekPriority from '../../components/priority/BeforeWeekPriority';
import AnimatedDropView from '../../components/common/AnimatedDropView';
import { format, getWeek } from 'date-fns';
import ReactModal from 'react-modal';
import TodayDeliverable from '../../components/deliverable/TodayDeliverable';
import { CarSvg } from '../../assets/svg';

function Deliverables(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDeliverableTab, setSelectedDeliverableTab] = useState('default');
  const [selectedPriority, setSelectedPriority] = useState<PriorityState | null>(null);
  const [rememberWeeklyPriorities, setRememberWeeklyPriorities] = useState<PriorityState[]>([]);
  const [deliverables, setDeliverables] = useState<DeliverableState[]>([]);
  const [clientList, setClientList] = useState<ClientState[]>([]);
  const [projectList, setProjectList] = useState<ProjectState[]>([]);
  const [taskList, setTaskList] = useState<TaskState[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientState | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectState | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskState | null>(null);
  const [selectedDeliverable, setSelectedDeliverable] = useState<DeliverableState | null>(null);
  const [deliverableValue, setDeliverableValue] = useState('');
  const [showClient, setShowClient] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTaskCompletedModal, setShowTaskCompletedModal] = useState(false);
  const [percentageValue, setPercentageValue] = useState(0);
  const [isDeliverableFromPriority, setIsDeliverableFromPriority] = useState(false);
  const [isPriority, setIsPriority] = useState(false);
  const [deliverableInfo, setDeliverableInfo] = useState<DeliverableInfoState | null>(null);
  const [showExpensesKind, setShowExpensesKind] = useState(false);
  const [selectedExpensesKind, setSelectedExpensesKind] = useState<{ key: string; name: string; icon: React.ElementType } | null>(null);

  const { account } = useAuth();
  const navigate = useNavigate();

  const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  const [_sendPriorityByBeforeWeek, , sendPriorityByBeforeWeekRes] = useRequest(sendPriorityByBeforeWeek);
  const [_sendGetMyClients, , getMyClientsRes] = useRequest(sendGetMyClients);
  const [_sendProjectWithClientId, , sendProjectWithClientIdRes] = useRequest(sendProjectWithClientId);
  const [_sendTodayDeliverable, , sendTodayDeliverableRes] = useRequest(sendTodayDeliverable);
  const [_sendSetClient, , sendSetClientRes] = useRequest(sendSetClient);
  const [_sendUpdateTask, , sendUpdateTaskRes] = useRequest(sendUpdateTask);
  const [_sendCreateDeliverable, , sendCreateDeliverableRes] = useRequest(sendCreateDeliverable);
  const [_sendUpdateDeliverable, , sendUpdateDeliverableRes] = useRequest(sendUpdateDeliverable);
  const [_sendTaskWithProjectId, , sendTaskWithProjectIdRes] = useRequest(sendTaskWithProjectId);
  const [_sendUpdatePriority, , sendUpdatePriorityRes] = useRequest(sendUpdatePriority);
  const [_sendDeliverableInfo, , sendDeliverableInfoRes] = useRequest(sendDeliverableInfo);

  React.useEffect(() => {
    const user_id = account?.user.user_id;
    const planned_end_date = format(selectedDate, 'yyyy-MM-dd');
    _sendTodayDeliverable(user_id, planned_end_date);

    const week = getWeek(selectedDate, { weekStartsOn: 1, firstWeekContainsDate: 4 });
    _sendPriorityByBeforeWeek(user_id, week);
  }, [selectedDate]);

  React.useEffect(() => {
    if (sendPriorityByBeforeWeekRes) {
      setRememberWeeklyPriorities(sendPriorityByBeforeWeekRes.priority);
    }
  }, [sendPriorityByBeforeWeekRes]);
  React.useEffect(() => {
    if (sendTodayDeliverableRes) {
      setDeliverables(sendTodayDeliverableRes.deliverable);
      let percentage = 0;
      sendTodayDeliverableRes.deliverable.map(item => {
        if (item.is_completed === 1) {
          percentage += 50;
        }
      });
      setPercentageValue(percentage);
    }
  }, [sendTodayDeliverableRes]);
  React.useEffect(() => {
    if (getMyClientsRes) {
      setClientList(getMyClientsRes.clients);
    }
  }, [getMyClientsRes]);
  React.useEffect(() => {
    if (sendProjectWithClientIdRes) {
      setProjectList(sendProjectWithClientIdRes.project);
    }
  }, [sendProjectWithClientIdRes]);
  React.useEffect(() => {
    if (sendTaskWithProjectIdRes) {
      setTaskList(sendTaskWithProjectIdRes.task);
      setShowTask(true);
    }
  }, [sendTaskWithProjectIdRes]);
  const onSelectDate = (date: Date) => {
    setSelectedDate(date);
  };
  const onSelectDeliverableTab = (key: string) => {
    if (key === 'picture') {
      navigate('/deliverables/camera');
    }
    if (key === 'file') {
      navigate('/deliverables/file-manager');
    }
    setSelectedDeliverableTab(preSelectedProject => (preSelectedProject === key ? 'default' : key));
  };
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
      setSelectedTask(null);
      setShowProject(true);
    }
  };
  const openTasks = () => {
    if (showTask) {
      setShowTask(false);
    } else {
      setShowTask(true);
    }
  };
  const onSelectClient = (client: ClientState) => {
    if (selectedClient?.client_id === client.client_id) {
      setSelectedClient(null);
    } else {
      setSelectedClient(client);
      setSelectedProject(null);
      setSelectedTask(null);
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
    if (selectedTask?.task_id === task.task_id) {
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
    }
    if (!task.project_id) {
      setShowTaskModal(true);
      return;
    }
    setShowTask(false);
  };
  const onSelectDeliverable = (deliverable: DeliverableState) => {
    if (selectedDeliverable?.deliverable_id === deliverable.deliverable_id) {
      setSelectedDeliverable(null);
    } else {
      setSelectedDeliverable(deliverable);
      setShowTaskCompletedModal(true);
      const deliverable_id = deliverable.deliverable_id;
      _sendDeliverableInfo(deliverable_id);
      setSelectedDeliverableTab('details');
    }
  };
  React.useEffect(() => {
    if (sendDeliverableInfoRes) {
      console.log(sendDeliverableInfoRes);
      setDeliverableInfo(sendDeliverableInfoRes.data);
    }
  }, [sendDeliverableInfoRes]);
  const changeDeliverableValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeliverableValue(event.target.value);
  };
  const onAddDeliverable = () => {
    if (selectedDeliverableTab !== 'default') {
      setSelectedDeliverableTab('default');
      return;
    }
    if (isPriority) {
      if (account && selectedPriority && selectedPriority.wp_id && selectedTask?.task_id) {
        const deliverable: DeliverableState = {
          deliverable_id: null,
          deliverable_name: selectedPriority?.priority,
          user_id: account.user.user_id,
          task_id: selectedTask?.task_id,
          periority_id: selectedPriority.wp_id,
          budget: 50,
          planned_end_date: format(selectedDate, 'yyyy-MM-dd'),
          end_date: null,
          is_completed: 0,
        };
        _sendCreateDeliverable(deliverable);
      }
    } else {
      if (!deliverableValue) {
        toast.error('select deliverable!');
        return;
      }
      if (account && selectedTask?.task_id) {
        const deliverable: DeliverableState = {
          deliverable_id: null,
          deliverable_name: deliverableValue,
          user_id: account.user.user_id,
          task_id: selectedTask?.task_id,
          periority_id: null,
          budget: 50,
          planned_end_date: format(selectedDate, 'yyyy-MM-dd'),
          end_date: null,
          is_completed: 0,
        };
        _sendCreateDeliverable(deliverable);
      }
    }
  };
  React.useEffect(() => {
    if (sendCreateDeliverableRes) {
      setSelectedClient(null);
      setSelectedProject(null);
      setSelectedTask(null);
      setDeliverableValue('');

      const newDeliverables = deliverables;
      newDeliverables.push(sendCreateDeliverableRes);
      setDeliverables(newDeliverables);

      if (isPriority) {
        if (account && selectedPriority) {
          const priority: PriorityState = {
            wp_id: selectedPriority?.wp_id,
            user_id: selectedPriority?.user_id,
            week: selectedPriority.week,
            priority: selectedPriority.priority,
            goal: selectedPriority.goal,
            detail: selectedPriority.detail,
            is_completed: 1,
            is_weekly: selectedPriority.is_weekly,
            end_date: selectedPriority.end_date,
          };
          _sendUpdatePriority(priority);
        }
      }
    }
  }, [sendCreateDeliverableRes]);
  React.useEffect(() => {
    if (sendUpdatePriorityRes) {
      const newRememberWeeklyPriorities = rememberWeeklyPriorities.map(priority => {
        if (priority.wp_id === sendUpdatePriorityRes.wp_id) {
          return sendUpdatePriorityRes;
        } else {
          return priority;
        }
      });

      setSelectedPriority(null);
      setRememberWeeklyPriorities(newRememberWeeklyPriorities);
    }
  }, [sendUpdatePriorityRes]);
  const onSelectWeelyPriority = (priority: PriorityState) => {
    if (selectedPriority?.wp_id === priority.wp_id) {
      setSelectedPriority(null);
      setIsPriority(false);
    } else {
      if (priority.is_completed !== 1) {
        setSelectedPriority(priority);
        setIsDeliverableFromPriority(true);
      }
    }
  };
  const onCancelDeliverableFromPriority = () => {
    setSelectedPriority(null);
    setIsPriority(false);
    setIsDeliverableFromPriority(false);
  };
  const onCancelProjectWithClient = () => {
    setSelectedProject(null);
    setShowProjectModal(false);
    setShowProject(false);
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
      setShowProjectModal(false);
    }
  }, [sendSetClientRes]);
  const onCancelTaskWithProject = () => {
    setSelectedTask(null);
    setShowTask(false);
    setShowTaskModal(false);
  };
  const onLinkTaskWithProject = () => {
    if (!selectedTask || !selectedProject?.project_id) return;
    const newTask: TaskState = {
      task_id: selectedTask.task_id,
      creator_id: selectedTask.creator_id,
      project_id: selectedProject?.project_id,
      task_name: selectedTask.task_name,
      description: selectedTask.description,
      planned_start_date: null,
      planned_end_date: null,
      actual_start_date: null,
      actual_end_date: null,
      hourly_rate: selectedTask.hourly_rate,
      is_add_all: selectedTask.is_add_all,
      is_active: selectedTask.is_active,
      is_deleted: 0,
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
      setShowTask(false);
      setShowProjectModal(false);
    }
  }, [sendUpdateTaskRes]);
  const onCancelDeliverableCompleted = () => {
    setShowTaskCompletedModal(false);
  };
  const onCompletedDeliverable = () => {
    if (!selectedDeliverable) return;
    const deliverable: DeliverableState = {
      deliverable_id: selectedDeliverable?.deliverable_id,
      deliverable_name: selectedDeliverable?.deliverable_name,
      user_id: selectedDeliverable.user_id,
      task_id: selectedDeliverable.task_id,
      periority_id: selectedDeliverable.periority_id,
      budget: selectedDeliverable.budget,
      planned_end_date: selectedDeliverable.planned_end_date,
      end_date: selectedDeliverable.end_date,
      is_completed: selectedDeliverable?.is_completed === 1 ? 0 : 1,
    };
    _sendUpdateDeliverable(deliverable);
  };
  React.useEffect(() => {
    if (sendUpdateDeliverableRes) {
      setShowTaskCompletedModal(false);
      const newDeliverables = deliverables.map(deliverable => {
        if (deliverable.deliverable_id === sendUpdateDeliverableRes.deliverable_id) {
          return sendUpdateDeliverableRes;
        }
        return deliverable;
      });
      setDeliverables(newDeliverables);
      let percentage = 0;
      newDeliverables.map(item => {
        if (item.is_completed === 1) {
          percentage += 50;
        }
      });
      setPercentageValue(percentage);
    }
  }, [sendUpdateDeliverableRes]);

  const onDeliverableFromPriority = () => {
    setIsPriority(true);
    setIsDeliverableFromPriority(false);
  };
  const onSelectExpensesKind = (name: { key: string; name: string; icon: React.ElementType }) => {
    setSelectedExpensesKind(name);
    setShowExpensesKind(false);
  };

  return (
    <MainResponsive>
      <WeekCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
      <div className='flex justify-between items-center px-4 pt-4 pb-2 w-full'>
        <span className='text-white font-bold flex-1 truncate'>{new Date(selectedDate).toLocaleDateString(undefined, options)}</span>
        <span className='text-white'>{percentageValue + ' %'}</span>
      </div>
      <GroupItemView className='mx-4 p-4 rounded-md'>
        <TodayDeliverable deliverables={deliverables} selectedDeliverable={selectedDeliverable} onSelect={onSelectDeliverable} />
      </GroupItemView>
      <div className='flex justify-center items-center p-2 mt-4 w-full'>
        <span className='text-white font-bold text-center'>At least 2 deliverable per day</span>
      </div>
      <GroupItemView className='mx-4 px-4 pt-4 pb-16 border-rouge-blue border-4 bg-card-gray relative'>
        {selectedDeliverableTab === 'default' ? (
          <>
            <div className='flex flex-row items-center text-xl font-bold text-white'>
              <span className='pr-2'>Client :</span>
              <div className='border-dotted border-b-4 border-white flex-1 self-end' />
              <div className='border-dashed text-rouge-blue px-2'>{selectedClient?.client_name}</div>
              <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openClients}>
                <img src={controlThumbnail} className='h-4 w-auto' />
              </div>
            </div>
            <AnimatedDropView show={showClient}>
              {clientList.map(client => (
                <ClientNameItem key={client.client_id} client={client} selectedClient={selectedClient} onSelect={onSelectClient} />
              ))}
            </AnimatedDropView>
            <div className='flex flex-row items-center text-xl font-bold text-white'>
              <span className='pr-2'>Project :</span>
              <div className='border-dotted border-b-4 border-white flex-1 self-end' />
              <div className='border-dashed text-rouge-blue px-2'>{selectedProject?.project_name}</div>
              <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openProjects}>
                <img src={controlThumbnail} className='h-4 w-auto' />
              </div>
            </div>
            <AnimatedDropView show={showProject}>
              {projectList.map(project => (
                <ProjectNameItem key={project.project_id} project={project} selectedProject={selectedProject} onSelect={onSelectProject} />
              ))}
            </AnimatedDropView>
            <div className='flex flex-row items-center text-xl font-bold text-white'>
              <span className='pr-2'>Task :</span>
              <div className='border-dotted border-b-4 border-white flex-1 self-end' />
              <div className='border-dashed text-rouge-blue px-2'>{selectedTask?.task_name}</div>
              <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openTasks}>
                <img src={controlThumbnail} className='h-4 w-auto' />
              </div>
            </div>
            <AnimatedDropView show={showTask}>
              {taskList.map((task, index) => (
                <TaskNameItem key={index} task={task} selectedTask={selectedTask} onSelect={onSelectTask} />
              ))}
            </AnimatedDropView>
            {isPriority ? (
              <div className='flex flex-row items-center text-xl font-bold text-white'>
                <span className='pr-2'>Priority :</span>
                <div className='border-dotted border-b-4 border-white flex-1 self-end' />
                <div className='border-dashed text-rouge-blue px-2 truncate'>{selectedPriority?.priority}</div>
              </div>
            ) : (
              <div className='flex flex-row items-center text-xl font-bold text-white'>
                <div>Deliverable :</div>
                <div className='ml-4 flex flex-1 w-full'>
                  <input
                    type='textarea'
                    name='textValue'
                    className='w-full bg-card-gray focus:outline-none truncate'
                    value={deliverableValue}
                    onChange={changeDeliverableValue}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className='flex flex-row items-center text-xl font-normal text-white'>
              <span className='pr-2'>Client :</span>
              <span className='pr-2'>{deliverableInfo?.client_name}</span>
            </div>
            <div className='flex flex-row items-center text-xl font-normal text-white'>
              <span className='pr-2'>Project :</span>
              <span className='pr-2'>{deliverableInfo?.project_name}</span>
            </div>
            <div className='flex flex-row items-center text-xl font-normal text-white'>
              <span className='pr-2'>Task :</span>
              <span className='pr-2'>{deliverableInfo?.task_name}</span>
            </div>
            <div className='flex flex-row items-center text-xl font-normal text-white'>
              <span className='pr-2'>Deliverable :</span>
              <span className='pr-2'>{deliverableInfo?.deliverable_name}</span>
            </div>
            {selectedDeliverableTab === 'expenses' && (
              <>
                <div className='flex flex-row items-center text-xl font-normal text-white mt-8'>
                  <span className=' text-rouge-blue'>Expensives cost</span>
                  <span className='px-2'>:</span>
                  <span className=''>€ 20,1</span>
                </div>
                <div className='flex flex-row items-center text-xl font-normal text-white'>
                  <span className=' text-rouge-blue'>What</span>
                  <span className='px-2'>:</span>
                  {selectedExpensesKind ? <selectedExpensesKind.icon className='w-6 h-6 mr-4' /> : <CarSvg className='w-6 h-6 mr-4' />}
                  <span className='flex flex-1'>{selectedExpensesKind ? selectedExpensesKind.name : deliverablesExpenseKind[0].name}</span>
                  <div
                    className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue'
                    onClick={() => setShowExpensesKind(!showExpensesKind)}
                  >
                    <img src={controlThumbnail} className='h-4 w-auto' />
                  </div>
                </div>
                <AnimatedDropView show={showExpensesKind}>
                  {deliverablesExpenseKind.map(item => (
                    <div key={item.key} className='px-4 text-white flex flex-row items-center' onClick={() => onSelectExpensesKind(item)}>
                      {/* <img src={item.icon} className='h-4 w-auto mr-2' /> */}
                      <item.icon className='w-4 h-4 mr-4' />
                      <div>{item.name}</div>
                    </div>
                  ))}
                </AnimatedDropView>
                <div className='flex flex-row text-xl font-normal text-white'>
                  <span className=' text-rouge-blue'>Info</span>
                  <span className='px-2'>:</span>
                  <span className=''>Day return 67 km between Frankfurt to Hammersbach</span>
                </div>
              </>
            )}
          </>
        )}

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
      </GroupItemView>
      <div className='flex justify-center items-center px-4 pt-6 pb-2 w-full'>
        <span className='text-white font-bold truncate'>Remember your weekly priorities</span>
      </div>
      <GroupItemView className='mx-4 p-4 rounded-md'>
        <BeforeWeekPriority priorities={rememberWeeklyPriorities} selectedPriority={selectedPriority} onSelect={onSelectWeelyPriority} />
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
      <ReactModal
        isOpen={showTaskCompletedModal}
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
        <div className='text-center'>
          {selectedDeliverable?.is_completed === 1 ? 'Not completed this Deliverable?' : 'Completed this Deliverable?'}
        </div>
        <div className='flex flex-row'>
          <div className='font-bold pr-2'>Deliverable:</div>
          <div className='font-bold'>{selectedDeliverable?.deliverable_name}</div>
        </div>
        <div className='flex flex-row items-start justify-between w-full px-8 pt-4'>
          <div className='text-lg font-bold' onClick={onCancelDeliverableCompleted}>
            No
          </div>
          <div className='text-lg font-bold text-rouge-blue' onClick={onCompletedDeliverable}>
            Yes
          </div>
        </div>
      </ReactModal>
      <ReactModal
        isOpen={isDeliverableFromPriority}
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
        <div className='text-center'>Deliverable from priority?</div>
        <div className='flex flex-row'>
          <div className='font-bold pr-2'>Deliverable:</div>
          <div className='font-bold'>{selectedPriority?.priority}</div>
        </div>
        <div className='flex flex-row items-start justify-between w-full px-8 pt-4'>
          <div className='text-lg font-bold' onClick={onCancelDeliverableFromPriority}>
            No
          </div>
          <div className='text-lg font-bold text-rouge-blue' onClick={onDeliverableFromPriority}>
            Yes
          </div>
        </div>
      </ReactModal>
    </MainResponsive>
  );
}

export default Deliverables;
