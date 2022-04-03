import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { plusThumbnail } from '../../assets/images';
import useRequest from '../../lib/hooks/useRequest';
import { sendCreatePriority, sendPriorityByBeforeWeek, sendPriorityByWeek } from '../../lib/api';
import PrioritiesCalender from '../../components/calendar/PrioritiesCalender';
import { PriorityState } from '../../modules/weekPriority';
import PriorityItem from '../../components/priority/PriorityItem';
import { getWeek } from 'date-fns';
import PastPriorityView from '../../containers/priority/PastPriorityView';
import { PrioritiesTab } from '../../modules/tab';
import { toast } from 'react-toastify';
import MainResponsive from '../../containers/main/MainResponsive';
import { ProjectTypeList, ProjectTypeState } from '../../modules/project';
import ProjectType from '../../components/priority/ProjectType';
import GroupItemView from '../../containers/main/GroupItemView';
import { useAuth } from '../../lib/context/AuthProvider';

const thisWeek = getWeek(new Date());
function Priorities(): JSX.Element {
  const [selectedWeek, setSelectedWeek] = useState(thisWeek);
  const [selectedPriorityTab, setSelectedPriorityTab] = useState('default');
  const [selectedPriority, setSelectedPriority] = useState<PriorityState | null>(null);
  const [weeklyPriorities, setWeeklyPriorities] = useState<PriorityState[]>([]);
  const [beforeWeeklyPriorities, setBeforWeeklyPriorities] = useState<PriorityState[]>([]);
  const [priorityValue, setPriorityValue] = useState('');
  const [deliverableValue, setDeliverableValue] = useState('');
  const [detailValue, setDetailValue] = useState('');
  const [selectedProjectType, setSeletedProjectType] = useState<ProjectTypeState | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [_sendPriorityByWeek, , sendPriorityByWeekRes] = useRequest(sendPriorityByWeek);
  const [_sendPriorityByBeforeWeek, , sendPriorityByBeforeWeekRes] = useRequest(sendPriorityByBeforeWeek);
  const [_sendCreatePriority, , sendCreatePriorityRes] = useRequest(sendCreatePriority);

  const navigate = useNavigate();
  const { account } = useAuth();

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = '0px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + 'px';
    }
  }, [detailValue]);

  React.useEffect(() => {
    requestWeelyPriorities(selectedWeek);
  }, []);
  React.useEffect(() => {
    if (sendPriorityByWeekRes) {
      setWeeklyPriorities(sendPriorityByWeekRes.priority);
    }
  }, [sendPriorityByWeekRes]);
  React.useEffect(() => {
    if (sendPriorityByBeforeWeekRes) {
      setBeforWeeklyPriorities(sendPriorityByBeforeWeekRes.priority);
    }
  }, [sendPriorityByBeforeWeekRes]);
  const requestWeelyPriorities = (week: number) => {
    const user_id = account?.user.user_id;
    _sendPriorityByWeek(user_id, week);
    _sendPriorityByBeforeWeek(user_id, week);
  };
  const onSelectWeek = (currentWeek: number) => {
    setSelectedWeek(currentWeek);
    requestWeelyPriorities(currentWeek);
  };
  const onSelectPriorityTab = (key: string) => {
    if (!selectedPriority) return;
    if (key === 'agenda') {
      navigate('/priorities/agenda');
    }
    if (key === 'support') {
      navigate('/priorities/support');
    }
    setSelectedPriorityTab(preSelectedProject => (preSelectedProject === key ? 'default' : key));
  };
  const changePriorityValue = (event: React.FormEvent<HTMLInputElement>) => {
    setPriorityValue(event.currentTarget.value);
  };
  const changeDeliverableValue = (event: React.FormEvent<HTMLInputElement>) => {
    setDeliverableValue(event.currentTarget.value);
  };
  const changeDetailValue = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetailValue(event.target.value);
  };
  const onAddPriority = () => {
    if (!priorityValue) {
      toast.error('priority is not empty!');
      return;
    }
    if (!deliverableValue) {
      toast.error('deliverable is not empty!');
      setSelectedPriorityTab('details');
      return;
    }
    if (account) {
      const priority: PriorityState = {
        wp_id: null,
        user_id: account?.user.user_id,
        week: selectedWeek,
        priority_num: 1,
        goal: deliverableValue,
        deliverable: deliverableValue,
        detail: detailValue,
        is_completed: null,
        is_weekly: null,
        end_date: null,
      };
      _sendCreatePriority(priority);
    }
  };
  React.useEffect(() => {
    if (sendCreatePriorityRes) {
      const newWeeklyPriorities = weeklyPriorities;
      setPriorityValue('');
      setDeliverableValue('');
      setDetailValue('');
      setSelectedPriorityTab('default');
      newWeeklyPriorities.push(sendCreatePriorityRes);
      setWeeklyPriorities(newWeeklyPriorities);
    }
  }, [sendCreatePriorityRes]);

  const onSelectWeelyPriority = (priority: PriorityState) => {
    if (selectedPriority?.wp_id === priority.wp_id) {
      setSelectedPriority(null);
      setPriorityValue('');
      setDeliverableValue('');
      setDetailValue('');
      setSelectedPriorityTab('default');
    } else {
      setSelectedPriority(priority);
      setPriorityValue(priority.goal);
      setDeliverableValue(priority.deliverable);
      setDetailValue(priority.detail || '');
      setSelectedPriorityTab('details');
    }
  };
  const onChangeProjectType = (projectTypeItem: ProjectTypeState) => {
    setSeletedProjectType(projectTypeItem);
  };

  return (
    <MainResponsive>
      <PrioritiesCalender selectedWeek={selectedWeek} onSelectWeek={onSelectWeek} />
      <div className='flex justify-center items-center px-4 pt-4 pb-2 w-full'>
        <span className='text-white font-bold truncate'>Weekly priorities</span>
      </div>
      <GroupItemView className='mx-4 p-4 rounded-md'>
        {weeklyPriorities.map((item, index) => (
          <PriorityItem
            key={index}
            index={index}
            priority={item}
            thisWeek={thisWeek == selectedWeek}
            selectedPriority={selectedPriority}
            onSelect={onSelectWeelyPriority}
          />
        ))}
      </GroupItemView>
      <div className='flex justify-center items-center p-2 mt-4 w-full'>
        <span className='text-white font-bold text-center'>Priority achieved this week with clear goal defined</span>
      </div>
      <GroupItemView className='mx-4 px-4 pt-4 pb-10 border-rouge-blue border-4 bg-card-gray relative'>
        <div className='flex flex-row items-center w-full'>
          <div className='text-xl font-bold text-white'>Priority :</div>
          <div className='ml-4 flex flex-1 w-full'>
            <input
              type='textarea'
              name='textValue'
              className='w-full bg-transparent text-white text-xl font-bold focus:outline-none truncate'
              value={priorityValue}
              onChange={changePriorityValue}
            />
          </div>
        </div>
        <div className='flex flex-row items-center'>
          <div className='text-xl font-bold text-white'>Deliverable :</div>
          <div className='ml-4 flex flex-1 w-full'>
            <input
              type='textarea'
              name='textValue'
              className='w-full bg-card-gray text-white text-xl font-bold focus:outline-none truncate'
              value={deliverableValue}
              onChange={changeDeliverableValue}
            />
          </div>
        </div>
        <div className='flex flex-row items-center'>
          {selectedPriorityTab === 'details' && (
            <label className='text-xl font-bold text-rouge-blue flex flex-1'>
              Detail:
              <textarea
                ref={textareaRef}
                value={detailValue}
                className='w-full bg-card-gray ml-2 text-xl font-bold text-white focus:outline-none'
                onChange={changeDetailValue}
              />
            </label>
          )}
        </div>
        {selectedPriorityTab === 'details' && (
          <div className='flex flex-col mt-3'>
            <span className='text-xl font-bold text-rouge-blue flex flex-1'>
              A.<span className='text-xl font-bold text-white flex ml-4'>Weekly priorities</span>
            </span>
            <span className='text-xl font-bold text-rouge-blue flex flex-1'>
              B.<span className='text-xl font-bold text-white flex ml-4'>Monthly priorities</span>
            </span>
          </div>
        )}
        {selectedPriorityTab === 'project' && (
          <>
            <div className='flex flex-row items-center'>
              <div className='text-xl font-bold text-white pr-2'>Client :</div>
              <div className='text-xl font-bold text-white'>IDL GRIEISHEIM</div>
            </div>
            <div className='flex flex-row items-start'>
              <div className='text-xl font-bold text-white pr-2'>Project :</div>
              <div className='flex flex-col'>
                {ProjectTypeList.map(item => (
                  <ProjectType
                    key={item.project_type}
                    projectTypeItem={item}
                    selectedProjectType={selectedProjectType}
                    onSelect={onChangeProjectType}
                  />
                ))}
              </div>
            </div>
          </>
        )}
        <div className='absolute bottom-6 right-2'>
          <div className='flex items-center justify-end bg-white rounded-full p-2 outline outline-1 shadow-xl' onClick={onAddPriority}>
            <img src={plusThumbnail} className='h-5 w-auto' />
          </div>
        </div>
        <div className='absolute -bottom-1 left-0 w-full flex flex-row justify-evenly items-center'>
          {PrioritiesTab.map(item => (
            <div
              key={item.key}
              className='rounded-t-md px-2'
              onClick={() => onSelectPriorityTab(item.key)}
              style={{ background: selectedPriorityTab === item.key ? 'white' : '#365B9D' }}
            >
              <span className='text-sm' style={{ color: selectedPriorityTab === item.key ? '#DD0000' : 'white' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </GroupItemView>

      <div className='flex justify-center items-center px-4 pt-6 pb-2 w-full'>
        <span className='text-white font-bold truncate'>Past priorities not achieved</span>
      </div>
      <GroupItemView className='mx-4 p-4 rounded-md'>
        <PastPriorityView priorities={beforeWeeklyPriorities} />
      </GroupItemView>
    </MainResponsive>
  );
}

export default Priorities;
