import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { AccountState, accountState } from '../../modules/user';
import { documentThumbnail, rightArrowThumbnail } from '../../assets/images';
import BottomUpAnimatedView from '../../components/common/BottomUpAnimatedView';
import {
  sendCreateClient,
  sendCreateProject,
  sendGetMyClients,
  sendMyProject,
  sendRegisterMyClient,
  sendUpdateByClient,
  sendUpdateByUser,
} from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { toast } from 'react-toastify';
import moment, { Moment } from 'moment';
import { ProjectState } from '../../modules/project';
import CustomCalender from '../../components/common/CustomCalender';
import { CalenderSvg } from '../../assets/svg';
import MainResponsive from '../../containers/main/MainResponsive';

const ManageProject = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProjectState | null>(null);
  const [dataList, getDataList] = useState<ProjectState[]>([] as ProjectState[]);
  const [projectName, setProjectName] = useState('');
  const [projectDec, setProjectDec] = useState('');
  const [popTitle, setPopTitle] = useState('Create Client');
  const [actionTitle, setActionTitle] = useState('Create');
  const [selectedMoment, setSelectedMoment] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [planedStarMoment, setPlanedStartMoment] = useState<Date | null>(null);
  const [planedEndMoment, setPlanedEndMoment] = useState<Date | null>(null);
  const [actualStartMoment, setActualStartMoment] = useState<Date | null>(null);
  const [actualEndMoment, setActualEndMoment] = useState<Date | null>(null);
  const [dateType, setDateType] = useState('ps');

  const account = useRecoilValue<AccountState | null>(accountState);
  const [_sendCreateProject, , sendCreateProjectRes] = useRequest(sendCreateProject);
  const [_sendMyProject, , sendMyProjectRes] = useRequest(sendMyProject);
  const [_sendUpdateByUser, , sendUpdateByUserRes] = useRequest(sendUpdateByUser);

  React.useEffect(() => {
    const creator_id = account?.user.user_id;
    creator_id && _sendMyProject(creator_id);
  }, []);
  React.useEffect(() => {
    if (sendMyProjectRes) {
      getDataList(sendMyProjectRes.project);
    }
  }, [sendMyProjectRes]);
  React.useEffect(() => {
    if (sendUpdateByUserRes) {
      const updateProject: ProjectState = {
        project_id: sendUpdateByUserRes.project_id,
        creator_id: sendUpdateByUserRes.creator_id,
        client_id: sendUpdateByUserRes.client_id,
        project_name: sendUpdateByUserRes.project_name,
        planned_start_date: sendUpdateByUserRes.planned_start_date,
        planned_end_date: sendUpdateByUserRes.planned_end_date,
        actual_start_date: sendUpdateByUserRes.actual_start_date,
        actual_end_date: sendUpdateByUserRes.actual_end_date,
        description: sendUpdateByUserRes.description,
      };
      const newDataList = dataList.map(item => {
        if (item.project_id === updateProject.project_id) {
          return updateProject;
        } else {
          return item;
        }
      });
      getDataList(newDataList);
      closeEdit();
    }
  }, [sendUpdateByUserRes]);
  const onCreateProject = () => {
    setPopTitle('Create Project');
    setActionTitle('Create');
    setIsEdit(true);
  };
  const onEditProject = (project: ProjectState) => {
    setSelectedItem(project);
    setPopTitle('Edit Project');
    setActionTitle('Save');
    setPlanedStartMoment(project.planned_start_date);
    setPlanedEndMoment(project.planned_end_date);
    setActualStartMoment(project.actual_start_date);
    setActualEndMoment(project.actual_end_date);
    setProjectName(project.project_name);
    setIsEdit(true);
  };
  const onCreateUpdateClient = () => {
    if (!planedStarMoment || !planedEndMoment || !actualStartMoment || !actualEndMoment) {
      return;
    }
    // if (planedStarMoment?.isSameOrAfter(planedEndMoment)) {
    //   toast.error('plan start time is after end time');
    //   return;
    // }
    // if (actualStartMoment?.isSameOrAfter(actualEndMoment)) {
    //   toast.error('actual start time is after end time');
    //   return;
    // }
    if (!account) {
      return;
    }
    if (selectedItem) {
      const params: ProjectState = {
        project_id: selectedItem.project_id,
        creator_id: selectedItem.creator_id,
        client_id: null,
        project_name: projectName,
        planned_start_date: planedStarMoment,
        planned_end_date: planedEndMoment,
        actual_start_date: actualStartMoment,
        actual_end_date: actualEndMoment,
        description: projectDec,
      };
      _sendUpdateByUser(params);
    } else {
      const params: ProjectState = {
        project_id: null,
        creator_id: account.user.user_id,
        project_name: projectName,
        client_id: null,
        planned_start_date: planedStarMoment,
        planned_end_date: planedEndMoment,
        actual_start_date: actualStartMoment,
        actual_end_date: actualEndMoment,
        description: projectDec,
      };
      _sendCreateProject(params);
    }
  };
  React.useEffect(() => {
    if (sendCreateProjectRes) {
      const updateProject: ProjectState = {
        project_id: sendCreateProjectRes.project_id,
        creator_id: sendCreateProjectRes.creator_id,
        project_name: sendCreateProjectRes.project_name,
        client_id: sendCreateProjectRes.client_id,
        planned_start_date: sendCreateProjectRes.planned_start_date,
        planned_end_date: sendCreateProjectRes.planned_end_date,
        actual_start_date: sendCreateProjectRes.actual_start_date,
        actual_end_date: sendCreateProjectRes.actual_end_date,
        description: sendCreateProjectRes.description,
      };
      const newDataList = dataList;
      newDataList.unshift(updateProject);
      toast.success('client updated successfully');
      closeEdit();
    }
  }, [sendCreateProjectRes]);
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
  const onSelectMoment = (date: Date) => {
    switch (dateType) {
      case 'ps':
        setPlanedStartMoment(date);
        break;
      case 'pe':
        setPlanedEndMoment(date);
        break;
      case 'as':
        setActualStartMoment(date);
        break;
      case 'ae':
        setActualEndMoment(date);
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
    <MainResponsive>
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
              <img src={documentThumbnail} className='h-6 w-auto' />
              <div className='text-lg text-black font-bold pr-3 flex-1 pl-2'>{project.project_name}</div>
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
                    <div className='text-sm text-rouge-blue font-bold text-center'>{planedStarMoment.toDateString()}</div>
                  ) : (
                    <CalenderSvg />
                  )}
                </div>
              </div>
              <div className='w-fll flex flex-col flex-1' onClick={() => selectCalendar('pe')}>
                <div className='text-sm text-black font-bold px-2 pt-2 text-center'>PLANED END DATE</div>
                <div className='mx-4 py-1 my-2 bg-light-gray flex items-center justify-center'>
                  {planedEndMoment ? (
                    <div className='text-sm text-rouge-blue font-bold text-center'>{planedEndMoment.toDateString()}</div>
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
                    <div className='text-sm text-rouge-blue font-bold text-center'>{actualStartMoment.toDateString()}</div>
                  ) : (
                    <CalenderSvg />
                  )}
                </div>
              </div>
              <div className='w-fll flex flex-col flex-1' onClick={() => selectCalendar('ae')}>
                <div className='text-sm text-black font-bold px-2 pt-2 text-center'>ACTUAL END DATE</div>
                <div className='mx-4 py-1 my-2 bg-light-gray flex items-center justify-center'>
                  {actualEndMoment ? (
                    <div className='text-sm text-rouge-blue font-bold text-center'>{actualEndMoment.toDateString()}</div>
                  ) : (
                    <CalenderSvg />
                  )}
                </div>
              </div>
            </div>
            {showCalendar && (
              <div className='flex justify-between items-center my-2 bg-white'>
                <CustomCalender onSelect={onSelectMoment} selectedDate={selectedMoment} />
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
    </MainResponsive>
  );
};

export default ManageProject;
