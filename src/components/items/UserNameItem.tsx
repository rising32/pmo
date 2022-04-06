import React from 'react';
import { UserState } from '../../modules/user';
import { CheckSvg } from '../../assets/svg';

interface Props {
  user: UserState;
  selectedUser: UserState | null;
  onSelect: (client: UserState) => void;
}
const UserNameItem = ({ user, selectedUser, onSelect }: Props) => {
  return (
    <div className='flex flex-row items-center w-full mb-2' onClick={() => onSelect(user)}>
      <div className='w-6 h-6 bg-dark-gray rounded-full outline outline-1 outline-rouge-blue flex items-center justify-center'>
        <span>{selectedUser && selectedUser.user_id === user.user_id ? <CheckSvg stroke='red' strokeWidth={4} /> : null}</span>
      </div>
      <div className='pl-2 text-lg font-bold flex flex-1 text-blue truncate'>{user.display_name}</div>
    </div>
  );
};

export default UserNameItem;
