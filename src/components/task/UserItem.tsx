import React from 'react';
import { UserState } from '../../modules/user';
import CheckIcon from './CheckIcon';

interface Props {
  user: UserState;
  selectedUser: UserState | null;
  onSelect: (client: UserState) => void;
}
const ClientItem = ({ user, selectedUser, onSelect }: Props) => {
  return (
    <div className='flex flex-row items-center w-full mb-2' onClick={() => onSelect(user)}>
      {selectedUser !== null ? <CheckIcon checked={selectedUser.user_id === user.user_id} /> : <CheckIcon checked={false} />}
      <div className='pl-2 text-lg font-bold flex flex-1 truncate'>{user.display_name}</div>
    </div>
  );
};

export default ClientItem;
