import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { accountState, AccountState, UserState } from '../../modules/user';
import { rightArrowThumbnail } from '../../assets/images';
import BottomUpAnimatedView from '../../components/common/BottomUpAnimatedView';
import Select, { SingleValue, components, DropdownIndicatorProps } from 'react-select';
import useRequest from '../../lib/hooks/useRequest';
import { addMember, getTeamMembers, getUserAll, TeamMemberState } from '../../lib/api/auth';
import { EmailSelectOption, UserSelectOption } from '../../modules/setting';
import { toast } from 'react-toastify';

const ManageTeam = () => {
  const [isEdit, setIsEdit] = React.useState(false);
  const [name, setName] = React.useState('');
  const [userID, setUserID] = React.useState(0);
  const [email, setEmail] = React.useState('');
  const [users, getUsers] = React.useState<UserState[]>([]);
  const [selectUserOptions, setSelectUserOptions] = React.useState<UserSelectOption[]>([]);
  const [selectEmailOptions, setSelectEmailOptions] = React.useState<EmailSelectOption[]>([]);
  const [editTitle, setEditTitle] = React.useState('New team member');
  const [dataList, getDataList] = React.useState<UserState[]>([] as UserState[]);
  const account = useRecoilValue<AccountState | null>(accountState);
  const [_getUserAll, , getUserAllRes] = useRequest(getUserAll);
  const [_addMember, , addMemberRes] = useRequest(addMember);
  const [_getTeamMembers, , getTeamMembersRes] = useRequest(getTeamMembers);

  React.useEffect(() => {
    const owner_id = account?.user.user_id;
    owner_id && _getTeamMembers(owner_id);
    _getUserAll();
  }, []);
  React.useEffect(() => {
    if (getUserAllRes) {
      getUsers(getUserAllRes);
      const userOptions: UserSelectOption[] = getUserAllRes.map(user => {
        return { value: user.user_id, label: user.display_name, email: user.email };
      });
      setSelectUserOptions(userOptions);
      const emailOptions: EmailSelectOption[] = getUserAllRes.map(user => {
        return { value: user.user_id, label: user.email, name: user.display_name };
      });
      setSelectEmailOptions(emailOptions);
    }
  }, [getUserAllRes]);
  React.useEffect(() => {
    console.log('addMemberRes =', addMemberRes);
    if (addMemberRes) {
      setIsEdit(false);
      const owner_id = account?.user.user_id;
      owner_id && _getTeamMembers(owner_id);
      _getUserAll();
    }
  }, [addMemberRes]);
  React.useEffect(() => {
    console.log('getTeamMembersRes =', getTeamMembersRes);
    if (getTeamMembersRes) {
      getDataList(getTeamMembersRes.member);
    }
  }, [getTeamMembersRes]);

  const [isManager, setIsManager] = React.useState(true);
  const handleInputChange = (event: any) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setIsManager(value);
  };

  const editTeam = (member: UserState | null) => {
    setEditTitle(member ? 'Edit team member' : 'New team member');
    setName(member?.display_name || '');
    setEmail(member?.email || '');
    setIsEdit(true);
  };
  const onSelectName = (newValue: SingleValue<UserSelectOption>) => {
    if (newValue) {
      const userOptions: EmailSelectOption[] = [];
      selectUserOptions.map(item => {
        if (item.value === newValue.value) {
          userOptions.push({ value: item.value, label: item.email, name: item.label });
        }
      });
      setSelectEmailOptions(userOptions);
      setUserID(newValue.value);
      setName(newValue.label);
    }
  };
  const onSelectEmail = (newValue: SingleValue<EmailSelectOption>) => {
    if (newValue) {
      setEmail(newValue.label);
    }
  };
  const onClose = () => {
    setIsEdit(false);
    const userOptions: UserSelectOption[] = users.map(user => {
      return { value: user.user_id, label: user.display_name, email: user.email };
    });
    setSelectUserOptions(userOptions);
    const emailOptions: EmailSelectOption[] = users.map(user => {
      return { value: user.user_id, label: user.email, name: user.display_name };
    });
    setSelectEmailOptions(emailOptions);
  };
  const onCreateUpdateMember = () => {
    console.log(email, name);
    if (!name) {
      toast.error('member name is not null!');
      return;
    }
    if (!email) {
      toast.error('client name is not null!');
      return;
    }
    if (account) {
      const params: TeamMemberState = {
        owner_id: account?.user.user_id,
        member_id: userID,
        role_id: 3,
      };
      _addMember(params);
    }
  };
  return (
    <div className='items-center flex flex-col flex-1 p-4 w-full h-full mb-32'>
      <div className='flex flex-row w-full h-12 px-4 mb-4 items-center justify-between bg-light-gray'>
        <div className='text-sm text-rouge-blue font-normal'></div>
        <div className='text-lg text-rouge-blue font-bold'>Your Account</div>
        <div className='text-sm text-rouge-blue font-normal'></div>
      </div>
      <div className='flex flex-1 flex-col w-full h-full relative'>
        <div className='flex flex-1 flex-col w-full p-1 bg-white'>
          <div
            className='flex flex-row items-center justify-center py-3'
            // onClick={() => user?.member.isAdmin && navigate('/account/company-profile')}
          >
            <div className='text-lg text-black font-bold'>Manage Team</div>
          </div>
          <div className='flex flex-row px-4 items-center justify-between'>
            <div className='text-sm text-black font-normal'>TEAM MEMBERS</div>
            <div className='text-sm text-blue font-normal' onClick={() => editTeam(null)}>
              Invite
            </div>
          </div>
          {dataList.map((member, index) => (
            <div
              key={index}
              className='flex flex-row p-4 mb-2 rounded-md items-center justify-between bg-light-gray'
              onClick={() => editTeam(member)}
            >
              <div className='text-sm text-black font-normal pr-3 flex-1'>{member.display_name}</div>
              <div className='flex-row flex items-center'>
                <div className='text-sm text-black font-normal pr-3'>Active</div>
                <img src={rightArrowThumbnail} className='h-4 w-auto' />
              </div>
            </div>
          ))}
        </div>
        <BottomUpAnimatedView title={editTitle} actionTitle='Invite' isOpen={isEdit} onClose={onClose} onSave={onCreateUpdateMember}>
          <div className='px-4 my-4'>
            <div className='text-base text-black font-normal px-2'>NAME</div>
            <div className='flex flex-row mb-2 rounded-md items-center bg-light-gray relative'>
              <Select
                className='w-full p-2 text-left text-black bg-transparent'
                isClearable
                isSearchable={false}
                options={selectUserOptions}
                onChange={onSelectName}
              />
            </div>
            <div className='flex flex-row justify-between items-center px-2'>
              <div className='text-base text-black font-normal'>EMAIL</div>
              <div className='text-xs text-black font-normal'>Invite will be sent to this email</div>
            </div>
            <div className='flex flex-row mb-2 rounded-md items-center bg-light-gray relative'>
              <Select
                className='w-full p-2 text-left text-black bg-transparent'
                isClearable
                isSearchable={false}
                options={selectEmailOptions}
                onChange={onSelectEmail}
              />
            </div>
            <div className='flex flex-row mx-1 mb-2 items-center'>
              <input
                name='isAdmin'
                type='checkbox'
                checked={isManager}
                onChange={handleInputChange}
                className=' rounded-full bg-light-gray inline'
              />
              <div className='text-base text-black font-bold pl-2'>Manager</div>
            </div>
          </div>
        </BottomUpAnimatedView>
      </div>
    </div>
  );
};

export default ManageTeam;
