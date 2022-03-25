import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { AccountState, accountState } from '../../modules/user';
import { rightArrowThumbnail } from '../../assets/images';
import BottomUpAnimatedView from '../../components/common/BottomUpAnimatedView';
import { sendCreateClient, sendGetMyClients, sendRegisterMyClient, sendUpdateByClient } from '../../lib/api/auth';
import useRequest from '../../lib/hooks/useRequest';
import { toast } from 'react-toastify';
import { ClientState } from '../../modules/client';
import { Moment } from 'moment';
import { ProjectState } from '../../modules/project';
import CustomCalender from '../../components/common/CustomCalender';
import { CalenderSvg } from '../../assets/svg';

const ManageProject = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProjectState | null>(null);
  const [dataList, getDataList] = useState<ProjectState[]>([] as ProjectState[]);
  const [projectName, setProjectName] = useState('');
  const [projectDec, setProjectDec] = useState('');
  const [popTitle, setPopTitle] = useState('Create Client');
  const [actionTitle, setActionTitle] = useState('Create');
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [planedStarMoment, setPlanedStartMoment] = useState<Moment | null>(null);
  const [planedEndMoment, setPlanedEndMoment] = useState<Moment | null>(null);
  const [actualStartMoment, setActualStartMoment] = useState<Moment | null>(null);
  const [actualEndMoment, setActualEndMoment] = useState<Moment | null>(null);
  const [dateType, setDateType] = useState('ps');
  const account = useRecoilValue<AccountState | null>(accountState);

  const onCreateProject = () => {
    setPopTitle('Create Project');
    setActionTitle('Create');
    setIsEdit(true);
  };
  const onEditProject = (project: ProjectState) => {
    setSelectedItem(project);
    setPopTitle('Edit Project');
    setActionTitle('Save');
    setProjectName(project.project_name);
    setIsEdit(true);
  };
  const onCreateUpdateClient = () => {
    if (planedStarMoment?.isSameOrAfter(planedEndMoment)) {
      console.log('kkkkkk');
      toast.error('plan start time is after end time');
      return;
    }
    if (actualStartMoment?.isSameOrAfter(actualEndMoment)) {
      console.log('kkkkkk');
      toast.error('actual start time is after end time');
      return;
    }
    if (selectedItem) {
      console.log('edit');
    } else {
      console.log('create');
    }
  };
  const handleProjectNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    setProjectName(event.currentTarget.value);
  };
  const handleProjectDecChange = (event: React.FormEvent<HTMLInputElement>) => {
    setProjectDec(event.currentTarget.value);
  };
  const selectCalendar = (type: string) => {
    setDateType(type);
    switch (type) {
      case 'ps':
        setSelectedMoment(planedStarMoment);
        break;
      case 'pe':
        setSelectedMoment(planedEndMoment);
        break;
      case 'as':
        setSelectedMoment(actualStartMoment);
        break;
      case 'ae':
        setSelectedMoment(actualEndMoment);
        break;
    }
    setShowCalendar(true);
  };
  const onSelectMoment = (moment: Moment) => {
    switch (dateType) {
      case 'ps':
        setPlanedStartMoment(moment);
        break;
      case 'pe':
        setPlanedEndMoment(moment);
        break;
      case 'as':
        setActualStartMoment(moment);
        break;
      case 'ae':
        setActualEndMoment(moment);
        break;
    }
    setShowCalendar(false);
  };
  const closeEdit = () => {
    setIsEdit(false);
    setProjectName('');
    setPlanedStartMoment(null);
    setPlanedEndMoment(null);
    setActualStartMoment(null);
    setActualEndMoment(null);
  };

  return (
    <div className='items-center flex flex-col flex-1 p-4 w-full h-full mb-32'>
      <div
        className='flex flex-row items-center w-full justify-between py-6 px-4 bg-light-gray'
        // onClick={() => user?.member.isAdmin && navigate('/account/company-profile')}
      >
        <div />
        <div className='text-lg text-black font-bold'>Manager Projects</div>
        <div className='text-sm text-blue font-normal' onClick={onCreateProject}>
          Create
        </div>
      </div>
      <div className='flex flex-1 flex-col w-full h-full relative'>
        <div className='flex flex-1 flex-col w-full p-1 bg-white'>
          <div className='flex flex-row px-4 pb-2 items-center'>
            <div className='text-base text-black font-bold mt-4'>PROJECTS</div>
          </div>
          {dataList.map((project, index) => (
            <div
              key={index}
              className='flex flex-row p-4 mb-2 items-center justify-between bg-light-gray'
              onClick={() => onEditProject(project)}
            >
              <div className='text-sm text-black font-normal pr-3 flex-1'>{project.project_name}</div>
            </div>
          ))}
        </div>
        <BottomUpAnimatedView title={popTitle} actionTitle={actionTitle} isOpen={isEdit} onClose={closeEdit} onSave={onCreateUpdateClient}>
          <div className='px-4 my-4'>
            <div className='text-sm text-black font-bold px-2 pt-2'>PROJECT NAME</div>
            <div className='flex flex-row mb-2 rounded-md items-center bg-dark-gray mt-2'>
              <input
                className='w-full p-2 text-left text-black bg-transparent'
                placeholder='Enter New Project Name'
                value={projectName}
                onChange={handleProjectNameChange}
              />
            </div>
            <div className='w-fll flex flex-row'>
              <div className='w-fll flex flex-col flex-1' onClick={() => selectCalendar('ps')}>
                <div className='text-sm text-black font-bold px-2 pt-2 text-center'>PLANED START DATE</div>
                <div className='mx-4 py-1 my-2 bg-light-gray flex items-center justify-center'>
                  {planedStarMoment ? (
                    <div className='text-sm text-rouge-blue font-bold text-center'>{planedStarMoment.format('YYYY-MM-DD')}</div>
                  ) : (
                    <CalenderSvg />
                  )}
                </div>
              </div>
              <div className='w-fll flex flex-col flex-1' onClick={() => selectCalendar('pe')}>
                <div className='text-sm text-black font-bold px-2 pt-2 text-center'>PLANED END DATE</div>
                <div className='mx-4 py-1 my-2 bg-light-gray flex items-center justify-center'>
                  {planedEndMoment ? (
                    <div className='text-sm text-rouge-blue font-bold text-center'>{planedEndMoment.format('YYYY-MM-DD')}</div>
                  ) : (
                    <CalenderSvg />
                  )}
                </div>
              </div>
            </div>
            <div className='w-fll flex flex-row'>
              <div className='w-fll flex flex-col flex-1' onClick={() => selectCalendar('as')}>
                <div className='text-sm text-black font-bold px-2 pt-2 text-center'>ACTUAL START DATE</div>
                <div className='mx-4 py-1 my-2 bg-light-gray flex items-center justify-center'>
                  {actualStartMoment ? (
                    <div className='text-sm text-rouge-blue font-bold text-center'>{actualStartMoment.format('YYYY-MM-DD')}</div>
                  ) : (
                    <CalenderSvg />
                  )}
                </div>
              </div>
              <div className='w-fll flex flex-col flex-1' onClick={() => selectCalendar('ae')}>
                <div className='text-sm text-black font-bold px-2 pt-2 text-center'>ACTUAL END DATE</div>
                <div className='mx-4 py-1 my-2 bg-light-gray flex items-center justify-center'>
                  {actualEndMoment ? (
                    <div className='text-sm text-rouge-blue font-bold text-center'>{actualEndMoment.format('YYYY-MM-DD')}</div>
                  ) : (
                    <CalenderSvg />
                  )}
                </div>
              </div>
            </div>
            {showCalendar && (
              <div className='flex justify-between items-center my-2 bg-white'>
                <CustomCalender onSelect={onSelectMoment} selectedMoment={selectedMoment} />
              </div>
            )}
            <div className='text-sm text-black font-bold px-2 mt-4'>DESCRIPTION</div>
            <div className='flex flex-row mb-2 rounded-md items-center bg-dark-gray mt-2'>
              <input
                className='w-full p-2 text-left text-black bg-transparent'
                placeholder='Enter New Project Name'
                value={projectDec}
                onChange={handleProjectDecChange}
              />
            </div>
          </div>
        </BottomUpAnimatedView>
      </div>
    </div>
  );
};

export default ManageProject;
