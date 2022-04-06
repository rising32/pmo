import React from 'react';
import { useNavigate } from 'react-router-dom';
import { personGrayThumbnail } from '../../assets/images';
import { sendUserProfileUpdate, signOut } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { toast } from 'react-toastify';
import EditUserNameEmail from '../../components/profile/EditUserNameEmail';
import MainResponsive from '../../containers/main/MainResponsive';
import { useAuth } from '../../lib/context/AuthProvider';
import AnimatedDropView from '../../components/common/AnimatedDropView';
import { AccountState, UserState } from '../../modules/user';

const UserProfile = () => {
  const [isEditProfile, setIsEditProfile] = React.useState(false);
  const [userName, setUserName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const { account, changeAccount } = useAuth();

  const navigate = useNavigate();
  const [_sendSignOut, , signOutRes] = useRequest(signOut);
  const [_sendUserProfileUpdate, , sendUserProfileUpdateRes] = useRequest(sendUserProfileUpdate);

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
  const handleUserNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    setUserName(event.currentTarget.value);
  };
  const handleEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };
  const onOpenEditProfile = () => {
    if (isEditProfile) {
      setIsEditProfile(false);
    } else {
      if (account) {
        setUserName(account?.user.display_name);
        setEmail(account?.user.email);
        setIsEditProfile(true);
      }
    }
  };
  const onUserProfileUpdate = () => {
    if (!account) {
      return;
    }
    if (!userName) {
      toast.error('Name is not null!');
      return;
    }
    if (!email) {
      toast.error('Email is not null!');
      return;
    }

    if (email && userName && account) {
      const user: UserState = {
        user_id: account.user.user_id,
        email: email ? email : account.user.email,
        phone_number: account.user.phone_number,
        display_name: userName ? userName : account.user.display_name,
        password: account.user.password,
        avatar: account.user.avatar,
        birthday: account.user.birthday,
        role_id: 3,
        registration_time: account.user.registration_time,
      };
      _sendUserProfileUpdate(user);
    }
  };
  React.useEffect(() => {
    if (sendUserProfileUpdateRes && sendUserProfileUpdateRes.user_id && account) {
      const updateAccount: AccountState = {
        login_id: account.login_id,
        token: account.token,
        user: sendUserProfileUpdateRes,
      };
      changeAccount(updateAccount);
      toast.success('profile update successed!');
      onOpenEditProfile();
    }
  }, [sendUserProfileUpdateRes]);
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
          <div className='flex flex-row py-2 pr-4 mb-2 rounded-md items-center bg-light-gray' onClick={onOpenEditProfile}>
            <div className='w-10 h-6 flex items-center justify-center'>
              <img src={personGrayThumbnail} alt='Person' className='h-4 w-auto' />
            </div>
            <div className='text-base text-black font-bold pr-4 truncate'>{account?.user.display_name}</div>
            <div className='text-base text-link font-normal truncate'>{account?.user.email}</div>
          </div>
          <AnimatedDropView show={isEditProfile}>
            <div className='p-4 border-2 border-dark-gray'>
              <div className='flex flex-row w-full p-4 items-center justify-between'>
                <div className='text-sm text-black font-normal' onClick={onOpenEditProfile}>
                  Cancel
                </div>
                <div className='text-lg text-black font-bold'>Edit Profile</div>
                <div className='text-sm text-black font-normal' onClick={onUserProfileUpdate}>
                  Save
                </div>
              </div>
              <div className='text-base text-black font-bold'>NAME</div>
              <div className='flex flex-row mb-2 rounded-md items-center bg-light-gray relative'>
                <input
                  className='w-full p-2 text-left text-black bg-transparent'
                  placeholder='Enter Name'
                  value={userName}
                  onChange={handleUserNameChange}
                />
              </div>
              <div className='text-base text-black font-bold'>EMAIL</div>
              <div className='flex flex-row mb-2 rounded-md items-center bg-light-gray relative'>
                <input
                  className='w-full p-2 text-left text-black bg-transparent'
                  placeholder='Enter Email'
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
            </div>
          </AnimatedDropView>
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
      </div>
    </MainResponsive>
  );
};

export default UserProfile;
