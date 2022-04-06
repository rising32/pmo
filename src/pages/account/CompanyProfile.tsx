import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  dateTimeCurrencyThumbnail,
  downThumbnail,
  dropDownThumbnail,
  organizationThumbnail,
  personGrayThumbnail,
  rightArrowThumbnail,
  teamMemberThumbnail,
  workSettingThumbnail,
} from '../../assets/images';
import {
  getTeamMembers,
  sendUserProfileUpdate,
  signOut,
  sendDateTimeCurrencyCreate,
  sendDateTimeCurrencyUpdate,
  sendDateTimeCurrency,
} from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { toast } from 'react-toastify';
import MainResponsive from '../../containers/main/MainResponsive';
import { useAuth } from '../../lib/context/AuthProvider';
import AnimatedDropView from '../../components/common/AnimatedDropView';
import { AccountState, UserState } from '../../modules/user';
import {
  currencyOptions,
  dateFormatOptions,
  DateTimeCurrencyType,
  decimalSeparatorOptions,
  KeyValueState,
  timeFormatOptions,
} from '../../modules/dateTimeCurrency';
import { DownSvg } from '../../assets/svg';

const CompanyProfile = () => {
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isEditDateTimeCurrency, setIsEditDateTimeCurrency] = useState(false);
  const [showDateFormat, setShowDateFormat] = useState(false);
  const [selectedDateFormat, setSelectedDateFormat] = useState<KeyValueState | null>(null);
  const [showCurrency, setShowCurrency] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<KeyValueState | null>(null);
  const [selectedTimeFormat, setSelectedTimeFormat] = useState<KeyValueState | null>(null);
  const [selectedDecimalSeparator, setSelectedDecimalSeparator] = useState<KeyValueState | null>(null);
  const [dtcData, setDTCData] = React.useState<DateTimeCurrencyType | null>(null);

  const [userName, setUserName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const { account, changeAccount } = useAuth();

  const [teamMemberNum, setTeamMemberNum] = React.useState(0);

  const navigate = useNavigate();
  const [_sendSignOut, , signOutRes] = useRequest(signOut);
  const [_getTeamMembers, , getTeamMembersRes] = useRequest(getTeamMembers);
  const [_sendUserProfileUpdate, , sendUserProfileUpdateRes] = useRequest(sendUserProfileUpdate);
  const [_sendDateTimeCurrencyCreate, , dateTimeCurrencyCreateRes] = useRequest(sendDateTimeCurrencyCreate);
  const [_sendDateTimeCurrencyUpdate, , dateTimeCurrencyUpdateRes] = useRequest(sendDateTimeCurrencyUpdate);
  const [_sendDateTimeCurrency, , sendDateTimeCurrencyRes] = useRequest(sendDateTimeCurrency);

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
      changeAccount(null);
      toast.success('sign out successed!');
      navigate('/');
    }
  }, [signOutRes]);

  const onSignOut = () => {
    const user_id = account?.user.user_id;
    _sendSignOut(user_id);
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
  const handleUserNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    setUserName(event.currentTarget.value);
  };
  const handleEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
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
  const onOpenEditDateTimeCurrency = () => {
    if (isEditDateTimeCurrency) {
      setIsEditDateTimeCurrency(false);
    } else {
      const user_id = account?.user.user_id;
      user_id && _sendDateTimeCurrency(user_id);
    }
  };
  React.useEffect(() => {
    if (sendDateTimeCurrencyRes) {
      setDTCData(sendDateTimeCurrencyRes);
      dateFormatOptions.map(item => {
        if (item.value === sendDateTimeCurrencyRes.date_format) {
          setSelectedDateFormat(item);
        }
      });
      currencyOptions.map(item => {
        if (item.key === sendDateTimeCurrencyRes.currency) {
          setSelectedCurrency(item);
        }
      });
      timeFormatOptions.map(item => {
        if (item.value === sendDateTimeCurrencyRes.time_format) {
          setSelectedTimeFormat(item);
        }
      });
      decimalSeparatorOptions.map(item => {
        if (item.key === sendDateTimeCurrencyRes.decimal_seperator) {
          setSelectedDecimalSeparator(item);
        }
      });
      setIsEditDateTimeCurrency(true);
    }
  }, [sendDateTimeCurrencyRes]);
  const onShowDateFormat = () => {
    if (showDateFormat) {
      setShowDateFormat(false);
    } else {
      setShowDateFormat(true);
    }
  };
  const onSelectedDateFormat = (item: KeyValueState) => {
    setSelectedDateFormat(item);
    onShowDateFormat();
  };
  const onShowCurrency = () => {
    if (showCurrency) {
      setShowCurrency(false);
    } else {
      setShowCurrency(true);
    }
  };
  const onSelectedCurrency = (item: KeyValueState) => {
    setSelectedCurrency(item);
    onShowCurrency();
  };
  const onSelectedTimeFormat = (item: KeyValueState) => {
    setSelectedTimeFormat(item);
  };
  const onSelectedDecimalSeparator = (item: KeyValueState) => {
    setSelectedDecimalSeparator(item);
  };
  const onDateTimeCurrencyUpdate = () => {
    if (account && selectedDateFormat && selectedTimeFormat && selectedCurrency && selectedDecimalSeparator) {
      if (dtcData) {
        const dateTimeCurrency: DateTimeCurrencyType = {
          dtc_id: dtcData?.dtc_id,
          user_id: dtcData.user_id,
          date_format: selectedDateFormat?.value,
          time_format: selectedTimeFormat?.value,
          currency: selectedCurrency?.key,
          decimal_seperator: selectedDecimalSeparator?.key,
        };
        _sendDateTimeCurrencyUpdate(dateTimeCurrency);
      } else {
        const dateTimeCurrency: DateTimeCurrencyType = {
          dtc_id: null,
          user_id: account.user.user_id,
          date_format: selectedDateFormat?.value,
          time_format: selectedTimeFormat?.value,
          currency: selectedCurrency?.key,
          decimal_seperator: selectedDecimalSeparator?.key,
        };
        _sendDateTimeCurrencyCreate(dateTimeCurrency);
      }
    }
  };
  React.useEffect(() => {
    if (dateTimeCurrencyCreateRes) {
      toast.success('Date, Time, Currency created!');
      console.log(dateTimeCurrencyCreateRes);
      onOpenEditDateTimeCurrency();
    }
  }, [dateTimeCurrencyCreateRes]);
  React.useEffect(() => {
    console.log(dateTimeCurrencyUpdateRes);
    if (dateTimeCurrencyUpdateRes) {
      toast.success('Date, Time, Currency updated!');
      onOpenEditDateTimeCurrency();
    }
  }, [dateTimeCurrencyUpdateRes]);
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
            className='flex flex-row py-2 mb-2 pr-4 rounded-md items-center justify-between bg-light-gray'
            onClick={() => navigate('/account/work-setting')}
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
            onClick={onOpenEditDateTimeCurrency}
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
          <AnimatedDropView show={isEditDateTimeCurrency}>
            <div className='p-4 border-2 border-dark-gray'>
              <div className='flex flex-row w-full p-4 items-center justify-between'>
                <div className='text-sm text-black font-normal' onClick={onOpenEditDateTimeCurrency}>
                  Cancel
                </div>
                <div className='text-lg text-black font-bold'>Account Setting</div>
                <div className='text-sm text-black font-normal' onClick={onDateTimeCurrencyUpdate}>
                  Save
                </div>
              </div>
              <div className='my-4 flex flex-row'>
                <div className='w-1/2 pr-4 flex flex-col justify-between'>
                  <div className='relative'>
                    <div className='text-sm text-black font-bold text-center'>DATE FORMAT</div>
                    <div
                      className='bg-light-gray flex flex-row items-center justify-between px-2 py-1 rounded-md my-4'
                      onClick={onShowDateFormat}
                    >
                      <div className='truncate'>
                        {selectedDateFormat && selectedDateFormat.value ? selectedDateFormat.value : 'Select ...'}
                      </div>
                      <img src={dropDownThumbnail} alt='Person' className='h-3 w-auto' />
                    </div>
                    {showDateFormat && (
                      <div className='absolute top-full bg-white w-full py-4 text-lg z-10 border-2 border-light-gray'>
                        {dateFormatOptions.map(item => (
                          <div key={item.key} onClick={() => onSelectedDateFormat(item)}>
                            <div className='text-center truncate'>{item.value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className='text-sm text-black font-bold text-center'>CURRENCY</div>
                    <div className='relative'>
                      <div
                        className='bg-light-gray flex flex-row items-center justify-between px-2 py-1 rounded-md my-4'
                        onClick={onShowCurrency}
                      >
                        <div className='truncate'>{selectedCurrency && selectedCurrency.value ? selectedCurrency.value : 'Select ...'}</div>
                        <img src={dropDownThumbnail} alt='Person' className='h-3 w-auto' />
                      </div>
                      {showCurrency && (
                        <div className='absolute bottom-full bg-white w-full py-4 text-lg z-10 border-2 border-light-gray'>
                          {currencyOptions.map(item => (
                            <div key={item.key} onClick={() => onSelectedCurrency(item)}>
                              <div className='text-center truncate'>{item.value}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='w-1/2'>
                  <div className='text-sm text-black font-bold truncate text-center'>TIME FORMAT</div>
                  <div className='w-full py-4 text-lg'>
                    {timeFormatOptions.map(item => (
                      <div key={item.key} className='flex flex-row items-center pl-4' onClick={() => onSelectedTimeFormat(item)}>
                        <div
                          className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                            selectedTimeFormat && selectedTimeFormat.key === item.key ? 'bg-rouge-blue' : 'bg-card-gray'
                          }`}
                        >
                          {selectedTimeFormat && selectedTimeFormat.key === item.key && (
                            <DownSvg stroke='white' strokeWidth={3} className='w-4 h-4 rotate-90' />
                          )}
                        </div>
                        <div className='text-center truncate'>{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className='text-sm text-black font-bold truncate text-center'>DECIMAL SEPARATOR</div>
                  <div className='w-full py-4 text-lg'>
                    {decimalSeparatorOptions.map(item => (
                      <div key={item.key} className='flex flex-row items-center pl-4' onClick={() => onSelectedDecimalSeparator(item)}>
                        <div
                          className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                            selectedDecimalSeparator && selectedDecimalSeparator.key === item.key ? 'bg-button-blue' : 'bg-card-gray'
                          }`}
                        >
                          {selectedDecimalSeparator && selectedDecimalSeparator.key === item.key && (
                            <DownSvg stroke='white' strokeWidth={3} className='w-4 h-4 rotate-90' />
                          )}
                        </div>
                        <div className='text-center truncate'>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedDropView>
          <div
            className='flex flex-row py-2 mb-2 pr-4 rounded-md items-center justify-between bg-light-gray'
            // onClick={() => setIsEditOrganization(true)}
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
      </div>
    </MainResponsive>
  );
};

export default CompanyProfile;
