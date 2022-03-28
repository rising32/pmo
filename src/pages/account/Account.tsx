import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { AccountState, accountState } from '../../modules/user';
import {
  clientRougeThumbnail,
  crayon,
  dateTimeCurrencyThumbnail,
  doubleRecThumbnail,
  organizationThumbnail,
  personGrayThumbnail,
  personRougeThumbnail,
  projectRougeThumbnail,
  rightArrowThumbnail,
  taskRougeThumbnail,
  teamMemberThumbnail,
  uroSimbalThumbnail,
  workSettingThumbnail,
} from '../../assets/images';
import { getUserTasks, sendGetMyClients, sendMyProject, signOut } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { toast } from 'react-toastify';

const Account = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useRecoilState<AccountState | null>(accountState);
  const [clientNum, setClientNum] = React.useState(0);
  const [projectNum, setProjectNum] = React.useState(0);
  const [taskNum, setTaskNum] = React.useState(0);

  const [_sendGetMyClients, , getMyClientsRes] = useRequest(sendGetMyClients);
  const [_getUserTasks, , getUserTasksRes] = useRequest(getUserTasks);
  const [_sendSignOut, signOuting, signOutRes, , resetSignOut] = useRequest(signOut);
  const [_sendMyProject, , sendMyProjectRes] = useRequest(sendMyProject);

  React.useEffect(() => {
    if (signOutRes && signOutRes.user_id) {
      setAccount(null);
      toast.success('sign out successed!');
      navigate('/tasks');
    }
  }, [signOutRes]);
  const onSignOut = () => {
    const user_id = account?.user.user_id;
    _sendSignOut(user_id);
  };
  const companyProfile = {
    company_id: 1,
    company_name: 'ID Logistics',
    manager_info: {
      user_id: 'test_id',
      email: 'jf.loubeyre@gmail.com',
      phone_number: '18600559425',
      display_name: 'Loubeyre',
      avatar: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200',
      birthday: null,
      is_project_manager: 0,
      registration_time: '2022-03-18T01:07:13.000Z',
    },
    team_num: '',
  };
  React.useEffect(() => {
    const user_id = account?.user.user_id;
    user_id && _sendGetMyClients(user_id);

    const creator_id = account?.user.user_id;
    creator_id && _sendMyProject(creator_id);
  }, []);
  React.useEffect(() => {
    if (getMyClientsRes) {
      // console.log(getMyClientsRes);
      setClientNum(getMyClientsRes.clients.length);
    }
  }, [getMyClientsRes]);
  React.useEffect(() => {
    if (sendMyProjectRes) {
      // console.log('sendMyProjectRes = ', sendMyProjectRes);
      setProjectNum(sendMyProjectRes.res.length);
    }
  }, [sendMyProjectRes]);

  React.useEffect(() => {
    const creator_id = account?.user.user_id;
    creator_id && _getUserTasks(creator_id);
  }, []);
  React.useEffect(() => {
    if (getUserTasksRes) {
      // console.log(getUserTasksRes.task);
      setTaskNum(getUserTasksRes.task.length);
    }
  }, [getUserTasksRes]);

  return (
    <div className='items-center flex flex-col flex-1 px-4 pt-4 pb-32'>
      <div className='flex flex-row w-full p-4 items-center justify-between bg-light-gray'>
        <div className='text-sm text-rouge-blue font-normal' onClick={() => navigate('/terms')}>
          Terms
        </div>
        <div className='text-lg text-rouge-blue font-bold'>Your account</div>
        <div className='text-sm text-rouge-blue font-normal' onClick={onSignOut}>
          Sign Out
        </div>
      </div>

      <div className='w-full mt-4 p-1 bg-white'>
        <div className='flex flex-row items-center justify-between px-12 py-3'>
          <div className='text-lg text-black font-bold'>COMPANY PROFILE</div>
        </div>
        <div className='flex flex-row py-2 pr-4 mb-2 rounded-md items-center justify-between bg-light-gray'>
          <div className='w-10 h-6 flex items-center justify-center'>
            <img src={personGrayThumbnail} alt='Person' className='h-4 w-auto' />
          </div>
          <div className='text-base text-black font-bold flex-1'>{companyProfile.manager_info.display_name}</div>
          <div className='text-base text-link font-normal flex-1'>{companyProfile.manager_info.email}</div>
        </div>
        <div className='flex flex-row py-2 pr-4 rounded-t-md items-center justify-between bg-light-gray'>
          <div className='w-10 h-6 flex items-center justify-center'>
            <img src={organizationThumbnail} className='h-5 w-auto' />
          </div>
          <div className='flex flex-1 flex-row justify-between'>
            <div className='text-base text-black font-normal flex-1'>Organization</div>
            <div className='text-base text-rouge-blue font-normal flex-1'>{companyProfile.company_name}</div>
          </div>
          <div className='w-auto h-6 flex items-center justify-end'>
            <img src={rightArrowThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <div className='flex flex-row py-2 mb-2 pr-4 rounded-b-md items-center justify-between bg-light-gray'>
          <div className='w-10 h-6 flex items-center justify-center'>
            <img src={workSettingThumbnail} className='h-4 w-auto' />
          </div>
          <div className='flex flex-1 flex-row justify-between'>
            <div className='text-base text-black font-normal flex-1'>Work Setting</div>
            <div className='flex flex-1 flex-row justify-between'>
              <div className='w-10 h-6 flex flex-1 items-center'>
                <img src={doubleRecThumbnail} className='h-4 w-auto' />
              </div>
              <div className='text-base text-rouge-blue font-normal pr-2'>AM/PM</div>
            </div>
          </div>
          <div className='w-auto h-6 flex items-center justify-end'>
            <img src={rightArrowThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <div className='flex flex-row py-2 mb-2 pr-4 rounded-md items-center justify-between bg-light-gray'>
          <div className='w-10 h-6 flex items-center justify-center'>
            <img src={dateTimeCurrencyThumbnail} className='h-4 w-auto' />
          </div>
          <div className='flex flex-1 flex-row justify-between'>
            <div className='text-base text-black font-normal flex-1'>Date, time and currency</div>
            <div className='flex flex-row justify-center'>
              <div className='w-10 h-6 flex items-center'>
                <img src={doubleRecThumbnail} className='h-4 w-auto' />
              </div>
              <div className='w-10 h-6 flex items-center'>
                <img src={uroSimbalThumbnail} className='h-4 w-auto' />
              </div>
            </div>
          </div>
          <div className='w-auto h-6 flex items-center justify-end'>
            <img src={rightArrowThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <div className='flex flex-row py-2 pr-4 rounded-t-md items-center justify-between bg-light-gray'>
          <div className='w-10 h-6 flex items-center justify-center'>
            <img src={teamMemberThumbnail} className='h-3 w-auto' />
          </div>
          <div className='flex flex-1 flex-row justify-between'>
            <div className='text-base text-black font-normal flex-1'>{companyProfile.team_num + ' Team member'}</div>
          </div>
          <div className='w-auto h-6 flex items-center justify-end'>
            <img src={rightArrowThumbnail} className='h-4 w-auto' />
          </div>
        </div>
      </div>

      <div className='w-full mt-4 p-1 bg-dark-gray'>
        <div className='flex flex-row items-center justify-between px-12 py-3' onClick={() => navigate('/account/user-profile')}>
          <div className='text-lg text-black font-bold'>MEMBER PROFILE</div>
          <img src={crayon} className='h-4 w-auto' />
        </div>
        <div className='flex flex-row py-2 pr-4 items-center' onClick={() => navigate('/account/user-profile')}>
          <div className='w-10 h-6 flex items-center justify-center'>
            <img src={personRougeThumbnail} className='h-4 w-auto' />
          </div>
          <div className='text-base text-black font-normal mr-4 truncate'>{account?.user.display_name}</div>
          <div className='text-base text-rouge-blue font-normal truncate'>{account?.user.email}</div>
        </div>
        <div className='flex flex-row py-2 pr-4 items-center' onClick={() => navigate('/account/manage-client')}>
          <div className='w-10 h-6 flex items-center justify-center'>
            <img src={clientRougeThumbnail} className='h-4 w-auto' />
          </div>
          <div className='text-base text-black font-normal mr-4'>{clientNum + ' Clients'}</div>
        </div>
        <div className='flex flex-row py-2 pr-4 items-center' onClick={() => navigate('/account/manage-project')}>
          <div className='w-10 h-6 flex items-center justify-center'>
            <img src={projectRougeThumbnail} className='h-4 w-auto' />
          </div>
          <div className='text-base text-black font-normal mr-4'>{projectNum + ' Projects'}</div>
        </div>
        <div className='flex flex-row py-2 pr-4 items-center' onClick={() => navigate('/account/manage-task')}>
          <div className='w-10 h-6 flex items-center justify-center'>
            <img src={taskRougeThumbnail} className='h-4 w-auto' />
          </div>
          <div className='text-base text-black font-normal mr-4'>{taskNum + ' Tasks'}</div>
        </div>
      </div>
    </div>
  );
};

export default Account;
