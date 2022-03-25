import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { AccountState, accountState, UserState } from '../../modules/user';
import {
  dateTimeCurrencyThumbnail,
  doubleRecThumbnail,
  organizationThumbnail,
  personGrayThumbnail,
  rightArrowThumbnail,
  slideBarThumbnail,
  teamMemberThumbnail,
  workSettingThumbnail,
} from '../../assets/images';
import BottomUpAnimatedView from '../../components/common/BottomUpAnimatedView';
import { getTeamMembers, signOut } from '../../lib/api/auth';
import useRequest from '../../lib/hooks/useRequest';
import { toast } from 'react-toastify';
import EditUserNameEmail from '../../components/profile/EditUserNameEmail';
import DateTimeCurrency from '../../components/profile/DateTimeCurrency';
import OrganizationUpdate from '../../components/profile/OrganizationUpdate';
import WorkSetting from '../../components/profile/WorkSetting';

const UserProfile = () => {
  const [isEditProfile, setIsEditProfile] = React.useState(false);
  const [isEditOrganization, setIsEditOrganization] = React.useState(false);
  const [isEditWorkSetting, setIsEditWorkSetting] = React.useState(false);
  const [isEditDateTimeCurrency, setIsEditDateTimeCurrency] = React.useState(false);
  const [account, setAccount] = useRecoilState<AccountState | null>(accountState);

  const [teamMemberNum, setTeamMemberNum] = React.useState(0);

  const navigate = useNavigate();
  const [_sendSignOut, signOuting, signOutRes, , resetSignOut] = useRequest(signOut);
  const [_getTeamMembers, , getTeamMembersRes] = useRequest(getTeamMembers);

  React.useEffect(() => {
    const owner_id = account?.user.user_id;
    owner_id && _getTeamMembers(owner_id);
  }, []);
  React.useEffect(() => {
    if (getTeamMembersRes) {
      setTeamMemberNum(getTeamMembersRes.member.length);
    }
  }, [getTeamMembersRes]);
  React.useEffect(() => {
    if (signOutRes && signOutRes.user_id) {
      setAccount(null);
      toast.success('sign out successed!');
      navigate('/');
    }
  }, [signOutRes]);

  const onSignOut = () => {
    const user_id = account?.user.user_id;
    _sendSignOut(user_id);
  };
  return (
    <div className='items-center flex flex-col flex-1 p-4 w-full h-full mb-32'>
      <div className='flex flex-row w-full h-12 px-4 mb-4 items-center justify-between bg-light-gray'>
        <div className='text-sm text-rouge-blue font-normal'></div>
        <div className='text-lg text-rouge-blue font-bold'>Your Account</div>
        <div className='text-sm text-rouge-blue font-normal'></div>
      </div>
      <div className='flex flex-1 w-full h-full relative'>
        <div className='flex flex-1 flex-col w-full p-1 bg-white h-full'>
          <div className='flex flex-row items-center justify-between px-8 py-3'>
            <div className='text-lg text-black font-bold'>PROFILE</div>
          </div>
          <div className='flex flex-row py-2 pr-4 mb-2 rounded-md items-center bg-light-gray' onClick={() => setIsEditProfile(true)}>
            <div className='w-10 h-6 flex items-center justify-center'>
              <img src={personGrayThumbnail} alt='Person' className='h-4 w-auto' />
            </div>
            <div className='text-base text-black font-bold pr-4 truncate'>{account?.user.display_name}</div>
            <div className='text-base text-link font-normal truncate'>{account?.user.email}</div>
          </div>
          <div
            className='flex flex-row py-2 mb-2 pr-4 rounded-md items-center justify-between bg-light-gray'
            onClick={() => setIsEditWorkSetting(true)}
          >
            <div className='w-10 h-6 flex items-center justify-center'>
              <img src={workSettingThumbnail} className='h-4 w-auto' />
            </div>
            <div className='flex flex-1 flex-row justify-between'>
              <div className='text-base text-black font-normal flex-1'>Work Setting</div>
            </div>
            <div className='w-auto h-6 flex items-center justify-end'>
              <img src={rightArrowThumbnail} className='h-4 w-auto' />
            </div>
          </div>
          <div
            className='flex flex-row py-2 mb-2 rounded-md items-center justify-center bg-light-gray text-base text-black font-normal'
            onClick={onSignOut}
          >
            Sign Out
          </div>

          <div className='flex flex-row items-center justify-between px-8 py-3'>
            <div className='text-lg text-black font-bold'>SETTINGS</div>
          </div>
          <div
            className='flex flex-row py-2 mb-2 pr-4 rounded-md items-center justify-between bg-light-gray'
            onClick={() => setIsEditDateTimeCurrency(true)}
          >
            <div className='w-10 h-6 flex items-center justify-center'>
              <img src={dateTimeCurrencyThumbnail} className='h-4 w-auto' />
            </div>
            <div className='flex flex-1 flex-row justify-between'>
              <div className='text-base text-black font-normal flex-1'>Date, time and currency</div>
            </div>
            <div className='w-auto h-6 flex items-center justify-end'>
              <img src={rightArrowThumbnail} className='h-4 w-auto' />
            </div>
          </div>
          <div
            className='flex flex-row py-2 mb-2 pr-4 rounded-md items-center justify-between bg-light-gray'
            onClick={() => setIsEditOrganization(true)}
          >
            <div className='w-10 h-6 flex items-center justify-center'>
              <img src={organizationThumbnail} className='h-4 w-auto' />
            </div>
            <div className='flex flex-1 flex-row justify-between'>
              <div className='text-base text-black font-normal flex-1'>Organization</div>
            </div>
            <div className='w-auto h-6 flex items-center justify-end'>
              <img src={rightArrowThumbnail} className='h-4 w-auto' />
            </div>
          </div>
          <div className='flex flex-row py-2 mb-2 rounded-md items-center justify-center bg-light-gray text-base text-black font-normal'>
            View Terms & Privacy Policy
          </div>
          <div className='flex flex-row items-center justify-between px-8 py-3'>
            <div className='text-lg text-black font-bold'>MANAGE</div>
          </div>
          <div
            className='flex flex-row py-2 mb-2 pr-4 rounded-md items-center justify-between bg-light-gray'
            onClick={() => navigate('/account/manage-team')}
          >
            <div className='w-10 h-6 flex items-center justify-center'>
              <img src={teamMemberThumbnail} className='h-3 w-auto' />
            </div>
            <div className='flex flex-1 flex-row justify-between'>
              <div className='text-base text-black font-normal flex-1'>{teamMemberNum + ' Team member'}</div>
            </div>
            <div className='w-auto h-6 flex items-center justify-end'>
              <img src={rightArrowThumbnail} className='h-4 w-auto' />
            </div>
          </div>
        </div>
        {isEditOrganization && <OrganizationUpdate isEditOrganization={isEditOrganization} onClose={() => setIsEditOrganization(false)} />}
        {isEditProfile && <EditUserNameEmail isEditProfile={isEditProfile} onClose={() => setIsEditProfile(false)} />}
        {isEditWorkSetting && <WorkSetting isEditWorkSetting={isEditWorkSetting} onClose={() => setIsEditWorkSetting(false)} />}
        {isEditDateTimeCurrency && (
          <DateTimeCurrency isEditDateTimeCurrency={isEditDateTimeCurrency} onClose={() => setIsEditDateTimeCurrency(false)} />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
