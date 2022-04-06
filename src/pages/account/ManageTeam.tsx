import React, { useState } from 'react';
import { UserState } from '../../modules/user';
import { dropDownThumbnail, rightArrowThumbnail } from '../../assets/images';
import BottomUpAnimatedView from '../../components/common/BottomUpAnimatedView';
import Select, { SingleValue, components, DropdownIndicatorProps } from 'react-select';
import useRequest from '../../lib/hooks/useRequest';
import { addMember, getTeamMembers, getUserAll } from '../../lib/api';
import { EmailSelectOption, UserSelectOption } from '../../modules/setting';
import { toast } from 'react-toastify';
import { TeamMemberState } from '../../modules/team';
import MainResponsive from '../../containers/main/MainResponsive';
import { useAuth } from '../../lib/context/AuthProvider';
import AnimatedDropView from '../../components/common/AnimatedDropView';
import { DownSvg } from '../../assets/svg';

const ManageTeam = () => {
  const [users, setUsers] = useState<UserState[]>([]);
  const [teamMemberList, getTeamMemberList] = useState<UserState[]>([] as UserState[]);
  const [isManager, setIsManager] = useState(true);
  const [showView, setShowView] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserState | null>(null);
  const [showUserName, setShowUserName] = useState(false);
  const [showUserEmail, setShowUserEmail] = useState(false);
  const [showMember, setShowMember] = useState(false);

  const [_getUserAll, , getUserAllRes] = useRequest(getUserAll);
  const [_addMember, , addMemberRes] = useRequest(addMember);
  const [_getTeamMembers, , getTeamMembersRes] = useRequest(getTeamMembers);

  const { account } = useAuth();

  React.useEffect(() => {
    const owner_id = account?.user.user_id;
    owner_id && _getTeamMembers(owner_id);
  }, []);
  React.useEffect(() => {
    if (getUserAllRes) {
      console.log(getUserAllRes);
      const newUser: UserState[] = [];
      getUserAllRes.map(user => {
        let isIncluded = false;
        teamMemberList.map(teamMember => {
          if (teamMember.user_id === user.user_id) {
            isIncluded = true;
          }
        });
        if (!isIncluded) {
          newUser.push(user);
        }
      });
      setUsers(newUser);

      setShowView(true);
    }
  }, [getUserAllRes]);
  React.useEffect(() => {
    if (addMemberRes) {
      console.log(addMemberRes);
      const owner_id = account?.user.user_id;
      owner_id && _getTeamMembers(owner_id);
    }
  }, [addMemberRes]);
  React.useEffect(() => {
    if (getTeamMembersRes) {
      getTeamMemberList(getTeamMembersRes.member);
      setSelectedUser(null);
      setShowView(false);
    }
  }, [getTeamMembersRes]);
  const openInvite = () => {
    _getUserAll();
  };
  const onCloseView = () => {
    setShowView(false);
  };
  const onOpenUserName = () => {
    setShowUserName(!showUserName);
  };
  const onOpenUserEmail = () => {
    setShowUserEmail(!showUserEmail);
  };
  const onSelectedUser = (user: UserState) => {
    setSelectedUser(user);
    setShowUserName(false);
    setShowUserEmail(false);
  };
  const onSelectedMember = (member: UserState) => {
    setSelectedUser(member);
    setIsManager(member.role_id === 1);
    setShowMember(!showMember);
  };
  const onCloseMember = () => {
    setShowMember(false);
  };
  const onInvite = () => {
    console.log(selectedUser);
    if (account && selectedUser) {
      console.log(selectedUser);
      const params: TeamMemberState = {
        owner_id: account?.user.user_id,
        member_id: selectedUser?.user_id,
        role_id: 3,
      };
      _addMember(params);
    }
  };

  return (
    <MainResponsive>
      <div className='flex flex-row w-full h-12 px-4 mb-4 items-center justify-between bg-light-gray'>
        <div className='text-sm text-rouge-blue font-normal'></div>
        <div className='text-lg text-rouge-blue font-bold'>Your Account</div>
        <div className='text-sm text-rouge-blue font-normal'></div>
      </div>
      <div className='flex flex-1 flex-col w-full h-full relative'>
        <div className='flex flex-1 flex-col w-full p-1 bg-white'>
          <div className='flex flex-row items-center justify-center py-3'>
            <div className='text-lg text-black font-bold'>Manage Team</div>
          </div>
          <div className='flex flex-row px-4 items-center justify-between pb-2'>
            <div className='text-sm text-black font-bold'>TEAM MEMBERS</div>
            <div className='text-sm text-blue font-bold' onClick={openInvite}>
              Invite
            </div>
          </div>
          <AnimatedDropView show={showView}>
            <div className='p-4 border-2 border-dark-gray'>
              <div className='flex flex-row w-full p-4 items-center justify-between'>
                <div className='text-sm text-black font-normal' onClick={onCloseView}>
                  Cancel
                </div>
                <div className='text-lg text-black font-bold'>Edit Profile</div>
                <div className='text-sm text-black font-normal' onClick={onInvite}>
                  Invite
                </div>
              </div>
              <div className='text-base text-black font-bold'>NAME</div>
              <div className='rounded-md bg-light-gray p-2 flex flex-row items-center justify-between' onClick={onOpenUserName}>
                <div className='text-base'>{selectedUser ? selectedUser.display_name : 'select user'}</div>
                <img src={dropDownThumbnail} alt='Person' className='h-3 w-auto' />
              </div>
              {showUserName && (
                <div className='border-2 border-dark-gray py-4'>
                  {users.map(user => (
                    <div
                      key={user.user_id}
                      onClick={() => onSelectedUser(user)}
                      className={`pb-2 px-4 ${selectedUser?.user_id === user.user_id ? ' bg-rouge-blue' : ''}`}
                    >
                      <div>{user.display_name}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className='text-base text-black font-bold'>EMAIL</div>
              <div className='rounded-md bg-light-gray p-2 flex flex-row items-center justify-between' onClick={onOpenUserEmail}>
                <div className='text-base'>{selectedUser ? selectedUser.email : 'select email'}</div>
                <img src={dropDownThumbnail} alt='Person' className='h-3 w-auto' />
              </div>
              {showUserEmail && (
                <div className='border-2 border-dark-gray py-4'>
                  {users.map(user => (
                    <div
                      key={user.user_id}
                      onClick={() => onSelectedUser(user)}
                      className={`pb-2 px-4 ${selectedUser?.user_id === user.user_id ? ' bg-rouge-blue' : ''}`}
                    >
                      <div>{user.email}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className='flex flex-row mt-4' onClick={() => setIsManager(!isManager)}>
                <div
                  className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${isManager ? 'bg-rouge-blue' : 'bg-card-gray'}`}
                >
                  {isManager && <DownSvg stroke='white' strokeWidth={3} className='w-4 h-4 rotate-90' />}
                </div>
                <div className='text-center truncate'>Manager</div>
              </div>
            </div>
          </AnimatedDropView>
          {teamMemberList.map((member, index) => (
            <div key={member.user_id}>
              <div
                className='flex flex-row p-4 mb-2 rounded-md items-center justify-between bg-light-gray'
                onClick={() => onSelectedMember(member)}
              >
                <div className='text-sm text-black font-normal pr-3 flex-1'>{member.display_name}</div>
                <div className='flex-row flex items-center'>
                  <div className='text-sm text-black font-normal pr-3'>Active</div>
                  <img src={rightArrowThumbnail} className='h-4 w-auto' />
                </div>
              </div>
              <AnimatedDropView show={showMember && selectedUser?.user_id === member.user_id}>
                <div className='p-4 border-2 border-dark-gray'>
                  <div className='flex flex-row w-full p-4 items-center justify-between'>
                    <div className='text-sm text-black font-normal' onClick={onCloseMember}>
                      Cancel
                    </div>
                    <div className='text-lg text-black font-bold'>Edit Profile</div>
                    <div className='text-sm text-black font-normal' onClick={onCloseMember}>
                      Save
                    </div>
                  </div>
                  <div className='text-base text-black font-bold'>NAME</div>
                  <div className='rounded-md bg-light-gray p-2 flex flex-row items-center justify-between' onClick={onOpenUserName}>
                    <div className='text-base'>{selectedUser ? selectedUser.display_name : 'select user'}</div>
                  </div>
                  <div className='text-base text-black font-bold'>EMAIL</div>
                  <div className='rounded-md bg-light-gray p-2 flex flex-row items-center justify-between' onClick={onOpenUserEmail}>
                    <div className='text-base'>{selectedUser ? selectedUser.email : 'select email'}</div>
                  </div>
                  <div className='flex flex-row mt-4' onClick={() => setIsManager(!isManager)}>
                    <div
                      className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                        isManager ? 'bg-rouge-blue' : 'bg-card-gray'
                      }`}
                    >
                      {isManager && <DownSvg stroke='white' strokeWidth={3} className='w-4 h-4 rotate-90' />}
                    </div>
                    <div className='text-center truncate'>Manager</div>
                  </div>
                </div>
              </AnimatedDropView>
            </div>
          ))}
        </div>
      </div>
    </MainResponsive>
  );
};

export default ManageTeam;
