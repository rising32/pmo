import React from 'react';
import { AccountState, UserState } from '../../modules/user';
import BottomUpAnimatedView from '../../components/common/BottomUpAnimatedView';
import { sendUserProfileUpdate } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { toast } from 'react-toastify';
import { useAuth } from '../../lib/context/AuthProvider';

interface Props {
  isEditProfile: boolean;
  onClose: () => void;
}

const EditUserNameEmail = ({ isEditProfile, onClose }: Props) => {
  const { account, changeAccount } = useAuth();

  const [userName, setUserName] = React.useState<string | undefined>(account?.user.display_name);
  const [email, setEmail] = React.useState<string | undefined>(account?.user.email);

  const [_sendUserProfileUpdate, , profileRes] = useRequest(sendUserProfileUpdate);

  React.useEffect(() => {
    if (profileRes && profileRes.user_id && account) {
      const updateAccount: AccountState = {
        login_id: account.login_id,
        token: account.token,
        user: profileRes,
      };
      changeAccount(updateAccount);
      toast.success('profile update successed!');
      onClose();
    }
  }, [profileRes]);

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
  const handleUserNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    setUserName(event.currentTarget.value);
  };
  const handleEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  return (
    <BottomUpAnimatedView title='Edit Profile' isOpen={isEditProfile} onClose={onClose} onSave={onUserProfileUpdate}>
      <div className='px-4 my-4'>
        <div className='text-base text-black font-normal'>NAME</div>
        <div className='flex flex-row mb-2 rounded-md items-center bg-light-gray relative'>
          <input
            className='w-full p-2 text-left text-black bg-transparent'
            placeholder='Enter Email'
            value={userName || ''}
            onChange={handleUserNameChange}
          />
        </div>
        <div className='text-base text-black font-normal'>EMAIL</div>
        <div className='flex flex-row mb-2 rounded-md items-center bg-light-gray relative'>
          <input
            className='w-full p-2 text-left text-black bg-transparent'
            placeholder='Enter Email'
            value={email}
            onChange={handleEmailChange}
          />
        </div>
      </div>
    </BottomUpAnimatedView>
  );
};

export default EditUserNameEmail;
