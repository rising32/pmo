import React from 'react';
import { useRecoilState } from 'recoil';
import { AccountState, accountState, UserState } from '../../modules/user';
import BottomUpAnimatedView from '../../components/common/BottomUpAnimatedView';
import { sendUserProfileUpdate } from '../../lib/api/auth';
import useRequest from '../../lib/hooks/useRequest';
import { toast } from 'react-toastify';

interface Props {
  isEditOrganization: boolean;
  onClose: () => void;
}

const OrganizationUpdate = ({ isEditOrganization, onClose }: Props) => {
  const [account, setAccount] = useRecoilState<AccountState | null>(accountState);

  const [companyName, setCompanyName] = React.useState<string>('');

  const [_sendUserProfileUpdate, profileUpdating, profileRes, , resetSendUserProfileUpdate] = useRequest(sendUserProfileUpdate);

  React.useEffect(() => {
    if (profileRes && profileRes.user_id && account) {
      const updateAccount: AccountState = {
        login_id: account.login_id,
        user: profileRes,
      };
      setAccount(updateAccount);
      toast.success('profile update successed!');
      onClose();
    }
  }, [profileRes]);

  const onUserProfileUpdate = () => {
    if (!account) {
      return;
    }
  };
  const handleCompanyNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    setCompanyName(event.currentTarget.value);
  };

  return (
    <BottomUpAnimatedView title='Organization' isOpen={isEditOrganization} onClose={onClose} onSave={onUserProfileUpdate}>
      <div className='px-4 my-4'>
        <div className='text-base text-black font-normal'>COMPANY NAME</div>
        <div className='flex flex-row mb-2 rounded-md items-center bg-light-gray relative'>
          <input
            className='w-full p-2 text-left text-black bg-transparent'
            placeholder='Enter Email'
            value={companyName}
            onChange={handleCompanyNameChange}
          />
        </div>
      </div>
    </BottomUpAnimatedView>
  );
};

export default OrganizationUpdate;
