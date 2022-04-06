import React from 'react';
import { useNavigate } from 'react-router-dom';
import { personGrayThumbnail } from '../../assets/images';
import { signOut } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { toast } from 'react-toastify';
import EditUserNameEmail from '../../components/profile/EditUserNameEmail';
import MainResponsive from '../../containers/main/MainResponsive';
import { useAuth } from '../../lib/context/AuthProvider';

const UserProfile = () => {
  const [isEditProfile, setIsEditProfile] = React.useState(false);
  const { account, changeAccount } = useAuth();

  const navigate = useNavigate();
  const [_sendSignOut, signOuting, signOutRes, , resetSignOut] = useRequest(signOut);

  React.useEffect(() => {
    if (signOutRes && signOutRes.user_id) {
      changeAccount(null);
      toast.success('sign out successed!');
      navigate('/');
    }
  }, [signOutRes]);

  const onSignOut = () => {
    const user_id = account?.user.user_id;
    _sendSignOut(user_id);
  };
  return (
    <MainResponsive>
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
            className='flex flex-row py-2 mb-2 rounded-md items-center justify-center bg-light-gray text-base text-black font-normal'
            onClick={onSignOut}
          >
            Sign Out
          </div>

          <div className='flex flex-row py-2 mb-2 rounded-md items-center justify-center bg-light-gray text-base text-black font-normal'>
            View Terms & Privacy Policy
          </div>
        </div>
        {isEditProfile && <EditUserNameEmail isEditProfile={isEditProfile} onClose={() => setIsEditProfile(false)} />}
      </div>
    </MainResponsive>
  );
};

export default UserProfile;
