import React from 'react';
import { useRecoilState } from 'recoil';
import { AccountState, accountState, UserState } from '../../modules/user';
import BottomUpAnimatedView from '../../components/common/BottomUpAnimatedView';
import { sendUserProfileUpdate } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { toast } from 'react-toastify';
import { doubleRecThumbnail, dropDownThumbnail, slideBarThumbnail } from '../../assets/images';
import MultiRangeSlider from '../common/MultiRangeSlider';
import Select, { SingleValue, components, DropdownIndicatorProps } from 'react-select';
import { weekFormatOptions } from '../../modules/setting';

const DropdownIndicator = (props: DropdownIndicatorProps<any, true>) => {
  return (
    <components.DropdownIndicator {...props}>
      <img src={dropDownThumbnail} className=' h-3 w-auto' />
    </components.DropdownIndicator>
  );
};

interface Props {
  isEditWorkSetting: boolean;
  onClose: () => void;
}

const WorkSetting = ({ isEditWorkSetting, onClose }: Props) => {
  const [account, setAccount] = useRecoilState<AccountState | null>(accountState);

  const [companyName, setCompanyName] = React.useState<string>('');

  const [_sendUserProfileUpdate, profileUpdating, profileRes, , resetSendUserProfileUpdate] = useRequest(sendUserProfileUpdate);

  React.useEffect(() => {
    if (profileRes && profileRes.user_id && account) {
      const updateAccount: AccountState = {
        login_id: account.login_id,
        token: account.token,
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
    <BottomUpAnimatedView title='Work Setting' isOpen={isEditWorkSetting} onClose={onClose} onSave={onUserProfileUpdate}>
      <div className='px-4 my-4'>
        <div className='text-lg text-black font-bold'>FIRST DAY OF THE WEEK</div>
        <Select
          // defaultValue={dtcData.currency}
          options={weekFormatOptions}
          className='mb-6 mt-1'
        />
        <div className='flex flex-row justify-between items-center'>
          <div className='text-base text-black font-normal'>DAILY WORK ROUTINE</div>
          <div className='text-base text-black font-normal'>09:00</div>
        </div>
        <div className='flex justify-center m-4 px-8'>
          <MultiRangeSlider />
        </div>
        <div className='flex flex-row'>
          <div className='flex-1'>
            <div className='text-lg text-black font-bold'>Reminders</div>
            <div className='text-base text-black font-normal truncate'>Get a notification to stard:</div>
          </div>
          <div className='flex-2'>
            <div className='flex flex-row text-base text-black font-normal items-center'>
              <img src={doubleRecThumbnail} className='h-4 w-auto mr-2' />
              <div className='text-base text-black font-normal'>Priorities</div>
            </div>
            <div className='flex flex-row text-base text-black font-normal items-center'>
              <img src={doubleRecThumbnail} className='h-4 w-auto mr-2' />
              <div className='text-base text-black font-normal'>Deliverables</div>
            </div>
          </div>
        </div>
      </div>
    </BottomUpAnimatedView>
  );
};

export default WorkSetting;
